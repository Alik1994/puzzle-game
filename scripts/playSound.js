import { btnMute } from "./init.js";

//Воспроизведение аудио
function playSound(sound) {
  if (btnMute.classList.contains("isMute")) {
    return;
  }

  let audio = new Audio();
  audio.src = `https://github.com/Alik1994/puzzle-game/blob/main/src/${sound}.mp3`;
  audio.autoplay = true;
}

function muteHandler() {
  btnMute.classList.toggle("isMute");
}

export { playSound, muteHandler };
