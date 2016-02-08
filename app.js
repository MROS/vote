var koa = require('koa');
var logger = require('koa-logger');
var serve = require('koa-static');
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser')();
var random_url = require('./util.js').random_url;
var fs = require('co-fs');

var app = koa();
app.use(logger());
app.use(serve('public'));
app.use(bodyParser);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/voting');


var Voting = mongoose.model(
	'voting',
	{
		index: String,
		title: String,
		multi_select: Boolean,
		need_name: Boolean,
		need_login: Boolean,
		choices: [
			{name: String, voters: [{user: String, id: String}]}
		]
	}
);

// app.use(function *(){
//   this.body = 'jjjj World';
// });

router.get("/data/:index", function *(next) {
	var data = yield Voting.findOne({index: this.params.index}).exec();
	console.log(data);
	this.body = JSON.stringify(data);
});

router.get("/q/:index", function *(next) {
	this.body = yield fs.readFile('public/voting.html', 'utf8');
});

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

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000);
