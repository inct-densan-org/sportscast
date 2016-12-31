var mongoose = require('mongoose');

var schema = mongoose.Schema;

var dataschema=new schema({
	lastname : String,
	firstname : String,
	email : String,
	pass : String,
	tournament : String,
	sports : String,
	startday : String,
	finishday : String,
	enable : Boolean
});

var article = mongoose.model('userdatas',dataschema);
mongoose.connect('mongodb://user:pass@sportscast.live-on.net:27017/SportsCastDB',
	function(err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log('DB connection success!');
		}
	}
);

module.exports = article;