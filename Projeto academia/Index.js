const readline = require('readline');
const fs = require('fs'); // Adicionado o módulo 'fs'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//// Array para armazenar os jogadores cadastrados
const jogadores = [];

/////////////////////////////////////////////////////////
//cadastro
function cadastrarJogador() {
  rl.question('Nome completo: ', (nomeCompleto) => {
    rl.question('Senha: ', (senha) => {
      rl.question('CPF: ', (cpf) => {
        rl.question('Endereço: ', (endereco) => {
          rl.question('Data de nascimento (DD/MM/AAAA): ', (dataNascimento) => {
            rl.question('Cargo (1. Gerente de equipe/coach, 2. Jogador, 3. Treinador): ', (cargo) => {
              const jogador = { nomeCompleto, senha, cpf, endereco, dataNascimento };
              switch (cargo) {
                case '1':
                  jogador.cargo = 'Gerente de equipe/coach';
                  rl.question('Número da equipe: ', (numeroEquipe) => {
                    jogador.numeroEquipe = parseInt(numeroEquipe);
                    jogadores.push(jogador);
                    salvarDados();
                    console.log('Jogador cadastrado com sucesso!');
                    mostrarMenu();
                  });
                  break;
                case '2':
                  jogador.cargo = 'Jogador';
                  rl.question('Número da equipe: ', (numeroEquipe) => {
                    jogador.numeroEquipe = parseInt(numeroEquipe);
                    jogadores.push(jogador);
                    salvarDados();
                    console.log('Jogador cadastrado com sucesso!');
                    mostrarMenu();
                  });
                  break;
                case '3':
                  jogador.cargo = 'Treinador';
                  jogador.numeroEquipe = 1;
                  jogadores.push(jogador);
                  salvarDados();
                  console.log('Treinador cadastrado com sucesso!');
                  mostrarMenu();
                  break;
                default:
                  console.log('Cargo inválido.');
                  mostrarMenu();
                  break;
              }
            });
          });
        });
      });
    });
  });
}

/////////////////////////////////////////////////////////
//PÁGINA DO GERENTE
function menuGerente(jogador) {
  console.log(`\nBem-vindo, ${jogador.nomeCompleto} (Gerente de equipe)`);
  console.log('1. Adicionar membro à equipe');
  console.log('2. Remover membro da equipe');
  console.log('3. Listar jogadores no time');
  console.log('4. Voltar ao menu principal');
  rl.question('Escolha uma opção: ', (opcao) => {
    switch (opcao) {
      case '1':
          rl.question('Nome do membro a ser adicionado: ', (nomeMembro) => {
            const membro = jogadores.find(j => j.nomeCompleto === nomeMembro);
              if (membro) {
               console.log(`Membro ${nomeMembro} adicionado à equipe.`);
               membro.numeroEquipe = jogador.numeroEquipe; 
                salvarDados();
                 } else {
                      console.log(`Membro ${nomeMembro} não encontrado.`);}
                      menuGerente(jogador);});
                      break;
      case '2':
          rl.question('Nome do membro a ser removido: ', (nomeMembro) => {
            const jogadorARemover = jogadores.find(j => j.nomeCompleto === nomeMembro);
            if (jogadorARemover) {
              if (jogadorARemover.numeroEquipe === jogador.numeroEquipe) {
                jogadorARemover.numeroEquipe = undefined; 
                console.log(`Membro ${nomeMembro} removido da equipe.`);
                salvarDados();
              } else {
                console.log(`Membro ${nomeMembro} não pertence à sua equipe.`);
              }
            } else {
              console.log(`Membro ${nomeMembro} não encontrado.`);
            }
            menuGerente(jogador);
          });
          break;
      case '3':
        listarJogadoresNoTime(jogador);
        break;
      case '4':
        mostrarMenu();
        break;
      default:
        console.log('Opção inválida');
        menuGerente(jogador);
        break;
    }
  });

}
function listarJogadoresNoTime(jogador) {
  console.log('\nJogadores no time:');
  const jogadoresNoTime = jogadores.filter(j => j.numeroEquipe === jogador.numeroEquipe && j.cargo === 'Jogador');
  if (jogadoresNoTime.length > 0) {
    jogadoresNoTime.forEach(jogador => {
      console.log(`- ${jogador.nomeCompleto}`);
    });
  } else {
    console.log('Não há jogadores no time.');
  }
  menuGerente(jogador);
}

