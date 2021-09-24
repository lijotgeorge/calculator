const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// const operate = (operator, nums) => operator(nums[0], nums[1]);

let displayTop = document.getElementById("display-top");
let displayBot = document.getElementById("display-bottom");
let topText = displayTop.innerText;
let botText = displayBot.innerText;

let opValue = "";

/*---------------
GENERAL FUNCTIONS
---------------*/
function evaluate(opFunction, a, b) {
  let f = new Function("a", "b", `return ${opFunction}(a, b)`);
  return f(a, b);
}

function opConversion(opValue) {
  return opValue == "+"
    ? "add"
    : opValue == "-"
    ? "subtract"
    : opValue == "*"
    ? "multiply"
    : "divide";
}

/*--------------
KEY INTERACTIONS
--------------*/

// Define the number keys
let numKeys = document.getElementsByClassName("num-keys");
Array.from(numKeys).forEach((num) => {
  num.addEventListener("click", getNumber);

  function getNumber() {
    displayBot.innerText += num.innerText;
  }
});

let clearTop = () => (displayTop.innerText = "");
let clearBot = () => (displayBot.innerText = "");

// Clear Display Screen
let clearScreen = () => {
  clearTop();
  clearBot();
};
let clr = document.getElementById("key-clear");
clr.addEventListener("click", clearScreen);

// Mathematical Operations on click
let opKeys = document.getElementsByClassName("op-keys");
Array.from(opKeys).forEach((operator) => {
  operator.addEventListener("click", (e) => getOperator(e.currentTarget.value));
});
function getOperator(opSign) {
  // let opSign = operator.value;
  if (displayTop.innerText === "" && displayBot.innerText !== "") {
    displayTop.innerText = displayBot.innerText + " " + opSign;
    clearBot();
  } else if (displayTop.innerText !== "" && displayBot.innerText === "") {
    displayTop.innerText = displayTop.innerText.split(" ")[0] + " " + opSign;
  } else if (displayTop.innerText !== "" && displayBot.innerText !== "") {
    if (displayTop.innerText.split(" ")[2]) {
      // displayTop.innerText = displayBot.innerText + " " + operator.value;
      displayTop.innerText = displayBot.innerText + " " + opSign;
      clearBot();
    } else {
      let firstNum = Number(displayTop.innerText.split(" ")[0]);
      let secondNum = Number(displayBot.innerText);
      let newopSign = getOpSign(displayTop.innerText);
      let result = evaluate(opConversion(newopSign), firstNum, secondNum);
      // displayTop.innerText = result + " " + operator.value;
      displayTop.innerText = result + " " + opSign;
      clearBot();
    }
  }
}

// Delete last item in display
delKey = document.getElementById("key-delete");
delKey.addEventListener("click", deleteItem);
function deleteItem() {
  displayBot.innerText = displayBot.innerText.slice(0, -1);
}

// Defining the equal sign key
equalKey = document.getElementById("key-equals");
equalKey.addEventListener("click", calculate);
function calculate() {
  if (displayTop.innerText !== "") {
    let firstNum = Number(displayTop.innerText.split(" ")[0]);
    let secondNum = Number(displayBot.innerText);
    let opSign = getOpSign(displayTop.innerText);
    let result = evaluate(opConversion(opSign), firstNum, secondNum);
    console.log(typeof result.toString());
    displayTop.innerText += " " + secondNum;
    if (result.toString() === "Infinity") {
      // displayBot.style.fontSize = "1em";
      displayBot.style.textAlign = "center";
      displayBot.innerText = "\u{1F926} Try again? \u{1f645}";
    } else {
      displayBot.innerText = result;
    }
  }
}

// Defining the decimal point key
decKey = document.getElementById("key-decimal");
decKey.addEventListener("click", createFloat);
function createFloat() {
  if (
    displayBot.innerText !== "" &&
    displayBot.innerText.includes(".") === false
  ) {
    displayBot.innerText += ".";
  }
}

// Adjusting for large number display
displayBot.addEventListener("DOMSubtreeModified", displayBotLimiter);
function displayBotLimiter() {
  let displayNumber = displayBot.innerText;
  if (displayNumber.length > 21) {
    displayBot.innerText = Number(displayNumber).toPrecision(10);
  }
}

displayTop.addEventListener("DOMSubtreeModified", displayTopLimiter);
function displayTopLimiter() {
  let topDisplay = displayTop.innerText;
  if (topDisplay.length > 32) {
    displayTop.style.fontSize = "0.8em";
  }
}

// Defining the Square Root Key
sqrtkey = document.getElementById("key-sqrt");
sqrtkey.addEventListener("click", sqRoot);
function sqRoot() {
  let displayNumber = displayBot.innerText;
  if (displayNumber !== "") {
    displayTop.innerText = "\u{0221A}" + displayNumber;
    displayBot.innerText = Math.sqrt(displayNumber);
  }
}

// Get the operator from a string
let getOpSign = (text) => {
  opArray = ["+", "-", "/", "*"];
  for (let i = 0; i < opArray.length; i++) {
    if (text.includes(opArray[i])) {
      return opArray[i];
    }
  }
};

/*-------------------
KEYBOARD INTERACTIONS
-------------------*/
let numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let operatorArray = ["+", "-", "*", "/"];

window.addEventListener("keydown", (event) => {
  let name = event.key;
  let code = event.code;
  // console.log(name, code);
  if (numArray.includes(name)) {
    displayBot.innerText += name;
  } else if (name == "Enter") {
    calculate();
  } else if (code == "Period") {
    createFloat();
  } else if (name == "Backspace") {
    deleteItem();
  } else if (operatorArray.includes(name)) {
    getOperator(name);
  } else if (name == "Escape") {
    clearScreen();
  }
});
