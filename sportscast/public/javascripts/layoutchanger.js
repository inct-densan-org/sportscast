function selectlayout(sports, page) {
	switch (sports) {
		case 'soccer':
			soccerlayout(page);
			break;
		case 'fencing':
			fencinglayout(page);
			break;
		case 'video':
			videobroadcastlayout(page);
			break;
		default:
			break;
	}
}

//競技がサッカーのときのレイアウト
function soccerlayout(page) {

}

//競技がフェンシングのときのレイアウト
function fencinglayout(page) {
	if (page == 'cast') {
		var first_half_start_button = document.getElementById('first-half-start-button');
		var latter_half_start_button = document.getElementById('latter-half-start-button');
		first_half_start_button.innerHTML = '試合開始';
		latter_half_start_button.style.display = 'none';
	}
	var team_name_title = document.getElementById('team-name-title');
	var info_title = document.getElementById('info-title');
	team_name_title.innerHTML = '選手名';
	info_title.innerHTML = '選手情報';
}

//映像配信のみのときのレイアウト
function videobroadcastlayout(page){
	if (page == 'cast') {
		var score_area=document.getElementById('score');
		var video=document.getElementById('video');
		var my_video=document.getElementById('my_video');
		score_area.style.display='none';
		video.style.width='100%';
		video.style.textAlign='center';
		if(window.innerWidth<1000){
			my_video.style.width='100%';
		}
		else{
			my_video.style.width='50%';
		}
	}
	else{
		var score_area=document.getElementById('score');
		var video=document.getElementById('video');
		var video_area=document.getElementById('video-area');
		var cast_video=document.getElementById('cast_video');
		score_area.style.display='none';
		video.style.width='100%';
		video_area.style.textAlign='center';
		if(window.innerWidth<1000){
			cast_video.style.width='100%';
		}
		else{
			cast_video.style.width='50%';
		}
	}
}