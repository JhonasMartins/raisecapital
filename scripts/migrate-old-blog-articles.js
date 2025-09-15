#!/usr/bin/env node

/**
 * Script para migrar artigos do banco antigo para o Supabase
 * 
 * Este script:
 * 1. Conecta ao banco antigo PostgreSQL
 * 2. Busca todos os artigos existentes
 * 3. Migra para o Supabase convertendo IDs para UUID
 */

const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configuração de conexão com banco antigo
const OLD_DB_CONFIG = {
  connectionString: 'postgresql://raisecapitaldatabase:150523272942150523805628soft99@65.109.3.180:5433/raisecapitaldatabase',
  ssl: false
};

// Configuração de conexão com Supabase
const SUPABASE_DB_CONFIG = {
  connectionString: 'postgresql://postgres.zaybwuyceusiktocgrff:Kx5arw5GBNZYXZC4@aws-1-sa-east-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
};

/**
 * Conecta a um banco de dados
 */
async function connectToDatabase(config, name) {
  const client = new Client(config);
  try {
    await client.connect();
    console.log(`✅ Conectado ao ${name}`);
    return client;
  } catch (error) {
    console.error(`❌ Erro ao conectar ao ${name}:`, error.message);
    throw error;
  }
}

/**
 * Converte array PostgreSQL para formato JSON
 */
function parsePostgresArray(pgArray) {
  if (!pgArray) return [];
  if (Array.isArray(pgArray)) return pgArray;
  
  // Remove chaves e divide por vírgulas, tratando aspas
  const cleaned = pgArray.replace(/^\{|\}$/g, '');
  if (!cleaned) return [];
  
  return cleaned.split(',').map(item => 
    item.replace(/^"(.*)"$/, '$1').trim()
  ).filter(item => item.length > 0);
}

/**
 * Converte corpo do artigo para HTML simples
 */
function convertBodyToHtml(bodyArray) {
  if (!bodyArray || !Array.isArray(bodyArray)) return '';
  
  return bodyArray
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('\n');
}

/**
 * Migra artigos do banco antigo para o Supabase
 */
async function migrateArticles() {
  let oldClient, supabaseClient;
  
  try {
    // Conectar aos bancos
    oldClient = await connectToDatabase(OLD_DB_CONFIG, 'Banco Antigo');
    supabaseClient = await connectToDatabase(SUPABASE_DB_CONFIG, 'Supabase');
    
    console.log('\n📦 Buscando artigos no banco antigo...');
    
    // Buscar todos os artigos do banco antigo
    const result = await oldClient.query(`
      SELECT id, titulo, slug, resumo, data_publicacao, autor, capa, categorias, corpo, corpo_html
      FROM blog 
      ORDER BY data_publicacao DESC
    `);
    
    const articles = result.rows;
    console.log(`📄 Encontrados ${articles.length} artigos no banco antigo`);
    
    if (articles.length === 0) {
      console.log('⚠️  Nenhum artigo encontrado para migrar');
      return;
    }
    
    // Limpar tabela blog no Supabase antes da migração
    console.log('\n🧹 Limpando tabela blog no Supabase...');
    await supabaseClient.query('DELETE FROM blog');
    console.log('✅ Tabela blog limpa');
    
    console.log('\n🚀 Iniciando migração dos artigos...');
    
    let migratedCount = 0;
    
    for (const article of articles) {
      try {
        // Processar categorias
        const categorias = parsePostgresArray(article.categorias);
        
        // Processar corpo
        const corpo = parsePostgresArray(article.corpo);
        
        // Gerar HTML do corpo se não existir
        let corpoHtml = article.corpo_html;
        if (!corpoHtml && corpo.length > 0) {
          corpoHtml = convertBodyToHtml(corpo);
        }
        
        // Inserir no Supabase usando o ID original (bigint)
        await supabaseClient.query(`
          INSERT INTO blog (
            titulo, slug, resumo, data_publicacao, autor, capa, categorias, corpo, corpo_html, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        `, [
          article.titulo,
          article.slug,
          article.resumo,
          article.data_publicacao,
          article.autor,
          article.capa,
          categorias,
          corpo,
          corpoHtml
        ]);
        
        migratedCount++;
        console.log(`✅ Artigo migrado (${migratedCount}/${articles.length}): ${article.titulo}`);
        
      } catch (error) {
        console.error(`❌ Erro ao migrar artigo "${article.titulo}":`, error.message);
      }
    }
    
    console.log(`\n✅ Migração concluída: ${migratedCount}/${articles.length} artigos migrados`);
    
    // Verificar migração
    const verifyResult = await supabaseClient.query('SELECT COUNT(*) as total FROM blog');
    console.log(`📊 Total de artigos no Supabase: ${verifyResult.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
    throw error;
  } finally {
    // Fechar conexões
    if (oldClient) {
      await oldClient.end();
      console.log('🔌 Conexão com banco antigo fechada');
    }
    if (supabaseClient) {
      await supabaseClient.end();
      console.log('🔌 Conexão com Supabase fechada');
    }
  }
}

// Executar migração
console.log('🚀 Iniciando migração dos artigos do banco antigo para Supabase...\n');

migrateArticles()
  .then(() => {
    console.log('\n✅ Migração dos artigos concluída com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Falha na migração:', error.message);
    process.exit(1);
  });