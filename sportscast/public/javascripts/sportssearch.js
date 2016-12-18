function search() {
	var sportsnametitleelements = document.getElementsByClassName('sportsnametitle');
	var input=document.getElementById('competition');
	var tournamentnameelements = document.getElementsByClassName('tourmentname');

	for(var i=0;i<sportsnametitleelements.length;i++){
		var sportsnametitleelement = sportsnametitleelements[i];
		sportsnametitleelement.parentNode.parentNode.parentNode.style.display='';
	}
	for(var i=0;i<sportsnametitleelements.length;i++){
		var inputstr=input.value;
		var sportsnametitleelement =sportsnametitleelements[i];
		var tournamentnameelement = tournamentnameelements[i];
		if('soccer'.indexOf(inputstr)!=-1){
			if(sportsnametitleelement.innerHTML.indexOf(inputstr) == -1){
				var notdisplaynode=sportsnametitleelement.parentNode.parentNode.parentNode;
				notdisplaynode.style.display='none';
			}
		}
		else if('fencing'.indexOf(inputstr)!=-1){
			if(sportsnametitleelement.innerHTML.indexOf(inputstr) == -1){
				var notdisplaynode=sportsnametitleelement.parentNode.parentNode.parentNode;
				notdisplaynode.style.display='none';
			}
		}
		else if('video'.indexOf(inputstr)!=-1){
			if(sportsnametitleelement.innerHTML.indexOf(inputstr) == -1){
				var notdisplaynode=sportsnametitleelement.parentNode.parentNode.parentNode;
				notdisplaynode.style.display='none';
			}
		}
		else if(tournamentnameelement.innerHTML.indexOf(inputstr) == -1){
			var notdisplaynode1 = tournamentnameelement.parentNode.parentNode.parentNode;
			notdisplaynode1.style.display = 'none';
		}
	}
}