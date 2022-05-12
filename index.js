//Selecting items
const alert = document.querySelector(".alert");
const todoform = document.querySelector(".todoform");
const todo = document.getElementById("todo");
const submit = document.querySelector(".submit");
const todoContainer = document.querySelector(".todo-container");
const todolist = document.querySelector(".todo-list");
const title = document.querySelector(".title");
const clear = document.querySelector(".clear");

//Edit options
let editElement;
let editFlag = false;
let editId;

//Displaying alert function
const displayALert = (text, action) => {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
};

const addToLocalStorage = (id, value) => {
    const todo = { id, value };
    let items = getLocalStorage();
    console.log(items);
    items.push(todo);
    localStorage.setItem('todolist', JSON.stringify(items));
};

const setBackDefault = () => {
    todo.value = "";
    editFlag = false;
    editId = "";
    submit.value = "submit";
};
const editLocalStorage = (id, value) => {
    let items = getLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value
        }
        return item;
    })
    localStorage.setItem('todolist', JSON.stringify(items));
}
const removeFromLocalStorage = (id) => {
    let items = getLocalStorage();
    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    })
    localStorage.setItem('todolist', JSON.stringify(items));
}
const getLocalStorage = () => {
    return localStorage.getItem('todolist') ? JSON.parse(localStorage.getItem('todolist')) : [];
}

//All functions
const addItem = (e) => {
    e.preventDefault();
    const value = todo.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createList(id, value);
        //Deleteing and editing
        const deleteBtn = document.querySelector(".delete");

        deleteBtn.addEventListener('click', deleteItem);
        const edit = document.querySelector(".edit");

        edit.addEventListener('click', editItem);
        //Display alert
        displayALert("Item added", "success");

        //Show todocontainer
        todoContainer.classList.add("show-container");



        //Add to localstorage
        addToLocalStorage(id, value);

        //Setback to default
        setBackDefault();
    } else if (value && editFlag === true) {
        editElement.innerHTML = value;
        displayALert('value changed', 'success');
        //Edit locastorage;
        editLocalStorage(editId, value);
        setBackDefault();

    } else {
        displayALert("please enter value", "danger");
    }
};

//Clear at all
const clearAll = () => {
    const items = document.querySelectorAll(".todo-item");
    if (items.length > 0) {
        items.forEach((item) => {
            todolist.removeChild(item);
        });
    }
    todoContainer.classList.remove("show-container");
    displayALert("empty lsit", "danger");
    setBackDefault();
    localStorage.removeItem('todolist');
};
//Delteing item
const deleteItem = (e) => {
    const elem = e.currentTarget.parentElement.parentElement;
    const id = elem.dataset.id;
    todolist.removeChild(elem);
    //if no todo then remove todocontainer
    if (todolist.children.length === 0) {
        todoContainer.classList.remove('show-container');
    }
    displayALert('item removed', 'danger');
    setBackDefault();
    removeFromLocalStorage(id);
};
//Editing functions
const editItem = (e) => {
    const elem = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    todo.value = editElement.innerHTML;
    editFlag = true;
    editId = elem.dataset.id;
    submit.value = 'Edit';
};


//Add Eventlistener
todoform.addEventListener("submit", addItem);
clear.addEventListener("click", clearAll);
//load items
window.addEventListener('DOMContentLoaded', () => {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach((item) => {
            createList(item.id, item.value);
        })
    }
    todoContainer.classList.add('show-container')
})

const createList = (id, value) => {
    const element = document.createElement("div");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);

    element.classList.add("todo-item");
    element.innerHTML = `
            <p class="title">${value}</p>
            <div class="button-group">
                <div class="delete">
                <ion-icon name="trash-outline"></ion-icon>
                </div>
                <div class="edit">
                <ion-icon  name="create-outline"></ion-icon>
                </div>
                
            </div>
        `;

    //appendchild
    todolist.appendChild(element);

}