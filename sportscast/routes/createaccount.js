var express = require('express');
var mail=require('../modules/mail.js');
var dbconnection = require('../modules/dbconnection.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('createaccount', {
		title: 'CreateAccount'
	});
});

router.post('/',function(req,res,next){
	console.log(req.body);
	var Data=dbconnection;
	var data=new Data();
	data.lastname=req.body.LastName;
	data.firstname=req.body.FirstName;
	data.email=req.body.mail1;
	data.pass=req.body.pass1;
	data.tournament=req.body.Tournament;
	data.sports=req.body.sports;
	data.startday=req.body.startday;
	data.finishday=req.body.finishday;
	data.enable=false;
	data.save(function(err){
		if(err){
			console.log(err);
		}
	});
	var mailmsg=req.body.LastName+'　'+req.body.FirstName+'さんがアカウント作成を申請しました。';
	mail(mailmsg);
	res.send('<p>登録が完了しました。</p><br><a href=\"/\">トップページに戻る</a>');
});
module.exports = router;