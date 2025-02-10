import * as fs from 'fs';
import * as path from 'path';
import { Perfil, Publicacao, PerfilAvancado } from './perfil';

const caminhoPerfisArquivo = path.join(__dirname, 'perfis.json');
const caminhoPublicacoesArquivo = path.join(__dirname, 'publicacoes.json');

export class PersistenciaDeDados {
    // Salvar perfis
    static salvarPerfis(perfis: Perfil[]): void {
        const perfisSerializaveis = perfis.map(perfil => {
            const perfilSerializado: any = {
                id: perfil.getId(),
                apelido: perfil.getApelido(),
                foto: perfil.getfoto(),
                email: perfil.getEmail(),
                status: perfil['status'],
                tipo: perfil instanceof PerfilAvancado ? 'avancado' : 'normal' // Adiciona o tipo
            };
            return perfilSerializado;
        });

        const dados = JSON.stringify(perfisSerializaveis, null, 2);
        fs.writeFileSync(caminhoPerfisArquivo, dados);
    }

    // Salvar publicações
    static salvarPublicacoes(publicacoes: Publicacao[]): void {
        const dados = JSON.stringify(publicacoes, (key, value) => {
            if (key.startsWith('__')) return undefined; // Remover atributos privados
            return value;
        });
        fs.writeFileSync(caminhoPublicacoesArquivo, dados);
    }

    // Carregar perfis
    static carregarPerfis(): Perfil[] {
        if (fs.existsSync(caminhoPerfisArquivo)) {
            const dados = fs.readFileSync(caminhoPerfisArquivo, 'utf-8');
            const perfisData = JSON.parse(dados);

            return perfisData.map((perfilData: any) => {
                let perfil;
                if (perfilData.tipo === 'avancado') {
                    perfil = new PerfilAvancado(perfilData.id, perfilData.apelido, perfilData.foto, perfilData.email);
                } else {
                    perfil = new Perfil(perfilData.id, perfilData.apelido, perfilData.foto, perfilData.email);
                }

                // Restaura o status
                perfil['status'] = perfilData.status;
                return perfil;
            });
        }
        return [];
    }

    // Carregar publicações
    static carregarPublicacoes(): Publicacao[] {
        if (fs.existsSync(caminhoPublicacoesArquivo)) {
            const dados = fs.readFileSync(caminhoPublicacoesArquivo, 'utf-8');
            const publicacoes = JSON.parse(dados);
            return publicacoes.map((publicacao: any) => new Publicacao(publicacao.id, publicacao.conteudo, publicacao.perfil));
        }
        return [];
    }
    static recuperarPerfis(): Perfil[] {
        const dados = fs.readFileSync('perfis.json', 'utf-8');
        const perfis = JSON.parse(dados);
        return perfis.map((perfil: any) => new Perfil(perfil.id, perfil.apelido, perfil.foto, perfil.email));
    }

    static recuperarPublicacoes(): Publicacao[] {
        const dados = fs.readFileSync('publicacoes.json', 'utf-8');
        const publicacoes = JSON.parse(dados);
        return publicacoes.map((publicacao: any) => new Publicacao(publicacao.id, publicacao.conteudo, publicacao.perfil));
    }

}