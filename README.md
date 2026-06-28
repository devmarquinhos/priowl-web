# Priowl Web 🦉

O cliente web oficial do Priowl, uma plataforma inteligente para priorização de fluxo de trabalho e gerenciamento de dependências entre tarefas.

Este projeto foi construído com foco em alta performance, responsividade (Desktop & Mobile) e segurança extrema na comunicação com a API.

# 🛠️ Stack Tecnológica

- Framework: Next.js (App Router)
- Linguagem: TypeScript
- Estilização: Tailwind CSS
- Ícones: Lucide React

# 🛣️ Status do Desenvolvimento

- [x] Setup Inicial (Next.js + Tailwind + TS)
- [x] Interface de Autenticação (Login e Cadastro)
- [x] Responsividade (Mobile First & Desktop)
- [x] Proxy de Rotas
- [ ] Interface do Dashboard e Filtros Inteligentes
- [ ] Interface de Criação e Relacionamento de Tarefas (Motor de Dependências)

# ⚙️ Variáveis de Ambiente

O projeto exige o mapeamento da URL do seu Back-end. Crie um arquivo .env.local na raiz do projeto (mesmo nível do package.json) com a seguinte variável:
URL da sua API em Java (Mude para a URL de produção futuramente)

```
BACKEND_URL=http://sua_url/
```

# 🚀 Como Executar Localmente

Clone este repositório e certifique-se de ter o Node.js instalado (v18+ recomendado. Instale as dependências utilizando `npm install` ou `yarn install`

Crie o arquivo `.env.local` e aponte para o seu servidor Java rodando. Inicie o servidor de desenvolvimento usando `npm run dev` ou `yarn dev` e por fim acesse a URL disponibilizada no terminal em seu navegador.