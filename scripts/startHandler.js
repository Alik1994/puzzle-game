import { sizesHandler } from "./createSizes.js";
import { isSolveable, generateRandom } from "./setMatrix.js";
import {
  anotherSizes,
  newMatrix,
  mainMatrix,
  btnStart,
  btnReset,
  btnResults,
  gameField,
  dimension,
} from "./init.js";
import { createBars } from "./createBars.js";
import { getTimerId } from "./timer.js";
import { gameHandler } from "./fieldHandler.js";
import { resultHandler } from "./resultHandler.js";

//Старт игры - нажатие на Start
function startHandler() {
  //1. Запретить переключение размеров
  anotherSizes.removeEventListener("click", sizesHandler);

  //2. Проверка на решаемость и отрисовка
  newMatrix(generateRandom(dimension));

  while (isSolveable(mainMatrix) !== true) {
    newMatrix(generateRandom(dimension));
  }

  createBars(mainMatrix, dimension);

  //3. Запуск таймера
  getTimerId();

  //4. Сделать кнопку Stop активной
  btnReset.style.backgroundColor = "#ff8c69";

  //5. Сделать кнопку Start неактивной
  btnStart.removeEventListener("click", startHandler);

  //6. Навесить событие на игровое поле
  gameField.addEventListener("click", gameHandler);

  //7. Удалить обработчик с кнопки Results
  btnResults.removeEventListener("click", resultHandler);
}

export { startHandler };
