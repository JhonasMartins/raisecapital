import { slugify } from '@/lib/utils'

export type Article = {
  title: string
  slug: string
  excerpt: string
  date: string
  author: string
  cover: string
  categories: string[]
  body: string[]
}

const baseArticles = [
  {
    title: 'Como investir em startups com segurança',
    excerpt:
      'Entenda os princípios de análise de risco, diversificação e como avaliar oportunidades no equity crowdfunding.',
    date: '2025-08-01',
    author: 'Equipe Raise Capital',
    cover: '/globe.svg',
    categories: ['Investimento', 'Crowdfunding'],
    body: [
      'Investir em startups exige uma abordagem estruturada para equilibrar risco e retorno.',
      'Uma das melhores práticas é diversificar, alocando pequenos tickets em várias oportunidades.',
      'Além disso, leia atentamente as informações essenciais da oferta e entenda o modelo do negócio.',
    ],
  },
  {
    title: 'Equity x Dívida: qual modalidade escolher?',
    excerpt:
      'Compare as modalidades de captação mais comuns no mercado e descubra qual se adequa ao seu perfil.',
    date: '2025-07-20',
    author: 'Equipe Raise Capital',
    cover: '/file.svg',
    categories: ['Modalidades', 'Educação Financeira'],
    body: [
      'Equity busca participação acionária, com retorno potencial no longo prazo.',
      'Dívida foca em pagamentos periódicos e prazos definidos, com perfil diferente de risco.',
      'Cada modalidade tem vantagens que dependem do objetivo do investidor.',
    ],
  },
  {
    title: 'Checklist para analisar uma oferta',
    excerpt:
      'Uma lista prática do que observar antes de investir: equipe, mercado, métricas e termos da oferta.',
    date: '2025-07-03',
    author: 'Equipe Raise Capital',
    cover: '/window.svg',
    categories: ['Checklist', 'Due Diligence'],
    body: [
      'Avalie a experiência do time fundador e o histórico de execução.',
      'Entenda o tamanho do mercado e as vantagens competitivas da empresa.',
      'Revise as condições da oferta, como valuation, meta e uso de recursos.',
    ],
  },
  {
    title: 'Como funciona o processo de captação',
    excerpt:
      'Veja as etapas de uma oferta: preparação, campanha, fechamento e pós-captação.',
    date: '2025-06-15',
    author: 'Equipe Raise Capital',
    cover: '/next.svg',
    categories: ['Processo', 'Plataforma'],
    body: [
      'A captação começa com a seleção e preparação das informações.',
      'Durante a campanha, a empresa apresenta seu caso e responde dúvidas dos investidores.',
      'Após o fechamento, ocorre a formalização e acompanhamento da empresa.',
    ],
  },
] as const

export const articles: Article[] = baseArticles.map((a) => ({
  ...a,
  slug: slugify(a.title),
  categories: [...a.categories],
  body: [...a.body],
}))

export function listArticles(): Article[] {
  return articles
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}