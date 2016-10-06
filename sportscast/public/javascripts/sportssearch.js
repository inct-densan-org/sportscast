function search() {
	var sportsnametitleelements = document.getElementsByClassName('sportsnametitle');
	var input=document.getElementById('competition');
	var tournamentnameelements = document.getElementsByClassName('tourmentname');

	for(var i=0;i<sportsnametitleelements.length;i++){
		var sportsnametitleelement = sportsnametitleelements[i];
		sportsnametitleelement.parentNode.parentNode.parentNode.style.display='';
	}
	for(var i=0;i<sportsnametitleelements.length;i++){
		var sportsnametitleelement =sportsnametitleelements[i];
		var tournamentnameelement = tournamentnameelements[i];
		var inputstr=input.value;
		if(inputstr.indexOf('soccer')!=-1 || inputstr.indexOf('fencing')!=-1){
			if(sportsnametitleelement.innerHTML != input.value){
				var notdisplaynode=sportsnametitleelement.parentNode.parentNode.parentNode;
				notdisplaynode.style.display='none';
			}
		}
		else if(tournamentnameelement.innerHTML.indexOf(input.value) == -1){
			var notdisplaynode1 = tournamentnameelement.parentNode.parentNode.parentNode;
			notdisplaynode1.style.display = 'none';
		}
	}
}
function enterkey(evt){
	if (evt.keyCode) {
		if (evt.keyCode == 13) {
			search();
			return;
		}
	} else if (window.event.keyCode == 13) {
		search();
		return;
	}
}