var express = require('express');
var dbconnection = require('../modules/dbconnection.js');
var router = express.Router();

//IDをもとに競技名を検索して返す
router.post('/', function(req, res) {
	dbconnection.find({
		_id: req.body.id
	}, function(err, docs) {
		if(!docs){
			console.log(req.body.id+'is not found');
			res.send('');
		}
		else{
			docs.forEach(function(doc) {
				if (err) {
					return done(err);
				}
				res.send(doc.sports);
			});
		}
	});
});

module.exports = router;