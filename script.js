let currentValue = "0";
let previousValue = null;
let currentOperator = null;
let waitingForOperand = false;

const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");


/* -----------------------------
   UPDATE DISPLAY
----------------------------- */

function updateDisplay() {

    resultDisplay.textContent = currentValue;

    if (previousValue !== null && currentOperator !== null) {

        let operatorSymbol = getOperatorSymbol(currentOperator);

        expressionDisplay.textContent =
            previousValue + " " +
            operatorSymbol + " " +
            (waitingForOperand ? "" : currentValue);

    } else {

        expressionDisplay.textContent = "";
    }
}


/* -----------------------------
   OPERATOR SYMBOL
----------------------------- */

function getOperatorSymbol(operator) {

    switch (operator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return operator;
    }
}


/* -----------------------------
   INPUT NUMBER
----------------------------- */

function inputNumber(number) {

    if (currentValue === "Error") {
        clearCalculator();
    }

    if (waitingForOperand) {

        currentValue = number;
        waitingForOperand = false;

    } else {

        if (currentValue === "0") {

            currentValue = number;

        } else if (currentValue.length < 16) {

            currentValue += number;
        }
    }

    updateDisplay();
}


/* -----------------------------
   DECIMAL
----------------------------- */

function inputDecimal() {

    if (currentValue === "Error") {
        clearCalculator();
    }

    if (waitingForOperand) {

        currentValue = "0.";
        waitingForOperand = false;

    } else if (!currentValue.includes(".")) {

        currentValue += ".";
    }

    updateDisplay();
}


/* -----------------------------
   SELECT OPERATOR
----------------------------- */

function selectOperator(operator) {

    if (currentValue === "Error") {
        return;
    }

    if (
        previousValue !== null &&
        currentOperator !== null &&
        !waitingForOperand
    ) {

        const result = calculate(
            Number(previousValue),
            Number(currentValue),
            currentOperator
        );

        if (!Number.isFinite(result)) {

            currentValue = "Error";
            previousValue = null;
            currentOperator = null;

            updateDisplay();

            return;
        }

        currentValue = formatNumber(result);
    }

    previousValue = currentValue;
    currentOperator = operator;
    waitingForOperand = true;

    updateDisplay();
}


/* -----------------------------
   CALCULATE
----------------------------- */

function calculate(first, second, operator) {

    switch (operator) {

        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":

            if (second === 0) {
                return NaN;
            }

            return first / second;

        default:
            return second;
    }
}


/* -----------------------------
   EQUALS
----------------------------- */

function calculateResult() {

    if (
        previousValue === null ||
        currentOperator === null ||
        currentValue === "Error"
    ) {
        return;
    }

    const first = Number(previousValue);
    const second = Number(currentValue);

    const operator = currentOperator;

    const result = calculate(
        first,
        second,
        operator
    );

    const operatorSymbol =
        getOperatorSymbol(operator);

    expressionDisplay.textContent =
        previousValue +
        " " +
        operatorSymbol +
        " " +
        currentValue +
        " =";

    if (!Number.isFinite(result)) {

        currentValue = "Error";

    } else {

        currentValue = formatNumber(result);
    }

    previousValue = null;
    currentOperator = null;
    waitingForOperand = true;

    resultDisplay.textContent = currentValue;
}


/* -----------------------------
   PERCENTAGE
----------------------------- */

function calculatePercent() {

    if (currentValue === "Error") {
        return;
    }

    const number = Number(currentValue);

    if (!Number.isFinite(number)) {
        return;
    }

    currentValue = formatNumber(number / 100);

    updateDisplay();
}


/* -----------------------------
   DELETE
----------------------------- */

function deleteLast() {

    if (
        waitingForOperand ||
        currentValue === "Error"
    ) {

        clearCalculator();
        return;
    }

    if (currentValue.length > 1) {

        currentValue =
            currentValue.slice(0, -1);

    } else {

        currentValue = "0";
    }

    updateDisplay();
}


/* -----------------------------
   CLEAR
----------------------------- */

function clearCalculator() {

    currentValue = "0";
    previousValue = null;
    currentOperator = null;
    waitingForOperand = false;

    updateDisplay();
}


/* -----------------------------
   FORMAT NUMBER
----------------------------- */

function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    const rounded =
        Math.round(
            (number + Number.EPSILON) * 1000000000000
        ) / 1000000000000;

    return String(rounded);
}


/* -----------------------------
   BUTTON EVENTS
----------------------------- */

document
    .querySelector(".buttons")
    .addEventListener("click", function (event) {

        const button =
            event.target.closest("button");

        if (!button) {
            return;
        }

        const value =
            button.dataset.value;

        const action =
            button.dataset.action;


        /* Numbers */

        if (value !== undefined) {

            if (/^[0-9]$/.test(value)) {

                inputNumber(value);

            } else {

                selectOperator(value);
            }

            return;
        }


        /* Actions */

        switch (action) {

            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteLast();
                break;

            case "percent":
                calculatePercent();
                break;

            case "decimal":
                inputDecimal();
                break;

            case "equals":
                calculateResult();
                break;
        }
    });


/* -----------------------------
   KEYBOARD SUPPORT
----------------------------- */

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        /* Numbers */

        if (/^[0-9]$/.test(key)) {

            inputNumber(key);
            event.preventDefault();
            return;
        }


        /* Decimal */

        if (key === ".") {

            inputDecimal();
            event.preventDefault();
            return;
        }


        /* Operators */

        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            selectOperator(key);
            event.preventDefault();
            return;
        }


        /* Equals */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculateResult();
            event.preventDefault();
            return;
        }


        /* Backspace */

        if (key === "Backspace") {

            deleteLast();
            event.preventDefault();
            return;
        }


        /* Escape */

        if (key === "Escape") {

            clearCalculator();
            event.preventDefault();
            return;
        }


        /* Percentage */

        if (key === "%") {

            calculatePercent();
            event.preventDefault();
        }
    }
);


/* Initial display */

updateDisplay();