function search() {
	var sportsnametitleelements = document.getElementsByClassName('sportsnametitle');
	var input=document.getElementById('competition');
	var cserch = document.getElementsByClassName('data');
	var cnames = document.getElementsByClassName('tname');
	var name = document.getElementById('strname');
	var tname = document.getElementsByClassName('tname');
	var inputstr=input.value;
	for(var i=0;i<sportsnametitleelements.length;i++){
		var tmp1 = cserch[i];
		var tmp2 = sportsnametitleelements[i];
		tmp1.parentNode.parentNode.parentNode.style.display='';
		tmp2.parentNode.parentNode.parentNode.style.display='';
	}
	for(var i=0;i<sportsnametitleelements.length;i++){
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
			notdisplaynode1.style.display = 'none';
		}
	}
}