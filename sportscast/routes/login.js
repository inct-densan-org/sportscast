var express = require('express');
var router = express.Router();
var dbconnection = require('../modules/dbconnection.js');
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

//実際のログインの処理　メールアドレスとパスワードを渡して一致するかチェック
passport.use(new LocalStrategy(
	function(username, password, done) {
		dbconnection.find({
			email: username
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
				if(doc.enable === false){
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

//ログイン情報をセッションに保存する処理(らしい)メールアドレスをもとにユーザーデータを検索して保存
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

//このページにアクセスしたときに最初に実行される
router.get('/',function(req, res, next) {
	var errorMsg = '';
	//ログイン時にエラーがあったときにreq.flash().errorにエラーメッセージが入ってる
	var error = req.flash().error;
	if (error) {
		errorMsg = error[0];
	}
	//titleにLogin、messageにエラーメッセージ(あれば)を表示
	res.render('login', {
		title: 'Login',
		message: errorMsg
	});
});

//login.ejsのsubmitを押した時に実行される
router.post('/',
	passport.authenticate('local', {//ログイン処理をする
		failureRedirect: '/login',//ログインに失敗したら再度loginを表示
		failureFlash: true
	}),
	function(req, res, next) {
		res.redirect('/cast?'+req.user._id);//ログインに成功したら配信用ページに移動
	}
);
module.exports = router;