const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// String de conexão do Supabase direta
const connectionString = 'postgresql://postgres:Kx5arw5GBNZYXZC4@db.zaybwuyceusiktocgrff.supabase.co:5432/postgres';

async function applyRLSPolicies() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 30000,
    query_timeout: 30000,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🚀 Aplicando políticas RLS no Supabase...');
    await client.connect();
    console.log('✅ Conectado ao Supabase via pooler');

    // Executar migração 004 - RLS Policies
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', '004_create_rls_policies.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('🔄 Aplicando políticas RLS...');
    await client.query(migrationSQL);
    console.log('✅ Políticas RLS aplicadas com sucesso!');

    // Validar que RLS está habilitado
    console.log('🔍 Validando configuração RLS...');
    const rlsCheck = await client.query(`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'empresas', 'investidores', 'ofertas', 'investimentos', 'blog', 'blog_comments', 'newsletter_subscriptions', 'files')
      ORDER BY tablename;
    `);
    
    console.log('📊 Status RLS das tabelas:');
    rlsCheck.rows.forEach(row => {
      console.log(`  - ${row.tablename}: ${row.rowsecurity ? '✅ Habilitado' : '❌ Desabilitado'}`);
    });

    // Verificar políticas criadas
    const policiesCheck = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `);
    
    console.log(`📋 Total de políticas criadas: ${policiesCheck.rows.length}`);
    
    await client.end();
    console.log('🎉 Políticas RLS configuradas com sucesso!');
    
  } catch (error) {
    console.error('💥 Erro ao aplicar políticas RLS:', error.message);
    await client.end();
    process.exit(1);
  }
}

applyRLSPolicies();