/*
ベンダープレフィックス*/
peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
	window.webkitRTCPeerConnection || window.msRTCPeerConnection;
sessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
	window.webkitRTCSessionDescription || window.msRTCSessionDescription;

// navigator.getUserMedia = navigator.getUserMedia || navigator.mediaDevices.getUserMedia ||
// 					   navigator.webkitGetUserMedia || navigator.msGetUserMedia;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia || navigator.msGetUserMedia;
/*navigator.getUserMedia = navigator.getUserMedia || navigator.mediaDevices.getUserMedia ||
					   navigator.webkitGetUserMedia || navigator.msGetUserMedia;*/
/**/


var localVideo = document.getElementById('my_video');
var elapsed_time = document.getElementById('elapsed-time');
var team_name_a = document.getElementById('team-name-a');
var team_name_b = document.getElementById('team-name-b');
var team_point_a = document.getElementById('team-point-a');
var team_point_b = document.getElementById('team-point-b');
var team_info_a = document.getElementById('team-info-a');
var team_info_b = document.getElementById('team-info-b');

var localStream = null;
var mediaConstraints = {
	'mandatory': {
		'OfferToReceiveAudio': false,
		'OfferToReceiveVideo': false
	}
};

//socketの接続状態を表す変数
var socketStatus = false;
//シグナリングサーバ―の接続待ち受けポート
var PORT = 3001;
//var ADDRESS='http://192.168.0.14:'+PORT+'/';
var ADDRESS = 'http://localhost:' + PORT + '/';

//競技時間を競技名に応じて初期化
initGameTime(getSportsName());

//競技状況配信機能のUIを競技に応じて変更
selectlayout(getSportsName(), 'cast');

//競技によって前後半の表示を切り替える
showhalf(getSportsName());

//ローカルストリーム(カメラとマイクからのデータの取得)が開始されているか判定する関数
//onMessage関数でメッセージがcast_requestのとき、tellCastReady関数から呼び出される
function isLocalStreamStarted() {
	if (localStream) {
		return true;
	} else {
		return false;
	}
}

//複数のPeer-to-Peer接続を管理するための便宜上のクラスと、関連する関数
var MAX_CONNECTION_COUNT = 10; //最大接続数
var connections = {}; //接続用の連想配列
function Connection() { //接続用のクラス
	var self = this;
	var id = ''; //視聴者のsocket.id
	var peerconnection = null; //RTCPeerConnectionインスタンス
}

//視聴者のidから接続情報を取得して返す関数(Connectionクラスから)
//onMessage関数、onCandidate関数、sendOffer関数、setAnswer関数から呼び出される
function getConnection(id) {
	var con = null;
	con = connections[id];
	return con;
}

//接続している視聴者のsocket.idを追加する関数
//prepareNewConnection関数から呼び出される
function addConnection(id, connection) {
	connections[id] = connection;
}

//接続数をカウントして結果を返す関数
//isConnectPossible関数、isPeerStarted関数から呼び出される
function getConnectionCount() {
		var count = 0;
		//connectionsのid(socket.id)をカウント
		for (var id in connections) {
			count++;
		}
		//デバッグ用ログ出力
		console.log('接続数は' + count);
		return count;
	}
	//接続可能かを判定する関数
function isConnectPossible() {
	//接続数が10未満ならtrueを返す
	if (getConnectionCount() < MAX_CONNECTION_COUNT)
		return true;
	//10以上ならfalseを返す
	else
		return false;
}

//接続している視聴者のidの位置を返す関数
function getConnectionIndex(id_to_lookup) {
	var index = 0;
	for (var id in connections) {
		if (id == id_to_lookup) {
			return index;
		}
		index++;
	}
	//見つからなかったら-1を返す
	return -1;
}

//視聴者の接続idを削除する関数
function deleteConnection(id) {
	delete connections[id];
}

//接続をすべて切断する関数
//hangUp関数から呼び出される
function stopAllConnections() {
	//視聴者の人数分forを回す
	for (var id in connections) {
		//connにidさんの接続情報を渡しておいて...
		var conn = connections[id];
		//idさんの接続を閉じて...
		conn.peerconnection.close();
		//nullを代入して...
		conn.peerconnection = null;
		//idさんの接続情報を削除
		delete connections[id];
	}
}

