(() => {
  const START_BUTTON = 'Enter'; // Works same way as clicking on the screen
  const SKIP_BUTTON = 'Escape';
  const RESET_BUTTON = 'm';
  const MODE_BUTTON = '1';

  let DEFAULT_FOCUS_TIME = parseInt(localStorage.getItem('focusTime'), 10) || 20 * 60;
  let DEFAULT_RELAX_TIME = parseInt(localStorage.getItem('relaxTime'), 10) || 5 * 60;
  let viewMode = localStorage.getItem('viewMode') || 'pomodoros'; // pomodoros, totalTime
  let collectedPomodoros = parseInt(localStorage.getItem('collectedPomodoros'), 10) || 0;
  let totalFocusTime = parseInt(localStorage.getItem('totalFocusTime'), 10) || 0;
  let totalRelaxTime = parseInt(localStorage.getItem('totalRelaxTime'), 10) || 0;

  let currentState = 'focus'; // focus, relax
  let isTimerStarted = false;
  let isTimerRunning = false;
  let timeLeft = DEFAULT_FOCUS_TIME;

  const timerDisplay = document.getElementById('timer');

  updateTimerDisplay();
  updatePomodorosDisplay();
  setInterval(() => {
    tick();
  }, 1000);

  document.addEventListener('click', () => start());

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

      case MODE_BUTTON:
        toggleViewMode();
        break;
    }
  });

  document.addEventListener('wheel', (e) => {
    const isUp = e.deltaX > 0;
    changeTimeSettings(isUp);
  });

  function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
  }

  function updatePomodorosDisplay() {
    const pomodorosDisplay = document.getElementById('pomodoros');

    switch (viewMode) {
      case 'pomodoros': {
        let str = '';
        for (let i = 0; i < collectedPomodoros; i++) {
          str += '🍅';
        }

        pomodorosDisplay.textContent = str || 'Collect your first pomodoro!';
        break;
      }

      case 'totalTime': {
        pomodorosDisplay.textContent =  `${formatTime(totalFocusTime)} | ${formatTime(totalRelaxTime)}`;
        break;
      }
    }
  }

  function tick() {
    if (isTimerRunning) {
      timeLeft--;

      switch (currentState) {
        case 'focus':
          totalFocusTime++;
          localStorage.setItem('totalFocusTime', totalFocusTime.toString());
          break;

        case 'relax':
          totalRelaxTime++;
          localStorage.setItem('totalRelaxTime', totalRelaxTime.toString());
      }

      if (timeLeft === 0 && currentState === 'focus') {
        collectedPomodoros++;
        updatePomodorosDisplay();
        localStorage.setItem('collectedPomodoros', collectedPomodoros);
      }

      if (timeLeft === 0) {
        isTimerStarted = false;
        isTimerRunning = false;
        toggleState();
      }

      updateTimerDisplay();
      if (viewMode === 'totalTime') {
        updatePomodorosDisplay();
      }
    }
  }

  function toggleState() {
    const body = document.querySelector('body');

    switch (currentState) {
      case 'focus':
        timeLeft = DEFAULT_RELAX_TIME;
        currentState = 'relax';
        body.className = 'relaxMode';
        break;

      case 'relax':
        timeLeft = DEFAULT_FOCUS_TIME;
        currentState = 'focus';
        body.className = 'focusMode';
        break;
    }

    isTimerStarted = false;
    isTimerRunning = false;
    updateTimerDisplay();
  }

  function toggleViewMode() {
    viewMode = viewMode === 'pomodoros' ? 'totalTime' : 'pomodoros';
    localStorage.setItem('viewMode', viewMode);
    updatePomodorosDisplay();
  }

  function start() {
    isTimerStarted = true;
    isTimerRunning = !isTimerRunning;
    updateTimerDisplay();
  }

  function skip() {
    if (isTimerStarted && !confirm('Are you sure you want to skip the current interval?')) {
      return;
    }

    toggleState();
  }

  function reset() {
    collectedPomodoros = 0;
    totalFocusTime = 0;
    totalRelaxTime = 0;
    updatePomodorosDisplay();
    localStorage.setItem('collectedPomodoros', collectedPomodoros);
    localStorage.setItem('totalFocusTime', totalFocusTime);
    localStorage.setItem('totalRelaxTime', totalRelaxTime);
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

  function changeTimeSettings(isUp) {
    if (isTimerStarted) {
      return;
    }

    switch (currentState) {
      case 'focus':
        DEFAULT_FOCUS_TIME = isUp ? DEFAULT_FOCUS_TIME + 30 : DEFAULT_FOCUS_TIME - 30;
        DEFAULT_FOCUS_TIME = Math.max(30, DEFAULT_FOCUS_TIME);
        timeLeft = DEFAULT_FOCUS_TIME;
        localStorage.setItem('focusTime', DEFAULT_FOCUS_TIME);
        break;

      case 'relax':
        DEFAULT_RELAX_TIME = isUp ? DEFAULT_RELAX_TIME + 30 : DEFAULT_RELAX_TIME - 30;
        DEFAULT_RELAX_TIME = Math.max(30, DEFAULT_RELAX_TIME);
        timeLeft = DEFAULT_RELAX_TIME;
        localStorage.setItem('relaxTime', DEFAULT_RELAX_TIME);
        break;
    }

    updateTimerDisplay();
  }
})();