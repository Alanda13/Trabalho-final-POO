import { Perfil, PerfilAvancado, Publicacao, PublicacaoAvancada, Interacao, TipoInteracao } from './perfil';
import { PerfilJaCadastradoError, PerfilNaoAutorizadoError, PerfilInativoError, AmizadeJaExistenteError } from './excecoes';

export class RedeSocial {
    private _perfis: Perfil[];
    private _publicacoes: Publicacao[];
    private _solicitacoesAmizade: Map<Perfil, Perfil>;

    constructor() {
        this._perfis = [];
        this._publicacoes = [];
        this._solicitacoesAmizade = new Map<Perfil, Perfil>();
    }

    private perfis: Perfil[] = [];
    adicionarPerfil(perfil: Perfil): void {
        if (this.perfis.some(p => p['email'] === perfil['email'])) {
            throw new PerfilJaCadastradoError("Já existe um perfil com este e-mail.");
        }
        this.perfis.push(perfil);
    }

    buscarPerfil(id?: string, apelido?: string, email?: string): Perfil | null {
        return this._perfis.find(perfil => perfil['id'] === id || perfil['apelido'] === apelido || perfil['email'] === email) || null;
    }

    listarPerfis(): Perfil[] {
        return this._perfis;
    }

    ativarDesativarPerfil(perfilAvancado: PerfilAvancado, perfil: Perfil): void {
        if (!(perfilAvancado instanceof PerfilAvancado)) {
            throw new PerfilNaoAutorizadoError('Perfil não autorizado para ativar/desativar outro perfil.');
        }
        perfilAvancado.habilitarDesabilitarPerfil(perfil);
    }

    adicionarPublicacao(publicacao: Publicacao): void {
        const perfil = publicacao['perfil'];
        if (perfil['status'] === 'inativo') {
            throw new PerfilInativoError('Perfis inativos não podem criar publicações.');
        }
        this._publicacoes.push(publicacao);
    }

    listarPublicacoes(): Publicacao[] {
        return this._publicacoes.sort((a, b) => b['dataHora'].getTime() - a['dataHora'].getTime());
    }



    private solicitacoesAmizade: { remetente: Perfil, destinatario: Perfil }[] = [];

    enviarSolicitacaoAmizade(remetente: Perfil, destinatario: Perfil): void {
        if (remetente === destinatario) {
            throw new Error("Não é possível enviar uma solicitação de amizade para si mesmo.");
        }

        if (this.saoAmigos(remetente, destinatario)) {
            throw new AmizadeJaExistenteError("Essa amizade já existe.");
        }

        // Verifica se já existe uma solicitação pendente
        const solicitacaoPendente = this.solicitacoesAmizade.find(
            (solicitacao) =>
                (solicitacao.remetente === remetente && solicitacao.destinatario === destinatario) ||
                (solicitacao.remetente === destinatario && solicitacao.destinatario === remetente)
        );

        if (solicitacaoPendente) {
            throw new AmizadeJaExistenteError("Já existe uma solicitação de amizade pendente entre esses perfis.");
        }

        this.solicitacoesAmizade.push({ remetente, destinatario });
    }

    listarSolicitacoesPendentes(perfil: Perfil): { remetente: Perfil, destinatario: Perfil }[] {
        return this.solicitacoesAmizade.filter(solicitacao => solicitacao.destinatario === perfil);
    }

    aceitarSolicitacaoEspecifica(destinatario: Perfil, remetente: Perfil): void {
        const solicitacaoIndex = this.solicitacoesAmizade.findIndex(
            solicitacao => solicitacao.destinatario === destinatario && solicitacao.remetente === remetente
        );

        if (solicitacaoIndex === -1) {
            throw new Error("Solicitação de amizade não encontrada.");
        }

        destinatario.adicionarAmigo(remetente);
        remetente.adicionarAmigo(destinatario);
        this.solicitacoesAmizade.splice(solicitacaoIndex, 1);
    }

    recusarSolicitacao(destinatario: Perfil): void {
        // Encontrar o índice da primeira solicitação de amizade pendente para este destinatário
        const solicitacaoIndex = this.solicitacoesAmizade.findIndex(solicitacao => solicitacao.destinatario === destinatario);

        if (solicitacaoIndex === -1) {
            throw new Error("Não há solicitações de amizade pendentes para este perfil.");
        }

        // Remover a solicitação de amizade do array
        this.solicitacoesAmizade.splice(solicitacaoIndex, 1);
    }

    saoAmigos(perfil1: Perfil, perfil2: Perfil): boolean {
        return perfil1.listarAmigos().includes(perfil2);
    }

    listarSolicitacoes(): undefined | Map<Perfil, Perfil>{
        return this._solicitacoesAmizade;
    }
    aceitarSolicitacao(perfilDestinatario: Perfil): void {
        const perfilRemetente = this._solicitacoesAmizade.get(perfilDestinatario);
        if (perfilRemetente) {
            if (perfilDestinatario.listarAmigos().includes(perfilRemetente)) {
                throw new AmizadeJaExistenteError('Os perfis já são amigos.');
            }
            perfilDestinatario.adicionarAmigo(perfilRemetente);
            perfilRemetente.adicionarAmigo(perfilDestinatario);
            this._solicitacoesAmizade.delete(perfilDestinatario);
        }
    }
}