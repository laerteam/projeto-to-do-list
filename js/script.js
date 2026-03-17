let switchOut = document.getElementById('switchOut');
let switchIn = document.getElementById('switchIn');
let switchToggle = document.querySelector('input#switchToggle');
let lista = document.getElementById('lista');

const switchOnOff = () => {
    switchToggle.checked = !switchToggle.checked;
    document.body.classList.toggle('escuro');
    if (switchToggle.checked) {
        switchIn.style.transform = 'translateX(28px)';
        switchIn.innerHTML = '<i class="fa-solid fa-moon"></i>'
    } else {
        switchIn.style.transform = 'translateX(0)';
        switchIn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

switchOut.addEventListener('click', switchOnOff);

const adicionar = () => {
    let inputTask = document.querySelector('input#inputTask');
    let task = inputTask.value;
    inputTask.value = '';
    inputTask.focus();

    let tableRow = document.createElement('tr');
    let tableHeader = document.createElement('th');
    let tdConcluir = document.createElement('td');
    let tdEditTh = document.createElement('td');

    let p = document.createElement('p');
    p.textContent = task;
    tableHeader.appendChild(p);
    tdConcluir.innerHTML = '<input class="concluir" type="checkbox" value="Concluir">';
    tdEditTh.innerHTML = '<input class="removeTask" type="button" value="Remover"> <input class="editTask" type="button" value="Editar">';

    if (!task.trim()) {
        alert('[ERRO] É necessário digitar um valor antes de adiciona-lo.');
    } else {
        lista.appendChild(tableRow);
        tableRow.appendChild(tableHeader);
        tableRow.appendChild(tdConcluir);
        tableRow.appendChild(tdEditTh);
    }
}

document.getElementById('addTask').addEventListener('click', adicionar);
document.querySelector('input#inputTask').addEventListener('keydown', function(evento) {
    if (evento.key === 'Enter') {
        adicionar();
    }
})