var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'SportCast!'
	});
	console.log('Accessed '+getTime()+' '+getIpAddress(req));
});

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