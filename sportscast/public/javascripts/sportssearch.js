function search() {
	var sportsnametitleelements = document.getElementsByClassName('sportsnametitle');
	var input=document.getElementById('competition');
	var cserch = document.getElementsByClassName('data');
	var cnames = document.getElementsByClassName('tname');
	var name = document.getElementById('strname');
	var tname = document.getElementsByClassName('tname');
	for(var i=0;i<sportsnametitleelements.length;i++){
		var tmp1 = cserch[i];
		var tmp2 = sportsnametitleelements[i];
		tmp1.parentNode.parentNode.parentNode.style.display='';
		tmp2.parentNode.parentNode.parentNode.style.display='';
	}
	for(var i=0;i<sportsnametitleelements.length;i++){
		var tmp=sportsnametitleelements[i];
		var tmp5 = tname[i];
		var inputstr=input.value;
		if(inputstr.indexOf('soccer')!=-1 || inputstr.indexOf('fencing')!=-1){
			if(tmp.innerHTML != input.value){
				var notdisplaynode=tmp.parentNode.parentNode.parentNode;
				notdisplaynode.style.display='none';
			}
		}
		else if(tmp5.innerHTML.indexOf(input.value) == -1){
			var notdisplaynode1 = tmp5.parentNode.parentNode.parentNode;
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