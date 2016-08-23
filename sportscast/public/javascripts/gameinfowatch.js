function readJSONdata(data){
	var jsonobj=JSON.parse(data);
	isGameStarted=jsonobj.isGameStarted;
	team_name_a.value=jsonobj.team_name_a;
	team_name_b.value=jsonobj.team_name_b;
	team_point_a.value=jsonobj.team_point_a;
	team_point_b.value=jsonobj.team_point_b;
	team_info_a.value=jsonobj.team_info_a;
	team_info_b.value=jsonobj.team_info_b;
	if(jsonobj.half=="前半" && isGameStarted==false){
		first_half_start();
	}
	else if(jsonobj.half=="後半"){
		latter_half_start();
	}
	notification("競技状況が更新されました。",getRoomName());
}
function first_half_start(){
	var tmp;
	var setItv;
	setItv=setInterval(function(){
		tmp=showElapsedTime();
		if(tmp>0){
			elapsed_time.innerHTML=half+"　"+sectominsec(tmp);
		}
		else{
			elapsed_time.innerHTML="";
			clearInterval(setItv);
		}
	},1000);
}
function latter_half_start(){
	var tmp;
	var setItv;
	elapsed_time.innerHTML="";
			clearInterval(setItv);
	half="後半";
	setItv=setInterval(function(){
		tmp=showElapsedTime();
		if(tmp>0){
			elapsed_time.innerHTML=half+"　"+sectominsec(tmp);
		}
		else{
			elapsed_time.innerHTML="";
			clearInterval(setItv);
		}
	},1000);
}
function sectominsec(time) {
	var sec,min;
	var tmp;
	min=((time/60)|0);
	sec=time%60;
	tmp=(("0"+min).slice(-2)+":"+("0"+sec).slice(-2));
	return tmp;
}