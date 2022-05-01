// Seletores
const itemInput = document.querySelector('.item-input');
const itemButton = document.querySelector('.item-button');
const itemList = document.querySelector('.item-list');
const totalList = document.querySelector('.total-items');
const qtdItems = document.querySelector('.qtd-items');
const select = document.querySelector('#list');

// Events
document.addEventListener('DOMContentLoaded', verifySelect());

itemButton.addEventListener('click', addItem);
itemList.addEventListener('click', deleteCheck);

select.addEventListener('change', verifySelect);

// Functions

function verifySelect() {

    if (select.options[select.selectedIndex].text === 'TODOS') {
        clearList();
        getAllItems();
    } else if (select.options[select.selectedIndex].text === 'COMPRADOS') {
        clearList();
        getPurchasedItems();
    } else if (select.options[select.selectedIndex].text === 'PENDENTES') {
        clearList();
        getPendingItems();
    }

}

function clearList() {
    let listDivs = document.getElementsByClassName('item');
    let items = verifyLocalStorage();

    Array.prototype.forEach.call(items, item => {
        Array.prototype.forEach.call(listDivs, div => {
            if (div.id === item.id) {
                div.remove();
            }
        });
    });

}

function getAllItems() {
    let items = verifyLocalStorage();

    items.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.id = item.id;

        // Create li
        const newTodo = document.createElement('li');
        newTodo.innerText = item.name;
        newTodo.classList.add('div-item');

        itemDiv.appendChild(newTodo);

        // Creating mark button
        createMarkButton(itemDiv);

        if (item.purchased === true) {
            itemDiv.classList.toggle('completed');
        }

        // Creating trash button
        createTrashButton(itemDiv);

        // Append to list
        itemList.appendChild(itemDiv);
    })
    // Redefinindo totalizadores da lista
    updateTotals();

}

function getPurchasedItems() {
    let items = verifyLocalStorage();

    items.forEach((item) => {

        if (item.purchased === true) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.id = item.id;

            // Create li
            const newTodo = document.createElement('li');
            newTodo.innerText = item.name;
            newTodo.classList.add('div-item');

            itemDiv.appendChild(newTodo);

            // Creating mark button
            createMarkButton(itemDiv);

            if (item.purchased === true) {
                itemDiv.classList.toggle('completed');
            }
            // Creating trash button
            createTrashButton(itemDiv);

            // Append to list
            itemList.appendChild(itemDiv);
        }
    })

    // Redefinindo totalizadores da lista
    updateTotals();

}

function getPendingItems() {
    let items = verifyLocalStorage();

    items.forEach((item) => {

        if (item.purchased === false) {
            // Creating Todo Div
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.id = item.id;

            // Create li
            const newTodo = document.createElement('li');
            newTodo.innerText = item.name;
            newTodo.classList.add('div-item');

            itemDiv.appendChild(newTodo);

            // Creating mark button
            createMarkButton(itemDiv);

            if (item.purchased === true) {
                itemDiv.classList.toggle('completed');
            }

            // Creating trash button
            createTrashButton(itemDiv);

            // Append to list
            itemList.appendChild(itemDiv);
        }
    })

    // Redefinindo totalizadores da lista
    updateTotals();

}

//calculo de todos os itens
function calculateTotalItemsAmount() {
    const items = verifyLocalStorage();
    const total = items.reduce((total, item) => total + parseFloat(item.value), 0)
    totalList.innerText = "Total R$ " + JSON.stringify(total);
}

function calculateTotalItemsQtd() {
    const items = verifyLocalStorage();
    const total = parseInt(items.length);
    qtdItems.innerText = "Qtde itens: " + JSON.stringify(total);
}

//calculo dos itens purchaseds
function calculateTotalPurchasedItemsAmount() {
    const items = verifyLocalStorage();
    const total = items.reduce(function (total, item) {
        if (item.purchased === true) {
            total += parseFloat(item.value);
        }
        return total;
    }, 0)

    totalList.innerText = "Total R$ " + JSON.stringify(total);
}

function calculateTotalPurchasedItemsQtd() {
    const items = verifyLocalStorage();
    const total = items.reduce(function (total, item) {
        if (item.purchased === true) {
            total += 1;
        }
        return total;
    }, 0)

    qtdItems.innerText = "Qtde itens: " + JSON.stringify(total);
}

//calculo dos itens pendentes
function calculateTotalPendingItemsAmount() {
    const items = verifyLocalStorage();
    const total = items.reduce(function (total, item) {
        if (item.purchased === false) {
            total += parseFloat(item.value);
        }
        return total;
    }, 0)
    totalList.innerText = "Total R$ " + JSON.stringify(total);
}

