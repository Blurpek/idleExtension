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
    baseIncome: 0.7,
    baseIncomeByClick: 2.5,
    baseIncomePrice: 100,
    baseClickerPrice: 50,
    mulltiplier: 1.25,
    loopInterval: 180,  // 33 milliseconds = ~ 30 frames per sec
    saveInterval: 1000,
    incomeFromBackgroungMultiplier: 0.7
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
