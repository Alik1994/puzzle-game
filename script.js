//МОДУЛИ

const container = document.createElement("DIV");

//КНОПКИ
const btnWrap = document.createElement("DIV");
const btnStart = document.createElement("button");
const btnReset = document.createElement("button");
const btnResults = document.createElement("button");
const btnMute = document.createElement("button");
const muteIcon = document.createElement("img");

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

//МОДАЛЬНОЕ ОКНО (РЕЗУЛЬТАТЫ)
const modalResults = document.createElement("div");
const resultsTitle = document.createElement("h2");
const resultsTable = document.createElement("table");

//ИГРОВОЕ ПОЛЕ
const gameField = document.createElement("div");

//ТЕКУЩИЙ РАЗМЕР ПОЛЯ
const currentSize = document.createElement("div");
const sizeValue = document.createElement("span");

//ДРУГИЕ РАЗМЕРЫ ПОЛЯ
const anotherSizes = document.createElement("div");

//Параметры поля
let dimension; //размерность
let count; //кол-во ходов
let startView; //стартовый набор карточек
let mainMatrix;
let sizesArr; //доступные размеры полей

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

      bar.classList.add("bar");

      bar.style.width = gameField.offsetWidth / dimension + "px";
      bar.style.height = gameField.offsetWidth / dimension + "px";

      if (currentMatrix[y][x] === dimension * dimension) {
        //задать конечному элементу цвет шрифта = цвету поля
        //скрываем его
        const empty = document.createElement("span");

        empty.textContent = `${currentMatrix[y][x]}`;
        empty.classList.add("empty");

        bar.append(empty);
        bar.style.backgroundColor = "#0abab5";

        gameField.append(bar);
        continue;
      }

      bar.textContent = `${currentMatrix[y][x]}`;

      gameField.append(bar);
    }
  }
}

//Создание иных размеров
function createSizes(arr) {
  let sizes = arr;
  anotherSizes.innerHTML = "";

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
    currentSize.dataset.dim = `${dimension}`;
    startView = startArr(dimension);
    mainMatrix = setMatrix(startView);
    sizeValue.textContent = `${dimension} х ${dimension}`;
    createBars(mainMatrix);

    //Очистка localStorage
    localStorage.clear();
  }
}
//------MUTE-------
function muteHandler() {
  btnMute.classList.toggle("isMute");
}

btnMute.addEventListener("click", muteHandler);

//------START-------

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
  timerId = setInterval(timer, 1000); //TimerId

  //4. Сделать кнопку Stop активной
  btnReset.style.backgroundColor = "#ff8c69";

  //5. Сделать кнопку Start неактивной
  btnStart.removeEventListener("click", startHandler);

  //6. Навесить событие на игровое поле
  gameField.addEventListener("click", gameHandler);

  //7. Удалить обработчик с кнопки Results
  btnResults.removeEventListener("click", resultHandler);
}

//Функция-таймер
let timerId;
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

//Воспроизведение аудио
function playSound(sound) {
  if (btnMute.classList.contains("isMute")) {
    return;
  }

  let audio = new Audio();
  audio.src = `src/${sound}.mp3`;
  audio.autoplay = true;
}

//Функция для обработчика игрового поля
function gameHandler(event) {
  const barNode = event.target.closest(".bar");

  if (!barNode) return;

  //1. Получить номер пустой плитки
  const emptyBarNum = dimension * dimension;

  //2. Получить номер активной плитки
  const activeBarNum = Number(barNode.textContent);

  //3. Получить координаты (x,y) в матрице для пустой и активной плитки
  const emptyBarCoords = getCoordinateByNum(emptyBarNum, mainMatrix);
  const activeBarCoords = getCoordinateByNum(activeBarNum, mainMatrix);

  //4. Проверка валидности координат
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
      clearInterval(timerId);

      //Открываем модалку
      setTimeout(function () {
        //Показываем модалку
        makeModal();
      }, 1000);
    }
  }
}

//Проверка победы
function isWin() {
  //Идентичные массивы НЕ РАВНЫ друг другу
  //Делаем из них строки и сравниваем
  let startArr = [].concat(startView);
  let newArr = mainMatrix.flat(Infinity);

  return startArr.join("") === newArr.join("");
}

//Модальное окно
let userName;

