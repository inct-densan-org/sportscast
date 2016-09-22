var userAgent = window.navigator.userAgent.toLowerCase();
var browser='';

if(userAgent.indexOf('chrome')!=-1){
	browser='chrome';
}
else if(userAgent.indexOf('firefox')!=-1){
	browser='firefox';
}
else{
	alert('お使いのブラウザは対応していません');
	browser='notsupport';
}
console.log(browser);