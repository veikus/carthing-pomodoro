(() => {
  const CONFIG_BUTTON = 'Enter';
  const SKIP_BUTTON = 'Escape';
  const RESET_BUTTON = '1';

  let DEFAULT_FOCUS_TIME = parseInt(localStorage.getItem('focusTime'), 10) || 20 * 60;
  let DEFAULT_RELAX_TIME = parseInt(localStorage.getItem('relaxTime'), 10) || 5 * 60;
  let collectedPomodoros = parseInt(localStorage.getItem('collectedPomodoros'), 10) || 0;

  let isConfiguring = false;
  let currentState = 'focus'; // focus, relax
  let isTimerRunning = false;
  let timeLeft = DEFAULT_FOCUS_TIME;

  const configModeLabel = document.getElementById('config-mode-label');
  const timerDisplay = document.getElementById('timer');

  function updateTimerDisplay() {
    let value = timeLeft;
    if (isConfiguring) {
      if (currentState === 'focus') {
        value = DEFAULT_FOCUS_TIME;
      } else {
        value = DEFAULT_RELAX_TIME
      }
    }

    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
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

    isTimerRunning = false;
    updateTimerDisplay();
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
        isTimerRunning = false;
        toggleState();
      }

      updateTimerDisplay();
    }
  }

  updateTimerDisplay();
  updatePomodorosDisplay();
  setInterval(() => {
    tick();
  }, 1000);

  document.addEventListener('click', (e) => {
    if (isConfiguring) {
      return;
    }

    isTimerRunning = !isTimerRunning;
    updateTimerDisplay();
  });

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case CONFIG_BUTTON:
        if (isTimerRunning) {
          const confirmed = confirm('This will stop the timer. Are you sure?');
          if (!confirmed) {
            return;
          }
        }

        isTimerRunning = false;
        isConfiguring = !isConfiguring;
        configModeLabel.style.display = isConfiguring ? 'block' : 'none';
        break;

      case SKIP_BUTTON:
        if (isTimerRunning) {
          const confirmed = confirm('This will stop the timer. Are you sure?');
          if (!confirmed) {
            return;
          }
        }

        toggleState();
        break;

      case RESET_BUTTON:
        collectedPomodoros = 0;
        updatePomodorosDisplay();
        localStorage.setItem('collectedPomodoros', collectedPomodoros);
        break;
    }

    updateTimerDisplay();
  });

  document.addEventListener('wheel', (e) => {
    if (!isConfiguring) {
      return;
    }

    const isUp = e.deltaX > 0;
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
  });
})();