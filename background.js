//init
let game = "";
let lastSaveDate = {};
let isFirstRun = false;
// let xd = {};
browser.storage.local.get("isFirstRun").then(onGotFirstRun);
browser.storage.local.get("game").then(onGotGame);

browser.runtime.onMessage.addListener(notify);

//end of init

function notify(request, sender, sendRequest) {
    switch (request.option) {
        case "getGame": 
            browser.storage.local.get("game").then(onGotGame);
            sendRequest(game, lastSaveDate);
            break;
        case "setGame": 
            game = request.game;
            game.lastSaveDate = new Date();
            browser.storage.local.set({game});
            break;
        case "isFirstRun":
            sendRequest(isFirstRun);
            isFirstRun = false;
            browser.storage.local.set({isFirstRun})
            break;
        // case "debug":
        //     sendRequest(xd);
    }
}

function onGotGame(item) {
    if (!isFirstRun) {
        game = item.game;
    }
}

function onGotFirstRun(item) {
    isFirstRun = item.isFirstRun == undefined ? true : item.isFirstRun;
}

function onRemoved() {
    browser.storage.local.set({game});
}

function onFirstRun() {
    isFirstRun = true
}