# Raise Capital

Landing page construída com Next.js (App Router) e Tailwind CSS, com componentes de UI no estilo shadcn/ui. Inclui seções institucionais e cards com imagens otimizadas.

## Destaques
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- Componentes de UI locais (inspirados no shadcn/ui)
- Animações com framer-motion
- Ícones com lucide-react
- Charts com Recharts (componentes utilitários prontos)
- Imagens otimizadas com next/image (Sharp)

## Pré‑requisitos
- Node.js e npm instalados

## Instalação e uso
```bash
npm install
npm run dev
```
Abra http://localhost:3000 para visualizar.

Build de produção e servidor:
```bash
npm run build
npm start
```

Lint:
```bash
npm run lint
```

## Scripts
- dev: Inicia o Dev Server com Turbopack
- build: Build de produção com Turbopack
- start: Sobe o servidor em produção
- lint: Executa o ESLint

## Estrutura do projeto
- src/app/
  - layout.tsx: layout raiz e metadata
  - page.tsx: composição da landing page (seções e conteúdo)
- src/components/ui/: componentes básicos (Button, Card, Badge, etc.)
- src/lib/utils.ts: utilitários (ex.: composição de classes)
- public/: assets e imagens (inclui as imagens dos cards e ícones)

## Seções principais
- Hero e chamadas
- Benefícios da Raise Capital (layout em 2 colunas)
- Como Investir (3 cards: Cadastre‑se, Explore e Invista, cada um com imagem)
- Para Investidores (fundo #f2f2f2)
- Outras seções institucionais conforme evoluções

## Personalização
- Conteúdo: edite src/app/page.tsx
- Estilos: utilize classes do Tailwind (ex.: cores arbitrárias como bg-[#f2f2f2])
- Imagens: adicione em /public e referencie em src/app/page.tsx com next/image

## Deploy
Recomendado: Vercel.
- Build Command: `npm run build`
- Output: `.next`

Contribuições e melhorias são bem‑vindas!
