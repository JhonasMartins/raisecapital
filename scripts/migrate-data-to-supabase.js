#!/usr/bin/env node

/**
 * Script para migrar dados do PostgreSQL local para Supabase
 * 
 * Este script:
 * 1. Conecta ao banco local (origem)
 * 2. Conecta ao Supabase (destino)
 * 3. Migra dados das tabelas principais
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configurações de conexão
const LOCAL_DB_CONFIG = {
  connectionString: 'postgresql://jhonasleismann@localhost:5432/raisecapital',
  ssl: false
};

const SUPABASE_DB_CONFIG = {
  connectionString: 'postgresql://postgres.zaybwuyceusiktocgrff:Kx5arw5GBNZYXZC4@aws-1-sa-east-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
};

// Tabelas para migrar (em ordem de dependência)
const TABLES_TO_MIGRATE = [
  'users',
  'empresas', 
  'ofertas',
  'investidores',
  'investimentos',
  'documentos',
  'acoes',
  'captacao_mensal',
  'dados_bancarios',
  'distribuicao_carteira',
  'kpis_empresa',
  'movimentacoes',
  'relatorios',
  'rendimentos'
];

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

async function getTableData(client, tableName) {
  try {
    const result = await client.query(`SELECT * FROM ${tableName}`);
    return result.rows;
  } catch (error) {
    console.error(`❌ Erro ao buscar dados da tabela ${tableName}:`, error.message);
    return [];
  }
}

async function getTableColumns(client, tableName) {
  try {
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `, [tableName]);
    return result.rows;
  } catch (error) {
    console.error(`❌ Erro ao buscar colunas da tabela ${tableName}:`, error.message);
    return [];
  }
}

async function insertData(client, tableName, data) {
  if (data.length === 0) {
    console.log(`⚠️  Tabela ${tableName} está vazia, pulando...`);
    return;
  }

  try {
    // Primeiro, limpar a tabela de destino
    await client.query(`DELETE FROM ${tableName}`);
    console.log(`🧹 Tabela ${tableName} limpa`);

    // Obter colunas da primeira linha para construir o INSERT
    const columns = Object.keys(data[0]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = columns.join(', ');
    
    const insertQuery = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
    
    let insertedCount = 0;
    for (const row of data) {
      try {
        const values = columns.map(col => row[col]);
        await client.query(insertQuery, values);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Erro ao inserir linha na tabela ${tableName}:`, error.message);
        console.error('Dados da linha:', row);
      }
    }
    
    console.log(`✅ Migrados ${insertedCount}/${data.length} registros para ${tableName}`);
  } catch (error) {
    console.error(`❌ Erro ao migrar tabela ${tableName}:`, error.message);
  }
}

async function migrateTable(sourceClient, targetClient, tableName) {
  console.log(`\n📦 Migrando tabela: ${tableName}`);
  
  // Verificar se a tabela existe no banco de origem
  try {
    await sourceClient.query(`SELECT 1 FROM ${tableName} LIMIT 1`);
  } catch (error) {
    console.log(`⚠️  Tabela ${tableName} não existe no banco de origem, pulando...`);
    return;
  }

  // Buscar dados do banco de origem
  const data = await getTableData(sourceClient, tableName);
  console.log(`📊 Encontrados ${data.length} registros em ${tableName}`);
  
  if (data.length > 0) {
    // Inserir dados no Supabase
    await insertData(targetClient, tableName, data);
  }
}

async function main() {
  console.log('🚀 Iniciando migração de dados para Supabase...\n');
  
  let sourceClient, targetClient;
  
  try {
    // Conectar aos bancos
    sourceClient = await connectToDatabase(LOCAL_DB_CONFIG, 'PostgreSQL Local');
    targetClient = await connectToDatabase(SUPABASE_DB_CONFIG, 'Supabase');
    
    // Migrar cada tabela
    for (const tableName of TABLES_TO_MIGRATE) {
      await migrateTable(sourceClient, targetClient, tableName);
    }
    
    console.log('\n✅ Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error.message);
    process.exit(1);
  } finally {
    // Fechar conexões
    if (sourceClient) {
      await sourceClient.end();
      console.log('🔌 Conexão com PostgreSQL Local fechada');
    }
    if (targetClient) {
      await targetClient.end();
      console.log('🔌 Conexão com Supabase fechada');
    }
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };