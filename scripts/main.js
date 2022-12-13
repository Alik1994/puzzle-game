import { createElements, makeDefault } from "./init.js";

window.addEventListener("load", init);

//Инициатор
function init() {
  createElements();
  makeDefault(4);
}
