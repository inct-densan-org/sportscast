
function console_output() {
	var form = document.forms.form1;
	console.log('LastName:', form.LastName.value);
	console.log('FirstName:', form.FirstName.value);
	console.log('mail1:', form.mail1.value);
	console.log('mail2:', form.mail2.value);
	console.log('Tournament:', form.Tournament.value);
	console.log('start:', form.start.value);
	console.log('finish:', form.finish.value);
	console.log('policy:', form.policy.checked);
	console.log('Terms:', form.Terms.checked);
};

function mail_check() {
	$("#alert").css("visibility", "visible"); // 表示できるようにして
	$("#alert").hide(); // 隠しておく
	if (document.forms.form1.mail1.value !== document.forms.form1.mail2.value){ // 不一致なら
		$("#alert").show(); // 警告表示
	} else {
		$("#alert").hide(); // 不要かも(^^;
	}
}
