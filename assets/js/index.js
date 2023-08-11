const addBtn = document.querySelector('.todo-list__main_header-btn');
const taskList = document.querySelector('.todo-list__main-list-content');
const taskInput = document.querySelector('.todo-list__main_header-input');

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  let tasksCompletedCounter = 0;
  tasks.forEach(task => {
    createTask(task.text, task.id, task.completed);

    if (task.completed) {
      tasksCompletedCounter++;
    }
  });

  if (tasks.length == 0) {
    addInfoTag();
  }

  updateHeaderCounter(tasks.length, tasksCompletedCounter);
}

function createTask(taskText, id = 0, completed = false) {
  const newTask = document.createElement('li');
  newTask.classList.add('todo-list__main-list-content--item');
  newTask.id = id;
  if (completed) {
    newTask.classList.add('completed');
  }

  newTask.innerHTML = `
    <div class="main__list-content_item-body">
      <input type="checkbox" ${completed ? 'checked' : ''}>
      <p>${taskText}</p>
    </div>
    <button class="main__list-content_item-buttons--delete">
      <img src="./assets/imgs/trash.svg" alt="">
    </button>
  `;

  const checkbox = newTask.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    newTask.classList.toggle('completed');
  });

  const deleteBtn = newTask.querySelector('.main__list-content_item-buttons--delete');
  deleteBtn.addEventListener('click', () => {
    newTask.remove();

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => Number(task.id) !== Number(newTask.id));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    updateLocalStorage();
  });

  taskList.appendChild(newTask);
}

function addTask() {
  const taskText = taskInput.value;
  
  if (taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const lastTaskId = tasks.length ? Number(tasks[tasks.length - 1].id) : 0;

    createTask(taskText, lastTaskId + 1);
    updateLocalStorage();

    taskInput.value = '';
  }
}

function updateLocalStorage() {
  console.log('oi');

  const tasks = [];
  const items = document.querySelectorAll('.todo-list__main-list-content--item');

  let counterTasksCompleted = 0;

  items.forEach((item) => {
    const taskText = item.querySelector('p').textContent;
    const completed = item.classList.contains('completed');
    const id = Number(item.id);

    if (completed) {
      counterTasksCompleted++;
    }

    tasks.push({ id, text: taskText, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  });

  if (items.length === 0) {
    addInfoTag();
    updateHeaderCounter(items.length, counterTasksCompleted);
  } else {
    const info = document.querySelector('.todo-list__main-list-content--text');

    if (info) {
      info.remove();
    }

    updateHeaderCounter(items.length, counterTasksCompleted);
  }
}

function addInfoTag() {
  const info = document.createElement('div');
  info.classList.add('todo-list__main-list-content--text');

  info.innerHTML = `
    <span class="todo-list__main-list-content--text-info">
      Você ainda não tem tarefas cadastradas
    </span>

    <span class="todo-list__main-list-content--text-desc">
      Crie tarefas e organize seus itens a fazer
    </span>
  `;

  taskList.appendChild(info);
}

function updateHeaderCounter(tasksLength, tasksCompleted) {
  const headerListLengthTag = document.querySelector('[data-number="length"]');
  const headerListCounterTag = document.querySelector('[data-number="counter"]');

  headerListLengthTag.textContent = tasksLength;
  headerListCounterTag.textContent = `${tasksCompleted} de ${tasksLength}`
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});
taskList.addEventListener('change', updateLocalStorage);

window.addEventListener('load', loadTasks);
