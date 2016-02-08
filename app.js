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

router.get("/data/:index", function *(next) {
	var data = yield Voting.findOne({index: this.params.index}).exec();
	console.log(data);
	this.body = JSON.stringify(data);
});

router.get("/q/:index", function *(next) {
	this.body = yield fs.readFile('public/voting.html', 'utf8');
});


app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000);
