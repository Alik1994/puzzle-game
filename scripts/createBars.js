import { gameField } from "./init.js";

//Создание плиток пазла
function createBars(matrix, dimension) {
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

export { createBars };
