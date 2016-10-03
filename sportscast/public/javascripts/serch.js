document.onkeyup = onkeyup;



function onkeyup() {

	var text = document.forms.form01.search.value.trim().replace(/　/g,' ').split(' ');

	$('tr.add_js').each(function(){

		for (var i = 0; i < text.length; i++){

			var isShow = 0;

			if (~$(this).text().indexOf(text[i])) {

				isShow = 1;

			} else {

				$("div", this).slideUp(300);

				$(this).hide(300);

				break;

			}

		}



	});

}