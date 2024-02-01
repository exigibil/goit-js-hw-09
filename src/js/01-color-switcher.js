function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');
const bodySelect = document.querySelector('body');

stopBtn.disabled = true;
let seconds = 0;

function changeColor() {
  bodySelect.style.backgroundColor = getRandomHexColor();
}

startBtn.addEventListener('click', () => {
  seconds = setInterval(changeColor, 1000);
  changeColor();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
  clearInterval(seconds);
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