//idを指定して接続を削除する関数
//onMessage関数でメッセージがexitまたはonUserDisconnect関数から呼び出される
function stopConnection(id) {
	//connにidさんの接続情報を渡しておいて...
	var conn = connections[id];
	//idさんの情報が存在すれば以下を実行
	if (conn) {
		//idさんの接続を閉じて...
		conn.peerconnection.close();
		//nullを代入して...
		conn.peerconnection = null;
		//idさんの接続情報を削除
		delete connections[id];
		//デバッグ用ログ出力
		console.log(id + 'の接続を切断し、接続情報を削除しました。');
	}
	//idさんの情報が存在しなければ以下を実行
	else {
		console.error(id + 'の接続の切断、接続情報の削除を試みましたが、' + id + 'は見つかりませんでした。');
	}
}

//ペア接続しているか判定する関数
//onMessage関数でメッセージがanswerまたはcandidateのときに呼び出される
function isPeerStarted() {
	//視聴者の接続数が0よりも大きいならtrueを返す
	if (getConnectionCount() > 0) {
		return true;
	}
	//それ以外ならfalseを返す
	else {
		return false;
	}
}


//シグナリングサーバーへの接続に関する処理
//socket接続を作成
//シグナリングサーバーに接続
var socket = io.connect(ADDRESS); //IPアドレスの部分は実行環境によって変更する

//各イベントごとの処理を定義
socket.on('connect', onOpened)
	.on('message', onMessage)
	.on('user disconnected', onUserDisconnect);

//視聴者が接続したときの処理
function onOpened(evt) {
	socketStatus = true;
	//デバッグ用ログ出力
	console.log('socketを開きました。');
	//部屋名の取得
	var roomname = getSportsName();
	//取得した部屋に入室
	socket.emit('enter', roomname);
	//デバッグ用ログ出力
	console.log(roomname + 'に入室しました。');
}

//メッセージを受け取ったときの処理(メッセージ受信時のイベントハンドラを設定)
//応答するメッセージは、cast_request, answer, candidate
function onMessage(evt) {
	//リクエストしてきた視聴者のidを取得
	var id = evt.from;
	//リクエスト先を取得
	var target = evt.sendto;
	//idを渡して視聴者の接続情報を取得
	var conn = getConnection(id);

	//メッセージがcast_requestである時の処理
	if (evt.type === 'cast_request') {
		if (!isLocalStreamStarted()) {
			//音声・映像の取得が開始されていなかったらエラーのログ出力
			console.warn('音声・映像の取得が開始されていないので要求を無視しました。');
			//処理を終了する
			return;
		}
		//sendOffer関数を呼び出し、視聴者のidを渡す。(下で定義されている)
		sendOffer(id);
		//デバッグ用ログ出力
		console.log('リクエストを受け取りました。配信を開始します。');
		return;
	}
	//メッセージがanswerであり、かつペア接続しているときの処理
	else if (evt.type === 'answer' && isPeerStarted()) {
		//onAnswer関数を呼び出す(下で定義されている)
		onAnswer(evt);
		//デバッグ用ログ出力
		console.log('answerを受信しました。answerのSDPを設定します。');
	}
	//メッセージがcandidateであり、かつペア接続しているときの処理
	else if (evt.type === 'candidate' && isPeerStarted()) {
		//onCandidate関数を呼び出す(下で定義されている)
		onCandidate(evt);
		//デバッグ用ログ出力
		console.log('ICE candidateを受信しました。');
	}
	//メッセージがexitのときの処理
	else if (evt.type === 'exit') {
		//stopConnection関数を呼び出す(上で定義されている)
		stopConnection(id);
		//デバッグ用ログ出力
		console.log('接続終了');
	}
}

//視聴者が接続終了したときの処理
function onUserDisconnect(evt) {
	if (evt) {
		//stopConnection関数を呼び出し、視聴者のidを渡す(上で定義されている)
		stopConnection(evt.id);
		//デバッグ用ログ出力
		console.log('切断しました。');
	}
}

//onMessage関数でメッセージがanswerのときに呼び出される
function onAnswer(evt) {
	//setAnswe関数を呼び出す(下で定義されている)
	setAnswer(evt);
	//デバッグ用ログ出力
	console.log('Answerを受信しました。');
	console.log(evt);
}

