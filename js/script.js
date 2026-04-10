let switchOut = document.getElementById('switchOut');
let switchIn = document.getElementById('switchIn');
let switchToggle = document.querySelector('input#switchToggle');
let lista = document.getElementById('lista');

const salvarTarefas = () => {
    let tarefas = [];

    document.querySelectorAll('#lista tr').forEach(tr => {
        let texto = tr.querySelector('p').textContent;
        let checked = tr.querySelector('input.concluir').checked;

        tarefas.push({
            tarefa: texto,
            isCheck: checked
        });
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

const carregarTarefas = () => {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    let isDark = localStorage.getItem('isDarkMode') === 'true';
    aplicarModoEscuro(isDark);

    tarefas.forEach((tarefaObj) => {
        addLinha(tarefaObj.tarefa, tarefaObj.isCheck);
    });
}

const aplicarModoEscuro = (ativo) => {
    switchToggle.checked = ativo;
    document.body.classList.toggle('escuro', ativo);

    if (ativo) {
        switchIn.style.transform = 'translateX(30px)';
        switchIn.innerHTML = '<i class="fa-solid fa-moon"></i>'
    } else {
        switchIn.style.transform = 'translateX(0)';
        switchIn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

const switchOnOff = () => {
    const estadoAtual = switchToggle.checked;
    const novoEstado = !estadoAtual;
    aplicarModoEscuro(novoEstado);
    localStorage.setItem('isDarkMode', novoEstado);
}

switchOut.addEventListener('click', switchOnOff);

const addLinha = (texto = null, isCheck = false) => {
    let inputTask = document.querySelector('input#inputTask');
    let task = texto || inputTask.value;
    
    if (!task.trim()) {
        alert('[ERRO] É necessário digitar um valor antes de adiciona-lo.');
        inputTask.value = '';
        return;
    }

    let tableRow = document.createElement('tr');
    let tableHeader = document.createElement('th');
    let tdConcluir = document.createElement('td');
    let tdEditTh = document.createElement('td');
    tdEditTh.classList.add('editTh');

    let preview = task.length > 30? 
    task.slice(0, 30) + '...': 
    task;
    tableRow.dataset.tarefa = preview;

    let p = document.createElement('p');
    p.textContent = task;

    let concluir = addConcluir(tableHeader, isCheck);
    let btnEditar = addEditar(p);
    let btnRemover = addRemover(tableRow);

    tableHeader.appendChild(p);
    tdConcluir.appendChild(concluir);
    tdEditTh.appendChild(btnEditar);
    tdEditTh.appendChild(btnRemover);

    lista.appendChild(tableRow);
    tableRow.appendChild(tableHeader);
    tableRow.appendChild(tdConcluir);
    tableRow.appendChild(tdEditTh);
    
    inputTask.value = '';
    inputTask.focus();

    salvarTarefas();
}

const addConcluir = (tableHeader, isCheck) => {
    let concluir = document.createElement('input');
    concluir.classList.add('concluir');
    concluir.name = 'concluir';
    concluir.type = 'checkbox';

    concluir.checked = isCheck;

    if (isCheck) {
        tableHeader.classList.add('isComplete');
    }

    concluir.addEventListener('change', () => {
        tableHeader.classList.toggle('isComplete');
        salvarTarefas();
    })

    return concluir;
}

const addRemover = (tableRow) => {
    let btnRemover = document.createElement('button');
    btnRemover.classList.add('removeTask');
    btnRemover.addEventListener('click', () => {
        tableRow.remove();
        salvarTarefas();
    })
    btnRemover.innerHTML = '<i class="fa-solid fa-trash"></i>';

    return btnRemover;
}

const addEditar = (p) => {
    let btnEditar = document.createElement('button');
    btnEditar.classList.add('editTask');
    btnEditar.addEventListener('click', () => {
        let novoTexto = prompt(`Editar tarefa: ${p.textContent}`);

        if(novoTexto !== null && novoTexto.trim()) {
            p.textContent = novoTexto;
            salvarTarefas();
        }
    })
    btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

        return btnEditar;
}

document.getElementById('addTask').addEventListener('click', () => addLinha(null, false));
document.querySelector('input#inputTask').addEventListener('keydown', function(evento) {
    if (evento.key === 'Enter') {
        addLinha(null, false);
    }
})

carregarTarefas();