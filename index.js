import fs from 'fs/promises';
import promptSync from 'prompt-sync';

const prompt = promptSync();
const FILE_NAME = 'tarefas.json';

// Função para ler tarefas do arquivo
async function lerTarefas() {
    try {
        const data = await fs.readFile(FILE_NAME, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Retorna lista vazia se o arquivo não existir
    }
}
// Função para salvar tarefas no arquivo
async function salvarTarefas(tarefas) {
    await fs.writeFile(FILE_NAME, JSON.stringify(tarefas, null, 2));
}
// Função para gerar novo ID
function gerarId(tarefas) {
    const ids = tarefas.map(t => t.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}
// Criar nova tarefa
async function criarTarefa() {
    const titulo = prompt('Digite o título da tarefa: ');
    const descricao = prompt('Digite a descrição da tarefa: ');
    const tarefas = await lerTarefas();
    const novaTarefa = {
        id: gerarId(tarefas),
        titulo,
        descricao,
        concluida: false
    };
    tarefas.push(novaTarefa);
    await salvarTarefas(tarefas);
    console.log('✅ Tarefa criada com sucesso!');
}
// Exibir todas as tarefas
async function listarTarefas(filtrar = null) {
    const tarefas = await lerTarefas();
    let lista = tarefas;

    if (filtrar === 'concluidas') {
        lista = tarefas.filter(t => t.concluida);
    } else if (filtrar === 'naoConcluidas') {
        lista = tarefas.filter(t => !t.concluida);
    }
    if (lista.length === 0) {
        console.log('🚫 Nenhuma tarefa encontrada.');
    } else {
        console.log('\n📋 Lista de Tarefas:');
        lista.forEach(t => {
            console.log(`ID: ${t.id} | Título: ${t.titulo} | Concluída: ${t.concluida}`);
            console.log(`Descrição: ${t.descricao}\n`);
        });
    }
}
// Marcar tarefa como concluída
async function concluirTarefa() {
    const id = parseInt(prompt('Digite o ID da tarefa que deseja concluir: '));
    const tarefas = await lerTarefas();
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        console.log('❌ Tarefa não encontrada.');
        return;
    }
    tarefas[index].concluida = true;
    await salvarTarefas(tarefas);
    console.log('✅ Tarefa marcada como concluída!');
}
// Menu principal
async function menu() {
    let sair = false;
    while (!sair) {
        console.log('\n===== MENU =====');
        console.log('1. Criar nova tarefa');
        console.log('2. Ver todas as tarefas');
        console.log('3. Ver tarefas concluídas');
        console.log('4. Ver tarefas não concluídas');
        console.log('5. Concluir uma tarefa');
        console.log('6. Sair');
        const opcao = prompt('Escolha uma opção: ');
        switch (opcao) {
            case '1':
                await criarTarefa();
                break;
            case '2':
                await listarTarefas();
                break;
            case '3':
                await listarTarefas('concluidas');
                break;
            case '4':
                await listarTarefas('naoConcluidas');
                break;
            case '5':
                await concluirTarefa();
                break;
            case '6':
                sair = true;
                console.log('👋 Encerrando o programa...');
                break;
            default:
                console.log('⚠️ Opção inválida!');
        }
    }
}
// Iniciar programa
menu();
