import { readFile, writeFile } from 'fs/promises';
const prompt = require('prompt-sync')();

const ARQUIVO = 'tarefas.json';

async function carregarTarefas() {
    try {
        const dados = await readFile(ARQUIVO, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        return [];
    }
}

async function salvarTarefas(tarefas) {
    try {
        await writeFile(ARQUIVO, JSON.stringify(tarefas, null, 2));
    } catch (erro) {
        console.log('Erro ao salvar tarefas:', erro.message);
    }
}

function mostrarTarefas(tarefas) {
    if (tarefas.length === 0) {
        console.log('Nenhuma tarefa encontrada.');
    } else {
        for (let i = 0; i < tarefas.length; i++) {
            const t = tarefas[i];
            console.log(`ID: ${t.id} | Título: ${t.titulo} | Concluída: ${t.concluida}`);
            console.log(`Descrição: ${t.descricao}`);
            console.log('---');
        }
    }
}

async function criarTarefa() {
    const titulo = prompt('Digite o título da tarefa: ');
    const descricao = prompt('Digite a descrição da tarefa: ');
    const tarefas = await carregarTarefas();

    let novoId = 1;
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id >= novoId) {
            novoId = tarefas[i].id + 1;
        }
    }

    const novaTarefa = {
        id: novoId,
        titulo: titulo,
        descricao: descricao,
        concluida: false
    };

    tarefas.push(novaTarefa);
    await salvarTarefas(tarefas);
    console.log('Tarefa criada com sucesso!');
}

async function visualizarTodas() {
    const tarefas = await carregarTarefas();
    mostrarTarefas(tarefas);
}

async function visualizarConcluidas() {
    const tarefas = await carregarTarefas();
    const concluidas = [];
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].concluida === true) {
            concluidas.push(tarefas[i]);
        }
    }
    mostrarTarefas(concluidas);
}

async function visualizarNaoConcluidas() {
    const tarefas = await carregarTarefas();
    const naoConcluidas = [];
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].concluida === false) {
            naoConcluidas.push(tarefas[i]);
        }
    }
    mostrarTarefas(naoConcluidas);
}

async function concluirTarefa() {
    const id = Number(prompt('Digite o ID da tarefa que deseja concluir: '));
    const tarefas = await carregarTarefas();

    let encontrada = false;
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id === id) {
            tarefas[i].concluida = true;
            encontrada = true;
            break;
        }
    }

    if (encontrada) {
        await salvarTarefas(tarefas);
        console.log('Tarefa concluída com sucesso!');
    } else {
        console.log('Tarefa com o ID informado não encontrada.');
    }
}

async function menu() {
    let sair = false;
    do {
        console.log('\n====== MENU ======');
        console.log('1. Criar nova tarefa');
        console.log('2. Visualizar todas as tarefas');
        console.log('3. Visualizar tarefas concluídas');
        console.log('4. Visualizar tarefas não concluídas');
        console.log('5. Concluir uma tarefa');
        console.log('6. Sair');

        const opcao = prompt('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                await criarTarefa();
                break;
            case '2':
                await visualizarTodas();
                break;
            case '3':
                await visualizarConcluidas();
                break;
            case '4':
                await visualizarNaoConcluidas();
                break;
            case '5':
                await concluirTarefa();
                break;
            case '6':
                sair = true;
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
        }
    } while (!sair);
}

menu();
