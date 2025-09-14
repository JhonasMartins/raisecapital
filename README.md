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

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router e Server Components
- **[React 19](https://react.dev/)** - Biblioteca para interfaces de usuário com hooks modernos
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first

### UI & Componentes
- **Componentes customizados** inspirados no [shadcn/ui](https://ui.shadcn.com/)
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos acessíveis e não-estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones SVG otimizados
- **[Framer Motion](https://www.framer.com/motion/)** - Animações fluidas e interativas

### Dados & Estado
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional robusto
- **[Better Auth](https://www.better-auth.com/)** - Sistema de autenticação moderno
- **React Hooks** - Gerenciamento de estado com `useState`, `useReducer`

### Ferramentas & Utilitários
- **[Recharts](https://recharts.org/)** - Gráficos e visualizações de dados
- **[TipTap](https://tiptap.dev/)** - Editor de texto rico e extensível
- **[Sharp](https://sharp.pixelplumbing.com/)** - Processamento de imagens otimizado
- **[Turbopack](https://turbo.build/pack)** - Bundler ultra-rápido para desenvolvimento

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
- **Better Auth** para autenticação moderna
- **Proteção de rotas** com middleware
- **Sanitização de dados** com sanitize-html
- **Validação robusta** em formulários

## 📋 Pré-requisitos

- **Node.js** LTS (>= 18.0.0)
- **npm** ou **yarn** para gerenciamento de pacotes
- **PostgreSQL** (>= 12.0) disponível e acessível
- **Git** para controle de versão

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd raisecapital
```

### 2. Instale as Dependências
```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

### 3. Configuração de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# 🗄️ Banco de Dados
DATABASE_URL="postgres://USER:PASS@HOST:5432/DBNAME"
DATABASE_SSL=false  # Para desenvolvimento local

# 🔐 Autenticação (Better Auth)
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# 📧 Email (Nodemailer)
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"

# ☁️ Upload de Arquivos (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 4. Configuração do Banco de Dados

```bash
# Execute as migrações
npm run db:migrate

# Verifique a conexão
psql $DATABASE_URL -c "SELECT version();"
```

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
├── 📁 src/
│   ├── 📁 app/                    # App Router (Next.js 15)
│   │   ├── 📁 (auth)/             # Grupo de rotas de autenticação
│   │   ├── 📁 conta/              # Dashboard do investidor
│   │   ├── 📁 ofertas/            # Sistema de ofertas
│   │   ├── 📁 blog/               # Blog e posts
│   │   ├── 📁 api/                # Route Handlers (API)
│   │   └── 📄 layout.tsx          # Layout raiz
│   ├── 📁 components/             # Componentes React
│   │   ├── 📁 ui/                 # Componentes base (shadcn-style)
│   │   └── 📁 sections/           # Seções específicas
│   └── 📁 lib/                    # Utilitários e configurações
│       ├── 📄 db.ts               # Conexão PostgreSQL
│       ├── 📄 auth.ts             # Configuração Better Auth
│       └── 📄 utils.ts            # Funções utilitárias
├── 📁 public/                     # Assets estáticos
├── 📁 scripts/                    # Scripts de migração
└── 📄 tailwind.config.js          # Configuração Tailwind CSS
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
- 🔐 **[Better Auth](https://www.better-auth.com/)** - Autenticação moderna
- 📊 **[Recharts](https://recharts.org/)** - Gráficos React
- ✍️ **[TipTap](https://tiptap.dev/)** - Editor de texto rico

## 📞 Suporte

Para dúvidas ou suporte técnico:

- 📧 **Email**: dev@raisecapital.com.br
- 💬 **Slack**: #dev-team
- 📋 **Issues**: Use o sistema de issues do GitHub

---

## 📄 Licença

**Todos os direitos reservados © 2024 Raise Capital**

Este projeto é proprietário e confidencial. O uso, distribuição ou modificação sem autorização expressa é estritamente proibido.

---

<div align="center">
  <strong>🚀 Construído com Next.js 15, React 19 e muito ☕</strong>
</div>