/////////////////////////////////////////////////////////
//Página Do TREINADOR

//ADD EQUIPE
function adicionarEquipeTreinando(jogador) {
  rl.question('Digite o código da equipe que deseja adicionar: ', (codigoEquipe) => {
    const equipeExiste = jogadores.some(j => j.numeroEquipe === parseInt(codigoEquipe));
    if (equipeExiste) {
      const treinador = jogadores.find(j => j.nomeCompleto === jogador.nomeCompleto && j.cargo === 'Treinador');
      if (treinador) {
        if (!treinador.equipesTreinando) {
          treinador.equipesTreinando = [];
        }
        treinador.equipesTreinando.push(parseInt(codigoEquipe));
        salvarDados();
        console.log(`Equipe ${codigoEquipe} adicionada à lista de equipes que está treinando.`);
      } else {
        console.log('Erro: Treinador não encontrado.');
      }
    } else {
      console.log('Equipe não encontrada. Certifique-se de que o código da equipe está correto.');
    }
    menuTreinador(jogador);
  });
}
//REMOVER EQUIPE

function finalizarTreinamentoEquipe(jogador) {
  rl.question('Digite o código da equipe que deseja finalizar o treinamento: ', (codigoEquipe) => {
    const treinador = jogadores.find(j => j.nomeCompleto === jogador.nomeCompleto && j.cargo === 'Treinador');
    if (treinador && treinador.equipesTreinando) {
      const index = treinador.equipesTreinando.indexOf(parseInt(codigoEquipe));
      if (index !== -1) {
        treinador.equipesTreinando.splice(index, 1);
        salvarDados();
        console.log(`Treinamento da equipe ${codigoEquipe} finalizado.`);
      } else {
        console.log('Erro: Equipe não encontrada na lista de equipes treinadas.');
      }
    } else {
      console.log('Erro: Treinador não encontrado ou nenhuma equipe está sendo treinada.');
    }
    menuTreinador(jogador);
  });
}


///Salvar os dados em formato JSON
function salvarDados() {
  fs.writeFileSync('DataCadastros.json', JSON.stringify(jogadores, null, 2));
  console.log('Dados salvos em DataCadastros.json');
}

function menuTreinador(jogador) {
  console.log(`\nBem-vindo, ${jogador.nomeCompleto} (Treinador)`);
  console.log('Dashboard do Treinador:');
  console.log('1. Visualizar equipes que está treinando');
  console.log('2. Adicionar equipe que está treinando');
  console.log('3. Finalizar treinamento de equipe');
  console.log('4. Voltar ao menu principal');
  rl.question('Escolha uma opção: ', (opcao) => {
    switch (opcao) {
      case '1':
        console.log('Equipes:');
        const equipes = jogadores.filter(j => j.cargo === 'Jogador' && j.numeroEquipe !== 0)
          .map(j => j.numeroEquipe)
          .filter((value, index, self) => self.indexOf(value) === index); // Remover duplicatas
        equipes.forEach((equipe) => {
          console.log(`Equipe ${equipe}:`);
          const membros = jogadores.filter(j => j.numeroEquipe === equipe);
          membros.forEach(m => console.log(`- ${m.nomeCompleto}`));
        });
        menuTreinador(jogador);
        break;
      case '2':
        adicionarEquipeTreinando(jogador);
        break;
      case '3':
        finalizarTreinamentoEquipe(jogador);
        break;
      case '4':
        mostrarMenu();
        break;
      default:
        console.log('Opção inválida');
        menuTreinador(jogador);
        break;
    }
  });
}

