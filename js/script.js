let switchOut = document.getElementById('switchOut');
let switchIn = document.getElementById('switchIn');
let switchToggle = document.querySelector('input#switchToggle');

let taskList = document.getElementById('taskList');
const masterList = document.querySelector('#masterList');
masterList.showModal();
const inputList = document.querySelector('#inputList');

const groupLists = JSON.parse(localStorage.getItem('lists')) || {};
let currentList = '';

taskList.addEventListener('click', onListsClick);
masterList.addEventListener('click', onListsClick);

function onListsClick(event, EnterClick) {
    const btn = event.target;
    const ir = btn.closest('.itemRow');

    if (btn.closest('.completeCheckbox')) {
        const itemName = ir.querySelector('.itemName');

        itemName.classList.toggle('isComplete');
        saveTasks();
    }

    if(btn.closest('.removeItem')) {
        delete groupLists[ir.dataset.id]
        ir.remove();
        saveTasks();
    }

    if(btn.closest('.editItem')) {
        const p = ir.querySelector('p');
        let newTxt = prompt(`Editar tarefa: ${p.textContent}`);

        if(newTxt !== null && newTxt.trim()) {
            while (newTxt.length > 40) {
                newTxt = prompt('[ERRO] O nome deve ter no máximo 40 caracteres');
                if (!newTxt || !newTxt.trim()) {
                    return;
                }
            }
            let listName = newTxt;
            let c = 1;
            if (ir.dataset.id) {
                while (groupLists[newTxt]) {
                    newTxt = `${listName} (${c})`;
                    c++
                }

                groupLists[newTxt] = groupLists[ir.dataset.id];
                delete groupLists[ir.dataset.id];
                ir.dataset.id = newTxt;
            }
            p.textContent = newTxt;
            saveTasks();
        }
    }

    if (btn.closest('.addList') || EnterClick) {
        let listName = inputList.value;
        let c = 1;
        while (groupLists[listName]) {
            listName = `${inputList.value} (${c})`;
            c++
        }

        if (inputList.value.trim()) {
            groupLists[listName] = [];
        }

        addRow(listName, false, false)
    }

    if (btn.closest('.selectList')) {
        let currentListTxt = document.querySelector('#currentListTxt');

        currentList = ir.dataset.id;
        currentListTxt.textContent = `Lista atual: ${currentList}`;
        masterList.close();
        loadTasks();
    }
}

const saveTasks = () => {
    let tasks = [];

    if (groupLists[currentList]) {
        document.querySelectorAll('[data-task]').forEach(ir => {
            let txt = ir.querySelector('p').textContent;
            let checked = ir.querySelector('input.completeCheckbox').checked;

            tasks.push({
                task: txt,
                isCheck: checked
            });
        });
        groupLists[currentList] = tasks;
    }

    localStorage.setItem('lists', JSON.stringify(groupLists));
}

const loadTasks = () => {
    document.querySelectorAll('[data-task]').forEach(ir => {
        ir.remove();
    })

    groupLists[currentList].forEach((taskObj) => {
        addRow(taskObj.task, taskObj.isCheck);
    })
}

const loadLists = () => {
    let lists = JSON.parse(localStorage.getItem('lists')) || {};

    Object.keys(lists).forEach((taskObj) => {
        addRow(taskObj, false, false);
    });
}

document.getElementById('openListsMenu').addEventListener('click', () => {
    masterList.showModal();
})

const darkMode = (on) => {
    switchToggle.checked = on;
    document.body.classList.toggle('dark', on);

    if (on) {
        switchIn.style.transform = 'translateX(30px)';
        switchIn.innerHTML = '<i class="fa-solid fa-moon"></i>'
    } else {
        switchIn.style.transform = 'translateX(0)';
        switchIn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

const switchOnOff = () => {
    const currentState = switchToggle.checked;
    const newState = !currentState;
    darkMode(newState);
    localStorage.setItem('isDarkMode', newState);
}

switchOut.addEventListener('click', switchOnOff);

const addRow = (txt = null, isCheck = false, isListRow = true) => {
    let inputTask = document.querySelector('input#inputTask');
    let item = txt || inputTask.value;
    
    if (!item.trim()) {
        if (isListRow) {
            document.querySelectorAll('.error')[0].style.display = 'block';
        } else {
            document.querySelectorAll('.error')[1].style.display = 'block';
        }
        
        return;
    }
    document.querySelectorAll('.error')[0].style.display = 'none';
    document.querySelectorAll('.error')[1].style.display = 'none';

    let itemRow = document.createElement('div');
    let itemName = document.createElement('div');
    let itemControl = document.createElement('div');
    let itemEdit = document.createElement('div');

    itemRow.classList.add('itemRow');
    itemName.classList.add('itemName');
    itemControl.classList.add('itemControl');
    itemEdit.classList.add('itemEdit');

    let p = document.createElement('p');
    p.textContent = item;

    let btnEdit = createButton('edit');
    let btnRemove = createButton('remove');

    itemName.appendChild(p);
    itemEdit.appendChild(btnEdit);
    itemEdit.appendChild(btnRemove);

    if (isListRow) {
        let checkbox = createButton('checkbox', itemName, isCheck);

        let preview = item.length > 8? 
        item.slice(0, 8) + '...': 
        item;
        itemRow.dataset.task = preview;

        taskList.appendChild(itemRow);
        itemRow.appendChild(itemName);
        itemControl.appendChild(checkbox);
        itemRow.appendChild(itemControl);

        inputTask.value = '';
        inputTask.focus();
    } else {
        let selectButton = createButton('select');

        itemRow.dataset.id = item;

        masterList.appendChild(itemRow);
        itemRow.appendChild(itemName);
        itemControl.appendChild(selectButton);
        itemRow.appendChild(itemControl);

        inputList.value = '';
        inputList.focus();
    }

    itemRow.appendChild(itemEdit);
    saveTasks();
}

const createButton = (btnType, itemName, isCheck) => {
    if (btnType === 'checkbox') {
        let checkbox = document.createElement('input');
        checkbox.classList.add('completeCheckbox');
        checkbox.name = 'completeCheckbox';
        checkbox.type = 'checkbox';

        checkbox.checked = isCheck;

        if (isCheck) {
            itemName.classList.add('isComplete');
        }

        return checkbox;
    }

    let btn = document.createElement('button');
    switch (btnType) {
        case 'remove':
            btn.classList.add('removeItem', 'listButton');
            btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            break;

        case 'edit':
            btn.classList.add('editItem', 'listButton');
            btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            break;
        
        case 'select':
            btn.classList.add('selectList', 'listButton');
            btn.textContent = 'Escolher';
    }
    return btn;
}

document.getElementById('addTask').addEventListener('click', () => addRow(null, false));
document.querySelector('input#inputTask').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addRow(null, false);
    }
})

inputList.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        onListsClick(event, true);
    }
})

let isDark = localStorage.getItem('isDarkMode') === 'true';
darkMode(isDark);
loadLists();