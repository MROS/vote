var config = require('./config.js');
var passport = require('koa-passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./db.js').User;

passport.serializeUser(function(user, done) {
	done(null, user.id)
})

passport.deserializeUser(function(id, done) {
	User.findOne({id: id}, function(err, user) {
		done(null, user)
	})
})

passport.use(
	new FacebookStrategy({
		clientID: config.clientID,
		clientSecret: config.clientSecret,
		callbackURL: 'http://'+ config.host + ':' + config.proxy_port + '/auth/facebook/callback'
	},
	function(token, tokenSecret, profile, done) {
		console.log(profile)
		var user = {id: profile.id, name: profile.displayName}
		User.findOne(user, function(err, found_user) {
			if (found_user == null) {
				User.create(user, function(err, user) {
					if (err) {
						console.log("create user fail")
					}
					console.log("careate new user");
					console.log(user);
					done(null, user)
				})
			} else {
				console.log("find user");
				console.log(user);
			}
			done(null, user)
		});
	})
)
