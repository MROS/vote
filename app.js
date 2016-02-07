var koa = require('koa');
var logger = require('koa-logger');
var serve = require('koa-static');
var router = require('koa-router')();

var app = koa();
app.use(logger());
app.use(serve('public'));

// app.use(function *(){
//   this.body = 'jjjj World';
// });

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000);
