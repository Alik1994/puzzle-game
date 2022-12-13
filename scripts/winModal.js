//Модальное окно
import { overlay, currentSize, makeDefault } from "./init.js";
import { hours, minutes, seconds } from "./timer.js";
import { count } from "./fieldHandler.js";
import { playSound } from "./playSound.js";

const modalWindow = document.createElement("div");
const modalImg = document.createElement("img");
const winText = document.createElement("p");
const nameText = document.createElement("p");
const modalForm = document.createElement("input");
const modalBtn = document.createElement("button");
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

export { makeModal };
