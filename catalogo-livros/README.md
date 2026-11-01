# Minha estante

Catálogo interativo de livros feito para a disciplina **Tópicos Especiais em Projeto e Desenvolvimento Web (TEPDW)**.

**Autor(es):** Thaís Araújo de Paiva
**Vídeo de apresentação:** [](https://drive.google.com/drive/folders/1gP2n4vldkttU6U97oKmsPAaK12oBBKy4?usp=sharing)

## Objetivo

Organizar uma lista de livros, separando o que a pessoa quer ler, está lendo e já leu. O foco do projeto é praticar TypeScript (tipos, interfaces, funções tipadas, arrays, DOM e eventos).

## Funcionalidades

- Cadastro de livros com título, categoria, ano de publicação e status, com validação dos campos
- Lista de livros, com mensagem quando não há livros ou nenhum resultado na busca
- Busca por título (ignora acentos e maiúsculas) e filtro por categoria
- Mudança de status e exclusão de livros
- Resumo com o total e a quantidade em cada status, atualizado a cada alteração

Os dados ficam apenas em memória (ao recarregar a página, a lista volta ao início).

## Tecnologias

HTML, CSS e TypeScript (sem frameworks).

## Como rodar

É preciso ter o [Node.js](https://nodejs.org) instalado.

```bash
# 1. instalar as dependências (TypeScript)
npm install

# 2. compilar o TypeScript para JavaScript (gera a pasta dist/)
npm run build

# 3. abrir o index.html no navegador
```

Para recompilar automaticamente enquanto edita o código, use `npm run watch`.

## Estrutura

```
index.html      página principal
css/style.css   estilos
src/main.ts     código TypeScript
dist/main.js    JavaScript gerado pela compilação
tsconfig.json   configuração do compilador
```
