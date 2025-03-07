# Sistema de Rede Social

Este projeto é um sistema de rede social desenvolvido para o trabalho final da disciplina de Programação Orientada a Objetos (POO). O sistema permite gerenciar perfis de usuários, publicações, interações e solicitações de amizade. A aplicação foi desenvolvida em equipe, com foco em uma arquitetura modular e fácil de entender.

## Funcionalidades

O sistema oferece as seguintes funcionalidades:

1. **Gerenciamento de Perfis**
   - Criar, buscar, ativar/desativar perfis de usuário.
   - Adicionar e remover amigos.
   - Listar amigos e publicações de cada perfil.

2. **Gerenciamento de Publicações**
   - Criar publicações simples e avançadas.
   - Listar publicações de forma ordenada.
   - Adicionar interações (curtir, não curtir, riso, surpresa) nas publicações avançadas.

3. **Gerenciamento de Solicitações de Amizade**
   - Enviar, aceitar ou recusar solicitações de amizade.

4. **Persistência de Dados**
   - Os perfis e publicações são armazenados em arquivos JSON, garantindo a persistência entre as execuções do programa.

5. **Validações e Tratamento de Exceções**
   - O sistema possui validações robustas para evitar dados duplicados, perfis inativos e interações inválidas. Exceções personalizadas são lançadas para garantir a integridade dos dados.

## Estrutura do Código

O sistema é composto pelas seguintes classes:

- **Perfil**: Contém atributos como ID, apelido, foto, e status. Métodos para adicionar/remover amigos, listar amigos e postagens.
- **PerfilAvancado**: Herda da classe `Perfil` e adiciona métodos para habilitar/desabilitar outros perfis.
- **Publicacao**: Representa uma publicação com conteúdo e data/hora.
- **PublicacaoAvancada**: Herda de `Publicacao` e adiciona a capacidade de interagir com as publicações.
- **Interacao**: Representa uma interação (curtir, não curtir, etc.) em uma publicação.
- **RedeSocial**: Classe principal que gerencia todos os perfis, publicações e solicitações de amizade.

## Contribuidores

- [**Alanda13**](https://github.com/Alanda13)
- [**Clara**](https://github.com/ClaraMikaelly-ifpi)
- [**Shara**](https://github.com/Shara-Cristtina-SL)

