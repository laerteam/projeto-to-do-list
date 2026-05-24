let switchOut = document.getElementById('switchOut');
let switchIn = document.getElementById('switchIn');
let switchToggle = document.querySelector('input#switchToggle');
let list = document.getElementById('list');

list.addEventListener('click', onListClick);

function onListClick(event) {
    const btn = event.target;
    const tr = btn.closest('.itemRow');

    if (btn.closest('.completeCheckbox')) {
        const tn = tr.querySelector('.itemName');

        tn.classList.toggle('isComplete');
        saveTasks();
    }

    if(btn.closest('.removeItem')) {
        tr.remove();
        saveTasks();
    }

    if(btn.closest('.editItem')) {
        const tn = tr.querySelector('.itemName');
        const p = tn.querySelector('p');
        const newTxt = prompt(`Editar tarefa: ${p.textContent}`);

        if(newTxt !== null && newTxt.trim()) {
            p.textContent = newTxt;
            saveTasks();
        }
    }
}

const saveTasks = () => {
    let tasks = [];

    document.querySelectorAll('.itemRow').forEach(tr => {
        let txt = tr.querySelector('p').textContent;
        let checked = tr.querySelector('input.completeCheckbox').checked;

        tasks.push({
            task: txt,
            isCheck: checked
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const loadTasks = () => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    let isDark = localStorage.getItem('isDarkMode') === 'true';
    darkMode(isDark);

    tasks.forEach((taskObj) => {
        addRow(taskObj.task, taskObj.isCheck);
    });
}

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

const addRow = (txt = null, isCheck = false) => {
    let inputTask = document.querySelector('input#inputTask');
    let item = txt || inputTask.value;
    
    if (!item.trim()) {
        alert('[ERRO] É necessário digitar um valor antes de adiciona-lo.');
        inputTask.value = '';
        return;
    }

    let itemRow = document.createElement('div');
    let itemName = document.createElement('div');
    let itemControl = document.createElement('div');
    let itemEdit = document.createElement('div');

    itemRow.classList.add('itemRow');
    itemName.classList.add('itemName');
    itemControl.classList.add('itemControl');
    itemEdit.classList.add('itemEdit');

    let preview = item.length > 30? 
    item.slice(0, 30) + '...': 
    item;
    itemRow.dataset.task = preview;

    let p = document.createElement('p');
    p.textContent = item;

    let checkbox = createButton('checkbox', itemName, isCheck);
    let btnEdit = createButton('edit');
    let btnRemove = createButton('remove');

    itemName.appendChild(p);
    itemControl.appendChild(checkbox);
    itemEdit.appendChild(btnEdit);
    itemEdit.appendChild(btnRemove);

    list.appendChild(itemRow);
    itemRow.appendChild(itemName);
    itemRow.appendChild(itemControl);
    itemRow.appendChild(itemEdit);
    
    inputTask.value = '';
    inputTask.focus();

    saveTasks();
}

document.getElementById('addTask').addEventListener('click', () => addRow(null, false));

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
            btn.classList.add('removeItem');
            btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            break;

        case 'edit':
            btn.classList.add('editItem');
            btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            break;
    }
    return btn;
}

document.querySelector('input#inputTask').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addRow(null, false);
    }
})

loadTasks();