var config = require('./config.js');
var koa = require('koa');
var router = require('koa-router')();
var app = koa();

var serve = require('koa-static');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser')();
app.use(serve('public'));
app.use(logger());
app.use(bodyParser);

var fs = require('co-fs');
var Voting = require('./db.js').Voting;
var random_url = require('./util.js').random_url;

const session = require('koa-generic-session')
app.keys = config.keys;
app.use(session())

var passport = require('koa-passport');
require('./auth.js');
app.use(passport.initialize())
app.use(passport.session())

var events = require('events');
var emitter = new events.EventEmitter();

// 創建頁

router.post("/create", function *(next) {
	var data = this.request.body;

	data.choices = data.choices.map(function(c){return {name: c, voters: []}});
	var index = random_url();
	data.index = index;

	var voting = new Voting(data);
	voting.save(function(err){if(err){console.log(err)}});
	
	var url = "/q/" + index;
	this.body = JSON.stringify({url: url});
});

// auth

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
		  passport.authenticate(
			  'facebook',
			  {
				  successRedirect: '/user',
				  failureRedirect: '/'
			  }
		  )
);

router.get('/user', function *(next) {
	this.body = this.req.user;
})

// 問題頁

function client_data(raw_data, that) {
	var data = {
		title: raw_data.title,
		choices: raw_data.choices,
		need_login: raw_data.need_login,
		need_name: raw_data.need_name,
		multi_select: raw_data.multi_select
	};

	var id;
	if (data.need_login) {
		id = that.req.user.id;
	} else if (data.need_name){
		id = that.session.username;
	} else if (!data.need_name){
		id = that.session.who;
	}

	var selected = [];
	for (var c of data.choices) {
		for (var v in c.voters) {
			if (c.voters[v].id == id) {
				selected.push(c.name);
			}
			c.voters[v] = c.voters[v].username;
		}
	}
	console.log(selected);
	data.selected = selected;
	return data;
}

router.get("/data/:index", function *(next) {
	var raw_data = yield Voting.findOne({index: this.params.index}).exec();
	console.log(raw_data);

	var data = client_data(raw_data, this);

	this.body = JSON.stringify(data);
});

router.get("/poll/:index", function *(next) {
	var that = this;
	yield function(callback) {
		emitter.once('update-' + that.params.index, function () {
			console.log("update it");
			console.log(that.params.index);
			Voting.findOne({index: that.params.index}, function(err, response) {
				if (response == null) {
					console.log("when poll: no this quesstion");
					that.status = 404;
					callback()
				} else {
					var data = client_data(response, that);
					that.body = JSON.stringify(data);
					callback();
				}
			});
		})
	}
});

router.get("/q/:index", function *(next) {
	if (this.session.who == null) {
		this.session.who = random_url();
	}
	this.body = yield fs.readFile('public/voting.html', 'utf8');
});

router.post("/update/:index", function *(next) {
	console.log(this.session.who);
	console.log(this.request.body);

	var raw_data = yield Voting.findOne({index: this.params.index}).exec();

	var to_change = {};
	if (raw_data.need_login && raw_data.need_name) {
		to_change.id = this.req.user.id;
		to_change.username = this.req.user.displayName;
	} else if (raw_data.need_login && !raw_data.need_name) {
		to_change.id = this.req.user.id;
	} else if (!raw_data.need_login && raw_data.need_name) {
		to_change.id = this.session.username;
		to_change.username = this.session.username;
	} else if (!raw_data.need_name && !raw_data.need_name) {
		to_change.id = this.session.who;
	}

	console.log(to_change);

	if (this.session.who != null) {
		var cmd = this.request.body;
		if (cmd.type == "remove") {
			console.log("remove");
			yield Voting.update({"index": this.params.index, "choices.name": cmd.name},
								{$pull: {"choices.$.voters": to_change}}).exec();
		} else if (cmd.type == "add") {
			console.log("add");
			yield Voting.update({"index": this.params.index, "choices.name": cmd.name},
								{$addToSet: {"choices.$.voters": to_change}}).exec();
		}
		console.log("emit update");
		emitter.emit('update-' + this.params.index);
	} else {
		console.log("update but no session");
		this.status = 401;
	}
	this.body = "ok"
});


app.use(router.routes())
   .use(router.allowedMethods());

app.listen(config.port);
