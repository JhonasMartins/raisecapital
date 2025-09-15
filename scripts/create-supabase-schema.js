#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração do banco Supabase
const client = new Client({
  connectionString: 'postgresql://postgres:Kx5arw5GBNZYXZC4@db.zaybwuyceusiktocgrff.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  query_timeout: 60000,
});

async function runMigration(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`\n🔄 Executando: ${path.basename(filePath)}`);
  
  try {
    await client.query(sql);
    console.log(`✅ Sucesso: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Erro em ${path.basename(filePath)}:`, error.message);
    throw error;
  }
}

async function validateSchema() {
  console.log('\n🔍 Validando schema criado...');
  
  const query = `
    SELECT 
      to_regclass('public.ofertas') AS ofertas,
      to_regclass('public.blog') AS blog,
      to_regclass('public.blog_comments') AS blog_comments,
      to_regclass('public.newsletter_subscriptions') AS newsletter_subscriptions,
      to_regclass('public.files') AS files,
      EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='tipo_pessoa'
      ) AS users_campos_perfil;
  `;
  
  try {
    const result = await client.query(query);
    const row = result.rows[0];
    
    console.log('\n📊 Resultado da validação:');
    console.log('- Tabela ofertas:', row.ofertas ? '✅' : '❌');
    console.log('- Tabela blog:', row.blog ? '✅' : '❌');
    console.log('- Tabela blog_comments:', row.blog_comments ? '✅' : '❌');
    console.log('- Tabela newsletter_subscriptions:', row.newsletter_subscriptions ? '✅' : '❌');
    console.log('- Tabela files:', row.files ? '✅' : '❌');
    console.log('- Campos de perfil em users:', row.users_campos_perfil ? '✅' : '❌');
    
    const allValid = row.ofertas && row.blog && row.blog_comments && 
                     row.newsletter_subscriptions && row.files && row.users_campos_perfil;
    
    if (allValid) {
      console.log('\n🎉 Schema criado com sucesso! Todas as tabelas e campos estão presentes.');
    } else {
      console.log('\n⚠️  Algumas tabelas ou campos podem estar faltando.');
    }
    
    return allValid;
  } catch (error) {
    console.error('❌ Erro na validação:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando criação do schema no Supabase...');
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Executar migrações na ordem
    const migrations = [
      'database/migrations/001_create_all_tables.sql',
      'database/migrations/002_alter_users_add_profile_fields.sql',
      'database/migrations/003_finalize_idempotent.sql'
    ];
    
    for (const migration of migrations) {
      const fullPath = path.join(__dirname, '..', migration);
      if (fs.existsSync(fullPath)) {
        await runMigration(fullPath);
      } else {
        console.log(`⚠️  Arquivo não encontrado: ${migration}`);
      }
    }
    
    // Validar resultado
    await validateSchema();
    
  } catch (error) {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

main().catch(console.error);