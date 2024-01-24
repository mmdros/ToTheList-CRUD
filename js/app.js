const formCreate = document.getElementById("form-create");
const formEdit = document.getElementById("form-edit");
const listGroupTodo = document.getElementById("list-group-todo");
// const messageCreate = document.getElementById('message-create')
const time = document.getElementById("time");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
/* time elements */
const fullDay = document.getElementById("full-day");
const hourEl = document.getElementById("hour");

const closeEl = document.getElementById("close");

const key = "c9742d46ff424d849bfa19756194a886";
const urlApi = `https://crudcrud.com/api/${key}/tasks`;

// check

async function postTask(task) {
  try {
    const response = await fetch(urlApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      getAll();
      return;
    }
  } catch (error) {
    showMessage(
      "message-create",
      "Please check communication with the api crud-crud"
    );
    throw error;
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`${urlApi}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      getAll();
      return;
    }
  } catch (error) {
    showMessage(
      "message-create",
      "Please check communication with the api crud-crud"
    );
    throw error;
  }
}

async function editTask(id, task) {
  try {
    const response = await fetch(`${urlApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      close();
      getAll();
    }
  } catch (error) {}
}

async function getAll() {
  try {
    const response = await fetch(urlApi);
    if (response.ok) {
      const dataResponse = await response.json();
      listGroupTodo.innerHTML = "";
      dataResponse.forEach((item, i) => {
        const id = item._id;
        listGroupTodo.innerHTML += `<li ondblclick="setCompleted(${i})" class="list-group-item d-flex justify-content-between ${
          item.completed == true ? "completed" : ""
        }">${item.task}
              <div class="todo-icons"><span class="opacity-50 me-2">${
                item.time
              }</span>
              <img onclick=(openModal('${id}')) src="./images/edit.svg" alt="edit icon" class="edit-icon" width="25" height="25">
              <img onclick=(deleteTask('${id}')) src="./images/delete.svg" alt="delete icon" class="delete-icon" width="25" height="25">
              </div>
          </li>`;
      });
    }
  } catch (error) {
    showMessage(
      "message-create",
      "Please check communication with the api crud-crud"
    );
  }
}

async function findById(id) {
  try {
    const response = await fetch(`${urlApi}/${id}`);

    if (response.ok) {
      const dataResponse = await response.json();
      return dataResponse;
    }
  } catch (error) {
    throw error;
  }
}

getAll();

//show time
function getTime() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString();

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Novembro",
    "Dezembro",
  ];

  const monthtitle = now.getMonth();

  fullDay.textContent = `${date.substring(0, 2)} ${
    months[monthtitle]
  } ${date.substring(8, 10)}`;

  hourEl.textContent = `${time}`;
  fullDay.style.color = "#bcd";
  hourEl.style.color = "#bcd";
  return `${time}, ${date}`;
}

setInterval(getTime, 500);

// show error
function showMessage(where, message) {
  document.getElementById(`${where}`).textContent = message;

  setTimeout(() => {
    document.getElementById(`${where}`).textContent = "";
  }, 2500);
}

formCreate.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoText = formCreate["input-create"].value.trim();
  formCreate.reset();
  if (todoText.length) {
    postTask({ task: todoText, time: getTime() });
    getAll();
  } else {
    showMessage("message-create", "Please enter some todo...");
  }
});

async function openModal(id) {
  const tasks = await findById(id);
  const inputEdit = formEdit["input-edit"];
  inputEdit.value = tasks.task;
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");

  formEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoText = formEdit["input-edit"].value.trim();

    formEdit.reset();
    if (todoText) {
      editTask(id, { task: todoText, time: getTime() });
    } else {
      showMessage("message-edit", "Please enter some todo...");
    }
  });
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

overlay.addEventListener("click", close);
closeEl.addEventListener("click", close);

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    close();
  }
});
