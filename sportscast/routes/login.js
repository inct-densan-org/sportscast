var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', message:''});
});

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

mongoose.connect('mongodb://61.23.8.105:47017/sportscasttestdb',
	function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('DB connection success!');
		}
	}
);

var schema = mongoose.Schema;

var article = mongoose.model('users', new schema({
	id: String,
	pass: String,
	sports: String
}));

passport.use(new LocalStrategy(
	function(username, password, done) {
		article.find({
			id: username
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
				if (doc.pass != password) {
					return done(null, false, {
						message: 'パスワードが間違っています'
					});
				}
				return done(null, doc);
			});
		});
	}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	article.find({
		id: id
	}, function(err, docs) {
		docs.forEach(function(doc) {
			if (err) {
				return done(err);
			}
			done(null, doc);
		});
	});
});


router.get('/',
	function(req, res, next) {
		var errorMsg = '';
		var error = req.flash().error;
		if (error) {
			errorMsg = error[0];
		}
		res.render('login', {
			title: 'Login',
			message: errorMsg
		});
	});

router.post('/',
	passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: true
	}),
	function(req, res, next) {
		res.redirect('/cast?'+req.user.sports);
	}
);
module.exports = router;
