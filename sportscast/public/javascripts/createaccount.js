function mail_check() {
	$("#alert").css("visibility", "visible"); // 表示できるようにして
	$("#alert").hide(); // 隠しておく
	if (document.forms.form1.mail1.value !== document.forms.form1.mail2.value){ // 不一致なら
		$("#alert").show(); // 警告表示
	} else {
		$("#alert").hide(); // 不要かも(^^;
	}
}
