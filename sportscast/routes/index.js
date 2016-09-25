var express = require('express');
var router = express.Router();
var dbconnection = require('../modules/dbconnection.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	generationTitles(res);
	console.log('Accessed '+getTime()+' '+getIpAddress(req));
});

function generationTitles(res){
	var htmltext='';
	dbconnection.find({
		enable: true
	}, function(err, docs) {
		docs.forEach(function(doc) {
			if (err) {
				return done(err);
			}
			htmltext+='<a href=\"/watch?'+doc._id+'\">'+
				'<div class=\"sportstitle\" style=\"background-image: url(/images/'+doc.sports+'.png);\">'+
				'<div class=\"sports\"><span class=\"sportsname\">競技名　<span>'+
					doc.sports+
				'</span></span></div><div class=\"data\">'+
				'<ul>'+
				'<li>配信者　'+doc.lastname+' '+doc.firstname+'</li>'+
				'<li>大会名　'+doc.tournament+'</li></ul>'+
				'</div></div></a>\n';
		});
		res.render('index', {
			title: 'SportCast!',
			sportstitle: htmltext
		});
	});
}
function getIpAddress(req) {
	if (req.headers['x-forwarded-for']) {
		return req.headers['x-forwarded-for'];
	}
	if (req.connection && req.connection.remoteAddress) {
		return req.connection.remoteAddress;
	}
	if (req.connection.socket && req.connection.socket.remoteAddress) {
		return req.connection.socket.remoteAddress;
	}
	if (req.socket && req.socket.remoteAddress) {
		return req.socket.remoteAddress;
	}

	return '0.0.0.0';
}
function getTime() {
	var date=new Date();
	var time=date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+
				date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	return time;
}

module.exports = router;