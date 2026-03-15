let switchOut = document.getElementById('switchOut');
let switchIn = document.getElementById('switchIn');
let toggle = document.querySelector('input#switchToggle');
let lista = document.getElementById('lista');

const switchOnOff = () => {
    toggle.checked = !toggle.checked;
    document.body.classList.toggle('escuro');
    if (toggle.checked) {
        switchIn.style.transform = 'translateX(28px)';
        switchIn.innerHTML = '<i class="fa-solid fa-moon"></i>'
    } else {
        switchIn.style.transform = 'translateX(0)';
        switchIn.innerHTML = '<p>&#9728;</p>';
    }
}

switchOut.addEventListener('click', switchOnOff);

const adicionar = () => {
    let inputTask = document.querySelector('input#inputTask');
    let task = inputTask.value;
    inputTask.value = ''
    inputTask.focus()

    let tableRow = document.createElement('tr');
    let tableHeader = document.createElement('th');
    let tableData = document.createElement('td');

    let p = document.createElement('p');
    p.textContent = task;
    tableHeader.appendChild(p);
    tableData.innerHTML = '<input class="concluir" type="checkbox" value="Concluir"> <input class="remover" type="button" value="Remover">';

    if (!task.trim()) {
        alert('[ERRO] É necessário digitar um valor antes de adiciona-lo.');
    } else {
        lista.appendChild(tableRow);
        tableRow.appendChild(tableHeader);
        tableRow.appendChild(tableData);
    }
}

document.getElementById('addTask').addEventListener('click', adicionar)