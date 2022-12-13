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

export { startArr };