/////////////////////////////////////////////////////////
//Página do JOGADOR
function exibirProgresso() {
    fs.readFile('DataJogador.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo:', err);
      } else {
        const progresso = JSON.parse(data);
        console.log('\nProgresso em jogos:');
        console.log('Nome do jogo:', progresso.nomeJogo);
        console.log('Partidas jogadas:', progresso.partidasJogadas);
        console.log('Vitórias:', progresso.vitorias);
        console.log('Derrotas:', progresso.derrotas);
        console.log('Taxa de vitória (Win Rate):', progresso.taxaVitoria);
      }
    });
  }
  
  function AdicionarProgresso(jogador) {
    rl.question('Nome do jogo: ', (nomeJogo) => {
      rl.question('Partidas jogadas: ', (partidasJogadas) => {
        rl.question('Vitórias: ', (vitorias) => {
          rl.question('Derrotas: ', (derrotas) => {
            const taxaVitoria = (parseInt(vitorias) / parseInt(partidasJogadas)) * 100 || 0; // Calcula a taxa de vitória
            const progresso = {
              nomeJogo,
              partidasJogadas: parseInt(partidasJogadas),
              vitorias: parseInt(vitorias),
              derrotas: parseInt(derrotas),
              taxaVitoria: taxaVitoria.toFixed(2) + '%'
            };
            const data = JSON.stringify(progresso, null, 2);
            fs.writeFile('DataJogador.json', data, (err) => {
              if (err) {
                console.error('Erro ao salvar o progresso:', err);
              } else {
                console.log('Progresso salvo com sucesso!');
              }
              menuJogador(jogador);
            });
          });
        });
      });
    });
  }
  
  function menuJogador(jogador) {
    console.log(`\nBem-vindo, ${jogador.nomeCompleto} (Jogador)`);
    console.log('1. Adicionar progresso em jogos');
    console.log('2. Exibir progresso em jogos');
    console.log('3. Voltar ao menu principal');
    rl.question('Escolha uma opção: ', (opcao) => {
      switch (opcao) {
        case '1':
          AdicionarProgresso(jogador);
          break;
        case '2':
          exibirProgresso();
          menuJogador(jogador);
          break;
        case '3':
          mostrarMenu();
          break;
        default:
          console.log('Opção inválida');
          menuJogador(jogador);
          break;
      }
    });
  }

/////////////////////////////////////////////////////////
//LOGIN
function fazerLogin() {
  rl.question('Nome completo: ', (nomeCompleto) => {
    rl.question('Senha: ', (senha) => {
      const jogador = jogadores.find(j => j.nomeCompleto === nomeCompleto && j.senha === senha);
      if (jogador) {
        console.log('Login bem-sucedido!');
        switch (jogador.cargo) {
          case 'Gerente de equipe/coach':
            menuGerente(jogador);
            break;
            case 'Jogador':
            menuJogador(jogador);
            break;
          case 'Treinador':
            menuTreinador(jogador);
            break;
          default:
            console.log('Cargo inválido.');
            mostrarMenu();
            break;
        }
      } else {
        console.log('Credenciais inválidas.');
        mostrarMenu();
      }
    });
  });
}

/////////////////////////////////////////////////////////
//MENU
function mostrarMenu() {
  console.log('\nMenu:');
  console.log('1. Cadastrar Participante');
  console.log('2. Fazer login');
  console.log('3. Sair');
  rl.question('Escolha uma opção: ', (opcao) => {
    switch (opcao) {
      case '1':
        cadastrarJogador();
        break;
      case '2':
        fazerLogin();
        break;
      case '3':
        rl.close();
        break;
      default:
        console.log('Opção inválida');
        mostrarMenu();
        break;
    }
  });
}

/////////////////////////////////////////////////////////
function salvarDados() {
  fs.writeFileSync('DataCadastros.json', JSON.stringify(jogadores, null, 2));
  console.log('Dados salvos em DataCadastros.json');
}

/////////////////////////////////////////////////////////
function carregarDados() {
  try {
    const data = fs.readFileSync('DataCadastros.json', 'utf8');
    if (data) {
      const jsonData = JSON.parse(data);
      jsonData.forEach((item) => {
        jogadores.push(item);
      });
      console.log('Dados carregados com sucesso.');
    }
  } catch (err) {
    console.error('Erro ao carregar os dados:', err);
  }
}

/////////////////////////////////////////////////////////
carregarDados();
mostrarMenu();
