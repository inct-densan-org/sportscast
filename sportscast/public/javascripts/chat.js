var isChatOpen=false;
var isPhone=false;

var chat=document.getElementById('chat');
var chat_open_icon=document.getElementById('chat-open-icon');

function checkphone() {//画面の幅からスマホかどうか判定する関数
	var width=window.innerWidth;
	if(width<1000){
		isPhone=true;
		return;
	}
	else{
		return;
	}
}
window.onresize=checkphone;
checkphone();

function openchat(){
	if(isChatOpen==false){//チャットを開く処理
		isChatOpen=true;
		chat.style.height='360px';
		chat.style.border='solid #1976d2 2px';
		if(isPhone==true){//スマホのとき
			chat_open_icon.style.transform ='rotate(270deg)';
			chat_open_icon.style.MozTransform ='rotate(270deg)';
			chat_open_icon.style.webkitTransform ='rotate(270deg)';
		}
		else{
			chat_open_icon.style.transform ='rotate(180deg)';
			chat_open_icon.style.MozTransform ='rotate(180deg)';
			chat_open_icon.style.webkitTransform ='rotate(180deg)';
		}

	}
	else{//チャットを閉じる処理
		isChatOpen=false;
		chat.style.height='0px';
		chat.style.border='none';
		if(isPhone==true){//スマホのとき
			chat_open_icon.style.transform ='rotate(90deg)';
			chat_open_icon.style.MozTransform ='rotate(90deg)';
			chat_open_icon.style.webkitTransform ='rotate(90deg)';
		}
		else{
			chat_open_icon.style.transform ='rotate(0deg)';
			chat_open_icon.style.MozTransform ='rotate(0deg)';
			chat_open_icon.style.webkitTransform ='rotate(0deg)';
		}
	}
}

function expicon(){
	if(isPhone==true){
		return;
	}
	if(isChatOpen==true){
		chat_open_icon.style.transform='scale(1.2) rotate(180deg)';
		chat_open_icon.style.MozTransform='scale(1.2) rotate(180deg)';
		chat_open_icon.style.webkitTransform='scale(1.2) rotate(180deg)';
	}
	else{
		chat_open_icon.style.transform='scale(1.2)';
		chat_open_icon.style.MozTransform='scale(1.2)';
		chat_open_icon.style.webkitTransform='scale(1.2)';
	}
}
function reducticon(){
	if(isPhone==true){
		return;
	}
	if(isChatOpen==true){
		chat_open_icon.style.transform='scale(1.0) rotate(180deg)';
		chat_open_icon.style.MozTransform='scale(1.0) rotate(180deg)';
		chat_open_icon.style.webkitTransform='scale(1.0) rotate(180deg)';
	}
	else{
		chat_open_icon.style.transform='scale(1.0)';
		chat_open_icon.style.MozTransform='scale(1.0)';
		chat_open_icon.style.webkitTransform='scale(1.0)';
	}
}