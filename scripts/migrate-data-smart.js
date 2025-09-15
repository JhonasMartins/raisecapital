#!/usr/bin/env node

/**
 * Script inteligente para migrar dados do PostgreSQL local para Supabase
 * 
 * Este script:
 * 1. Detecta diferenças de schema entre origem e destino
 * 2. Converte tipos de dados automaticamente (int -> uuid, etc.)
 * 3. Migra dados preservando relacionamentos
 */

const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configurações de conexão
const LOCAL_DB_CONFIG = {
  connectionString: 'postgresql://jhonasleismann@localhost:5432/raisecapital',
  ssl: false
};

const SUPABASE_DB_CONFIG = {
  connectionString: 'postgresql://postgres.zaybwuyceusiktocgrff:Kx5arw5GBNZYXZC4@aws-1-sa-east-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
};

// Mapeamento de IDs antigos para novos UUIDs
const idMapping = new Map();

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

async function getTableSchema(client, tableName) {
  try {
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `, [tableName]);
    return result.rows;
  } catch (error) {
    console.error(`❌ Erro ao buscar schema da tabela ${tableName}:`, error.message);
    return [];
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

function convertValue(value, sourceType, targetType, columnName, tableName) {
  if (value === null || value === undefined) {
    return null;
  }

  // Conversão de ID inteiro para UUID
  if (columnName === 'id' && sourceType === 'integer' && targetType === 'uuid') {
    const key = `${tableName}_${value}`;
    if (!idMapping.has(key)) {
      idMapping.set(key, uuidv4());
    }
    return idMapping.get(key);
  }

  // Conversão de foreign keys (campos que terminam com _id)
  if (columnName.endsWith('_id') && sourceType === 'integer' && targetType === 'uuid') {
    const referencedTable = columnName.replace('_id', '');
    const key = `${referencedTable}_${value}`;
    if (idMapping.has(key)) {
      return idMapping.get(key);
    }
    // Se não encontrar o mapeamento, gerar um novo UUID
    const newUuid = uuidv4();
    idMapping.set(key, newUuid);
    return newUuid;
  }

  // Conversão de timestamps
  if (targetType === 'timestamp with time zone' && value instanceof Date) {
    return value.toISOString();
  }

  // Conversão de boolean
  if (targetType === 'boolean') {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  }

  // Conversão de números
  if (targetType.includes('numeric') || targetType.includes('decimal')) {
    return parseFloat(value);
  }

  if (targetType === 'integer' || targetType === 'bigint') {
    return parseInt(value);
  }

  // Conversão de texto
  if (targetType.includes('text') || targetType.includes('varchar')) {
    return String(value);
  }

  return value;
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

  // Buscar schemas
  const sourceSchema = await getTableSchema(sourceClient, tableName);
  const targetSchema = await getTableSchema(targetClient, tableName);
  
  if (targetSchema.length === 0) {
    console.log(`⚠️  Tabela ${tableName} não existe no Supabase, pulando...`);
    return;
  }

  // Buscar dados do banco de origem
  const sourceData = await getTableData(sourceClient, tableName);
  console.log(`📊 Encontrados ${sourceData.length} registros em ${tableName}`);
  
  if (sourceData.length === 0) {
    console.log(`⚠️  Tabela ${tableName} está vazia, pulando...`);
    return;
  }

  try {
    // Limpar a tabela de destino
    await targetClient.query(`DELETE FROM ${tableName}`);
    console.log(`🧹 Tabela ${tableName} limpa`);

    // Criar mapeamento de tipos
    const typeMapping = new Map();
    targetSchema.forEach(col => {
      const sourceCol = sourceSchema.find(s => s.column_name === col.column_name);
      if (sourceCol) {
        typeMapping.set(col.column_name, {
          sourceType: sourceCol.data_type,
          targetType: col.data_type
        });
      }
    });

    // Migrar dados linha por linha
    let insertedCount = 0;
    for (const row of sourceData) {
      try {
        // Converter valores conforme os tipos
        const convertedRow = {};
        for (const [columnName, value] of Object.entries(row)) {
          const mapping = typeMapping.get(columnName);
          if (mapping) {
            convertedRow[columnName] = convertValue(
              value, 
              mapping.sourceType, 
              mapping.targetType, 
              columnName, 
              tableName
            );
          } else {
            convertedRow[columnName] = value;
          }
        }

        // Construir query de inserção
        const columns = Object.keys(convertedRow);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const columnNames = columns.join(', ');
        const values = columns.map(col => convertedRow[col]);
        
        const insertQuery = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
        await targetClient.query(insertQuery, values);
        insertedCount++;
        
      } catch (error) {
        console.error(`❌ Erro ao inserir linha na tabela ${tableName}:`, error.message);
        console.error('Dados da linha original:', row);
      }
    }
    
    console.log(`✅ Migrados ${insertedCount}/${sourceData.length} registros para ${tableName}`);
    
  } catch (error) {
    console.error(`❌ Erro ao migrar tabela ${tableName}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando migração inteligente de dados para Supabase...\n');
  
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
    console.log(`📋 Mapeamentos de ID criados: ${idMapping.size}`);
    
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