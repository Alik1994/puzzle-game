const container = document.createElement("DIV");

//АУДИО
const audioEl = document.createElement("audio");

//КНОПКИ
const btnWrap = document.createElement("DIV");
const btnStart = document.createElement("button");
const btnStop = document.createElement("button");
const btnResults = document.createElement("button");

//ХОДЫ И ВРЕМЯ
const progress = document.createElement("div");
//ходы
const movesEl = document.createElement("div");
const numberOfMoves = document.createElement("span");
//время
const timeEl = document.createElement("div");
const timeValue = document.createElement("span");

//МОДАЛЬНОЕ ОКНО (ПОБЕДА)
const overlay = document.createElement("div");
const modalWindow = document.createElement("div");
const modalImg = document.createElement("img");
const winText = document.createElement("p");
const nameText = document.createElement("p");
const modalForm = document.createElement("input");
const modalBtn = document.createElement("button");
let userName = "";

//TODO - delete later
const showModal = document.createElement("button");
showModal.textContent = "show modal";
showModal.addEventListener("click", () => {
  makeModal();
});

//ИГРОВОЕ ПОЛЕ
const gameField = document.createElement("div");

//ТЕКУЩИЙ РАЗМЕР ПОЛЯ
const currentSize = document.createElement("div");
const sizeValue = document.createElement("span");

//ДРУГИЕ РАЗМЕРЫ ПОЛЯ
const anotherSizes = document.createElement("div");

//Параметры поля
let dimension = 4; //размерность

let count = 0; //кол-во ходов
let startView = startArr(dimension); //стартовый набор карточек
let mainMatrix = setMatrix(startView); //начальная матрица элементов

let sizesArr = [3, 4, 5, 6, 7, 8]; //доступные размеры полей

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

  while (current <= end) {
    arr.push(current);
    current++;
  }

  return arr;
}

//Генерирование случайной последовательности плиток
function generateRandom(rows) {
  let set = new Set();
  let end = rows * rows;

  while (set.size < end) {
    let value = Math.ceil(Math.random() * end);
    set.add(value);
  }

  return Array.from(set);
}

//Создание матрицы
function setMatrix(arr) {
  let matrix = [];
  let x = 0; //горизонталь
  let y = 0; //вертикаль

  for (let i = dimension; i > 0; i--) matrix.push([]);

  for (let i = 0; i < arr.length; i++) {
    if (x >= dimension) {
      x = 0;
      y++;
    }

    matrix[y].push(arr[i]);
    x++;
  }

  return matrix;
}

//Проверка расклада на решаемость

function isSolveable(matrix) {
  //1. Делаем из матрицы массив
  const arrFromMtrx = mainMatrix.flat(Infinity);

  //2. Пуста клетка
  const emptyValue = dimension ** 2;

  //2. Точка отсчета
  let startIndx = 0;

  //3. Если точка отсчета равна пустой клетке, то изменить
  if (arrFromMtrx[startIndx] === emptyValue) {
    startIndx++;
  }

  //4. Поиск пар
  const pairsArr = [];
  let pairs = 0;

  while (startIndx < arrFromMtrx.length - 1) {
    pairs = findPairs(startIndx, arrFromMtrx);
    startIndx++;
    pairsArr.push(pairs);
  }

  //5. Ищем сумму пар
  const sumOfPairs = pairsArr.reduce((sum, item) => sum + item, 0);

  //6. Ищем номер ряда пустой клетки в матрице
  const emptyCoords = getCoordinateByNum(emptyValue, mainMatrix);
  const rowNum = emptyCoords.y + 1;

  //7. Проверка на валидность

  return (sumOfPairs + rowNum) % 2 === 0;
}

//Поиск пар, где большее значение стоит перед меньшим
function findPairs(start, arr) {
  let numOfPairs = 0;

  for (let i = start + 1; i < arr.length; i++) {
    if (arr[i] === dimension ** 2) continue;

    if (arr[i] < arr[start]) {
      numOfPairs++;
    }
  }
  return numOfPairs;
}

//Создание плиток пазла
function createBars(matrix) {
  let currentMatrix = matrix;
  gameField.innerHTML = "";

  for (let y = 0; y < currentMatrix.length; y++) {
    for (let x = 0; x < currentMatrix[y].length; x++) {
      const bar = document.createElement("div");

      if (currentMatrix[y][x] === dimension * dimension) {
        //задать конечному элементу цвет шрифта = цвету поля
        //скрываем его
        bar.style.color = "#0abab5";
        bar.style.backgroundColor = "#0abab5";
      }

      bar.classList.add("bar");
      bar.style.width = gameField.offsetWidth / dimension + "px";
      bar.style.height = gameField.offsetWidth / dimension + "px";

      bar.textContent = `${currentMatrix[y][x]}`;

      gameField.append(bar);
    }
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
function sizesHandler(event) {
  let target = event.target;

  if (target.className === "size") {
    dimension = Number(target.dataset.sizeValue);
    startView = startArr(dimension);
    mainMatrix = setMatrix(startView);
    sizeValue.textContent = `${dimension} х ${dimension}`;
    createBars(mainMatrix);
  }
}

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

//Получение координаты плитки
function getCoordinateByNum(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return { x, y };
      }
    }
  }

  return null;
}

//Проверка на валидность - возможность замены плиток
function isValidForSwap(coords1, coords2) {
  /*Координаты валидны тогда, когда разница в координатах
  либо по X, либо по Y не превышает 1*/

  const diffX = Math.abs(coords1.x - coords2.x); //разница в координатах по X
  const diffY = Math.abs(coords1.y - coords2.y); //разница в координатах по Y

  return (diffX === 1 || diffY === 1) && (diffX === 0 || diffY === 0);
}

