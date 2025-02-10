import * as fs from 'fs';
import * as path from 'path';
import { Perfil, Publicacao } from './perfil';

const caminhoPerfisArquivo = path.join(__dirname, 'perfis.json');
const caminhoPublicacoesArquivo = path.join(__dirname, 'publicacoes.json');

export class PersistenciaDeDados {
    // Salvar perfis
    static salvarPerfis(perfis: Perfil[]): void {
        const dados = JSON.stringify(perfis, (key, value) => {
            if (key.startsWith('__')) return undefined; // Remover atributos privados
            return value;
        });
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
            const perfis = JSON.parse(dados);
            return perfis.map((perfil: any) => new Perfil(perfil.id, perfil.apelido, perfil.foto, perfil.email));
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
