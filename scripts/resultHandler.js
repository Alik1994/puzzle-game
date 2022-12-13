//------RESULTS-------
import { overlay } from "./init.js";

const modalResults = document.createElement("div");
const resultsTitle = document.createElement("h2");
const resultsTable = document.createElement("table");

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

export { resultHandler };
