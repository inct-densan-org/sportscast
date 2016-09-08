//試合が始まっているかどうかを表す変数
var isGameStarted=false;

//前半後半をあらわす変数
var half="前半";

//前半のタイマー
var setItv_f;
//後半のタイマー
var setItv_l;


//競技状況配信
function sendScore(){
	//チーム(選手)名が入力されているかチェック
	if(teamnameCheck(team_name_a.value,team_name_b.value)==false){
		return false;
	}
	var json='{'+
	'"isGameStarted":'+isGameStarted+','+
	'"team_name_a":"'+team_name_a.value+'",'+
	'"team_name_b":"'+team_name_b.value+'",'+
	'"team_point_a":'+team_point_a.value+','+
	'"team_point_b":'+team_point_b.value+','+
	'"team_info_a":"'+team_info_a.value+'",'+
	'"team_info_b":"'+team_info_b.value+'",'+
	'"half":"'+half+'"}';
	socket.emit('scoreData',json);
	console.log(json);
	return true;
}
function first_half_start(){
	var tmp;
	isGameStarted=true;
	if(sendScore()==false){
		isGameStarted=false;
		return;
	}
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
	var first_half_start_button=document.getElementById("first-half-start-button");
	first_half_start_button.disabled=true;
	if(getSportsName()=='soccer'){
		var latter_half_start_button=document.getElementById("latter-half-start-button");
		latter_half_start_button.disabled=false;
	}
	else if(getSportsName()=='fencing'){
		var finish_game_button=document.getElementById("finish-game-button");
		finish_game_button.disabled=false;
	}
}
function latter_half_start(){
	var tmp;
	clearInterval(setItv_f);
	initGameTime(getSportsName());
	half="後半";
	sendScore();
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
	var latter_half_start_button=document.getElementById("latter-half-start-button");
	latter_half_start_button.disabled=true;
	var finish_game_button=document.getElementById("finish-game-button");
	finish_game_button.disabled=false;
}

function finishgame(){
	isGameStarted=false;
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
	var finish_game_button=document.getElementById('finish-game-button');
	finish_game_button.disabled=true;
	sendScore();
	half="";
}
//競技によって前後半の表示を切り替える関数
function showhalf(sports){
	switch(sports){
		case"soccer":break;
		case"fencing":half="";break;
		default:half="";break;
	}
}

function sectominsec(time) {
	var sec,min;
	var tmp;
	min=((time/60)|0);
	sec=time%60;
	tmp=(("0"+min).slice(-2)+":"+("0"+sec).slice(-2));
	return tmp;
}
//得点入力チェック用関数
function checkinput(input){
	//数字かどうかチェック
	if(isNaN(input)==false){
		//0～1000の範囲かどうかチェック
		if(input<0 || input>1000){
			alert("0～1000の範囲で数字を入力してください。");
			return false;
		}
	}
	else{
		alert("0～1000の範囲で数字を入力してください。");
		return false;
	}
}
function team_a_getpoint(){
	if(checkinput(team_point_a.value)==false){
		team_point_a.value="";
	}
}
function team_b_getpoint(){
	if(checkinput(team_point_b.value)==false){
		team_point_b.value="";
	}
}
function teamnameCheck(teamA,teamB){
	if(getSportsName()=='soccer'){
		if(teamA=="" || teamB==""){
			alert('チーム名が入力されていません');
			return false;
		}
		else{
			return true;
		}
	}
	else if(getSportsName()=='fencing'){
		if(teamA=="" || teamB==""){
			alert('選手名が入力されていません');
			return false;
		}
		else{
			return true;
		}
	}
}