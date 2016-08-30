var BROADCAST_ID = '_broadcast_';

module.exports=function(io){
	io.on('connect', function(socket) {
		//以下接続成功後の処理

		//部屋への入室
		socket.on('enter', function(roomname) {
			//メッセージを受け取った時の処理

			//roomnameという名前の部屋に参加(入室)
			socket.join(roomname);
			//デバッグ用ログ出力
			console.log('ID=' + socket.id + ' 部屋名=' + roomname);
			//入室した部屋名をsetRoomnameメソッドで設定(下記のメソッド)
			setRoomname(roomname);
		});

		socket.on("scoreData",function(data){
			io.sockets.to(getRoomname()).emit("scoreData",data);
			console.log(data);
		});

		function setRoomname(room) {
			// for v1.0
			socket.roomname = room;
		}

		function getRoomname() {
			//socketオブジェクトから上記のメソッドで設定されている部屋名を取得するメソッド
			var room = null;
			// for v1.0
			room = socket.roomname;

			return room;
		}


		//引数のメッセージを部屋にブロードキャストするメソッド
		function emitMessage(type, message) {
			//部屋名の取得(上記のメソッド)
			var roomname = getRoomname();

			if (roomname) {
				//部屋名が取得出来たらその部屋に引数のメッセージをブロードキャスト
				socket.broadcast.to(roomname).emit(type, message);
				//デバッグ用ログ出力
				console.log(roomname + "にブロードキャストしました。");
			}
			else {
				//取得できなかったら全体に引数のメッセージをブロードキャスト
				socket.broadcast.emit(type, message);
				//デバッグ用ログ出力
				console.log("全体にブロードキャストしました。");
			}
		}

		//配信者がSDPメッセージを送信した時に部屋内の全ての視聴者にブロードキャスト(配信)する
		socket.on('message', function(message) {
			//socket.idによりuserの管理を行うことができる。(この場合はsocket.idは配信者のid)
			message.from = socket.id;

			//ブロードキャストする対象を取得
			var target = message.sendto;
			if ( (target) && (target != BROADCAST_ID) ) {
				//targetにmessageを送信する
				socket.to(target).emit('message', message);
				//デバッグ用ログ出力
				console.log(target + "に" + message + "と送信しました。");
				return;
			}

			//ブロードキャストする
			emitMessage('message', message);
		});

		//配信者が終了したときに、部屋内の全ての視聴者に終了シグナルをブロードキャストする
		socket.on('disconnect', function() {
			//ブロードキャストする
			emitMessage('user disconnected', {id: socket.id});
			//デバッグ用ログ出力
			console.log(socket.id + "が接続を終了しました");

			//部屋から退出する
			var roomname = getRoomname();
			if (roomname) {
				//取得した部屋から退出
				socket.leave(roomname);
			}
		});
	});
};