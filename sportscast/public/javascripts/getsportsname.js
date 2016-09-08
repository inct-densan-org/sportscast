//部屋名を取得する関数
//onOpened関数で呼び出される
function getSportsName() { // たとえば、 URLに  ?roomname  とする
    //URLを取得
    var url = document.location.href;
    //?でURLを分割する
    var args = url.split('?');
    //分割した数が1よりも大きかったら以下の処理を実行
    if (args.length > 1) {
        //配列から要素を取得
        var sports = args[1];
        if (sports != '') {
            //部屋名が取得出来たら部屋名を返す
            return sports;
        }
    }
    //取得できなかったら_defaultroomを返す
    return '_defaultroom';
}