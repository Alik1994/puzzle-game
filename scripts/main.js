import { createElements, makeDefault } from "./init.js";
import "../style.scss";

window.addEventListener("load", init);

//Инициатор
function init() {
  createElements();
  makeDefault(4);
}