//onMessage関数でメッセージがcandidateのときに呼び出される
function onCandidate(evt) {
	//メッセージを送信してきた視聴者のidを取得する
	var id = evt.from;
	//idを基に視聴者の接続情報を取得する
	var conn = getConnection(id);
	//接続情報が得られなかった時の処理
	if (!conn) {
		//デバッグ用ログ出力
		console.error('peerConnectionが存在しません');
		return;
	}

	//接続情報が得られた時の処理
	//RTCIceCandidateオブジェクトを生成
	//各項目の詳細は以下を参照
	//https://developer.mozilla.org/ja/docs/Web/API/RTCIceCandidate
	//https://developer.mozilla.org/ja/docs/Web/API/RTCPeerConnection#addIceCandidate%28%29
	var candidate = new RTCIceCandidate({
		sdpMLineIndex: evt.sdpMLineIndex,
		sdpMid: evt.sdpMid,
		candidate: evt.candidate
	});
	//candidateを接続情報に追加
	conn.peerconnection.addIceCandidate(candidate);
	//デバッグ用ログ出力
	console.log('Candidateを受信しました');
	console.log(candidate);
}

//SDPを送信する関数
//sendOffer関数から呼び出される
function sendSDP(sdp) {
	//引数のsdpをJSON形式に整形して代入
	var text = JSON.stringify(sdp);
	//sdpをsocketで送信
	socket.json.send(sdp);
	//デバッグ用ログ出力
	console.log('SDPを送信しました。');
	console.log(text);
}

//Candidateを送信する関数
//prepareNewConnection関数から呼び出される
function sendCandidate(candidate) {
	//引数のcandidateをJSON形式に整形して代入
	var text = JSON.stringify(candidate);
	//candidateをsocketで送信
	socket.json.send(candidate);
	//デバッグ用ログ出力
	console.log('candidateを送信しました。');
	console.log(text);
}

//ラッパー関数
//詳しくは以下を参照
//http://stackoverflow.com/questions/11277677/javascript-newbie-how-to-choose-between-window-url-createobjecturl-and-window
function createObjectURL(file) {
	if (window.webkitURL) {
		return window.webkitURL.createObjectURL(file);
	} else if (window.URL && window.URL.createObjectURL) {
		return window.URL.createObjectURL(file);
	} else {
		return null;
	}
}

//ラッパー関数
//詳しくは以下を参照
//https://html5experts.jp/mganeko/19728/
//firefox 48.0で動作しなかった
// function getDeviceStream(option) {
// 	if ('getUserMedia' in navigator.mediaDevices) {
// 		return navigator.mediaDevices.getUserMedia(option);
// 	}
// 	else {
// 		return new Promise(function(resolve, reject){
// 			navigator.getUserMedia(
// 				option,
// 				resolve,
// 				reject
// 			);
// 		});
// 	}
// }

//音声・映像の取得・再生を開始
//配信者の映像を表示(Start videoボタンをクリックすることで呼び出される)
function startVideo() {
	//構文は以下のとおり
	//navigator.getUserMedia ( constraints, successCallback, errorCallback );
	//取得するコンテンツの指定
	navigator.getUserMedia({
			video: true,
			audio: true
		},
		//navigator.webkitGetUserMedia({video: true, audio: true},
		function(stream) { //取得成功時の処理
			//localstreamに音声・映像を設定
			localStream = stream;
			console.log('localstreamに音声・映像を設定:OK');
			//streamオブジェクトのURLを生成し、videoのsrcにセットする
			localVideo.src = createObjectURL(stream);
			//localVideo.src = window.webkitURL.createObjectURL(stream);
			console.log('streamオブジェクトのURLを生成し、videoのsrcにセットする:OK');
			//映像の再生を開始
			localVideo.play();
			console.log('映像の再生を開始:OK');
			//音量を0に設定
			localVideo.volume = 0;
			console.log('音量を0に設定:OK');
			//tellCastReady関数を呼び出す(下で定義されている)
			tellCastReady();
			//配信時にvideoタグの縁の色を変える
			localVideo.style.border = 'solid #f00 2px';
		},
		function(error) { //取得失敗時の処理
			//デバッグ用ログ出力
			console.error('エラーが発生しました');
			console.error(error);
			return;
		}
	);
}

//音声・映像の取得・再生を停止
//配信者の映像を停止(Stop videoボタンをクリックすることで呼び出される)
function stopCast() {
	if(isGameStarted==true){
		return;
	}
	//hangUp関数を呼び出す(下で定義されている)
	hangUp();

	//videoのsrcを空にする
	localVideo.src = '';
	//配信者の映像を停止する
	localStream.getTracks().forEach(function(track) {
		track.stop();
	});
	//localStream.stop();
	//localstreamにnullを代入する
	localStream = null;
	//配信時にvideoタグの縁の色を変える
	localVideo.style.border = 'solid #1976d2 2px';
}

