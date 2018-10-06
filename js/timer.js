var miliseconds = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var control;

function startChrono() {
  control = setInterval(chronometer, 10);
}

function stopChrono() {
  clearInterval(control);
}

function resetChrono() {
  clearInterval(control);
  miliseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
  Centesimas.innerHTML = ":00";
  Segundos.innerHTML = ":00";
  Minutos.innerHTML = ":00";
  Horas.innerHTML = "00";
}

function chronometer() {
  if (miliseconds < 99) {
    miliseconds++;
    if (miliseconds < 10) { miliseconds = "0" + miliseconds }
    Centesimas.innerHTML = ":" + miliseconds;
  }
  if (miliseconds == 99) {
    miliseconds = -1;
  }
  if (miliseconds == 0) {
    seconds++;
    if (seconds < 10) { seconds = "0" + seconds }
    Segundos.innerHTML = ":" + seconds;
  }
  if (seconds == 59) {
    seconds = -1;
  }
  if ((miliseconds == 0) && (seconds == 0)) {
    minutes++;
    if (minutes < 10) { minutes = "0" + minutes }
    Minutos.innerHTML = ":" + minutes;
  }
  if (minutes == 59) {
    minutes = -1;
  }
  if ((miliseconds == 0) && (seconds == 0) && (minutes == 0)) {
    hours++;
    if (hours < 10) { hours = "0" + hours }
    Horas.innerHTML = hours;
  }
}