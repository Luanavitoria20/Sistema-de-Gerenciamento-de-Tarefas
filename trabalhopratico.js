const fs = require('fs/promises');
const prompt = require('prompt-sync')();

const ARQUIVO_TAREFAS = 'tarefas.json';

// Função para ler as tarefas do arquivo
async function lerTarefas() {
    try {
        const dados = await fs.readFile(ARQUIVO_TAREFAS, 'utf-8');
        return JSON.parse(dados);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Arquivo não existe, retorna lista vazia
            return [];
        } else {
            throw error;
        }
    }
}

// Função para salvar tarefas no arquivo
async function salvarTarefas(tarefas) {
    await fs.writeFile(ARQUIVO_TAREFAS, JSON.stringify(tarefas, null, 2));
}

// Função para gerar novo ID
function gerarNovoId(tarefas) {
    if (tarefas.length === 0) return 1;
    const ids = tarefas.map(t => t.id);
    return Math.max(...ids) + 1;
}

// Menu interativo
async function menu() {
    let opcao;
    do {
        console.log('\n--- GERENCIADOR DE TAREFAS ---');
        console.log('1. Criar uma nova tarefa');
        console.log('2. Visualizar todas as tarefas');
        console.log('3. Visualizar apenas tarefas concluídas');
        console.log('4. Visualizar apenas tarefas não concluídas');
        console.log('5. Concluir uma tarefa');
        console.log('6. Sair');
        opcao = prompt('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                await criarTarefa();
                break;
            case '2':
                await listarTarefas();
                break;
            case '3':
                await listarTarefas(true);
                break;
            case '4':
                await listarTarefas(false);
                break;
            case '5':
                await concluirTarefa();
                break;
            case '6':
                console.log('Saindo...');
                break;
            default:
                console.log('Opção inválida!');
        }
    } while (opcao !== '6');
}

// Criar nova tarefa
async function criarTarefa() {
    const titulo = prompt('Título da tarefa: ');
    const descricao = prompt('Descrição da tarefa: ');
    const tarefas = await lerTarefas();
    const novaTarefa = {
        id: gerarNovoId(tarefas),
        titulo,
        descricao,
        concluida: false
    };
    tarefas.push(novaTarefa);
    await salvarTarefas(tarefas);
    console.log('Tarefa criada com sucesso!');
}

// Listar tarefas (todas, concluídas ou não concluídas)
async function listarTarefas(filtrarConcluidas = null) {
    const tarefas = await lerTarefas();
    let tarefasFiltradas = tarefas;

    if (filtrarConcluidas === true) {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    } else if (filtrarConcluidas === false) {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    }

    if (tarefasFiltradas.length === 0) {
        console.log('Nenhuma tarefa encontrada.');
    } else {
        console.log('\n--- Lista de Tarefas ---');
        for (const t of tarefasFiltradas) {
            console.log(`ID: ${t.id}`);
            console.log(`Título: ${t.titulo}`);
            console.log(`Descrição: ${t.descricao}`);
            console.log(`Concluída: ${t.concluida ? 'Sim' : 'Não'}`);
            console.log('---------------------------');
        }
    }
}

// Concluir uma tarefa
async function concluirTarefa() {
    const id = parseInt(prompt('Digite o ID da tarefa a concluir: '));
    const tarefas = await lerTarefas();
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        console.log('Tarefa não encontrada.');
        return;
    }

    if (tarefa.concluida) {
        console.log('Tarefa já está concluída.');
        return;
    }

    tarefa.concluida = true;
    await salvarTarefas(tarefas);
    console.log('Tarefa marcada como concluída!');
}

// Executar o programa
menu().catch(err => console.error('Erro inesperado:', err));
