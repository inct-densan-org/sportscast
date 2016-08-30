//試合が始まっているかどうかを表す変数
var isGameStarted=false;
//前半が始まっているかを表す変数
var isFirstHalfStarted=false;
//後半が始まっているかを表す変数
var isLatterHalfStarted=false;

//前半後半をあらわす変数
var half="前半";

//前半のタイマー
var setItv_f;
//後半のタイマー
var setItv_l;

function readJSONdata(data){
	var jsonobj=JSON.parse(data);
	isGameStarted=jsonobj.isGameStarted;
	team_name_a.value=jsonobj.team_name_a;
	team_name_b.value=jsonobj.team_name_b;
	team_point_a.value=jsonobj.team_point_a;
	team_point_b.value=jsonobj.team_point_b;
	team_info_a.value=jsonobj.team_info_a;
	team_info_b.value=jsonobj.team_info_b;
	//競技がサッカーのとき
	if(getSportsName()=="soccer"){
		if(jsonobj.half=="前半" && isFirstHalfStarted==false){
			first_half_start();
		}
		else if(jsonobj.half=="後半" && isLatterHalfStarted==false){
			latter_half_start();
		}
		else if(jsonobj.half=="後半" && isGameStarted==false){
			finishgame();
		}
	}
	//競技がフェンシングのとき
	else if(getSportsName()=="fencing"){
		if(isGameStarted==true){
			half="";
			first_half_start();
		}
		else{
			finishgame();
		}
	}
	notification("競技状況が更新されました。",getSportsName());
}
function first_half_start(){
	var tmp;
	setItv_f=setInterval(function(){
		tmp=showElapsedTime();
		if(tmp>0){
			elapsed_time.innerHTML=half+"　"+sectominsec(tmp);
		}
		else{
			elapsed_time.innerHTML="";
			clearInterval(setItv_f);
		}
	},1000);
	isFirstHalfStarted=true;
}
function latter_half_start(){
	var tmp;
	elapsed_time.innerHTML="";
	clearInterval(setItv_f);
	initGameTime(getSportsName());
	half="後半";
	setItv_l=setInterval(function(){
		tmp=showElapsedTime();
		if(tmp>0){
			elapsed_time.innerHTML=half+"　"+sectominsec(tmp);
		}
		else{
			elapsed_time.innerHTML="";
			clearInterval(setItv_l);
		}
	},1000);
	isLatterHalfStarted=true;
}
function finishgame() {
	//競技がサッカーなら後半のタイマーを止める
	if(getSportsName()=="soccer"){
		clearInterval(setItv_l);
	}
	//フェンシングなら前半のタイマーを止める(後半はない)
	else if(getSportsName()=="fencing"){
		clearInterval(setItv_f);
	}
	initGameTime(getSportsName());
	elapsed_time.innerHTML="";
}
function sectominsec(time) {
	var sec,min;
	var tmp;
	min=((time/60)|0);
	sec=time%60;
	tmp=(("0"+min).slice(-2)+":"+("0"+sec).slice(-2));
	return tmp;
}
//競技によって前後半の表示を切り替える関数
function showhalf(sports){
	switch(sports){
		case"soccer":break;
		case"fencing":half="";break;
		default:half="";break;
	}
}