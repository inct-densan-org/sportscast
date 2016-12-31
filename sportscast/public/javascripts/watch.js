/*
ベンダープレフィックス*/
peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || webkitRTCPeerConnection ||
	window.peerConnection || window.msRTCPeerConnection;
sessionDescription = window.sessionDescription || window.mozsessionDescription ||
	window.webkitsessionDescription || window.mssessionDescription;
/*
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
					   navigator.webkitGetUserMedia || navigator.msGetUserMedia;
					   || webkitRTCPeerConnection
/**/


var castVideo = document.getElementById('cast_video');
var replayVideo = document.getElementById('replay_video');
var replay_button=document.getElementById('replay_button');
var elapsed_time = document.getElementById('elapsed-time');
var team_name_a = document.getElementById('team-name-a');
var team_name_b = document.getElementById('team-name-b');
var team_point_a = document.getElementById('team-point-a');
var team_point_b = document.getElementById('team-point-b');
var team_info_a = document.getElementById('team-info-a');
var team_info_b = document.getElementById('team-info-b');

var remoteStream;
var recorder =  null;
var blobUrl = null;
var timerID = null;
var keepRecording = false;
var fileIndex = 0;
var recordIndex = 0;
var startRecording;

var mediaConstraints = {
	'mandatory': {
		'OfferToReceiveAudio': true,
		'OfferToReceiveVideo': true
	}
};

//socketの接続状態を表す変数
var socketStatus = false;
//シグナリングサーバ―の接続待ち受けポート
var PORT = 3001;
//シグナリングサーバーに接続
var ADDRESS = 'http://localhost:' + PORT + '/';

var sportsname='';
sportsname=getSportsName();
var sportsid='';
sportsid=getSportsId();

//競技状況配信機能のUIを競技に応じて変更
selectlayout(sportsname, 'watch');

//競技によって前後半の表示を切り替える
showhalf(sportsname);

//配信映像を切断する関数
//onMessage関数でメッセージがend_castのときに呼び出される
//onUserDisconnect関数で呼び出される
//prepareNewConnection関数でリモートストリームが削除されたときに呼び出される
//hangUp関数で呼び出される
function detachVideo(id) {
	if (id) {
		var conn = getConnection(id);
		if (conn) {
			castVideo.pause();
			castVideo.src = '';
		}
	} else {
		//強制切断
		castVideo.pause();
		castVideo.src = '';
	}
}

//複数のPeer-to-Peer接続を管理するための便宜上のクラスと、関連する関数
var MAX_CONNECTION_COUNT = 1; //最大接続数(自分が視聴するので1)
var connections = {}; //接続用の連想配列
function Connection() { //接続用のクラス
	var self = this;
	var id = ''; //視聴者のsocket.id
	var peerconnection = null; //RTCPeerConnectionインスタンス
}

//idから接続情報を取得して返す関数(Connectionクラスから)
//onMessage関数、onCandidate関数sendAnswer関数、setOffer関数で呼び出される
function getConnection(id) {
	var con = null;
	con = connections[id];
	return con;
}

//接続している視聴者のsocket.idを追加する関数
//prepareNewConnection関数で呼び出される
function addConnection(id, connection) {
	connections[id] = connection;
}

//接続数をカウントして結果を返す関数
//isConnectPossible関数、isPeerStarted関数で呼び出される
function getConnectionCount() {
	var count = 0;
	for (var id in connections) {
		count++;
	}
	//デバッグ用ログ出力
	console.log('接続数は' + count);
	return count;
}

