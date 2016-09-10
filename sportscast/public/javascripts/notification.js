var notificationPossible = false; // Notification対応しているかどうか

if (window.Notification) { // Permissionの確認 
	if (Notification.permission === 'granted') { // 許可されている場合はNotificationで通知 
		notificationPossible = true;
	} else if (Notification.permission === 'denied') {

	} else if (Notification.permission === 'default') { // 許可が取れていない場合はNotificationの許可を取る
		Notification.requestPermission(function(result) {
			if (result === 'denied') {

			} else if (result === 'default') {

			} else if (result === 'granted') {
				notificationPossible = true;
			}
		});
	}
}

function notification(message, sports) {
	if (notificationPossible) {
		var n = new Notification(message, {
			body: sports + 'の情報が更新されました。',
			icon: 'favicon.ico'
		});
	}
}