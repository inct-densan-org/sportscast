var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('createaccount', { title: 'CreateAccount'});
});

router.post('/',function(req,res,next){
	console.log(req.body);
	res.send('<p>登録が完了しました。</p><br><a href=\"/\">トップページに戻る</a>');
});
module.exports = router;
