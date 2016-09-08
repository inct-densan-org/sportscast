var express = require('express');
var mail=require('../modules/mail.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('createaccount', { title: 'CreateAccount'});
});

router.post('/',function(req,res,next){
	console.log(req.body);
	mail(req.body);
	res.send('<p>登録が完了しました。</p><br><a href=\"/\">トップページに戻る</a>');
});
module.exports = router;
