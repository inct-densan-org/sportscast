function a() {
	var e = document.getElementsByClassName("sportsnametitle");
	var input=document.getElementById('competition');
	var cserch = document.getElementsByClassName("data");
	var cnames = document.getElementsByClassName("tname");
	var name = document.getElementById("strname");
	var tname = document.getElementsByClassName("tname");
	for(var i=0;i<e.length;i++){
		var tmp1 = cserch[i];
		var tmp2 = e[i];
		var tmp4 = tname[i];
		tmp1.parentNode.parentNode.parentNode.style.display='';
		tmp2.parentNode.parentNode.parentNode.style.display='';
	}
	for(var i=0;i<e.length;i++){
		var tmp=e[i];
		var tmp3 = cserch[i];
		var tmp5 = tname[i];
		if(input.value == "soccer" || input.value == "fencing"){
			if(tmp.innerHTML != input.value){
				var notdisplaynode=tmp.parentNode.parentNode.parentNode;
				notdisplaynode.style.display="none";
			}
		}
		else if(tmp5.innerHTML.indexOf(input.value) == -1){
			var notdisplaynode1 = tmp5.parentNode.parentNode.parentNode;
			notdisplaynode1.style.display = "none";
		}
	}
}