var seconds = 0;
var minutes = 2;
var control;

function startChrono() {
  control = setInterval(chronometer, 1000);
}

function stopChrono() {
  clearInterval(control);
}

function resetChrono() {
  clearInterval(control);
  seconds = 0;
  minutes = 2;
  timersec.innerHTML = "00";
  timermin.innerHTML = "02";
}

function chronometer() {
  if (seconds == 0) {
    seconds = 60;
    minutes--;
    if (minutes < 10) { minutes = "0" + minutes }
    timermin.innerHTML = minutes;
  }
  if (seconds <= 60) {
    seconds--;
    if (seconds < 10) { seconds = "0" + seconds }
    timersec.innerHTML = seconds;
  }
  if ((seconds == 0) && (minutes == 0)) {
    stopChrono();
  }
}