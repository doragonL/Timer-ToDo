// ==========================
// 🔔 通知の許可リクエスト
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  // ⌨️ Enterキーでタスク追加
  document.getElementById('taskInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });
});

// ==========================
// ✅ ToDo追加機能
// ==========================
function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();

  if (taskText === '') {
    alert('タスクを入力してください');
    return;
  }

  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');

  // チェックボックス
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  // タスク内容
  const span = document.createElement('span');
  span.textContent = taskText;

  li.appendChild(checkbox);
  li.appendChild(span);
  taskList.appendChild(li);

  input.value = ''; // 入力欄リセット
}

// ==========================
// ✅ 通知を送る関数
// ==========================
function notifyEnd(type) {
  if (Notification.permission === 'granted') {
    new Notification(`${type}の時間が終了しました！`);
  }
}

// ==========================
// 🔊 音を鳴らす関数
// ==========================
function playSound() {
  const sound = document.getElementById('endSound');
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// ==========================
// ⏱ タイマー機能
// ==========================
let isFocus = true;
let timer;
let remainingSeconds = 0;

function startTimer() {
  const focusMinutes = parseInt(document.getElementById('focusMinutes').value) || 0;
  const focusSeconds = parseInt(document.getElementById('focusSeconds').value) || 0;
  const breakMinutes = parseInt(document.getElementById('breakMinutes').value) || 0;
  const breakSeconds = parseInt(document.getElementById('breakSeconds').value) || 0;

  const focusTime = focusMinutes * 60 + focusSeconds;
  const breakTime = breakMinutes * 60 + breakSeconds;

  remainingSeconds = isFocus ? focusTime : breakTime;

  clearInterval(timer);
  timer = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timer);

      notifyEnd(isFocus ? "休憩" : "集中");
      playSound();

      isFocus = !isFocus;
      startTimer(); // 自動で次へ
    } else {
      remainingSeconds--;
      updateTimerDisplay();
    }
  }, 1000);

  updateTimerDisplay();
}

// ==========================
// ⌛ 表示更新
// ==========================
function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const display = document.getElementById('timerDisplay');

  if (display) {
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}


