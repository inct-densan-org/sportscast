var mailer = require('nodemailer');
var settings = {
	service : 'Gmail',
	//アカウント情報
	auth:{
		user : '', //mail address
		pass : '', //password
		port : 465
	}
};
var smtp = mailer.createTransport(settings);

module.exports=function(message){
	var options = {
		to : 'example@example.org',
		subject : 'SportsCast! アカウント作成申請',
		html : message,
		form : 'SportsCast! Server'
	};
	smtp.sendMail(options, function(error, result) {
		if (error) {
			//メール送信失敗
			console.error(error);
		} else {
			//メール送信成功
			console.dir(result);
		}
		smtp.close();
	});
};