//競技IDを取得する関数
function getSportsId(){
	//URLを取得
	var url = document.location.href;
	//?でURLを分割する
	var args = url.split('?');
	//分割した数が1よりも大きかったら以下の処理を実行
	if (args.length > 1) {
		//配列から要素を取得
		var id = args[1];
		console.log(id);
		if (id != '') {
			//部屋名が取得出来たら部屋名を返す
			return id;
		}
	}
	//取得できなかったら空文字を返す
	document.location.href='/';
	return '';
}
//競技名を取得する関数
function getSportsName() {
	var id=getSportsId();

	if (id != '') {
		//競技IDが取得出来たら部屋名を返す
		return getSportsNameById(id);
	}
	
	//取得できなかったら_defaultroomを返す
	return;
}
//IDから競技名を取得する関数
function getSportsNameById(id){
	var request = new XMLHttpRequest();
	request.open('POST', '/sportsnames', false);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.send('id='+id);

	if (request.status === 200) {
		if(request.responseText!=''){
			console.log('競技名は'+request.responseText+'です。');
			return request.responseText;
		}
		else{
			document.location.href='/';
		}
	}
	request.abort();
}