function selectlayout(sports) {
	switch(sports){
		case"soccer":soccerlayout();break;
		case"fencing":fencinglayout();break;
		default:
			console.log("競技が不明なので、通常レイアウトに設定しました。");
			break;
	}
}

//競技がサッカーのときのレイアウト
function soccerlayout(){

}

//競技がフェンシングのときのレイアウト
function fencinglayout(){
	var first_half_start_button=document.getElementById("first-half-start-button");
	var latter_half_start_button=document.getElementById("latter-half-start-button");
	var team_name_title=document.getElementById("team-name-title");
	var info_title=document.getElementById("info-title");
	first_half_start_button.innerHTML="試合開始";
	latter_half_start_button.style.display="none";
	team_name_title.innerHTML="選手名";
	info_title.innerHTML="選手情報";
}