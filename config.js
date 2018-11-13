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
    mulltiplier: 1.15,
    loopInterval: 180,  // 33 milliseconds = ~ 30 frames per sec
    saveInterval: 1000,
    incomeFromBackgroungMultiplier: 0.6
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
