let add = (a, b) => a + b;

let substract = (a, b) => a - b;

let multiply = (a, b) => a * b;

let divide = (a, b) => a / b;

let operate = (operator, a, b) => operator(a, b);


function buttonPressed(e, button=undefined) {

  button = button || e.target;

  let text = button.textContent;

  if (Number.isInteger(Number(text)) || text === "+"  || text === "-"  || text === "*"  || text === "/" || text === ".") {

    displayValue += text;

  } else if (text === "AC") {

    displayValue = "";

    formula.textContent = displayValue;

  } else if (text === "DEL") {

    displayValue = displayValue.substr(0, displayValue.length - 1);

  } else if (text === "=") {

    formula.textContent = displayValue;
    displayValue = calculate(displayValue);

    if (displayValue !== "ERROR") {

      displayValue = String(Math.round(displayValue * 1000000) / 1000000);

    }

  }



  display.textContent = displayValue;

  button.classList.add("clicked");

  button.addEventListener("transitionend", removeClickedClass);

}



function calculate(string) {

  let operationObj = getOperationObj(string);

  let error = false;

  if (operationObj.numbers.length !== operationObj.operators.length + 1) {

    error = true;

  }



  // Multiply and Divide first

  while (operationObj.operators.indexOf(multiply) >= 0 || operationObj.operators.indexOf(divide) >= 0) {

    operationObj.operators.forEach((operator, i) => {

      if (operator === multiply || operator === divide) {

        // Division by zero

        if (operator === divide && operationObj.numbers[i + 1] == 0) {

          error = true;

        }

        operationObj.numbers[i] = operate(operator, operationObj.numbers[i], operationObj.numbers[i + 1]);

        operationObj.numbers.splice(i + 1, 1);

        operationObj.operators.splice(i, 1);

      }

    });

  }



  // Then Add and Substract

  while (operationObj.operators.length) {

    operationObj.numbers[0] = operate(operationObj.operators[0], operationObj.numbers[0], operationObj.numbers[1]);

    operationObj.numbers.splice(1, 1);

    operationObj.operators.splice(0, 1);

  }



  if (error) {

    return "ERROR";

  }

  return operationObj.numbers[0];

}

// Splits the String into two Arrays in operationObj
// operationObject.numbers holds numbers in right order
// operationObject.operators holds operators in right order
function getOperationObj(string) {

  //fix for negatives
  if(string.charAt(0)=="-"){
  	string = "0" + string;
  }

  string = string.split("");

  let operationObj = string.reduce((obj, char) => {

    if (Number.isInteger(Number(char)) || char === ".") {

      if (obj.lastNumber) {

        if (char === "." && obj.numbers[obj.numbers.length - 1].indexOf(".") >= 0) {
		}else{
          obj.numbers[obj.numbers.length - 1] += char;

        }

      } else {

        obj.numbers.push(char);

      }

      obj.lastNumber = true;

    } else {

      obj.operators.push(getOperator(char));

      obj.lastNumber = false;

    }

    return obj;

  }, {

    numbers: [],

    operators: [],

    lastNumber: false,

  });

  operationObj.numbers = operationObj.numbers.map(string => Number(string));

  return operationObj;

}



function getOperator(operatorString) {

  switch (operatorString) {

    case "+":

      return add;

      break;

    case "-":

      return substract;

      break;

    case "*":

      return multiply;

      break;

    case "/":

      return divide;

      break;

  }

}



function removeClickedClass(e) {

  e.target.classList.remove("clicked");

  e.target.removeEventListener("transitionend", removeClickedClass);

}



function keyPressed(e) {

  buttons.forEach(button => {

    if (e.key === button.textContent) {

      buttonPressed(e, button);

    }

  });



  if (e.key === "Enter" || e.key === " ") {

    buttonPressed(e, buttons.filter(button => button.textContent === "=")[0]);

  }



  if (e.key === "Backspace") {

    buttonPressed(e, buttons.filter(button => button.textContent === "DEL")[0]);

  }



  if (e.key === "Delete") {

    buttonPressed(e, buttons.filter(button => button.textContent === "AC")[0]);

  }

}

// ********************************

let displayValue = "";

let display = document.querySelector(".result");

let formula = document.querySelector(".formula");

let buttons = Array.from(document.querySelectorAll(".myBtn"));

buttons.forEach(button => button.addEventListener("click", buttonPressed));

document.addEventListener("keydown", keyPressed)