function mail_check() {
	var alert=document.getElementById('alert');
	alert.style.visibility='visible';
	alert.style.display='none';
	if (document.forms.form1.mail1.value !== document.forms.form1.mail2.value){
		alert.style.display='block';
	} else {
		alert.style.display='none';
	}
}