function makeModal() {
  //1. Отрисовка элементов модального окна
  modalImg.setAttribute("src", "src/win_img.png");
  winText.textContent = `Hooray! You solved the puzzle in ${
    hours < 10 ? "0" + hours : hours
  } : ${minutes < 10 ? "0" + minutes : minutes} : ${
    seconds < 10 ? "0" + seconds : seconds
  } and ${count} moves!`;
  nameText.textContent = "Please, enter your name!";
  modalForm.value = ""; //сброс предыдущего значения
  modalBtn.textContent = "Ok";

  winText.classList.add("modal_win");
  nameText.classList.add("modal_user");
  modalForm.classList.add("modal_form");
  modalBtn.classList.add("modal_btn");

  modalWindow.append(modalImg);
  modalWindow.append(winText);
  modalWindow.append(nameText);
  modalWindow.append(modalForm);
  modalWindow.append(modalBtn);

  document.body.prepend(modalWindow);

  overlay.classList.remove("hidden");
  modalWindow.classList.remove("hidden");

  overlay.classList.add("overlay");
  modalWindow.classList.add("modal");

  //2. Проигрыш фанфар
  playSound("win");

  //3. Отслеживаем поле ввода.
  modalForm.addEventListener("input", inputHandler); // (*)

  //4. Отслеживаем кнопку Enter на поле ввода
  modalForm.addEventListener("keypress", keyHandler); // (**)

  //5. Отлеживаем события на модальном окне
  document.body.addEventListener("click", windowWinner); // (***)
}

//(*) - Обработчик поля ввода
function inputHandler() {
  //Ограничиваем на 7 знаков
  //Без цифр
  let value = modalForm.value;
  const regexp = /[a-z]/i;

  //1. Проверяем, чтобы вводились только буквы
  for (let i = 0; i < value.length; i++) {
    if (!regexp.test(value[i])) {
      //Окрасить поле в красный
      modalForm.style.borderColor = "red";
      //Заменить енправильный символ на пустую строку
      value = value.replace(value[i], "");
    } else {
      modalForm.style.borderColor = "#0abab5";
    }
  }

  //2. Ограничиваем кол-во символов
  if (value.length > 7) {
    value = value.slice(0, 7);
  }

  //3. Показываем итог
  modalForm.value = value;
}

//(**) - Обработчик клавиатуры
function keyHandler(event) {
  if (event.key === "Enter" && modalForm.value !== "") {
    closeModal();
    modalForm.removeEventListener("keypress", keyHandler);
  }
}

//(***) - Глобальный обработчик
function windowWinner(event) {
  let target = event.target;

  //1. Кнопка 'OK'
  if (target.closest(".modal_btn") && modalForm.value !== "") {
    closeModal();
    document.body.removeEventListener("click", windowWinner);
  }

  //2. Нажатие за пределами окна
  if (target.closest(".overlay") && modalForm.value !== "") {
    closeModal();
    document.body.removeEventListener("click", windowWinner);
  }
}

//Сохранить результаты
function saveResults() {
  //1. Сохраняем текущее имя пользователя
  userName = modalForm.value;

  //2. Создаем объект с данными ходов и времени
  let userArray = [];
  let moves = count; //кол-во ходов
  let time = hours * 60 + minutes * 60 + seconds; //время сохраняем в секундах для удобства

  //3. Сохраняем данные в массив
  userArray = [moves, time];

  //4. Записываем данные в localStorage
  localStorage.setItem(userName, JSON.stringify(userArray));
}

//Закрытие модального окна
function closeModal() {
  //1. Сохранить результаты
  saveResults();
  //2. Закрыть модальное окно
  overlay.classList.remove("overlay");
  modalWindow.classList.remove("modal");

  overlay.classList.add("hidden");
  modalWindow.classList.add("hidden");

  //3. Привести к стартовому виду
  let currentDimension = Number(currentSize.dataset.dim);
  makeDefault(currentDimension);
}

//------RESET-------
//Сброс игры - нажатие на Reset
function resetHandler() {
  clearInterval(timerId); //остановка таймера
  let currentDimension = Number(currentSize.dataset.dim);
  makeDefault(currentDimension);
}

//------RESULTS-------
btnResults.addEventListener("click", resultHandler);

function resultHandler() {
  showResults();
}

function showResults() {
  //1. Получаем результаты
  let results = makeResults();

  //2. Сортируем по возрастанию
  //Определяющий фактор - время прохождения (time)
  //Больше время -> ниже в таблице
  //Если время одинаковое, сортируем по кол-ву ходов (moves)
  results.sort((a, b) =>
    a.time === b.time ? a.moves - b.moves : a.time - b.time
  );

  //3. Обрезаем массив до 10 значений
  results = results.slice(0, 10);

  //4. Заполняем рисуем
  createModalResults(results);

  //5. Вешаем обработчик
  document.body.addEventListener("click", windowResults);
}