function calculateTotalPendingItemsQtd() {
    const items = verifyLocalStorage();
    const total = items.reduce(function (total, item) {
        if (item.purchased === false) {
            total += 1;
        }
        return total;
    }, 0)
    qtdItems.innerText = "Qtde itens: " + JSON.stringify(total);
}

function verifyLocalStorage() {
    let items;

    if (localStorage.getItem('items') === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
}

function saveLocalItems(item) {
    let items = verifyLocalStorage();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function addItem(event) {

    // Prevent formu submitting
    event.preventDefault()

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    // Create li
    const newTodo = document.createElement('li');
    itemDiv.id = generateId();
    const itemName = itemInput.value;

    while (itemInput.value.length < 1 || itemInput.value.trim() == '') {
        alert('Campo de nome do produto não pode ser vazio, favor tentar novamente.')
        return;
    }

    let itemValue = prompt("Inserir valor do item:");
    while (!isNumber(itemValue)) {
        alert('Valor informado inválido, favor tentar novamente.')
        return;
    }

    const item = {
        id: itemDiv.id,
        name: itemName,
        value: itemValue,
        purchased: false
    }

    newTodo.innerText = item.name;

    newTodo.classList.add('div-item');

    itemDiv.appendChild(newTodo)

    if (select.options[select.selectedIndex].text === 'COMPRADOS') {
        itemDiv.classList.toggle('completed');
        item.purchased = true;
    }

    saveLocalItems(item);

    // Definindo totalizadores da lista
    updateTotals()

    // Creating mark button
    createMarkButton(itemDiv);

    // Creating trash button
    createTrashButton(itemDiv);

    // Append to list
    itemList.appendChild(itemDiv);

    // Clear Item Input Value
    itemInput.value = '';

}

function generateId() {
    let id;

    if (localStorage.getItem('id') === null) {
        id = 0;
        localStorage.setItem('id', JSON.stringify(id));
        return id;
    } else {
        id = JSON.parse(localStorage.getItem('id'));
    }
    id += 1;
    localStorage.setItem('id', JSON.stringify(id));
    return parseInt(id);
}

function removeLocalItems(divItem) {

    let items = verifyLocalStorage();

        Array.prototype.forEach.call(items, item => {
            if (divItem.id === item.id) {
                items.splice(items.indexOf(item), 1);
            }
    });

    // Atualiza o array no localStorage
    localStorage.setItem('items', JSON.stringify(items));

}

function deleteCheck(event) {

    const button = event.target;

    // Delete
    if (button.classList[0] === "trash-btn") {
        const divItem = button.parentElement;

        removeLocalItems(divItem);

        // Redefinindo totalizadores da lista
        updateTotals();
        divItem.remove()
    }

    // Check Mark
    if (button.classList[0] === "complete-btn") {
        const divItem = button.parentElement;
        divItem.classList.toggle('completed');
        changeItemStatusById(divItem.id);
    }

    if (button.classList[0] === "completed") {
        const divItem = button.parentElement;
        divItem.classList.toggle('complete-btn');
        changeItemStatusById(divItem.id);
    }

}

function updateTotals() {
    if (select.options[select.selectedIndex].text === 'TODOS') {
        calculateTotalItemsAmount();
        calculateTotalItemsQtd();
    } else if (select.options[select.selectedIndex].text === 'COMPRADOS') {
        calculateTotalPurchasedItemsAmount();
        calculateTotalPurchasedItemsQtd();
    } else if (select.options[select.selectedIndex].text === 'PENDENTES') {
        calculateTotalPendingItemsAmount();
        calculateTotalPendingItemsQtd();
    }
}

function changeItemStatusById(id) {

    const items = verifyLocalStorage();

    items.forEach((item) => {
        if (item.id == id) {
            if (item.purchased == false) {
                item.purchased = true;
            } else {
                item.purchased = false;
            }
        }
    })
    // Atualiza o array no localStorage
    localStorage.setItem('items', JSON.stringify(items));
}

function createMarkButton(itemDiv) {
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.classList.add('complete-btn');
    itemDiv.appendChild(completeButton);
}

function createTrashButton(itemDiv) {
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    itemDiv.appendChild(trashButton)
}

//Dark and light mode

// Seletores
const body = document.querySelector('#container-principal');
const button = document.querySelector('#mode-selector');

const darkModeClass = 'dark-mode';

// Eventos
button.addEventListener('click', changeMode);

function changeMode() {
    changeClasses();
    changeText();
}

function changeClasses() {
    body.classList.toggle(darkModeClass);
    button.classList.toggle(darkModeClass);
}

function changeText() {
    const lightMode = 'Tema claro';
    const darkMode = 'Tema escuro';

    if (body.classList.contains(darkModeClass)) {
        button.innerHTML = lightMode;
        return;
    }

    button.innerHTML = darkMode;
}