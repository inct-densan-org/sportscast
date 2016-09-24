function getSportsNameById(id){
	var request = new XMLHttpRequest();
	request.open('POST', '/sportsnames', false);  // `false` makes the request synchronous
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.send('id='+id);

	if (request.status === 200) {
		console.log('競技名は'+request.responseText+'です。');
		return request.responseText;
	}
	request.abort();
}
//部屋名を取得する関数
function getSportsName() { // たとえば、 URLに  ?roomname  とする
	//URLを取得
	var url = document.location.href;
	//?でURLを分割する
	var args = url.split('?');
	//分割した数が1よりも大きかったら以下の処理を実行
	if (args.length > 1) {
		//配列から要素を取得
		var id = args[1];
		if (id != '') {
			//部屋名が取得出来たら部屋名を返す
			return getSportsNameById(id);
		}
	}
	//取得できなかったら_defaultroomを返す
	return '_defaultroom';
}

// function getSportsName(){
// 	var sports='';
// 	//data = {id: data}; // POSTメソッドで送信するデータ

// 	var xmlHttpRequest = new XMLHttpRequest();
// 	xmlHttpRequest.onreadystatechange = function(){
// 		var READYSTATE_COMPLETED = 4;
// 		var HTTP_STATUS_OK = 200;

// 		if(this.readyState == READYSTATE_COMPLETED
// 		&& this.status == HTTP_STATUS_OK)
// 		{
// 			sports=this.responseText;
// 			console.log(sports);

// 			console.log('競技名は'+sports);

// 			//競技時間を競技名に応じて初期化
// 			initGameTime(sports);

// 			//競技状況配信機能のUIを競技に応じて変更
// 			selectlayout(sports, 'cast');

// 			//競技によって前後半の表示を切り替える
// 			showhalf(sports);
// 			return sports;
// 		}
// 	};

// 	xmlHttpRequest.open('POST', '/cast');

// 	xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

// 	xmlHttpRequest.send();
// }