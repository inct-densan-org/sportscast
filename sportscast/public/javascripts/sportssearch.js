function search() {
	var sportsnametitleelements = document.getElementsByClassName('sportsnametitle');
	var input=document.getElementById('competition');
<<<<<<< HEAD
	var tournamentnameelements = document.getElementsByClassName('tourmentname');

=======
	var cserch = document.getElementsByClassName('data');
	var cnames = document.getElementsByClassName('tname');
	var name = document.getElementById('strname');
	var tname = document.getElementsByClassName('tname');
	var inputstr=input.value;
>>>>>>> 64554ef68ccd293de085c1692529e54dbe152aa5
	for(var i=0;i<sportsnametitleelements.length;i++){
		var sportsnametitleelement = sportsnametitleelements[i];
		sportsnametitleelement.parentNode.parentNode.parentNode.style.display='';
	}
	for(var i=0;i<sportsnametitleelements.length;i++){
<<<<<<< HEAD
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
=======
		var tmp=sportsnametitleelements[i];
		var tmp5 = tname[i];
		if('soccer'.indexOf(inputstr)!=-1){
			if(tmp.innerHTML.indexOf(inputstr) == -1){
				var notdisplaynode=tmp.parentNode.parentNode.parentNode;
				notdisplaynode.style.display='none';
			}
		}
		else if('fencing'.indexOf(inputstr)!=-1){
			if(tmp.innerHTML.indexOf(inputstr) == -1){
				var notdisplaynode=tmp.parentNode.parentNode.parentNode;
				notdisplaynode.style.display='none';
			}
		}
		else if(tmp5.innerHTML.indexOf(inputstr) == -1){
			var notdisplaynode1 = tmp5.parentNode.parentNode.parentNode;
>>>>>>> 64554ef68ccd293de085c1692529e54dbe152aa5
			notdisplaynode1.style.display = 'none';
		}
	}
}