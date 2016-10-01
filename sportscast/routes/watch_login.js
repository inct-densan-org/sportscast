var express = require('express');
var router = express.Router();
var dbconnection = require('../modules/dbconnection.js');
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		dbconnection.find({
			watchableuser: username
		}, function(err, docs) {
			if (err) {
				return done(null, false, {
					message: 'ユーザー名が間違っています'
				});
			}
			if (!docs.length) {
				return done(null, false, {
					message: 'ユーザー名が間違っています'
				});
			}
			docs.forEach(function(doc) {
				if (err) {
					return done(err);
				}
				if (!doc) {
					return done(null, false, {
						message: 'ユーザー名が間違っています'
					});
				}
				if (doc.watchpass != password) {
					return done(null, false, {
						message: 'パスワードが間違っています'
					});
				}
				if(doc.enable === false){
					console.log(doc.enable);
					return done(null, false, {
						message: 'このアカウントはまだ有効化されていません。'
					});
				}
				return done(null, doc);
			});
		});
	}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	dbconnection.find({
		email: email
	}, function(err, docs) {
		docs.forEach(function(doc) {
			if (err) {
				return done(err);
			}
			done(null, doc);
		});
	});
});


router.get('/',function(req, res, next) {
	var errorMsg = '';
	var error = req.flash().error;
	if (error) {
		errorMsg = error[0];
	}
	res.render('watch_login', {
		title: 'Watch Login',
		message: errorMsg
	});
});

router.post('/',
	passport.authenticate('local', {
		failureRedirect: '/watch_login',
		failureFlash: true
	}),
	function(req, res, next) {
		res.redirect('/watch?'+req.user._id);
	}
);
module.exports = router;
