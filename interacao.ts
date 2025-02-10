import * as readline from 'readline';
import { RedeSocial } from './redeSocial';
import { Perfil, PerfilAvancado, Publicacao } from './perfil';
import { AmizadeJaExistenteError, PerfilInativoError, PerfilJaCadastradoError, PerfilNaoAutorizadoError } from './excecoes';
import { PersistenciaDeDados } from './persistenciaDados';
export class RedeSocialInterativa {
    private redeSocial: RedeSocial;
    private rl: readline.Interface;

    constructor() {
        this.redeSocial = new RedeSocial();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    iniciar(): void {
        this.menuPrincipal();
    }

    private menuPrincipal(): void {
        console.log('\n--- Menu Principal ---');
        console.log('1. Gerenciamento de Perfis');
        console.log('2. Gerenciamento de Publicações');
        console.log('3. Gerenciamento de Solicitações');
        console.log('4. Sair');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.menuPerfis();
                    break;
                case '2':
                    this.menuPublicacoes();
                    break;
                case '3':
                    this.menuSolicitacoes();
                    break;
                case '4':
                    this.rl.close();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPrincipal();
                    break;
            }
        });
    }

    private menuPerfis(): void {
        console.log('\n--- Gerenciamento de Perfis ---');
        console.log('1. Adicionar Perfil');
        console.log('2. Listar Perfis');
        console.log('3. Ativar/Desativar Perfil');
        console.log('4. Salvar')
        console.log('5. Recuperar')
        console.log('6. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPerfil();
                    break;
                case '2':
                    this.listarPerfis();
                    break;
                case '3':
                    this.ativarDesativarPerfil();
                    break;
                case '4':
                    this.salvarPerfis();
                    break;
                case '5':
                    this.recuperarPerfis();
                    break;
                case '6':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPerfis();
                    break;
            }
        });
    }

    // Métodos do menuPerfis
    private adicionarPerfil(): void {
        this.rl.question('ID: ', (id) => {
            this.rl.question('Apelido: ', (apelido) => {
                this.rl.question('Foto (emoji): ', (foto) => {
                    this.rl.question('Email: ', (email) => {
                        const perfil = new Perfil(id, apelido, foto, email);
                        try {
                            this.redeSocial.adicionarPerfil(perfil);
                            console.log('Perfil adicionado com sucesso!');
                            this.menuPerfis();
                        } catch (erro) {
                            if (erro instanceof PerfilJaCadastradoError) {
                                console.error(erro.message);
                                this.menuPerfis(); // Ou outro menu, dependendo da lógica
                            } else {
                                console.error("Ocorreu um erro desconhecido:", erro);
                                this.menuPerfis();
                            }
                        }
                    });
                });
            });
        });
    }

    private listarPerfis(): void {
        const perfis = this.redeSocial.listarPerfis();
        console.log('\nPerfis cadastrados:');
        perfis.forEach(perfil => console.log(`- ${perfil['apelido']} (${perfil['email']})`));
        this.menuPerfis();
    }

    private ativarDesativarPerfil(): void {
        this.rl.question('Email do perfil: ', (emailAvancado) => {
            const perfilAvancado = this.redeSocial.buscarPerfil(undefined, undefined, emailAvancado) as PerfilAvancado;
            if (perfilAvancado) {
                this.rl.question('Email do perfil a ser ativado/desativado: ', (email) => {
                    const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
                    try {
                        if (perfil) {
                            this.redeSocial.ativarDesativarPerfil(perfilAvancado, perfil);
                            console.log('Perfil ativado/desativado com sucesso!');
                            this.menuPerfis();
                        } else {
                            console.error("Perfil não encontado")
                            this.menuPerfis();
                        }
                    } catch (erro) {
                        if (erro instanceof PerfilInativoError) {
                            this.menuSolicitacoes();
                        } else {
                            console.error("Ocorreu um erro desconhecido!")
                            this.menuSolicitacoes();
                        }
                    }
                });
            } else {
                console.error('Perfil não encontrado ou não autorizado.');
                this.menuPerfis();
            }
        });
    }

    private salvarPerfis(): void{
        try{
        PersistenciaDeDados.salvarPerfis(this.redeSocial.listarPerfis())
        console.log("Sucesso.")
        this.menuPerfis();
        }catch(erro){
            console.error("Erro ao salvar perfis.")
            this.menuPerfis()
        }
    }

    private recuperarPerfis(): void{
        try{
            PersistenciaDeDados.recuperarPerfis();
            console.log("Sucesso.");
            this.menuPerfis();
            }catch(erro){
                console.error("Erro ao recuperar perfis.");
                this.menuPerfis();
            }
    }

    // Métodos do menuPublicacoes
    private menuPublicacoes(): void {
        console.log('\n--- Gerenciamento de Publicações ---');
        console.log('1. Adicionar Publicação');
        console.log('2. Listar Publicações');
        console.log('3. Salvar');
        console.log('4. Recuperar');
        console.log('Voltar ao menu principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPublicacao();
                    break;
                case '2':
                    this.listarPublicacoes();
                    break;
                case '3':
                    this.salvarPublicacoes();
                    break;
                case '4':
                    this.recuperarPublicacoes();
                    break;
                case '5':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPublicacoes();
                    break;
            }
        });
    }

    private adicionarPublicacao(): void {
        this.rl.question('Email do perfil: ', (email) => {
            const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
    
            if (perfil) {
                try {
                    // Verifique se o perfil está ativo ANTES de pedir o conteúdo e criar a publicação
                    if (perfil.perfil_status !== 'ativo') {
                        throw new PerfilInativoError("Perfil está inativo e não pode adicionar publicações.");
                    }
    
                    this.rl.question('Conteúdo: ', (conteudo) => {
                        try {
                            const publicacao = new Publicacao(Date.now().toString(), conteudo, perfil);
                            this.redeSocial.adicionarPublicacao(publicacao);
                            console.log('Publicação adicionada com sucesso!');
                            this.menuPublicacoes();
                        } catch (erro) {
                            console.error("Erro ao adicionar publicação:", erro);
                            this.menuPublicacoes();
                        }
                    });
                } catch (erro) {
                    if (erro instanceof PerfilInativoError) {
                        console.error(erro.message);
                        this.menuPublicacoes();
                    } else {
                        console.error("Ocorreu um erro desconhecido:", erro);
                        this.menuPublicacoes();
                    }
                }
            } else {
                console.error('Perfil não encontrado.');
                this.menuPublicacoes();
            }
        });
    }

    private listarPublicacoes(): void {
        const publicacoes = this.redeSocial.listarPublicacoes();
        console.log('\nPublicações:');
        publicacoes.forEach(pub => console.log(`${pub['perfil'].apelido_perfil}- Foto- ${pub['perfil'].perfil_foto}: [${pub['dataHora']}] ${pub['conteudo']}`));
        this.menuPublicacoes();
    }

    private salvarPublicacoes(): void{
        try{
            PersistenciaDeDados.salvarPublicacoes(this.redeSocial.listarPublicacoes())
            console.log("Sucesso.")
            this.menuPerfis();
            }catch(erro){
                console.error("Erro ao salvar publicações.")
                this.menuPerfis()
            }
    }

    private recuperarPublicacoes(){
        try{
            PersistenciaDeDados.recuperarPerfis();
            console.log("Sucesso.");
            this.menuPerfis();
            }catch(erro){
                console.error("Erro ao recuperar publicações.");
                this.menuPerfis();
            }
    }
    // Métodos do menuSolicitacoes
    private menuSolicitacoes(): void {
        console.log('\n--- Gerenciamento de Solicitações ---');
        console.log('1. Enviar Solicitação de Amizade');
        console.log('2. Aceitar Solicitação');
        console.log('3. Recusar Solicitação');
        console.log('4. Listar amigos')
        console.log('5. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.enviarSolicitacaoAmizade();
                    break;
                case '2':
                    this.aceitarSolicitacao();
                    break;
                case '3':
                    this.recusarSolicitacao();
                    break;
                case '4':
                    this.listarAmizades();
                    break;
                case '5':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuSolicitacoes();
                    break;
            }
        });
    }

    private enviarSolicitacaoAmizade(): void {
        this.rl.question('Email do perfil remetente: ', (Email) => {
            const perfilRemetente = this.redeSocial.buscarPerfil(undefined, undefined, Email);
            if (perfilRemetente) {
                this.rl.question('Email do perfil destinatário: ', (Email) => {
                    const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, Email);
                    if (perfilDestinatario) {
                        try {
                            this.redeSocial.enviarSolicitacaoAmizade(perfilRemetente, perfilDestinatario);
                        } catch (erro) {
                            if (erro instanceof AmizadeJaExistenteError) {
                                this.menuSolicitacoes();
                            } else {
                                console.error("Ocorreu um erro desconhecido!")
                                this.menuSolicitacoes();
                            }
                        }
                        console.log('Solicitação de amizade enviada com sucesso!');
                    } else {
                        console.log('Perfil destinatário não encontrado.');
                    }
                    this.menuSolicitacoes();
                });
            } else {
                console.log('Perfil remetente não encontrado.');
                this.menuSolicitacoes();
            }
        });
    }

    private aceitarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (emailDestinatario) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, emailDestinatario);
    
            if (perfilDestinatario) {
                const solicitacoesPendentes = this.redeSocial.listarSolicitacoesPendentes(perfilDestinatario);
    
                if (solicitacoesPendentes.length === 0) {
                    console.log('Não há solicitações de amizade pendentes.');
                    this.menuSolicitacoes();
                    return;
                }
    
                console.log('\nSolicitações de amizade pendentes:');
                solicitacoesPendentes.forEach((solicitacao, index) => {
                    console.log(`${index + 1}. De: ${solicitacao.remetente.apelido_perfil} (${solicitacao.remetente.perfil_email})`);
                });
    
                this.rl.question('Digite o número da solicitação que deseja aceitar: ', (numeroSolicitacao) => {
                    const index = parseInt(numeroSolicitacao) - 1;
    
                    if (index >= 0 && index < solicitacoesPendentes.length) {
                        const solicitacaoEscolhida = solicitacoesPendentes[index];
    
                        try {
                            this.redeSocial.aceitarSolicitacaoEspecifica(perfilDestinatario, solicitacaoEscolhida.remetente);
                            console.log('Solicitação de amizade aceita com sucesso!');
                        } catch (erro) {
                            if (erro instanceof AmizadeJaExistenteError) {
                                console.log("Amizade já existe.");
                            } else {
                                console.error("Ocorreu um erro desconhecido!", erro);
                            }
                        } finally {
                            this.menuSolicitacoes();
                        }
                    } else {
                        console.log('Número de solicitação inválido.');
                        this.menuSolicitacoes();
                    }
                });
            } else {
                console.log('Perfil destinatário não encontrado.');
                this.menuSolicitacoes();
            }
        });
    }

    private recusarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (Email) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, Email);
            if (perfilDestinatario) {
                try {
                    this.redeSocial.recusarSolicitacao(perfilDestinatario);
                    console.log('Solicitação de amizade recusada com sucesso!');
                } catch (erro) {
                    if (erro instanceof AmizadeJaExistenteError) {
                        this.menuSolicitacoes();
                    } else {
                        console.error("Ocorreu um erro desconhecido!")
                        this.menuSolicitacoes();
                    }
                }
            } else {
                console.log('Perfil destinatário não encontrado.');
            }
            this.menuSolicitacoes();
        });
    }

    private listarAmizades(): void {
        try {
          this.rl.question('Email do perfil: ', async (Email) => {
            try {
              const perfil = this.redeSocial.buscarPerfil(undefined, undefined, Email);
              if (perfil) {
                const lista: Perfil[] = perfil.listarAmigos();
                if (lista && lista.length > 0) { // Verifica se a lista existe e não está vazia
                  lista.forEach(amigo => { // Usa forEach para iterar sobre a lista
                    if (amigo) { // Verifica se o amigo existe
                      console.log(amigo.apelido_perfil);
                    }
                  });
                } else {
                  console.log("Este perfil não possui amigos.");
                }
              } else {
                throw new PerfilInativoError("Perfil não encontrado."); 
              }
            } catch (erro) {
              if (erro instanceof PerfilInativoError) {
                console.error(erro.message); 
              } else if (erro instanceof Error) { 
                console.error(`Ocorreu um erro: ${erro.message}`); 
              } else {
                console.error("Ocorreu um erro desconhecido.");
              }
            } finally {
              this.menuSolicitacoes();
            }
          });
        } catch (erro) {
          console.error("Erro na leitura do email."); 
          this.menuSolicitacoes();
        }
      }
    }
