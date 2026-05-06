let switchOut = document.getElementById('switchOut');
let switchIn = document.getElementById('switchIn');
let switchToggle = document.querySelector('input#switchToggle');
let lista = document.getElementById('lista');

lista.addEventListener('click', onListaClick);

function onListaClick(event) {
    const botoes = event.target;
    const tr = botoes.closest('.taskRow');

    if (botoes.closest('.concluir')) {
        const tn = tr.querySelector('.taskName');

        tn.classList.toggle('isComplete');
        salvarTarefas();
    }

    if(botoes.closest('.removeTask')) {
        tr.remove();
        salvarTarefas();
    }

    if(botoes.closest('.editTask')) {
        const tn = tr.querySelector('.taskName');
        const p = tn.querySelector('p');
        const novoTexto = prompt(`Editar tarefa: ${p.textContent}`);

        if(novoTexto !== null && novoTexto.trim()) {
            p.textContent = novoTexto;
            salvarTarefas();
        }
    }
}

const salvarTarefas = () => {
    let tarefas = [];

    document.querySelectorAll('.taskRow').forEach(tr => {
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

    let taskRow = document.createElement('div');
    let taskName = document.createElement('div');
    let taskConcluir = document.createElement('div');
    let taskEdit = document.createElement('div');

    taskRow.classList.add('taskRow');
    taskName.classList.add('taskName');
    taskConcluir.classList.add('taskConcluir');
    taskEdit.classList.add('taskEdit');

    let preview = task.length > 30? 
    task.slice(0, 30) + '...': 
    task;
    taskRow.dataset.tarefa = preview;

    let p = document.createElement('p');
    p.textContent = task;

    let concluir = addConcluir(taskName, isCheck);
    let btnEditar = addEditar();
    let btnRemover = addRemover();

    taskName.appendChild(p);
    taskConcluir.appendChild(concluir);
    taskEdit.appendChild(btnEditar);
    taskEdit.appendChild(btnRemover);

    lista.appendChild(taskRow);
    taskRow.appendChild(taskName);
    taskRow.appendChild(taskConcluir);
    taskRow.appendChild(taskEdit);
    
    inputTask.value = '';
    inputTask.focus();

    salvarTarefas();
}

const addConcluir = (taskName, isCheck) => {
    let concluir = document.createElement('input');
    concluir.classList.add('concluir');
    concluir.name = 'concluir';
    concluir.type = 'checkbox';

    concluir.checked = isCheck;

    if (isCheck) {
        taskName.classList.add('isComplete');
    }

    return concluir;
}

const addRemover = () => {
    let btnRemover = document.createElement('button');
    btnRemover.classList.add('removeTask');
    btnRemover.innerHTML = '<i class="fa-solid fa-trash"></i>';

    return btnRemover;
}

const addEditar = () => {
    let btnEditar = document.createElement('button');
    btnEditar.classList.add('editTask');
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