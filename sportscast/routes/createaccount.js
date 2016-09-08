var express = require('express');
var mail=require('../modules/mail.js');
var router = express.Router();

var mongoose = require('mongoose');
var schema=mongoose.Schema;
var dataschema=new schema({
	lastname : String,
	firstname : String,
	email : String,
	pass : String,
	tournament : String,
	sports : String,
	startday : String,
	finishday : String,
	policy : Boolean,
	terms : Boolean,
	enable : Boolean
});

mongoose.model('usersdatas',dataschema);
mongoose.connect('mongodb://61.23.8.105:47017/SportsCastDB',
	function(err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log('DB connection success!');
		}
	}
); 

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('createaccount', { title: 'CreateAccount'});
});

router.post('/',function(req,res,next){
	console.log(req.body);
	var Data=mongoose.model('usersdatas');
	var data=new Data();
	data.lastname=req.body.LastName;
	data.firstname=req.body.FirstName;
	data.email=req.body.mail1;
	data.pass=req.body.pass1;
	data.tournament=req.body.Tournament;
	data.sports=req.body.sports;
	data.startday=req.body.startday;
	data.finishday=req.body.finishday;
	data.policy=true;
	data.terms=true;
	data.enable=false;
	data.save(function(err){
		if(err){
			console.log(err);
		}
	});
	var mailmsg=req.body.LastName+'　'+req.body.FirstName+'さんがアカウント作成を申請しました。'
	//mail(mailmsg);
	res.send('<p>登録が完了しました。</p><br><a href=\"/\">トップページに戻る</a>');
});
module.exports = router;
