export class Perfil {
    private id: string;
    private apelido: string;
    private foto: string;
    private email: string;
    private status: string;
    private amigos: Perfil[];
    private postagens: Publicacao[];

    constructor(id: string, apelido: string, foto: string, email: string) {
        this.id = id;
        this.apelido = apelido;
        this.foto = foto;
        this.email = email;
        this.status = 'ativo';
        this.amigos = [];
        this.postagens = [];
    }

    adicionarAmigo(amigo: Perfil): void {
        this.amigos.push(amigo);
    }

    removerAmigo(amigo: Perfil): void {
        this.amigos = this.amigos.filter(a => a !== amigo);
    }

    adicionarPublicacao(publicacao: Publicacao): void {
        this.postagens.push(publicacao);
    }

    listarAmigos(): Perfil[] {
        return this.amigos;
    }

    listarPostagens(): Publicacao[] {
        return this.postagens;
    }

    ativarDesativarPerfil(): void {
        this.status = this.status === 'ativo' ? 'inativo' : 'ativo';
    }
    getId(): string {
        return this.id;
    }
    getApelido(): string {
        return this.apelido;
    }
    estaAtivo(): boolean {
        return this.status === 'ativo';
    }
    getEmail(): string {
        return this.email;
    }

    get apelido_perfil(): string {
        return this.apelido;
    }
    get perfil_foto(): string {
        return this.foto;
    }
    get perfil_status(): string {
        return this.status;
    }

    get perfil_email(): string {
        return this.email;
    }
}

export class Publicacao {
    private id: string;
    private conteudo: string;
    private dataHora: Date;
    private perfil: Perfil;

    constructor(id: string, conteudo: string, perfil: Perfil) {
        this.id = id;
        this.conteudo = conteudo;
        this.dataHora = new Date();
        this.perfil = perfil;
    }
    get perfilApelido(): string {
        return this.perfil.apelido_perfil;
    }
}

export class Interacao {
    private id: string;
    private tipo: TipoInteracao;
    private perfilAutor: Perfil;

    constructor(id: string, tipo: TipoInteracao, perfilAutor: Perfil) {
        this.id = id;
        this.tipo = tipo;
        this.perfilAutor = perfilAutor;
    }
}

export enum TipoInteracao {
    Curtir = '👍',
    NaoCurtir = '👎',
    Riso = '😂',
    Surpresa = '😮'
}
export class PerfilAvancado extends Perfil {
    habilitarDesabilitarPerfil(perfil: Perfil): void {
        perfil.ativarDesativarPerfil();
    }
}

