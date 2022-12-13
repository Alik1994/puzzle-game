import { timeValue } from "./init.js";

//Функция-таймер
export let timerId;
export let hours = 0;
export let minutes = 0;
export let seconds = 0;

function timer() {
  seconds++;

  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }

  if (minutes === 60) {
    hours++;
    minutes = 0;
  }

  timeValue.textContent = `${hours < 10 ? "0" + hours : hours} : ${
    minutes < 10 ? "0" + minutes : minutes
  } : ${seconds < 10 ? "0" + seconds : seconds}`;
}

function resetTimer() {
  hours = 0;
  minutes = 0;
  seconds = 0;
}

function getTimerId() {
  timerId = setInterval(timer, 1000); //TimerId

  return timerId;
}

export { timer, resetTimer, getTimerId };
