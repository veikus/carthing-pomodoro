(() => {
  const START_BUTTON = 'Enter'; // Works same way as clicking on the screen
  const SKIP_BUTTON = 'Escape';
  const RESET_BUTTON = 'm';
  const MODE_BUTTON = '1';

  let totalFocusTime = parseInt(localStorage.getItem('totalFocusTime'), 10) || 0;
  let totalRelaxTime = parseInt(localStorage.getItem('totalRelaxTime'), 10) || 0;

  let currentState = 'focus'; // focus, relax
  let isTimerRunning = false;
  let currentSessionTime = 0;

  const timerElem = document.getElementById('timer');
  const footerElem = document.getElementById('pomodoros');

  updateTimerInformation();
  updateFooterInformation();
  setInterval(() => {
    tick();
  }, 1000);

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case START_BUTTON:
        start();
        break;

      case SKIP_BUTTON:
        skip();
        break;

      case RESET_BUTTON:
        reset();
        break;
    }
  });

  function updateTimerInformation() {
    timerElem.textContent = formatTime(currentSessionTime);
  }

  function updateFooterInformation() {
    footerElem.textContent =  `${formatTime(totalFocusTime)} | ${formatTime(totalRelaxTime)}`;
  }

  function tick() {
    if (isTimerRunning) {
      currentSessionTime++;

      switch (currentState) {
        case 'focus':
          totalFocusTime++;
          localStorage.setItem('totalFocusTime', totalFocusTime.toString());
          break;

        case 'relax':
          totalRelaxTime++;
          localStorage.setItem('totalRelaxTime', totalRelaxTime.toString());
      }

      updateTimerInformation();
      updateFooterInformation();
    }
  }

  function toggleState() {
    const body = document.querySelector('body');

    switch (currentState) {
      case 'focus':
        currentState = 'relax';
        body.className = 'relaxMode';
        break;

      case 'relax':
        currentState = 'focus';
        body.className = 'focusMode';
        break;
    }

    currentSessionTime = 0;
    updateTimerInformation();
  }

  function start() {
    isTimerRunning = !isTimerRunning;
    updateTimerInformation();
    updateFooterInformation();
  }

  function skip() {
    toggleState();
  }

  function reset() {
    isTimerRunning = false;
    currentSessionTime = 0;
    totalFocusTime = 0;
    totalRelaxTime = 0;
    localStorage.setItem('totalFocusTime', totalFocusTime);
    localStorage.setItem('totalRelaxTime', totalRelaxTime);
    updateTimerInformation();
    updateFooterInformation();
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hoursStr = hours > 0 ? hours.toString() : '';
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');

    return hours
      ? `${hoursStr}:${minutesStr}:${secondsStr}`
      : `${minutesStr}:${secondsStr}`;
  }
})();