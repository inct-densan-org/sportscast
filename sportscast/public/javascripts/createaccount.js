function mail_check() {
	var mailalert=document.getElementById('mailalert');
	mailalert.style.visibility='visible';
	mailalert.style.display='none';
	if (document.forms.form1.mail1.value !== document.forms.form1.mail2.value){
		mailalert.style.display='block';
	} else {
		mailalert.style.display='none';
	}
}
function pass_check() {
	var passalert=document.getElementById('passalert');
	passalert.style.visibility='visible';
	passalert.style.display='none';
	if (document.forms.form1.pass1.value !== document.forms.form1.pass2.value){
		passalert.style.display='block';
	} else {
		passalert.style.display='none';
	}
}
