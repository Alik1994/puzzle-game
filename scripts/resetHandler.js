//------RESET-------
import { timerId } from "./timer.js";
import { currentSize, makeDefault } from "./init.js";

//Сброс игры - нажатие на Reset
function resetHandler() {
  clearInterval(timerId); //остановка таймера
  let currentDimension = Number(currentSize.dataset.dim);
  makeDefault(currentDimension);
}

export { resetHandler };