//Собираем результаты победы
function makeResults() {
  //Из каждого результаты делаем объект каждый объект в массив
  let arrOfResults = [];

  //Перебор localStorage
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }

    //Запись данных в объект
    let obj = {};
    obj.name = key;
    obj.moves = JSON.parse(localStorage.getItem(key))[0];
    obj.time = JSON.parse(localStorage.getItem(key))[1];

    //Добавление объекта в массив
    arrOfResults.push(obj);
  }

  return arrOfResults;
}

//Отрисовка результатов победы
function createModalResults(arr) {
  //Содержимое заголовка
  resultsTitle.textContent = `Top 10 winners for current size`;
  modalResults.append(resultsTitle);

  //Очищаем таблицу от предыдущих значений
  resultsTable.innerHTML = "";

  //Заполняем строку заголовков
  const titleRow = document.createElement("tr");
  const titleUser = document.createElement("th"); //заголовок имени
  const titleMoves = document.createElement("th"); //заголовок ходов
  const titleTime = document.createElement("th"); //заголовок времени

  titleUser.textContent = "User";
  titleMoves.textContent = "Score";
  titleTime.textContent = "Time";

  titleRow.append(titleUser);
  titleRow.append(titleMoves);
  titleRow.append(titleTime);
  resultsTable.append(titleRow);

  //Заполняем остальное содержимое таблицы
  let results = arr;

  for (let i = 0; i < results.length; i++) {
    let row = document.createElement("tr");
    let name = document.createElement("td");
    let score = document.createElement("td");

    //Время
    let timeEl = document.createElement("td");
    let time = results[i].time;
    let h = Math.trunc(time / 3600);
    let m = Math.trunc((time - h * 3600) / 60);
    let sec = Math.trunc(time - h * 3600 - m * 60);

    name.textContent = `${results[i].name}`;
    score.textContent = `${results[i].moves}`;
    timeEl.textContent = `${h < 10 ? "0" + h : h} : ${m < 10 ? "0" + m : m} : ${
      sec < 10 ? "0" + sec : sec
    }`;

    row.append(name);
    row.append(score);
    row.append(timeEl);

    resultsTable.append(row);
  }

  modalResults.append(resultsTable);
  document.body.append(modalResults);

  //Удаляем скрытие
  modalResults.classList.remove("hidden");
  overlay.classList.remove("hidden");

  //Добавляем классы
  overlay.classList.add("overlay");
  modalResults.classList.add("modal_results");
  resultsTitle.classList.add("results_title");
  resultsTable.classList.add("results_table");
}

//Глобальный обработчик окна с результатами
function windowResults(event) {
  let target = event.target;
  if (target.closest(".modal_results") || target.closest(".overlay")) {
    modalResults.classList.remove("modal_results");
    overlay.classList.remove("overlay");

    modalResults.classList.add("hidden");
    overlay.classList.add("hidden");

    //Удалить обработчик
    document.body.removeEventListener("click", windowResults);

    //Очистить содержимое
    modalResults.innerHTML = "";
  }
}

//------ИНИЦИАТОРЫ-------
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
  muteIcon.setAttribute("src", "src/mute-icon.png");

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
  count = 0; //кол-во ходов
  startView = startArr(dimension); //стартовый набор карточек
  mainMatrix = setMatrix(startView); //начальная матрица элементов
  sizesArr = [3, 4, 5, 6, 7, 8]; //доступные размеры полей

  //Сброс таймера
  clearInterval(timerId);

  //Обнуляем значения таймера
  hours = 0;
  minutes = 0;
  seconds = 0;

  numberOfMoves.textContent = "0";
  sizeValue.textContent = `${dimension} х ${dimension}`;
  timeValue.textContent = "00 : 00 : 00";
  btnReset.style.backgroundColor = "gray";

  //2. Заново отрисовываем игровое поле
  createBars(mainMatrix);
  createSizes(sizesArr);

  //3. Добавляем/удаляем обработчики
  anotherSizes.addEventListener("click", sizesHandler);
  btnStart.addEventListener("click", startHandler);
  gameField.removeEventListener("click", gameHandler);
  btnReset.addEventListener("click", resetHandler);
  btnResults.addEventListener("click", resultHandler);
}

//Инициатор
function init() {
  createElements();
  makeDefault(4);
}