//Функция замены при валидности
function swapBars(coords1, coords2, matrix) {
  const coord1Num = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coord1Num;
  createBars(matrix);
}

//Проверка победы
function isWin() {
  //Идентичные массивы НЕ РАВНЫ друг другу
  //Делаем из них строки и сравниваем
  let startArr = [].concat(startView);
  let newArr = mainMatrix.flat(Infinity);

  return startArr === newArr;
}

//Воспроизведение аудио
function playSound(sound) {
  let audio = new Audio();
  audio.src = `src/${sound}.mp3`;
  audio.autoplay = true;
}

//Старт игры - нажатие на Start
function startHandler() {
  //1. Запретить переключение размеров
  anotherSizes.removeEventListener("click", sizesHandler);

  //2. Проверка на решаемость и отрисовка
  mainMatrix = setMatrix(generateRandom(dimension));

  while (isSolveable(mainMatrix) !== true) {
    mainMatrix = setMatrix(generateRandom(dimension));
  }

  createBars(mainMatrix);

  //3. Запуск таймера
  setInterval(timer, 1000); //TimerId = 1

  //4. Сделать кнопку Stop активной
  btnStop.style.backgroundColor = "#ff8c69";

  //5. Сделать кнопку Start неактивной
  btnStart.removeEventListener("click", startHandler);

  //6. Навесить событие на игровое поле
  gameField.addEventListener("click", (event) => {
    const barNode = event.target.closest(".bar");

    if (!barNode) return;

    //6.1 Получить номер пустой плитки
    const emptyBarNum = dimension * dimension;

    //6.2 Получить номер активной плитки
    const activeBarNum = Number(barNode.textContent);

    //6.3 Получить координаты (x,y) в матрице для пустой и активной плитки
    const emptyBarCoords = getCoordinateByNum(emptyBarNum, mainMatrix);
    const activeBarCoords = getCoordinateByNum(activeBarNum, mainMatrix);

    //6.4 Проверка валидности координат
    const isValid = isValidForSwap(emptyBarCoords, activeBarCoords);

    if (isValid) {
      //Меняем плитки местами
      swapBars(emptyBarCoords, activeBarCoords, mainMatrix);
      //Увеличиваем кол-во ходов
      count++;
      numberOfMoves.textContent = `${count}`;
      //Воспроизводим звук
      playSound("click");

      //Проверка на победителя
      const winner = isWin();

      if (winner) {
        //Останавливаем таймер
        clearInterval(1);
        //Показываем модалку
        makeModal();
      }
    }
  });
}

//Остановка игры - нажатие на Stop
function stopHandler() {
  clearInterval(1); //остановка таймера
}

anotherSizes.addEventListener("click", sizesHandler);
btnStart.addEventListener("click", startHandler);
btnStop.addEventListener("click", stopHandler);

//Отрисовка элементов при загрузе
function createElements() {
  container.classList.add("container");
  btnWrap.classList.add("btn_wrapper");
  btnStart.classList.add("btn");
  btnStop.classList.add("btn");
  btnResults.classList.add("btn");
  progress.classList.add("progress_wrapper");
  anotherSizes.classList.add("sizes");

  btnStart.textContent = "Shuffle and start";
  btnStop.textContent = "Stop";
  btnResults.textContent = "Results";

  movesEl.textContent = "Moves: ";
  numberOfMoves.textContent = "0";
  timeEl.textContent = "Time: ";
  timeValue.textContent = "00 : 00 : 00";

  currentSize.textContent = "Frame size: ";
  sizeValue.textContent = `${dimension} х ${dimension}`;

  btnStart.style.backgroundColor = "#0abab5";
  btnStop.style.backgroundColor = "gray";
  btnResults.style.backgroundColor = "#0abab5";

  timeEl.style.marginLeft = "15px";

  currentSize.style.marginTop = "10px";
  anotherSizes.style.marginTop = "10px";

  document.body.prepend(container);
  document.body.prepend(audioEl);

  container.append(btnWrap);
  btnWrap.append(btnStart);
  btnWrap.append(btnStop);
  btnWrap.append(btnResults);

  container.append(progress);
  progress.append(movesEl);
  movesEl.append(numberOfMoves);
  progress.append(timeEl);
  timeEl.append(timeValue);

  createField();
  createBars(mainMatrix);

  container.append(currentSize);
  currentSize.append(sizeValue);

  container.append(anotherSizes);

  createSizes(sizesArr);

  //TODO - delete
  document.body.prepend(showModal);
}

//Отрисовка модального окна
function makeModal() {
  //Модальное окно

  modalImg.setAttribute("src", "src/win_img.png");
  winText.textContent = `Hooray! You solved the puzzle in ${
    hours < 10 ? "0" + hours : hours
  } : ${minutes < 10 ? "0" + minutes : minutes} : ${
    seconds < 10 ? "0" + seconds : seconds
  } and ${count} moves!`;
  nameText.textContent = "Please, enter your name!";
  modalBtn.textContent = "Ok";

  overlay.classList.add("overlay");
  modalWindow.classList.add("modal");
  winText.classList.add("modal_win");
  nameText.classList.add("modal_user");
  modalForm.classList.add("modal_form");
  modalBtn.classList.add("modal_btn");

  modalWindow.append(modalImg);
  modalWindow.append(winText);
  modalWindow.append(nameText);
  modalWindow.append(modalForm);
  modalWindow.append(modalBtn);

  document.body.prepend(overlay);
  document.body.prepend(modalWindow);

  playSound("win");
}

//Инициатор
function init() {
  createElements();
}
