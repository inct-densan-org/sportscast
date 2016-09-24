var express = require('express');
var dbconnection = require('../modules/dbconnection.js');
var router = express.Router();

router.post('/', function(req, res) {
	console.log(req.body.id);
	dbconnection.find({
		_id: req.body.id
	}, function(err, docs) {
		docs.forEach(function(doc) {
			if (err) {
				return done(err);
			}
			res.send(doc.sports);
		});
	});
	
});

module.exports = router;