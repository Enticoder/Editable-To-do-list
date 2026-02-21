const taskInput = document.getElementById("task");
const addTaskBtn = document.getElementById("add-task-btn");
const taskContainer = document.getElementById("tasks-container");

document.addEventListener("DOMContentLoaded", loadTasks);
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskTextValue = taskInput.value.trim();
  if (taskTextValue === "") return;

  const taskObj = {
    id: Date.now(),
    text: taskTextValue,
    completed: false,
  };

  createTaskElement(taskObj);
  saveTask(taskObj);
  taskInput.value = "";
}

function createTaskElement(taskObj) {
  const todoWrapper = document.createElement("div");
  todoWrapper.classList.add("todo-container");
  todoWrapper.dataset.id = taskObj.id;

  // Left section (checkbox + text)
  const leftWrapper = document.createElement("div");
  leftWrapper.classList.add("todo-left");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = taskObj.completed;

  const taskText = document.createElement("p");
  taskText.classList.add("task-text");
  taskText.textContent = taskObj.text;

  if (taskObj.completed) {
    taskText.style.textDecoration = "line-through";
    taskText.style.opacity = "0.6";
  }

  checkbox.addEventListener("change", () => {
    taskObj.completed = checkbox.checked;
    updateTask(taskObj);
    taskText.style.textDecoration = taskObj.completed ? "line-through" : "none";
    taskText.style.opacity = taskObj.completed ? "0.6" : "1";
  });

  leftWrapper.append(checkbox, taskText);

  // Right section (icon buttons)
  const actionsWrapper = document.createElement("div");
  actionsWrapper.classList.add("todo-actions");

  const editButton = document.createElement("button");
  editButton.classList.add("icon-btn");
  editButton.innerHTML = `<img src="images/pencil1.png" alt="Edit" class="edit-icon">`;
  editButton.title = "Edit task";
  editButton.addEventListener("click", () => {
    const newText = prompt("Edit your task:", taskText.textContent);
    if (newText !== null && newText.trim() !== "") {
      taskText.textContent = newText;
      taskObj.text = newText;
      updateTask(taskObj);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("icon-btn");
  deleteButton.innerHTML = `<img src="images/trash-can-color-icon.svg" alt="Delete" class="delete-icon">`;  deleteButton.title = "Delete task";
  deleteButton.addEventListener("click", () => {
    todoWrapper.remove();
    deleteTask(taskObj.id);
  });

  actionsWrapper.append(editButton, deleteButton);
  todoWrapper.append(leftWrapper, actionsWrapper);
  taskContainer.append(todoWrapper);
}

// LocalStorage functions
function saveTask(taskObj) {
  const tasks = getTasksFromStorage();
  tasks.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasksFromStorage();
  tasks.forEach((task) => createTaskElement(task));
}

function updateTask(updatedTask) {
  let tasks = getTasksFromStorage();
  tasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskId) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}