startRecording=function() {//録画開始
	if (!remoteStream) {//撮影中でない場合
		console.warn('no stream'); //警告出して終わり
		return;
	}
	else {//どちらでもない場合
		recorder = new MediaRecorder(remoteStream);//録画開始
	}
	recorder.ondataavailable = function (evt) {
		console.log('data available, recordIndex=', recordIndex, ' start playback. type=', evt.data.type);
		var videoBlob = new Blob([evt.data], {
			type: evt.data.type
		});
		blobUrl = window.URL.createObjectURL(videoBlob);
		recordIndex++;
		console.log('keep recording index=', recordIndex);
	};

	if (keepRecording) {//start_record_buttonを押すとkeepRecordingがtrueになる→start_record_buttonが押されたときのみ実行
		//録画開始
		recorder.start();
		//ログ出力
		console.log('start recording');
		//timerIDにtimerの情報を代入(厳密には違うけど…)
		timerID = setTimeout(function () {
			//録画を停止
			recorder.stop();
			//timerIDにnullを代入→timerの情報が削除されるので、次回以降は実行されない(タイマー終了処理)
			timerID = null;
			//録画開始(次のブロック)
			startRecording();
			//ログ出力
			console.log('stop and start..');
			replay_button.style.display='block';
		}, 5 * 1000);//{}で囲まれた処理を5*1000ミリ秒ごとに繰り返す
	}
};

function stopRecording() {//録画停止
	keepRecording = false;//フラグをOFF
	if (timerID) {
		clearTimeout(timerID);
		timerID = null;
	}
	if (recorder) {
		recorder.stop();
		console.log('stop recording');
	}
}
function playRecorded() {
	prepareFirst();
	playAndPrepareNext();
}
replayVideo.onended = function () {
	castVideo.style.display='inline';
	replayVideo.style.display='none';
	console.log('video0 ended');
	fileIndex++;
};

function prepareFirst() {
	var firstURL = blobUrl;
	replayVideo.src = firstURL;
	replayVideo.pause();
	console.log('playFirst index=', fileIndex, ' video0 firstURL=', firstURL);
	castVideo.style.display = 'none';
	replayVideo.style.display = 'inline';
}
function playAndPrepareNext() {
	if (fileIndex >= recordIndex) {
		console.log('end of recorded blocks');
		return;
	}
	var nextUrl = blobUrl;
	if ((fileIndex % 2) == 0) {
		castVideo.style.display = 'none';
		replayVideo.style.display = 'inline';
		replayVideo.play();
		console.log('start video0 URL=', replayVideo.src);
		if (fileIndex < 1024) {
			console.log('video1 nextURL=', nextUrl);
		}
	}
	else {
		if (fileIndex < 1024) {
			console.log('video0 nextURL=', nextUrl);
			replayVideo.preload = 'auto';
			replayVideo.src = nextUrl;
			replayVideo.play();
		}
	}
}