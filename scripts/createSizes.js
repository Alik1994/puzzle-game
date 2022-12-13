import {
  anotherSizes,
  currentSize,
  sizeValue,
  newMatrix,
  dimension,
  newStartView,
  newDimension,
  startView,
  mainMatrix,
} from "./init.js";
import { setMatrix } from "./setMatrix.js";
import { createBars } from "./createBars.js";

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
    newDimension(Number(target.dataset.sizeValue));
    currentSize.dataset.dim = `${dimension}`;
    newStartView(dimension);
    //mainMatrix = setMatrix(startView);
    newMatrix(startView);
    sizeValue.textContent = `${dimension} х ${dimension}`;
    createBars(mainMatrix, dimension);

    //Очистка localStorage
    localStorage.clear();
  }
}

export { createSizes, sizesHandler };
