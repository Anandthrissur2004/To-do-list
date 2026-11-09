const storageKey = "simple-todo-tasks";
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const filter = document.querySelector("#task-filter");
let tasks = JSON.parse(localStorage.getItem(storageKey) || "[]");

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function renderTasks() {
  list.replaceChildren();

  const visibleTasks = tasks.filter((task) => {
    return filter.value === "all" ||
      (filter.value === "completed" ? task.completed : !task.completed);
  });

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.classList.toggle("completed", task.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const status = document.createElement("small");
    status.className = "task-status";
    status.textContent = task.completed ? "Completed" : "Pending";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, status, deleteButton);
    list.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, completed: false });
  saveTasks();
  renderTasks();
  form.reset();
  input.focus();
});

filter.addEventListener("change", renderTasks);

renderTasks();
