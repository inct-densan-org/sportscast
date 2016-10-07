var dbconnection = require('../modules/dbconnection.js');

var BROADCAST_ID = '_broadcast_';
var counter=null;
var isSendedScore=false;
var sportsname='';

module.exports = function(io) {
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

			dbconnection.find({
				_id: roomname
			}, function(err, docs) {
				docs.forEach(function(doc) {
					if (err) {
						return done(err);
					}
					sportsname=doc.sports;
				});
			});
			initGameTime(sportsname);
		});

		socket.on('scoreData',function(data){
			isSendedScore=true;
			io.sockets.to(getRoomname()).emit('scoreData',data);
			console.log('scoreData:'+data);
		});

		socket.on('chatData',function (data) {
			io.sockets.to(getRoomname()).emit('chatData',data);
			console.log('ID=' + socket.id +' chatData:'+data);
		});

		socket.on('countStart',function () {
			counter=setInterval(function(){
				tmp=showElapsedTime();
				if(tmp>0){
					io.sockets.to(getRoomname()).emit('countStart',sectominsec(tmp));
				}
				else{
					io.sockets.to(getRoomname()).emit('countStart','reset');
					clearInterval(counter);
				}
			}, 1000);
		});

		socket.on('countStop',function () {
			clearInterval(counter);
			initGameTime(getRoomname());
			io.sockets.to(getRoomname()).emit('countStart','reset');
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
				console.log(roomname + 'にブロードキャストしました。');
			} else {
				//取得できなかったら全体に引数のメッセージをブロードキャスト
				socket.broadcast.emit(type, message);
				//デバッグ用ログ出力
				console.log('全体にブロードキャストしました。');
			}
		}

		var gameTime = 0;
		var elapsedtime = 0;

		function initGameTime(sports) {
			switch (sports) {
				case 'soccer':
					gameTime = 45 * 60;
					break;
				case 'fencing':
					gameTime = 3 * 60;
					break;
				default:
					gameTime = 1 * 60;
					break;
			}
			elapsedtime = 0;
		}

		function showElapsedTime() {
			elapsedtime++;
			if (elapsedtime <= gameTime) {
				return elapsedtime;
			} else {
				elapsedtime = 0;
				return -1;
			}
		}
		function sectominsec(time) {
			var sec, min;
			var tmp;
			min = ((time / 60) | 0);
			sec = time % 60;
			tmp = (('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2));
			return tmp;
		}

		//配信者がSDPメッセージを送信した時に部屋内の全ての視聴者にブロードキャスト(配信)する
		socket.on('message', function(message) {
			//socket.idによりuserの管理を行うことができる。(この場合はsocket.idは配信者のid)
			message.from = socket.id;

			//ブロードキャストする対象を取得
			var target = message.sendto;
			if ((target) && (target != BROADCAST_ID)) {
				//targetにmessageを送信する
				socket.to(target).emit('message', message);
				//デバッグ用ログ出力
				console.log(target + 'に' + message + 'と送信しました。');
				return;
			}

			//ブロードキャストする
			emitMessage('message', message);
		});

		//配信者が終了したときに、部屋内の全ての視聴者に終了シグナルをブロードキャストする
		socket.on('disconnect', function() {
			//ブロードキャストする
			emitMessage('user disconnected', {
				id: socket.id
			});

			clearInterval(counter);
			initGameTime(getRoomname());
			io.sockets.to(getRoomname()).emit('countStart','reset');

			//デバッグ用ログ出力
			console.log(socket.id + 'が接続を終了しました');

			//部屋から退出する
			var roomname = getRoomname();
			if (roomname) {
				//取得した部屋から退出
				socket.leave(roomname);
			}
		});
	});
};