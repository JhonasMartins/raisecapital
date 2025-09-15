#!/usr/bin/env node

/**
 * Script para migrar artigos do blog hardcoded para o Supabase
 * 
 * Este script:
 * 1. Lê os artigos definidos no código (src/lib/blog.ts)
 * 2. Converte para o formato do banco de dados
 * 3. Insere no Supabase
 */

const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configuração de conexão com Supabase
const SUPABASE_DB_CONFIG = {
  connectionString: 'postgresql://postgres.zaybwuyceusiktocgrff:Kx5arw5GBNZYXZC4@aws-1-sa-east-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
};

// Função para criar slug
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

// Artigos hardcoded do sistema atual
const baseArticles = [
  {
    title: 'Como investir em startups com segurança',
    excerpt: 'Entenda os princípios de análise de risco, diversificação e como avaliar oportunidades no equity crowdfunding.',
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
    excerpt: 'Compare as modalidades de captação mais comuns no mercado e descubra qual se adequa ao seu perfil.',
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
    excerpt: 'Uma lista prática do que observar antes de investir: equipe, mercado, métricas e termos da oferta.',
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
    excerpt: 'Veja as etapas de uma oferta: preparação, campanha, fechamento e pós-captação.',
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
];

async function connectToDatabase() {
  const client = new Client(SUPABASE_DB_CONFIG);
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    return client;
  } catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error.message);
    throw error;
  }
}

async function migrateBlogArticles(client) {
  console.log('\n📦 Migrando artigos do blog...');
  
  try {
    // Limpar tabela blog
    await client.query('DELETE FROM blog');
    console.log('🧹 Tabela blog limpa');

    let insertedCount = 0;
    
    for (const article of baseArticles) {
      try {
        const slug = slugify(article.title);
        const bodyHtml = article.body.map(p => `<p>${p}</p>`).join('\n');
        const categoriesJson = JSON.stringify(article.categories);
        
        const insertQuery = `
          INSERT INTO blog (
            titulo, slug, resumo, data_publicacao, autor, 
            capa, categorias, corpo, corpo_html, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        `;
        
        const values = [
          article.title, // titulo
          slug, // slug
          article.excerpt, // resumo
          new Date(article.date), // data_publicacao
          article.author, // autor
          article.cover, // capa
          article.categories, // categorias (array direto)
          article.body, // corpo (array direto)
          bodyHtml // corpo_html
        ];
        
        await client.query(insertQuery, values);
        insertedCount++;
        console.log(`✅ Artigo migrado: ${article.title}`);
        
      } catch (error) {
        console.error(`❌ Erro ao inserir artigo "${article.title}":`, error.message);
      }
    }
    
    console.log(`\n✅ Migrados ${insertedCount}/${baseArticles.length} artigos do blog`);
    
  } catch (error) {
    console.error('❌ Erro ao migrar artigos do blog:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando migração dos artigos do blog para Supabase...\n');
  
  let client;
  
  try {
    client = await connectToDatabase();
    await migrateBlogArticles(client);
    
    console.log('\n✅ Migração dos artigos concluída com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log('🔌 Conexão com Supabase fechada');
    }
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };