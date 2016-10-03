var express = require('express');
var dbconnection = require('../modules/dbconnection.js');
var router = express.Router();

//競技名をもとにIDを検索して返す
router.post('/', function(req, res) {
	dbconnection.find({
		sports: req.body.sports
	}, function(err, docs) {
		if(!docs){
			console.log(req.body.sports+'is not found');
			res.send('');
		}
		else{
			docs.forEach(function(doc) {
				if (err) {
					return done(err);
				}
				res.send(doc._id);
			});
		}
	});
});

module.exports = router;