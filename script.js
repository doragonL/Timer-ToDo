// =============================
// 🔔 通知の許可リクエスト & タスク入力
// =============================
document.addEventListener('DOMContentLoaded', () => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
  document.getElementById('taskInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  loadTasks();
});

// =============================
// 📋 タスク追加・削除・保存
// =============================
function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('taskPriority').value;
  const taskText = input.value.trim();

  if (taskText === '') return;

  const task = {
    id: Date.now(),
    text: taskText,
    priority: priority,
    done: false
  };
  saveTask(task);
  renderTask(task);
  input.value = '';
}

function renderTask(task) {
  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.className = `priority-${task.priority}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    updateTask(task);
  });

  const span = document.createElement('span');
  span.textContent = task.text;

  const del = document.createElement('button');
  del.textContent = '❌';
  del.addEventListener('click', () => {
    deleteTask(task.id);
    li.remove();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);
  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.forEach(renderTask);
}

function updateTask(updatedTask) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const newTasks = tasks.map(task =>
    task.id === updatedTask.id ? updatedTask : task
  );
  localStorage.setItem('tasks', JSON.stringify(newTasks));
}

function deleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const newTasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(newTasks));
}

// =============================
// ⏱ タイマー機能 + 一時停止
// =============================
let isFocus = true;
let timer = null;
let remainingSeconds = 0;
let paused = false;

function startTimer() {
  if (paused) {
    paused = false;
    runTimer();
    return;
  }
  const focusMinutes = parseInt(document.getElementById('focusMinutes').value) || 0;
  const focusSeconds = parseInt(document.getElementById('focusSeconds').value) || 0;
  const breakMinutes = parseInt(document.getElementById('breakMinutes').value) || 0;
  const breakSeconds = parseInt(document.getElementById('breakSeconds').value) || 0;

  const focusTime = focusMinutes * 60 + focusSeconds;
  const breakTime = breakMinutes * 60 + breakSeconds;
  remainingSeconds = isFocus ? focusTime : breakTime;
  runTimer();
}

function runTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timer);
      notifyEnd(isFocus ? '休憩' : '集中');
      playSound();
      isFocus = !isFocus;
      startTimer();
    } else {
      remainingSeconds--;
      updateTimerDisplay();
    }
  }, 1000);
  updateTimerDisplay();
}

function pauseTimer() {
  paused = true;
  clearInterval(timer);
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const display = document.getElementById('timerDisplay');
  if (display) {
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

// =============================
// 🔔 通知と音
// =============================
function notifyEnd(type) {
  if (Notification.permission === 'granted') {
    new Notification(`${type}の時間が終了しました！`);
  }
}

function playSound() {
  const sound = document.getElementById('endSound');
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}



