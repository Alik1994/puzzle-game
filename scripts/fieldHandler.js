import { dimension, numberOfMoves, mainMatrix, startView } from "./init.js";
import { createBars } from "./createBars.js";
import { playSound } from "./playSound.js";
import { timerId } from "./timer.js";
import { makeModal } from "./winModal.js";

export let count; //кол-во ходов

function resetCount() {
  count = 0;

  return count;
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
  createBars(matrix, dimension);
}

//Проверка победы
function isWin() {
  //Идентичные массивы НЕ РАВНЫ друг другу
  //Делаем из них строки и сравниваем
  let startArr = [].concat(startView);
  let newArr = mainMatrix.flat(Infinity);

  return startArr.join("") === newArr.join("");
}

export { gameHandler, getCoordinateByNum, resetCount };
