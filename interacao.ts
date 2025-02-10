import * as readline from 'readline';
import { RedeSocial } from './redeSocial';
import { Perfil, PerfilAvancado, Publicacao, PublicacaoAvancada} from './perfil';
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
        console.log('2. Adicionar Perfil Avançado');
        console.log('3. Listar Perfis');
        console.log('4. Ativar/Desativar Perfil');
        console.log('5. Salvar');
        console.log('6. Recuperar');
        console.log('7. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPerfil(false); // Adiciona perfil normal
                    break;
                case '2':
                    this.adicionarPerfil(true);  // Adiciona perfil avançado
                    break;
                case '3':
                    this.listarPerfis();
                    break;
                case '4':
                    this.ativarDesativarPerfil();
                    break;
                case '5':
                    this.salvarPerfis();
                    break;
                case '6':
                    this.recuperarPerfis();
                    break;
                case '7':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPerfis();
                    break;
            }
        });
    }

    private adicionarPerfil(avancado: boolean): void {
        this.rl.question('ID: ', (id) => {
            this.rl.question('Apelido: ', (apelido) => {
                this.rl.question('Foto (emoji): ', (foto) => {
                    this.rl.question('Email: ', (email) => {
                        let perfil;
                        if (avancado) {
                            perfil = new PerfilAvancado(id, apelido, foto, email);
                        } else {
                            perfil = new Perfil(id, apelido, foto, email);
                        }
    
                        try {
                            this.redeSocial.adicionarPerfil(perfil);
                            console.log('Perfil adicionado com sucesso!');
                            this.salvarPerfis();
                            this.menuPerfis();
                        } catch (erro) {
                            if (erro instanceof PerfilJaCadastradoError) {
                                console.error(erro.message);
                            } else {
                                console.error("Ocorreu um erro desconhecido:", erro);
                            }
                            this.menuPerfis();
                        }
                    });
                });
            });
        });
    }

    private listarPerfis(): void {
        const perfis = this.redeSocial.listarPerfis();
        if (perfis.length === 0) {
            console.log('Nenhum perfil cadastrado.');
        } else {
            perfis.forEach(perfil => {
                const tipoPerfil = perfil instanceof PerfilAvancado ? 'Avançado' : 'Normal';
                console.log(`ID: ${perfil.getId()}, Apelido: ${perfil.getApelido()}, Email: ${perfil.getEmail()}, Tipo: ${tipoPerfil}, Ativo: ${perfil.estaAtivo()}`);
            });
        }
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
                            console.error("Perfil não encontrado");
                            this.menuPerfis();
                        }
                    } catch (erro) {
                        if (erro instanceof PerfilInativoError) {
                            console.error(erro.message);
                        } else {
                            console.error("Ocorreu um erro desconhecido!");
                        }
                        this.menuPerfis();
                    }
                });
            } else {
                console.error('Perfil não encontrado ou não autorizado.');
                this.menuPerfis();
            }
        });
    }

    private salvarPerfis(): void {
        try {
            PersistenciaDeDados.salvarPerfis(this.redeSocial.listarPerfis());
            console.log("Perfis salvos automaticamente.");
            this.menuPerfis();
        } catch (erro) {
            console.error("Erro ao salvar perfis.");
            this.menuPerfis();
        }
    }

    private recuperarPerfis(): void {
        try {
            PersistenciaDeDados.recuperarPerfis();
            console.log("Perfis recuperados com sucesso.");
            this.menuPerfis();
        } catch (erro) {
            console.error("Erro ao recuperar perfis.");
            this.menuPerfis();
        }
    }

    private menuPublicacoes(): void {
        console.log('\n--- Gerenciamento de Publicações ---');
        console.log('1. Adicionar Publicação');
        console.log('2. Adicionar Publicação Avançada'); // Nova opção
        console.log('3. Listar Publicações');
        console.log('4. Salvar');
        console.log('5. Recuperar');
        console.log('6. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPublicacao(false); // Adiciona publicação normal
                    break;
                case '2':
                    this.adicionarPublicacao(true);  // Adiciona publicação avançada
                    break;
                case '3':
                    this.listarPublicacoes();
                    break;
                case '4':
                    this.salvarPublicacoes();
                    break;
                case '5':
                    this.recuperarPublicacoes();
                    break;
                case '6':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPublicacoes();
                    break;
            }
        });
    }
    
    private adicionarPublicacao(avancada: boolean): void {
        this.rl.question('Email do perfil: ', (email) => {
            const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
    
            if (perfil) {
                this.rl.question('Conteúdo: ', (conteudo) => {
                    try {
                        let publicacao;
                        if (avancada) {
                            publicacao = new PublicacaoAvancada(Date.now().toString(), conteudo, perfil);
                        } else {
                            publicacao = new Publicacao(Date.now().toString(), conteudo, perfil);
                        }
                        this.redeSocial.adicionarPublicacao(publicacao);
                        console.log('Publicação adicionada com sucesso!');
                        this.menuPublicacoes();
                    } catch (erro) {
                        if (erro instanceof PerfilInativoError) {
                            console.error(erro.message);
                            this.menuPublicacoes();
                        } else {
                            console.error("Ocorreu um erro desconhecido:", erro);
                            this.menuPublicacoes();
                        }
                    }
                });
            } else {
                console.error('Perfil não encontrado.');
                this.menuPublicacoes();
            }
        });
    }

    private listarPublicacoes(): void {
        const publicacoes = this.redeSocial.listarPublicacoes();
        console.log('\nPublicações:');
        publicacoes.forEach(pub => console.log(`${pub['perfil'].getApelido()} - Foto: ${pub['perfil'].getfoto}: [${pub['dataHora']}] ${pub['conteudo']}`));
        this.menuPublicacoes();
    }

    private salvarPublicacoes(): void {
        try {
            PersistenciaDeDados.salvarPublicacoes(this.redeSocial.listarPublicacoes());
            console.log("Publicações salvas com sucesso.");
            this.menuPublicacoes();
        } catch (erro) {
            console.error("Erro ao salvar publicações.");
            this.menuPublicacoes();
        }
    }

    private recuperarPublicacoes(): void {
        try {
            PersistenciaDeDados.recuperarPublicacoes();
            console.log("Publicações recuperadas com sucesso.");
            this.menuPublicacoes();
        } catch (erro) {
            console.error("Erro ao recuperar publicações.");
            this.menuPublicacoes();
        }
    }

    private menuSolicitacoes(): void {
        console.log('\n--- Gerenciamento de Solicitações ---');
        console.log('1. Enviar Solicitação de Amizade');
        console.log('2. Aceitar Solicitação');
        console.log('3. Recusar Solicitação');
        console.log('4. Listar amigos');
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
                            this.redeSocial.enviarSolicitacaoAmizade(perfilRemetente, perfilDestinatario);                            this.redeSocial.enviarSolicitacaoAmizade(perfilRemetente, perfilDestinatario);
                            console.log("Solicitação de amizade enviada!");
                            this.menuSolicitacoes();
                        } catch (erro) {
                            console.error("Erro ao enviar solicitação de amizade:", erro);
                            this.menuSolicitacoes();
                        }
                    } else {
                        console.error("Perfil destinatário não encontrado.");
                        this.menuSolicitacoes();
                    }
                });
            } else {
                console.error("Perfil remetente não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }

    private aceitarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (emailDestinatario) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, emailDestinatario);
            if (perfilDestinatario) {
                this.rl.question('Email do perfil a ser aceito: ', (emailRemetente) => {
                    const perfilRemetente = this.redeSocial.buscarPerfil(undefined, undefined, emailRemetente);
                    if (perfilRemetente) {
                        try {
                            // Chama o método de aceitar solicitação
                            this.redeSocial.aceitarSolicitacao(perfilDestinatario);
                            console.log("Solicitação de amizade aceita!");
                            this.menuSolicitacoes();
                        } catch (erro) {
                            console.error("Erro ao aceitar solicitação de amizade:", erro);
                            this.menuSolicitacoes();
                        }
                    } else {
                        console.error("Perfil remetente não encontrado.");
                        this.menuSolicitacoes();
                    }
                });
            } else {
                console.error("Perfil destinatário não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }
    
    private recusarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (emailDestinatario) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, emailDestinatario);
            if (perfilDestinatario) {
                this.rl.question('Email do perfil a ser recusado: ', (emailRemetente) => {
                    const perfilRemetente = this.redeSocial.buscarPerfil(undefined, undefined, emailRemetente);
                    if (perfilRemetente) {
                        try {
                            // Chama o método de recusar solicitação
                            this.redeSocial.recusarSolicitacao(perfilDestinatario);
                            console.log("Solicitação de amizade recusada!");
                            this.menuSolicitacoes();
                        } catch (erro) {
                            console.error("Erro ao recusar solicitação de amizade:", erro);
                            this.menuSolicitacoes();
                        }
                    } else {
                        console.error("Perfil remetente não encontrado.");
                        this.menuSolicitacoes();
                    }
                });
            } else {
                console.error("Perfil destinatário não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }
    
    private listarAmizades(): void {
        console.log("Listando amizades...");
        this.rl.question('Email do perfil: ', (email) => {
            const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
            if (perfil) {
                const amigos = this.redeSocial.listarAmigos(perfil);
                if (amigos.length === 0) {
                    console.log("Nenhuma amizade encontrada.");
                } else {
                    amigos.forEach(amigo => console.log(`Amigo: ${amigo.getApelido()}`));
                }
                this.menuSolicitacoes();
            } else {
                console.error("Perfil não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }
    
}



