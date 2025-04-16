import { readFile, writeFile } from 'fs/promises';
const prompt = require("prompt-sync")();

// Caminho do arquivo de tarefas
const caminhoArquivo = './tarefas.json';

// Função para ler tarefas do arquivo JSON
async function lerTarefas() {
    try {
        const dados = await readFile(caminhoArquivo, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        // Se o arquivo não existir ou estiver vazio, retorna uma lista vazia
        return [];
    }
}

// Função para salvar tarefas no arquivo JSON
async function salvarTarefas(tarefas) {
    await writeFile(caminhoArquivo, JSON.stringify(tarefas, null, 2));
}

// Função para gerar novo ID (incremental)
function gerarNovoId(tarefas) {
    let maiorId = 0;
    for (let tarefa of tarefas) {
        if (tarefa.id > maiorId) {
            maiorId = tarefa.id;
        }
    }
    return maiorId + 1;
}

// Função para criar uma nova tarefa
async function criarTarefa() {
    const titulo = prompt("Digite o título da tarefa: ");
    const descricao = prompt("Digite a descrição da tarefa: ");
    
    const tarefas = await lerTarefas();
    const novaTarefa = {
        id: gerarNovoId(tarefas),
        titulo,
        descricao,
        concluida: false
    };

    tarefas.push(novaTarefa);
    await salvarTarefas(tarefas);
    console.log("✅ Tarefa criada com sucesso!");
}

// Função para exibir tarefas (todas ou filtradas)
async function exibirTarefas(filtro) {
    const tarefas = await lerTarefas();

    let filtradas = tarefas;
    if (filtro === "concluidas") {
        filtradas = tarefas.filter(t => t.concluida);
    } else if (filtro === "naoConcluidas") {
        filtradas = tarefas.filter(t => !t.concluida);
    }

    if (filtradas.length === 0) {
        console.log("⚠️ Nenhuma tarefa encontrada.");
    } else {
        for (let tarefa of filtradas) {
            console.log(`ID: ${tarefa.id}`);
            console.log(`Título: ${tarefa.titulo}`);
            console.log(`Descrição: ${tarefa.descricao}`);
            console.log(`Concluída: ${tarefa.concluida ? "Sim" : "Não"}`);
            console.log("-------------------------");
        }
    }
}

// Função para concluir uma tarefa
async function concluirTarefa() {
    const id = parseInt(prompt("Digite o ID da tarefa a ser concluída: "));
    const tarefas = await lerTarefas();

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
        console.log("✅ Tarefa marcada como concluída!");
    } else {
        console.log("❌ Tarefa com ID informado não encontrada.");
    }
}

// Função principal que exibe o menu
async function menu() {
    let opcao;

    do {
        console.log("\n--- MENU ---");
        console.log("1. Criar uma nova tarefa");
        console.log("2. Visualizar todas as tarefas");
        console.log("3. Visualizar apenas tarefas concluídas");
        console.log("4. Visualizar apenas tarefas não concluídas");
        console.log("5. Concluir uma tarefa");
        console.log("6. Sair");

        opcao = prompt("Escolha uma opção: ");

        switch (opcao) {
            case "1":
                await criarTarefa();
                break;
            case "2":
                await exibirTarefas("todas");
                break;
            case "3":
                await exibirTarefas("concluidas");
                break;
            case "4":
                await exibirTarefas("naoConcluidas");
                break;
            case "5":
                await concluirTarefa();
                break;
            case "6":
                console.log("👋 Saindo do sistema...");
                break;
            default:
                console.log("❌ Opção inválida!");
                break;
        }

    } while (opcao !== "6");
}

// Executa o menu
menu();
