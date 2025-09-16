# 🚀 Raise Capital

> **Plataforma moderna para captação de recursos e gestão de ofertas de investimento**

Uma aplicação web completa construída com as mais recentes tecnologias do ecossistema React/Next.js, oferecendo uma experiência robusta para investidores e empresas que buscam captação de recursos.

## ✨ Visão Geral

O Raise Capital é uma plataforma full-stack que integra:
- **Landing page institucional** com design moderno e responsivo
- **Sistema de ofertas** com listagem, filtros e páginas detalhadas
- **Gestão de projetos** com formulários dinâmicos e validação
- **Blog integrado** com editor rico (TipTap) para conteúdo
- **Dashboard do investidor** com perfil PF/PJ e notificações
- **API robusta** implementada com Next.js Route Handlers

## 🛠️ Stack Tecnológica

### Core Framework
- **[Next.js 15.5.2](https://nextjs.org/)** - Framework React com App Router, Server Components e Turbopack
- **[React 19.1.0](https://react.dev/)** - Biblioteca para interfaces de usuário com React Compiler
- **[TypeScript 5+](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first com PostCSS

### UI & Componentes
- **[Base UI Components](https://base-ui.com/)** - Componentes headless da MUI (v1.0.0-beta.3)
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos acessíveis e não-estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones SVG otimizados (v0.542.0)
- **[Tabler Icons](https://tabler.io/icons)** - Conjunto adicional de ícones SVG
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animações fluidas e interativas
- **[Class Variance Authority](https://cva.style/)** - Utilitário para variantes de componentes

### Dados & Autenticação
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional robusto
- **[JWT (Jose)](https://github.com/panva/jose)** - Sistema de autenticação JWT customizado
- **[TanStack Table v8](https://tanstack.com/table)** - Tabelas poderosas e flexíveis
- **[Alchemy SDK](https://www.alchemy.com/)** - Integração com blockchain Ethereum

### Editor & Conteúdo
- **[TipTap 3.4.2](https://tiptap.dev/)** - Editor de texto rico e extensível
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Renderização de Markdown
- **[Remark GFM](https://github.com/remarkjs/remark-gfm)** - Suporte a GitHub Flavored Markdown
- **[Sanitize HTML](https://github.com/apostrophecms/sanitize-html)** - Sanitização de conteúdo HTML

### Ferramentas & Utilitários
- **[Recharts 2.15.4](https://recharts.org/)** - Gráficos e visualizações de dados
- **[Sharp 0.34.3](https://sharp.pixelplumbing.com/)** - Processamento de imagens otimizado
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - Armazenamento de arquivos na nuvem
- **[Nodemailer 7.0.6](https://nodemailer.com/)** - Envio de emails
- **[Sonner](https://sonner.emilkowal.ski/)** - Sistema de notificações toast
- **[Vaul](https://vaul.emilkowal.ski/)** - Drawer component para mobile

## 🎯 Funcionalidades Principais

### 🏠 Landing Page
- Design responsivo e moderno com Tailwind CSS
- Animações suaves com Framer Motion
- Seções otimizadas para conversão
- Integração com formulários de contato

### 💼 Sistema de Ofertas
- **Listagem dinâmica** com filtros avançados
- **Páginas de detalhes** com informações completas
- **Visualizações de dados** com gráficos interativos (Recharts)
- **Sistema de favoritos** para investidores

### 📊 Dashboard do Investidor
- **Perfil flexível** - suporte a Pessoa Física e Jurídica
- **Sistema de notificações** com dropdown interativo
- **Gestão de dados** pessoais, bancários e documentos
- **Histórico de investimentos** e portfolio

### ✍️ Blog & Conteúdo
- **Editor rico** com TipTap para criação de posts
- **Markdown support** com remark-gfm
- **Gestão de mídia** com upload otimizado
- **SEO otimizado** para melhor indexação

### 🔐 Autenticação & Segurança
- **JWT** para autenticação customizada
- **Proteção de rotas** com middleware
- **Sanitização de dados** com sanitize-html
- **Validação robusta** em formulários

## 📦 Principais Dependências

### 🎨 Interface & Componentes
- **Base UI Components** - Componentes acessíveis e modernos
- **shadcn/ui** - Sistema de design consistente
- **Tabler Icons** - Ícones SVG otimizados
- **Tailwind CSS** - Estilização utilitária

### 🔧 Funcionalidades Avançadas
- **DND Kit** - Drag and drop intuitivo
- **Recharts** - Gráficos e visualizações
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas TypeScript

### 🗄️ Banco de Dados & Backend
- **PostgreSQL (pg)** - Banco de dados principal
- **JWT** - Sistema de autenticação
- **Nodemailer** - Envio de e-mails
- **Multer** - Upload de arquivos

### 🚀 Desenvolvimento & Build
- **Next.js 15** - Framework React full-stack
- **TypeScript** - Tipagem estática
- **ESLint** - Linting e qualidade de código
- **PostCSS** - Processamento de CSS

## 📋 Pré-requisitos

- **Node.js** LTS (>= 18.0.0)
- **npm** ou **yarn** para gerenciamento de pacotes
- **PostgreSQL** (>= 12.0) disponível e acessível
- **Git** para controle de versão

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
```bash
# Clone o projeto
git clone <repository-url>
cd raisecapital

# Verifique se está na branch correta
git branch
```

### 2. Instale as Dependências
```bash
# Usando npm (recomendado)
npm install

# Ou usando yarn
yarn install

# Ou usando pnpm (mais rápido)
pnpm install
```

### 3. Configuração de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# 🗄️ Banco de Dados PostgreSQL
DATABASE_URL="postgres://USER:PASS@HOST:5432/DBNAME"
DATABASE_SSL=false  # Para desenvolvimento local
# Exemplo para desenvolvimento local:
# DATABASE_URL="postgresql://postgres:123456@localhost:5432/raisecapital_dev"

# 🔐 Autenticação (JWT)
SESSION_SECRET="your-super-secret-jwt-key-change-in-production"

# 📁 Upload de Arquivos
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=".pdf,.jpg,.jpeg,.png,.webp"

# 📧 Configuração de E-mail (Nodemailer)
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
FROM_EMAIL="noreply@raisecapital.com"

# 💳 Gateway de Pagamento Asaas (opcional)
ASAAS_API_KEY="sua-chave-api-asaas"
ASAAS_ENVIRONMENT="sandbox"  # ou "production"

# 🌐 Alchemy SDK (opcional)
ALCHEMY_API_KEY="sua-chave-alchemy"
ALCHEMY_NETWORK="eth-mainnet"  # ou "eth-sepolia" para testes

# ☁️ Upload de Arquivos (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# 🔧 Configurações Gerais
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Configuração do Banco de Dados

#### 🗄️ Estrutura do Banco
O projeto utiliza PostgreSQL com 18 tabelas principais:
- **users** - Usuários do sistema (empresas e investidores)
- **empresas** - Dados das empresas captadoras
- **investidores** - Perfil dos investidores (PF/PJ)
- **ofertas** - Ofertas de investimento disponíveis
- **acoes** - Ações e participações
- **relatorios** - Relatórios financeiros e de performance
- **blog** - Sistema de blog integrado
- **newsletter_subscriptions** - Assinantes da newsletter
- **files** - Gestão de arquivos e documentos

#### 🚀 Executar Migrações
```bash
# Execute o script de migração completo
npm run db:migrate

# Ou execute diretamente com psql
psql $DATABASE_URL -f database/migrations/001_create_all_tables.sql

# Verifique se as tabelas foram criadas
psql $DATABASE_URL -c "\dt"

# Teste a conexão
psql $DATABASE_URL -c "SELECT version();"
```

#### 🔧 Recursos do Banco
- **Índices otimizados** para consultas rápidas
- **Triggers automáticos** para updated_at
- **Constraints de integridade** referencial
- **Funções personalizadas** para lógica de negócio
- **Dados de exemplo** para desenvolvimento

### 5. Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento com Turbopack
npm run dev

# A aplicação estará disponível em:
# 🌐 http://localhost:3000
```

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
raisecapital/
├── 📁 .github/workflows/          # CI/CD e automações
├── 📁 database/migrations/        # Scripts de migração do banco
├── 📁 docs/                       # Documentação (termos, políticas)
├── 📁 public/                     # Assets estáticos
│   ├── 📁 assets/                 # Imagens e ícones do dashboard
│   ├── 📁 conselho/               # Fotos do conselho consultivo
│   ├── 📁 nossaequipe/            # Fotos da equipe
│   ├── 📁 offers/                 # Ícones dos segmentos
│   ├── 📁 segmentos/              # Imagens dos setores
│   └── 📁 uploads/                # Arquivos enviados pelos usuários
├── 📁 scripts/                    # Scripts de manutenção e migração
├── 📁 src/
│   ├── 📁 app/                    # App Router (Next.js 15)
│   │   ├── 📁 api/                # API Routes (endpoints)
│   │   ├── 📁 auth/               # Páginas de autenticação
│   │   ├── 📁 blog/               # Sistema de blog integrado
│   │   ├── 📁 conta/              # Dashboard do investidor
│   │   ├── 📁 dashboard/          # Painel administrativo
│   │   ├── 📁 empresa/            # Dashboard da empresa
│   │   ├── 📁 ofertas/            # Páginas públicas de ofertas
│   │   ├── 📁 projetos/           # Detalhes dos projetos
│   │   ├── 📁 capte-recursos/     # Landing para empresas
│   │   ├── 📁 material-didatico/  # Conteúdo educativo
│   │   ├── 📁 codigo-de-conduta/  # Página de conduta
│   │   ├── 📁 privacidade/        # Política de privacidade
│   │   ├── 📁 termos/             # Termos de uso
│   │   ├── 📄 globals.css         # Estilos globais Tailwind
│   │   ├── 📄 layout.tsx          # Layout raiz da aplicação
│   │   └── 📄 page.tsx            # Landing page principal
│   ├── 📁 components/             # Componentes reutilizáveis
│   │   ├── 📁 ui/                 # Componentes base (shadcn/ui)
│   │   ├── 📁 blog/               # Componentes específicos do blog
│   │   ├── 📄 *-nav.tsx           # Componentes de navegação
│   │   ├── 📄 *-card.tsx          # Cards e estatísticas
│   │   └── 📄 *.tsx               # Outros componentes especializados
│   ├── 📁 lib/                    # Utilitários e configurações
│   │   ├── 📄 auth.ts             # Sistema de autenticação JWT
│   │   ├── 📄 db.ts               # Conexão PostgreSQL
│   │   ├── 📄 email.ts            # Sistema de e-mail
│   │   ├── 📄 blog.ts             # Lógica do blog
│   │   ├── 📄 alchemy.ts          # Integração Alchemy SDK
│   │   ├── 📄 asaas.ts            # Gateway de pagamento
│   │   └── 📄 utils.ts            # Funções utilitárias
│   └── 📁 hooks/                  # Custom React Hooks
│       └── 📄 use-mobile.ts       # Hook para detecção mobile
├── 📄 components.json             # Configuração shadcn/ui
├── 📄 next.config.ts              # Configuração Next.js
├── 📄 package.json                # Dependências e scripts
├── 📄 tailwind.config.js          # Configuração Tailwind CSS
└── 📄 tsconfig.json               # Configuração TypeScript
```

### Padrões de Desenvolvimento

#### 🎨 Componentes UI
```typescript
// Exemplo de componente com Tailwind + CVA
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

#### 🔄 Gerenciamento de Estado
```typescript
// Hook personalizado para estado de formulário
import { useState } from 'react'

function useFormState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const [isLoading, setIsLoading] = useState(false)
  
  const updateField = (field: keyof T, value: T[keyof T]) => {
    setState(prev => ({ ...prev, [field]: value }))
  }
  
  return { state, updateField, isLoading, setIsLoading }
}
```

## 🔧 Scripts NPM Disponíveis

| Script | Descrição | Uso |
|--------|-----------|-----|
| `dev` | Servidor de desenvolvimento com Turbopack | `npm run dev` |
| `build` | Build otimizado para produção | `npm run build` |
| `start` | Servidor de produção | `npm start` |
| `lint` | Verificação de código com ESLint | `npm run lint` |
| `lint:fix` | Correção automática de problemas | `npm run lint -- --fix` |
| `db:migrate` | Execução de migrações do banco | `npm run db:migrate` |
| `type-check` | Verificação de tipos TypeScript | `npx tsc --noEmit` |

## 🚀 Build e Deploy

### Build Local
```bash
# Build da aplicação
npm run build

# Teste local do build
npm start
```

### Deploy na Vercel

1. **Conecte o repositório** à Vercel
2. **Configure as variáveis de ambiente**:
   ```bash
   DATABASE_URL=postgres://...
   BETTER_AUTH_SECRET=...
   BETTER_AUTH_URL=https://your-domain.vercel.app
   # ... outras variáveis
   ```
3. **Deploy automático** a cada push na branch `main`

### Outras Plataformas

#### Docker
```dockerfile
# Dockerfile exemplo
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuição

### Fluxo de Desenvolvimento

1. **Fork** o repositório
2. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Faça commits** seguindo o padrão:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```
4. **Push** para sua branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request**

### Padrões de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção

### Code Review

- ✅ Código segue os padrões ESLint
- ✅ Componentes são tipados com TypeScript
- ✅ Testes passam (quando aplicável)
- ✅ Build é bem-sucedido
- ✅ Documentação atualizada

## 📚 Recursos Úteis

- 📖 **[Next.js Documentation](https://nextjs.org/docs)** - Framework React
- 🎨 **[Tailwind CSS](https://tailwindcss.com/docs)** - Framework CSS
- 🧩 **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- 🔐 **[JWT (Jose)](https://github.com/panva/jose)** - Autenticação customizada
- 📊 **[Recharts](https://recharts.org/)** - Gráficos React
- ✍️ **[TipTap](https://tiptap.dev/)** - Editor de texto rico

## 📞 Suporte

Para dúvidas ou suporte técnico:

- 📧 **Email**: contato@codnodo.com
- 💬 **Slack**: #codnodo
- 📋 **Issues**: Use o sistema de issues do GitHub

---

## 📄 Licença

**Todos os direitos reservados © 2025 Codnodo Studio**

Este projeto é proprietário e confidencial. O uso, distribuição ou modificação sem autorização expressa é estritamente proibido.

---

<div align="center">
  <strong>🚀 Construído com Next.js 15, React 19 e muito ☕</strong>
</div>