//接続処理
//sendOffer関数から呼び出される
function prepareNewConnection(id) {
	//STUNサーバーの設定(Googleのサーバーを使用)
	var peercon_config = {
		'iceServers': [{
			'url': 'stun:stun.l.google.com:19302'
		}]
	};
	var peer = null;
	try {
		//peerオブジェクトを生成
		peer = new peerConnection(peercon_config);
	}
	//例外処理
	catch (e) {
		//デバッグ用ログ出力
		console.error('PeerConnectionの作成に失敗しました。\n:' + e.message);
	}

	//connオブジェクトを生成
	var conn = new Connection();
	//引数をconnのidに設定
	conn.id = id;
	//ペア接続にpeerオブジェクトを設定
	conn.peerconnection = peer;
	//引数をpeerのidに設定
	peer.id = id;
	//addConnection関数を実行(上で定義されている)
	addConnection(id, conn);

	//視聴者にいくつかのICEのcandidatesを送信
	peer.onicecandidate = function(evt) {
		if (evt.candidate) {
			//sendCandidate関数の引数にCandidateを渡す
			sendCandidate({
				type: 'candidate',
				sendto: conn.id,
				sdpMLineIndex: evt.candidate.sdpMLineIndex,
				sdpMid: evt.candidate.sdpMid,
				candidate: evt.candidate.candidate
			});
			//デバッグ用ログ出力
			console.log(evt.candidate);
		} else {
			//デバッグ用ログ出力
			console.log('ICEイベントの段階:' + evt.eventPhase);
			//conn.established = true;
		}
	};

	//localstreamをpeerオブジェクトに追加
	peer.addStream(localStream);
	//デバッグ用ログ出力
	console.log('localStreamを追加しました。');

	//connオブジェクトを返す
	return conn;
}

//接続要求を送る関数
//onMessageでメッセージがcast_requestのときに呼び出される
function sendOffer(id) {
	//idの接続情報を取得して代入
	var conn = getConnection(id);
	//取得できなかったら新しい接続情報を追加
	if (!conn) {
		//prepareNewConnection関数を呼び出しidを渡す
		conn = prepareNewConnection(id);
	}

	//接続要求を作成(以下のページを参照)
	//https://developer.mozilla.org/ja/docs/Web/API/RTCPeerConnection#createOffer
	conn.peerconnection.createOffer(function(sessionDescription) { //成功時の処理
			//SDPを設定する
			conn.peerconnection.setLocalDescription(sessionDescription);
			//SDPの送信先のidを設定
			sessionDescription.sendto = id;
			//sendSDP関数にSDPを渡す(上で定義されている)
			sendSDP(sessionDescription);
		},
		function() { //失敗時の処理
			//デバッグ用ログ出力
			console.error('要求の作成に失敗しました。');
		},
		//受信する内容を指定(配信者は音声・映像どちらもfalse)
		mediaConstraints
	);
}


//onAnswer関数から呼び出される
function setAnswer(evt) {
	//メッセージを送信してきた視聴者のidを取得する
	var id = evt.from;
	//そのidから視聴者の接続情報を取得
	var conn = getConnection(id);
	if (!conn) { //取得できなかった場合の処理
		//デバッグ用ログ出力
		console.error('peerConnectionが存在しません');
		return;
	}
	//接続に関連付けられたリモートの接続情報を変更
	conn.peerconnection.setRemoteDescription(new sessionDescription(evt));
}

//ユーザーUIイベント処理
//startVideo関数から呼び出される
function tellCastReady() {
	if (!isLocalStreamStarted()) { //音声・映像の取得が開始されていない場合
		//警告メッセージ表示(アラート)
		alert('ローカルストリームがまだ実行されていません。Start Videoボタンを押してください');
		return;
	}
	if (!socketStatus) { //socketサーバーに接続できていない場合
		//警告メッセージ表示(アラート)
		alert('サーバーに接続されていません。リロードして、もう一度お試しください。');
		return;
	}

	//同じ部屋の視聴者を呼び出します
	//socketサーバーにJSON形式で準備ができていることを伝える
	socket.json.send({
		type: 'cast_ready'
	});
	//デバッグ用ログ出力
	console.log('要求を送る前に同じ部屋の視聴者に準備ができていることを伝えます');
}


//ユーザの要求に応じて接続を停止
//stopCast関数から呼び出される
function hangUp() {
	//socketサーバーにJSON形式で配信が終了したことを伝える
	socket.json.send({
		type: 'end_cast'
	});
	//stopAllConnections関数を実行
	stopAllConnections();
	//デバッグ用ログ出力
	console.log('ハングアップしました。');
}