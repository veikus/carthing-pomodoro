(() => {
  const START_BUTTON = 'Enter'; // Works same way as clicking on the screen
  const SKIP_BUTTON = 'Escape';
  const RESET_BUTTON = '1';

  let DEFAULT_FOCUS_TIME = parseInt(localStorage.getItem('focusTime'), 10) || 20 * 60;
  let DEFAULT_RELAX_TIME = parseInt(localStorage.getItem('relaxTime'), 10) || 5 * 60;
  let collectedPomodoros = parseInt(localStorage.getItem('collectedPomodoros'), 10) || 0;

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
    }
  });

  document.addEventListener('wheel', (e) => {
    const isUp = e.deltaX > 0;
    changeTimeSettings(isUp);
  });

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function updatePomodorosDisplay() {
    let str = '';
    for (let i = 0; i < collectedPomodoros; i++) {
      str += '🍅';
    }

    const pomodorosDisplay = document.getElementById('pomodoros');
    pomodorosDisplay.textContent = str || 'Collect your first pomodoro!'
  }

  function tick() {
    if (isTimerRunning) {
      timeLeft--;

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
    updatePomodorosDisplay();
    localStorage.setItem('collectedPomodoros', collectedPomodoros);
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