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

var drawHeading = function(x1, y1, x2, y2) {
    showSpace(x1, y1, x2, y2, 'green', 12, -70);
    context.font = headFontSize + 'px ' + fontFamily;
    context.fillText('Welcome guest ;3', x1 + 10, y1 + headFontSize / 2 + 30, x2 - x1);
};