import { startArr } from "./startArr.js";
import { setMatrix, generateRandom } from "./setMatrix.js";
import { timerId, resetTimer } from "./timer.js";
import { createBars } from "./createBars.js";
import { createSizes, sizesHandler } from "./createSizes.js";
import { startHandler } from "./startHandler.js";
import { gameHandler, resetCount } from "./fieldHandler.js";
import { resetHandler } from "./resetHandler.js";
import { resultHandler } from "./resultHandler.js";
import { muteHandler } from "./playSound.js";

const container = document.createElement("DIV");

//КНОПКИ
const btnWrap = document.createElement("DIV");
export const btnStart = document.createElement("button");
export const btnReset = document.createElement("button");
export const btnResults = document.createElement("button");
export const btnMute = document.createElement("button");
const muteIcon = document.createElement("img");

//ХОДЫ И ВРЕМЯ
const progress = document.createElement("div");
//ходы
const movesEl = document.createElement("div");
export const numberOfMoves = document.createElement("span");
//время
const timeEl = document.createElement("div");
export const timeValue = document.createElement("span");

//Задний фон для модалок
export const overlay = document.createElement("div");

//ИГРОВОЕ ПОЛЕ
export const gameField = document.createElement("div");

//ТЕКУЩИЙ РАЗМЕР ПОЛЯ
export const currentSize = document.createElement("div");
export const sizeValue = document.createElement("span");

//ДРУГИЕ РАЗМЕРЫ ПОЛЯ
export const anotherSizes = document.createElement("div");

//Параметры поля
export let dimension; //размерность
export let startView; //стартовый набор карточек
export let mainMatrix; //главная матрица
let sizesArr; //доступные размеры полей

//Переназначение матрицы
function newMatrix(arg) {
  //mainMatrix = setMatrix(generateRandom(dimension));

  mainMatrix = setMatrix(arg);

  return mainMatrix;
}

//Переназначение стартового мнабора карточек
function newStartView(dimension) {
  startView = startArr(dimension);

  return startView;
}

//Переназначение размерности поля
function newDimension(arg) {
  dimension = arg;

  return dimension;
}

//Настройки игрового поля
function createField() {
  gameField.classList.add("game-field");
  gameField.style.marginTop = "10px";
  gameField.style.width = btnWrap.offsetWidth + "px";
  gameField.style.height = window
    .getComputedStyle(btnWrap)
    .getPropertyValue("width");
  container.append(gameField);
}

//Отрисовка элементов
function createElements() {
  document.body.prepend(overlay);
  container.classList.add("container");
  btnWrap.classList.add("btn_wrapper");
  btnStart.classList.add("btn");
  btnReset.classList.add("btn");
  btnResults.classList.add("btn");
  btnMute.classList.add("muteBtn");
  progress.classList.add("progress_wrapper");
  anotherSizes.classList.add("sizes");

  btnStart.textContent = "Shuffle and start";
  btnReset.textContent = "Reset";
  btnResults.textContent = "Results";

  movesEl.textContent = "Moves: ";
  numberOfMoves.textContent = "0";
  timeEl.textContent = "Time: ";

  currentSize.textContent = "Frame size: ";

  btnStart.style.backgroundColor = "#0abab5";
  btnResults.style.backgroundColor = "#0abab5";
  muteIcon.setAttribute("src", "mute-icon.png");

  timeEl.style.marginLeft = "15px";

  currentSize.style.marginTop = "10px";
  anotherSizes.style.marginTop = "10px";

  btnWrap.append(btnStart);
  btnWrap.append(btnReset);
  btnWrap.append(btnResults);
  btnMute.append(muteIcon);

  progress.append(movesEl);
  movesEl.append(numberOfMoves);
  progress.append(timeEl);
  timeEl.append(timeValue);

  currentSize.append(sizeValue);

  document.body.prepend(container);
  container.append(btnMute);
  container.append(btnWrap);
  container.append(progress);
  createField();
  container.append(currentSize);
  container.append(anotherSizes);
}

//Вид  и параметры игры по умолчанию
function makeDefault(dim) {
  //1. Назначаем параметры по умолчанию
  currentSize.dataset.dim = `${dim}`;
  dimension = dim; //размерность
  resetCount(); //сброс ходов
  newStartView(dimension); //стартовый набор карточек
  mainMatrix = setMatrix(startView, dimension); //начальная матрица элементов

  sizesArr = [3, 4, 5, 6, 7, 8]; //доступные размеры полей

  //Сброс таймера
  clearInterval(timerId);

  //Обнуляем значения таймера
  resetTimer();

  numberOfMoves.textContent = "0";
  sizeValue.textContent = `${dimension} х ${dimension}`;
  timeValue.textContent = "00 : 00 : 00";
  btnReset.style.backgroundColor = "gray";

  //2. Заново отрисовываем игровое поле
  createBars(mainMatrix, dimension);
  createSizes(sizesArr);

  //3. Добавляем/удаляем обработчики
  anotherSizes.addEventListener("click", sizesHandler);
  btnStart.addEventListener("click", startHandler);
  gameField.removeEventListener("click", gameHandler);
  btnReset.addEventListener("click", resetHandler);
  btnResults.addEventListener("click", resultHandler);
}

btnResults.addEventListener("click", resultHandler);
btnMute.addEventListener("click", muteHandler);

export { createElements, makeDefault, newMatrix, newStartView, newDimension };
