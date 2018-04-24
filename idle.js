const canvas = document.getElementById('drawing');
const rc = rough.canvas(canvas);
let context = canvas.getContext('2d');

const headFontSize = 42;
const fontSize = 26;
const fontFamily = 'Indie Flower';

let game = {
    clickerLevel: {},
    incomeLevel: {},
    cash: {},
    income: {},
    incomeByClick: {},
    nextClickerPrice: {},
    nextIncomePrice: {}
};

const config = {
    baseIncome: 0.5,
    baseIncomeByClick: 2,
    baseIncomePrice: 100,
    baseClickerPrice: 50,
    mulltiplier: 1.15
}

function computeCashSinceLastSaveDate(lastDate) {
    var now = new Date();
    var timeDiff = Math.abs(now.getTime() - lastDate.getTime());
    var diff = Math.ceil(timeDiff / (1000)); 
    game.cash.add(diff * game.income.value() / 10);
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

const drawable = {
    circleClicker: {},
    clicker: {},
    income: {}
}

const clickable = {
    circleClicker: {},
    clickerBox: {},
    incomeBox: {}
}

setInterval(onTimerTick, 160); // 33 milliseconds = ~ 30 frames per sec
setInterval(saveTick, 1000); // 33 milliseconds = ~ 30 frames per sec

function saveTick() {
    onUnload();
}

function onTimerTick() {
    loop();
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

var showSpace = function(x1, y1, x2, y2, color, gap, angle) {
    context.clearRect(x1 - 3, y1 - 3, x2 - x1 + 6, y2 - y1 + 6);
    rc.rectangle(x1, y1, x2 - x1, y2 - y1, {
        fill: color,
        hachureAngle: angle, // angle of hachure,
        hachureGap: gap
      }); // x, y, width, height
};

var drawBalance = function(x1, y1, x2, y2) {
    showSpace(x1, y1, x2, y2, 'cyan', 12, -70);
    context.font = fontSize + 'px ' + fontFamily;
    context.fillText('Cash: ' + game.cash.format(), x1 + 5, y1 + (y2 - y1) / 2 + fontSize / 2, (x2 - x1) / 2);
    context.fillText('Income: ' + game.income.format(), x1 + (x2 - x1) / 2 + 5, y1 + (y2 - y1) / 2  + fontSize / 2, (x2 - x1) / 2);
};

var circleContains = function(circle, x, y) {
    return Math.sqrt(
            Math.pow(y - circle.y, 2) 
            + Math.pow(x - circle.x, 2)
    ) <= circle.r
}

var rectangleContains = function(rectangle, x, y) {
    return x >= rectangle.x1
            && x <= rectangle.x2
            && y >= rectangle.y1
            && y <= rectangle.y2;
}

var initClicker = function(x1, y1, x2, y2) {
    // showSpace(x1, y1, x2, y2, 'gold', 12, -70);
    clickable.circleClicker.x = x1 + (x2 - x1) * 3 / 4;
    clickable.circleClicker.y = y1 + (y2 - y1) / 2;
    clickable.circleClicker.r = (y2 - y1) / 2 - 10;
    clickable.circleClicker.contains = function(x, y) {
        return circleContains(clickable.circleClicker, x, y);
    }
}

var drawClicker = function(x1, y1, x2, y2) {
    showSpace(x1, y1, x2, y2, 'gold', 12, -70);

    context.font = fontSize + 'px ' + fontFamily;
    context.fillText('Click circle to get', x1 + 15, y1 + 45, (x2 - x1) / 2);
    context.fillText(game.incomeByClick.format(), x1 + 20, y1 + 50 + fontSize, (x2 - x1) / 2);

    rc.circle(x1 + (x2 - x1) * 3 / 4, y1 + (y2 - y1) / 2, (y2 - y1) / 2 - 10, {
        fill: drawable.circleClicker.color,
        fillWeight: 1,
        hachureGap: drawable.circleClicker.hachureGap,
        hachureAngle: drawable.circleClicker.hachureAngle
    });
    
};

var drawClickerBox = function(x1, y1, x2, y2) {
    showSpace(x1, y1, x2, y2, 'red');
    context.font = fontSize + 'px ' + fontFamily;
    context.fillText('Price: ' + game.nextClickerPrice.format(), x1 + 5, y1 + 40, x2 - x1 - 10)
    rc.polygon([[(x1 + x2) / 2, y1 + (y2 - y1) / 3], 
                [x1 + (x2 - x1) / 6, y1 + (y2 - y1) * 2 / 3],
                [x1 + (x2 - x1) * 5 / 6, y1 + (y2 - y1) * 2 / 3]],
                {
                    fill: drawable.clicker.color,
                    hachureGap: drawable.clicker.hachureGap,
                    hachureAngle: drawable.clicker.hachureAngle
                })
    clickable.clickerBox.contains = function(x, y) {
        return rectangleContains({x1: x1, y1: y1, x2: x2, y2: y2}, x, y);
    }
};

var drawIncomeBox = function(x1, y1, x2, y2) {
    showSpace(x1, y1, x2, y2, 'cyan');
    context.font = fontSize + 'px ' + fontFamily;
    context.fillText('Price: ' + game.nextIncomePrice.format(), x1 + 5, y1 + 40, x2 - x1 - 10);
    rc.polygon([[(x1 + x2) / 2, y1 + (y2 - y1) * 2 / 3], 
                [x1 + (x2 - x1) / 6, y1 + (y2 - y1) / 3],
                [x1 + (x2 - x1) * 5 / 6, y1 + (y2 - y1) / 3]],
                {
                    fill: drawable.income.color,
                    hachureGap: drawable.income.hachureGap,
                    hachureAngle: drawable.income.hachureAngle
                })
    clickable.incomeBox.contains = function(x, y) {
        return rectangleContains({x1: x1, y1: y1, x2: x2, y2: y2}, x, y);
    }
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

var drawHeading = function(x1, y1, x2, y2) {
    showSpace(x1, y1, x2, y2, 'green', 12, -70);
    context.font = headFontSize + 'px ' + fontFamily;
    context.fillText('Welcome guest ;3', x1 + 10, y1 + headFontSize / 2 + 30, x2 - x1);
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