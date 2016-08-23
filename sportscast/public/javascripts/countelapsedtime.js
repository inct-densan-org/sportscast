var gameTime=0;
var elapsedtime=0;

function initGameTime(sports){
	switch(sports){
		case "soccer":gameTime=45*60;break;
		case "fencing":gameTime=3*60;break;
		default:gameTime=1*60;
			console.log("競技名が不明なので、競技時間を60分に設定しました。");
			break;
	}
	elapsedtime=0;
}
function showElapsedTime(){
	elapsedtime++;
	if(elapsedtime<=gameTime){
		return elapsedtime;
	}
	else{
		elapsedtime=0;
		return -1;
	}
}