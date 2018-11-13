setInterval(onLoopTick, config.loopInterval); 
setInterval(onSaveTick, config.saveInterval); 

function computeCashSinceLastSaveDate(lastDate) {
    var now = new Date();
    var timeDiff = Math.abs(now.getTime() - lastDate.getTime());
    var diff = Math.ceil(timeDiff / (1000)); 
    game.cash.add(diff * game.income.value() * config.incomeFromBackgroungMultiplier);
}

var parseToGame = function(toParse) {
    game.clickerLevel = toParse.clickerLevel;
    game.incomeLevel = toParse.incomeLevel;
    game.cash = numeral(toParse.cash);
    computeIncomeByClick();
    computeIncome();
    computeNextClickerPrice();
    computeNextIncomePrice();
    computeCashSinceLastSaveDate(toParse.lastSaveDate);
}

function onSaveTick() {
    onUnload();
}

function onLoopTick() {
    loop();
};

var computeBalance = function() {
    game.cash.add(game.income.value());
}

var loop = function() {
    computeBalance();
    // onUnload();
    drawHeading(10, 20, canvas.width - 10, 100);
    drawBalance(10, 115, canvas.width - 10, 175);
    drawClicker(10, 190, canvas.width - 10, 300);
    drawClickerBox(10, 315, canvas.width / 2 - 10, 550);
    drawIncomeBox(canvas.width / 2 + 10, 315, canvas.width - 10, 550);
};


var computeNextClickerPrice = function() {
    game.nextClickerPrice = numeral(config.baseClickerPrice * Math.pow(config.mulltiplier, game.clickerLevel));
}

var computeNextIncomePrice = function() {
    game.nextIncomePrice = numeral(config.baseIncomePrice * Math.pow(config.mulltiplier, game.incomeLevel));
}

var computeIncomeByClick = function() {
    game.incomeByClick = numeral(game.clickerLevel * Math.pow(1.07, game.clickerLevel));
}

var computeIncome = function() {
    game.income = numeral(game.incomeLevel * config.baseIncome * Math.pow(1.05, game.incomeLevel));
}

var upgradeClickerBox = function() {
    let price = game.nextClickerPrice;
    if (price.value() > game.cash.value()) {
        return;
    }
    game.cash.subtract(price.value());
    game.clickerLevel++;
    computeIncomeByClick();
    computeNextClickerPrice();

    drawable.clicker.hachureGap -= 5;
    if (drawable.clicker.hachureGap < 5) {
        drawable.clicker.hachureGap = 15;
        drawable.clicker.hachureAngle = Math.floor(Math.random() * 360 - 180);
        drawable.clicker.color = getRandomColor();
    }
}

var upgradeIncomeBox = function() {
    let price = game.nextIncomePrice;
    if (price.value() > game.cash.value()) {
        return;
    }
    game.cash.subtract(price.value());
    game.incomeLevel++;
    computeIncome();
    computeNextIncomePrice();
    
    drawable.income.hachureGap -= 2;
    if (drawable.income.hachureGap < 5) {
        drawable.income.hachureGap = 15;
        drawable.income.hachureAngle = Math.floor(Math.random() * 360 - 180);
        drawable.income.color = getRandomColor();
    }
}

//events
document.addEventListener("click", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (clickable.circleClicker.contains(mouseX, mouseY)) {
        drawable.circleClicker.color = getRandomColor();
        drawable.circleClicker.hachureAngle = Math.floor(Math.random() * 360 - 180);
        game.cash.add(game.incomeByClick.value());
    } else if (clickable.clickerBox.contains(mouseX, mouseY)) {
        upgradeClickerBox();
    } else if (clickable.incomeBox.contains(mouseX, mouseY)) {
        upgradeIncomeBox();
    }
});


var initGame = function() {
    // browser.runtime.sendMessage({option: "debug"}, function(response) {
    //     document.getElementById("XD").innerHTML = JSON.stringify(response);
    // });
    browser.runtime.sendMessage({option: "isFirstRun"}, function(response) {
        if (response) {
            game.cash = numeral(10);
            game.income = numeral(config.baseIncome);
            game.incomeByClick = numeral(config.baseIncomeByClick);
            game.clickerLevel = 1;
            game.incomeLevel = 1;
            computeNextClickerPrice();
            computeNextIncomePrice();
        } else {
            browser.runtime.sendMessage({option: "getGame"}, function(game) {
                parseToGame(game);
            })
        }
    })
    numeral.defaultFormat('($ 0.00 a)');
    onUnload();
}

var initDrawables = function() {
    drawable.circleClicker.color = getRandomColor();
    drawable.circleClicker.hachureGap = 4;
    drawable.circleClicker.hachureAngle = Math.floor(Math.random() * 360 - 180);

    drawable.clicker.color = getRandomColor();
    drawable.clicker.hachureGap = 15;
    drawable.clicker.hachureAngle = Math.floor(Math.random() * 360 - 180);

    drawable.income.color = getRandomColor();
    drawable.income.hachureGap = 10;
    drawable.income.hachureAngle = Math.floor(Math.random() * 360 - 180);
}

var init = function() {
    initDrawables();
    // drawHeading(10, 20, canvas.width - 10, 100);
    initClicker(10, 190, canvas.width - 10, 300);
    initGame();
}();

function onUnload() {
    let parsedGame = {
        cash: game.cash.value(),
        clickerLevel: game.clickerLevel,
        incomeLevel: game.incomeLevel
    }
    browser.runtime.sendMessage({option: "setGame", game: parsedGame})
}

// browser.browserAction.setBadgeText({text: '3'});