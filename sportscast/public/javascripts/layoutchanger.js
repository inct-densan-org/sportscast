function selectlayout(sports,page) {
	switch(sports){
		case"soccer":soccerlayout(page);break;
		case"fencing":fencinglayout(page);break;
		default:
			console.log("競技が不明なので、通常レイアウトに設定しました。");
			break;
	}
}

//競技がサッカーのときのレイアウト
function soccerlayout(page){

}

//競技がフェンシングのときのレイアウト
function fencinglayout(page){
	if(page=="cast"){
		var first_half_start_button=document.getElementById("first-half-start-button");
		var latter_half_start_button=document.getElementById("latter-half-start-button");
		first_half_start_button.innerHTML="試合開始";
		latter_half_start_button.style.display="none";
	}
	var team_name_title=document.getElementById("team-name-title");
	var info_title=document.getElementById("info-title");
	team_name_title.innerHTML="選手名";
	info_title.innerHTML="選手情報";
}