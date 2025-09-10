# Raise Capital

Plataforma web para captação de recursos e gestão de ofertas de investimento. O projeto reúne uma landing institucional, listagem e detalhes de ofertas, criação de projetos e um blog com editor rico. O backend é implementado via rotas de API do Next.js e o armazenamento de dados usa PostgreSQL.

## Stack
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- Componentes de UI locais (inspirados no shadcn/ui)
- Animações com framer-motion
- Ícones com lucide-react
- Gráficos com Recharts
- Renderização de imagens com next/image (Sharp)
- Banco de dados: PostgreSQL (pg)

## Funcionalidades
- Landing page institucional
- Ofertas: listagem e página de detalhes
- Projetos: criação de novos projetos/ofertas via formulário
- Blog: criação de posts com editor (TipTap)
- Páginas institucionais (políticas, termos, etc.)

## Pré-requisitos
- Node.js LTS (>= 18) e npm
- PostgreSQL disponível e acessível

## Instalação
```bash
npm install
```

## Configuração de Ambiente
Crie um arquivo `.env` na raiz com as seguintes variáveis:
```bash
# String de conexão do PostgreSQL (ex.: postgres://user:pass@host:5432/database)
DATABASE_URL="postgres://USER:PASS@HOST:5432/DBNAME"

# SSL habilitado por padrão. Para desabilitar (ex.: ambiente local), defina como 'false'.
DATABASE_SSL=false
```

### Migrações de Banco de Dados
Execute as migrações antes de iniciar a aplicação:
```bash
npm run db:migrate
```

## Execução em Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em http://localhost:3000/.

## Build e Produção
```bash
npm run build
npm start
```

## Scripts NPM
- dev: inicia o servidor de desenvolvimento (Turbopack)
- build: build de produção (Turbopack)
- start: inicia o servidor em modo produção
- lint: executa o ESLint
- db:migrate: executa migrações de banco

## Estrutura do Projeto (resumo)
- src/app: páginas (App Router), rotas de API e layout
- src/components/ui: componentes de UI reutilizáveis
- src/lib: utilitários e acesso ao banco de dados
- public: assets e imagens

## Deploy
Recomendado: Vercel.
- Build Command: `npm run build`
- Output: `.next`

## Licença
Todos os direitos reservados. É proibida a cópia, distribuição, modificação ou uso deste software, no todo ou em parte, sem autorização prévia e por escrito do detentor dos direitos. O acesso ao código-fonte não implica concessão de qualquer licença tácita.

Qualquer solicitação de uso, distribuição, sublicenciamento ou integração deve ser formalmente encaminhada e aprovada por escrito.

## Direitos Autorais
Copyright (c) 2025 codnodo studio
