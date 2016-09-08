var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		res.render('cast', { title: 'Cast',
			caster:req.user.id,
			Tournament:'',
			sports:req.user.sports });
	}
	else{
		res.redirect('/login');
	}
});

module.exports = router;
