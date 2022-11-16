const container = document.createElement("DIV");

//КНОПКИ
const btnWrap = document.createElement("DIV");
const btnStart = document.createElement("button");
const btnStop = document.createElement("button");
const btnSave = document.createElement("button");
const btnResults = document.createElement("button");

//ХОДЫ И ВРЕМЯ
const progress = document.createElement("div");
//ходы
const movesEl = document.createElement("div");
const numberOfMoves = document.createElement("span");
//время
const timeEl = document.createElement("div");
const timeValue = document.createElement("span");

//ИГРОВОЕ ПОЛЕ
const gameField = document.createElement("div");

//ТЕКУЩИЙ РАЗМЕР ПОЛЯ
const currentSize = document.createElement("div");
const sizeValue = document.createElement("span");

//ДРУГИЕ РАЗМЕРЫ ПОЛЯ
const anotherSizes = document.createElement("div");

let dimension = 4; //размерность
let count = 0; //кол-во ходов
let startView = startArr(dimension); //стартовый набор карточек
let sizesArr = [3, 4, 5, 6, 7, 8]; //доступные размеры полей

//Отрисока элементов при загрузе
function createElements() {
  container.classList.add("container");
  btnWrap.classList.add("btn_wrapper");
  btnStart.classList.add("btn");
  btnStop.classList.add("btn");
  btnSave.classList.add("btn");
  btnResults.classList.add("btn");
  progress.classList.add("progress_wrapper");
  anotherSizes.classList.add("sizes");

  btnStart.textContent = "Shuffle and start";
  btnStop.textContent = "Stop";
  btnSave.textContent = "Save";
  btnResults.textContent = "Results";

  movesEl.textContent = "Moves: ";
  numberOfMoves.textContent = `${count}`;
  timeEl.textContent = "Time: ";
  timeValue.textContent = "00 : 00 : 00";

  currentSize.textContent = "Frame size: ";
  sizeValue.textContent = `${dimension} х ${dimension}`;

  btnStart.style.backgroundColor = "#0abab5";
  btnStop.style.backgroundColor = "gray";
  btnSave.style.backgroundColor = "#0abab5";
  btnResults.style.backgroundColor = "#0abab5";

  timeEl.style.marginLeft = "15px";

  currentSize.style.marginTop = "10px";
  anotherSizes.style.marginTop = "10px";

  document.body.prepend(container);

  container.append(btnWrap);
  btnWrap.append(btnStart);
  btnWrap.append(btnStop);
  btnWrap.append(btnSave);
  btnWrap.append(btnResults);

  container.append(progress);
  progress.append(movesEl);
  movesEl.append(numberOfMoves);
  progress.append(timeEl);
  timeEl.append(timeValue);

  createField();
  createBars(startView);

  container.append(currentSize);
  currentSize.append(sizeValue);

  container.append(anotherSizes);

  createSizes(sizesArr);
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

//Стартовая последовательность плиток
function startArr(rows) {
  let arr = [];
  let current = 1;
  let end = rows * rows;

  while (current < end) {
    arr.push(current);
    current++;
  }

  return arr;
}

//Генерирование случайной последовательности плиток
function generateRandom(rows) {
  let set = new Set();
  let end = rows * rows - 1;

  while (set.size < end) {
    let value = Math.ceil(Math.random() * end);
    set.add(value);
  }

  return Array.from(set);
}

//Создание плиток пазла
function createBars(arr) {
  let array = arr;
  gameField.innerHTML = "";

  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");

    bar.classList.add("bar");
    bar.style.width = gameField.offsetWidth / dimension + "px";
    bar.style.height = gameField.offsetWidth / dimension + "px";

    bar.textContent = `${array[i]}`;

    gameField.append(bar);
  }
}

//Создание иных размеров
function createSizes(arr) {
  let sizes = arr;

  for (let i = 0; i < sizes.length; i++) {
    const size = document.createElement("div");

    size.classList.add("size");
    size.dataset.sizeValue = `${sizes[i]}`;
    size.textContent = `${sizes[i]}х${sizes[i]}`;

    anotherSizes.append(size);
  }
}

//Переключение между иными размерами
anotherSizes.addEventListener("click", (event) => {
  let target = event.target;

  if (target.className === "size") {
    dimension = Number(target.dataset.sizeValue);
    startView = startArr(dimension);
    sizeValue.textContent = `${dimension} х ${dimension}`;
    createBars(startView);
  }
});

//Функция-таймер
let hours = 0;
let minutes = 0;
let seconds = 0;

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

//Старт игры - нажатие на Start
function startHandler() {
  //1. Перемешать карточки
  let randomArr = generateRandom(dimension);
  createBars(randomArr);

  //2. Запуск таймера
  setInterval(timer, 1000); //TimerId = 1

  //3. Сделать кнопку Stop активной
  btnStop.style.backgroundColor = "#ff8c69";

  //4. Удалить обработчик с кнопки Start
  btnStart.removeEventListener("click", startHandler);

  //5. Навесить Drag'n'Drop на игровое поле
}

//Остановка игры - нажатие на Stop
function stopHandler() {
  clearInterval(1); //остановка таймера
}

btnStart.addEventListener("click", startHandler);
btnStop.addEventListener("click", stopHandler);
//Инициатор
function init() {
  createElements();
}