//接続可能かを判定する関数
//onMessage関数でメッセージがcast_readyである時に呼び出される
function isConnectPossible() {
	if (getConnectionCount() < MAX_CONNECTION_COUNT)
		return true;
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
//hangUp関数で呼び出される
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
//onMessage関数でメッセージがend_castであるとき、onUserDisconnect関数で呼び出される
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
//onMessage関数でメッセージがcandidateのときに呼び出される
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
var socket = io.connect(ADDRESS); //IPアドレスの部分は実行環境によって変更する

//各イベントごとの処理を定義
socket.on('connect', onOpened)
	.on('message', onMessage)
	.on('user disconnected', onUserDisconnect)
	.on('scoreData', function(data) { //競技状況配信用のやつ
		readJSONdata(data);
	})
	.on('countStart', countStart);

//接続したときの処理
function onOpened(evt) {
	socketStatus = true;
	//デバッグ用ログ出力
	console.log('socketを開きました。');
	//部屋名の取得
	var roomname = sportsid;
	//取得した部屋に入室
	socket.emit('enter', roomname);
	//デバッグ用ログ出力
	console.log(roomname + 'に入室しました。');
}

//メッセージを受け取ったときの処理(メッセージ受信時のイベントハンドラを設定)
//応答するメッセージは、cast_ready, offer, candidate, end_cast
function onMessage(evt) {
	//リクエストしてきた視聴者のidを取得
	var id = evt.from;
	//リクエスト先を取得
	var target = evt.sendto;
	//idを渡して視聴者の接続情報を取得
	var conn = getConnection(id);

	console.log('onMessage() evt.type=' + evt.type);

	//メッセージがcast_readyである時の処理
	if (evt.type === 'cast_ready') {
		//すでに接続されているか
		if (conn) {
			return;
		}
		//接続可能なら以下を実行
		if (isConnectPossible()) {
			//socketにJSON形式でidなどを送信
			socket.json.send({
				type: 'cast_request',
				sendto: id
			});
		}
		//接続不可能なら以下を実行
		else {
			console.warn('接続数が最大なので呼び出しを無視します');
		}
		return;
	}
	//メッセージがofferであるときの処理
	else if (evt.type === 'offer') {
		onOffer(evt);
		//デバッグ用ログ出力
		console.log('offerを受信しました。offerを設定し、Answerを送信しています。');
	}
	//メッセージがcandidateであり、ペア接続しているときの処理
	else if (evt.type === 'candidate' && isPeerStarted()) {
		onCandidate(evt);
		//デバッグ用ログ出力
		console.log('ICE candidateを受信しました。');
	}
	//メッセージがend_castであるときの処理
	else if (evt.type === 'end_cast') {
		stopRecording();
		detachVideo(id); //映像を切断
		stopConnection(id);

		//デバッグ用ログ出力
		console.log('接続終了');
	}

}

//接続終了したときの処理
function onUserDisconnect(evt) {
	if (evt) {
		detachVideo(evt.id); //映像を切断
		//stopConnection関数を呼び出し、idを渡す
		stopConnection(evt.id);
	}
	//デバッグ用ログ出力
	console.log('切断しました');
}

//接続要求を受信したときの処理
//onMessage関数でメッセージがofferであるときに呼び出される
function onOffer(evt) {
	setOffer(evt);
	sendAnswer(evt);
	//デバッグ用ログ出力
	console.log('offerを受信しました。');
	console.log(evt);
}

//onMessage関数でメッセージがcandidateであり、ペア接続しているときに呼び出される
function onCandidate(evt) {
	//メッセージを送信してきた視聴者のidを取得する
	var id = evt.from;
	//idを基に視聴者の接続情報を取得する
	var conn = getConnection(id);
	//接続情報が得られなかった時の処理
	if (!conn) {
		//デバッグ用ログ出力
		console.error('ペア接続は存在しません');
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
//sendAnswer関数で呼び出される
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
//prepareNewConnection関数で呼び出される
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

//接続処理
//setOffer関数で呼び出される
function prepareNewConnection(id) {
	if (id == null) {
		console.log('idがnullです');
	}
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
	} catch (e) {
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
	//addConnection関数を実行
	addConnection(id, conn);

	//ほかのピアにいくつかのICEのcandidatesを送信
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
		}
	};

	//イベントハンドラを定義
	peer.addEventListener('addstream', onRemoteStreamAdded, false);
	peer.addEventListener('removestream', onRemoteStreamRemoved, false);

	//リモートストリームを追加した時に、ローカルのvideo要素に渡す
	function onRemoteStreamAdded(event) {
		castVideo.src = createObjectURL(event.stream);
		remoteStream=event.stream;
		keepRecording=true;
		if(browser==='firefox'){
			setTimeout(startRecording, 5*1000);
		}
		else{
			alert('お使いのブラウザではリプレイ機能は使用できません');
			replay_button.style.display='none';
		}
		//デバッグ用ログ出力
		console.log('リモートストリームを追加しました。');
	}

	//リモートストリームが削除されたときに、ローカルのvideo要素から削除
	function onRemoteStreamRemoved(event) {
		detachVideo(this.id);
		//デバッグ用ログ出力
		console.log('リモートストリームを削除しました。');
	}

	//connオブジェクトを返す
	return conn;
}

//接続要求を設定関数
//onOffer関数で呼び出される
function setOffer(evt) {
	//要求のあった視聴者のidを取得
	var id = evt.from;
	//そのidの接続情報を取得
	var conn = getConnection(id);
	if (!conn) { //取得できなかった場合の処理
		//新しい接続を作成
		conn = prepareNewConnection(id);
		//接続に関連付けられたリモートの接続情報を変更
		conn.peerconnection.setRemoteDescription(new RTCSessionDescription(evt));
	} else {
		//デバッグ用ログ出力
		console.error('ピア接続は既に存在しています');
	}
}


//Answerを送信する関数
//onOffer関数で呼び出される
function sendAnswer(evt) {

	var id = evt.from;
	var conn = getConnection(id);
	if (!conn) {
		//デバッグ用ログ出力
		console.error('ピア接続は存在しません');
		return;
	}

	conn.peerconnection.createAnswer(function(sessionDescription) { //成功時の処理
			//SDPを設定する
			conn.peerconnection.setLocalDescription(sessionDescription);
			//SDPの送信先のidを設定
			sessionDescription.sendto = id;
			//sendSDP関数にSDPを渡す
			sendSDP(sessionDescription);
		},
		function() { //失敗時の処理
			console.error('Answerの作成に失敗しました');
		},
		//受信する内容を指定(視聴者は音声・映像どちらもtrue)
		mediaConstraints
	);
	//デバッグ用ログ出力
	console.log('Answerを送信しました。リモートセッションの接続情報を作成しました。');
}

//リクエストの送信用関数
//Requestボタンがクリックされたときに呼び出される
function sendRequest() {
	if (!socketStatus) {
		//警告メッセージ(アラート)
		alert('サーバーに接続されていません。リロードして、もう一度お試しください。');
		return;
	}

	//同じ部屋の視聴者を呼び出します
	//socketサーバーにJSON形式でリクエストを伝える
	socket.json.send({
		type: 'cast_request'
	});
	//デバッグ用ログ出力
	console.log('同じ部屋にofferを訪ねるリクエストを送信します');
}

//ユーザの要求に応じて接続を停止
//Hang Upボタンがクリックされたときに呼び出される
function hangUp() {
	stopRecording();
	//socketサーバーにJSON形式で視聴を終了したことを伝える
	socket.json.send({
		type: 'exit'
	});
	//映像を切断
	detachVideo(null);
	//stopAllConnections関数を実行
	stopAllConnections();
	//デバッグ用ログ出力
	console.log('ハングアップしました');
}


//全画面表示用の関数
function fullscreen() {
	if (castVideo.webkitRequestFullScreen) {
		castVideo.webkitRequestFullScreen();
	} else if (castVideo.mozRequestFullScreen) {
		castVideo.mozRequestFullScreen();
	} else {
		castVideo.requestFullScreen();
	}
}
