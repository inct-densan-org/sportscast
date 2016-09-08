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
            alert('競技が不明です。');
            location.href = './';
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