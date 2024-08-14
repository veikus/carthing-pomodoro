(() => {
  // const root = document.getElementById('root');
  // root.innerHTML = '<p>Press any key 2</p><a onclick="window.location.reload()">Reload 2</a>';
  // document.addEventListener('keydown', (e) => {
  //   root.innerHTML = `<p>${e.key} ${e.keyCode}</p><a onclick="window.location.reload()">Reload 2</a>`;
  // });
  //
  // document.addEventListener('wheel', (e) => {
  //   console.log(e);
  //   root.innerHTML = `scrolling... ${e.deltaX} ${e.deltaY}`;
  // });

  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');

  let timeLeft = 25 * 60; // 25 минут в секундах
  let timerInterval;

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          alert('Time is up! Take a break.');
        }
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
  }

  startBtn.addEventListener('click', startTimer);
  resetBtn.addEventListener('click', resetTimer);

  updateTimerDisplay();
})();