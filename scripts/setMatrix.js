import { dimension, mainMatrix } from "./init.js";
import { getCoordinateByNum } from "./fieldHandler.js";

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

export { generateRandom, setMatrix, isSolveable };
