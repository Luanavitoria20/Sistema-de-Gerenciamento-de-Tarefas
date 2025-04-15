import { readFile, writeFile } from 'fs/promises';
import promptSync from 'prompt-sync';

const prompt = promptSync();
const FILE = './JSON/tarefas.json';

// Lê tarefas do arquivo ou retorna array vazio se não existir
async function lerTarefas() {
  try {
    const dados = await readFile(FILE, 'utf-8');
    return JSON.parse(dados);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      return [];
    } else {
      console.error('Erro ao ler o arquivo:', erro.message);
      return [];
    }
  }
}

// Salva tarefas no arquivo
async function salvarTarefas(tarefas) {
  try {
    await writeFile(FILE, JSON.stringify(tarefas, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar o arquivo:', erro.message);
  }
}

// Gera novo ID único e sequencial
function gerarId(tarefas) {
  if (tarefas.length === 0) return 1;
  const ids = tarefas.map(t => t.id);
  return Math.max(...ids) + 1;
} 

// Criar nova tarefa
async function criarTarefa() {
  const titulo = prompt('Título da tarefa: ');
  const descricao = prompt('Descrição da tarefa: ');
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

// Listar tarefas com opção de filtro
async function listarTarefas(filtro = null) {
  const tarefas = await lerTarefas();

  const resultado = filtro === null
    ? tarefas
    : tarefas.filter(t => t.concluida === filtro);

  if (resultado.length === 0) {
    console.log('Nenhuma tarefa encontrada.');
    return;
  }

  resultado.forEach(t => {
    console.log('\nID:', t.id);
    console.log('Título:', t.titulo);
    console.log('Descrição:', t.descricao);
    console.log('Concluída:', t.concluida ? 'Sim' : 'Não');
  });
}

// Concluir uma tarefa
async function concluirTarefa() {
  const id = parseInt(prompt('Digite o ID da tarefa que deseja concluir: '));
  const tarefas = await lerTarefas();

  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) {
    console.log('❌ Tarefa não encontrada.');
    return;
  }

  if (tarefa.concluida) {
    console.log('⚠️ Essa tarefa já está concluída.');
    return;
  }

  tarefa.concluida = true;
  await salvarTarefas(tarefas);
  console.log('✅ Tarefa marcada como concluída!');
}

// Menu principal
async function menu() {
  let opcao;
  do {
    console.log('\n==== MENU ====');
    console.log('1 - Criar nova tarefa');
    console.log('2 - Visualizar todas as tarefas');
    console.log('3 - Visualizar tarefas concluídas');
    console.log('4 - Visualizar tarefas não concluídas');
    console.log('5 - Concluir uma tarefa');
    console.log('6 - Sair');

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
        console.log('👋 Saindo...');
        break;
      default:
        console.log('⚠️ Opção inválida. Tente novamente.');
    }
  } while (opcao !== '6');
}

// Iniciar sistema
menu();
