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

function watchable_opne () {
	document.getElementById('watchable').style.display = '';
	document.getElementById('watchable_opne').style.display = 'none';
	document.getElementById('watchable_close').style.display = '';
}
function watchable_close() {
	document.getElementById('watchable').style.display = 'none';
	document.getElementById('watchable_opne').style.display = '';
	document.getElementById('watchable_close').style.display = 'none';
	document.forms.form1.watchID00.value = '';
	document.forms.form1.watchID01.value = '';
	document.forms.form1.watchID02.value = '';
	document.forms.form1.watchID03.value = '';
	document.forms.form1.watchID04.value = '';
	document.forms.form1.watchID05.value = '';
	document.forms.form1.watchID06.value = '';
	document.forms.form1.watchID07.value = '';
	document.forms.form1.watchID08.value = '';
	document.forms.form1.watchID09.value = '';
	document.getElementById('watchID01').style.display = 'none';
	document.getElementById('watchID02').style.display = 'none';
	document.getElementById('watchID03').style.display = 'none';
	document.getElementById('watchID04').style.display = 'none';
	document.getElementById('watchID05').style.display = 'none';
	document.getElementById('watchID06').style.display = 'none';
	document.getElementById('watchID07').style.display = 'none';
	document.getElementById('watchID08').style.display = 'none';
	document.getElementById('watchID09').style.display = 'none';
}
