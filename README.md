# QuizLab - Backend

> Projeto desenvolvido para o Hackaton da FIAP (Pós-graduação em Desenvolvimento Full-Stack).

## Descrição

QuizLab é uma plataforma de quizzes interativos, com autenticação de usuários, ranking, pontuação e participação em tempo real. O backend foi desenvolvido em Node.js com TypeScript, utilizando Express e PostgreSQL.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- PostgreSQL
- JWT (autenticação)
- bcrypt (hash de senha)
- dotenv (variáveis de ambiente)
- ts-node-dev (desenvolvimento)

## Estrutura do Projeto

- `src/` - Código fonte
  - `modules/` - Módulos de negócio (quizzes, users, shared)
  - `config/` - Configuração do banco de dados
  - `routes.ts` - Rotas principais
  - `server.ts` - Inicialização do servidor

## Como preparar o ambiente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/MelqSantos/QuizLab---Nodejs.git
   cd QuizLab/QuizLab - Back
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=seu_usuario
   DATABASE_PASSWORD=sua_senha
   DATABASE_NAME=quizlab
   FRONTEND_URL=http://localhost:4200
   ```

4. **Prepare o banco de dados:**
   - Certifique-se de ter o PostgreSQL instalado e um banco criado. (Recomendo usar imagem docker)
   - Configure as variáveis de ambiente conforme acima.

5. **Modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

6. **Build e produção:**
   ```bash
   npm run build
   npm start
   ```

## Script de criação do banco e seeds

O arquivo `database.sql` contém toda a estrutura de tabelas, índices e dados iniciais (seeds) para o PostgreSQL.

1. Execute o script após criar o banco de dados:
   ```bash
   psql -U seu_usuario -d quizlab -f database.sql
   ```

2. O script inclui:
   - Criação das tabelas: users, quizzes, questions, alternatives, quiz_participants, answers
   - Índices e constraints
   - Inserts iniciais de usuários, quiz, perguntas, alternativas e participantes

Veja o arquivo [`database.sql`](database.sql) para detalhes.

## Frontend Angular

O frontend está disponível em: [QuizLab_angular](https://github.com/MelqSantos/QuizLab_angular.git)

## Sobre o Hackaton FIAP

Este projeto foi desenvolvido como parte do Hackaton proposto pela FIAP na pós-graduação de Desenvolvimento Full-Stack.