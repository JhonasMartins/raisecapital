const { Pool } = require('pg');

// Configuração do banco antigo
const oldDbPool = new Pool({
  connectionString: 'postgresql://raisecapitaldatabase:150523272942150523805628soft99@65.109.3.180:5433/raisecapitaldatabase'
});

// Configuração do banco PostgreSQL atual
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Função para mapear status do banco antigo para o PostgreSQL
function mapStatus(oldStatus) {
  const statusMap = {
    'Em captação': 'ativa',
    'Encerrada': 'encerrada',
    'Pausada': 'pausada',
    'Cancelada': 'cancelada',
    'Rascunho': 'rascunho'
  };
  return statusMap[oldStatus] || 'rascunho';
}

// Função para mapear modalidade do banco antigo para o PostgreSQL
function mapTipo(modalidade) {
  const tipoMap = {
    'Equity': 'equity',
    'Dívida': 'debt',
    'Híbrido': 'hybrid'
  };
  return tipoMap[modalidade] || 'equity';
}

// Função para criar uma empresa temporária se necessário
async function createTempCompany(pgClient) {
  try {
    // Verificar se já existe uma empresa
    const existingCompany = await pgClient.query('SELECT id FROM empresas LIMIT 1');
    if (existingCompany.rows.length > 0) {
      return existingCompany.rows[0].id;
    }

    // Buscar um usuário existente
    const userResult = await pgClient.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      throw new Error('Nenhum usuário encontrado no PostgreSQL');
    }
    const userId = userResult.rows[0].id;

    // Criar empresa temporária
    const companyResult = await pgClient.query(`
      INSERT INTO empresas (
        razao_social, 
        nome_fantasia, 
        cnpj, 
        user_id
      ) VALUES (
        'Empresa Temporária para Migração',
        'Empresa Temp',
        '00000000000100',
        $1
      ) RETURNING id
    `, [userId]);

    console.log('Empresa temporária criada com ID:', companyResult.rows[0].id);
    return companyResult.rows[0].id;
  } catch (error) {
    console.error('Erro ao criar empresa temporária:', error);
    throw error;
  }
}

async function migrateOfertas() {
  let oldDbClient;
  let pgClient;

  try {
    console.log('Conectando aos bancos de dados...');
    oldDbClient = await oldDbPool.connect();
    pgClient = await pgPool.connect();

    // Criar empresa temporária se necessário
    const empresaId = await createTempCompany(pgClient);

    // Buscar ofertas do banco antigo
    console.log('Buscando ofertas do banco antigo...');
    const ofertasResult = await oldDbClient.query(`
      SELECT 
        id,
        nome,
        slug,
        status,
        categoria,
        modalidade,
        minimo_investimento,
        arrecadado,
        meta,
        data_limite,
        capa,
        created_at,
        updated_at,
        prazo_texto,
        subtitulo,
        produto,
        pagamento,
        tir,
        resumo_pdf,
        sobre_operacao,
        sobre_empresa,
        empreendedores,
        financeiros,
        documentos,
        informacoes_essenciais,
        investidores,
        tipo_categoria
      FROM ofertas
      ORDER BY id
    `);

    console.log(`Encontradas ${ofertasResult.rows.length} ofertas para migrar`);

    // Migrar cada oferta
    for (const oferta of ofertasResult.rows) {
      try {
        console.log(`Migrando oferta: ${oferta.nome}`);

        const insertResult = await pgClient.query(`
          INSERT INTO ofertas (
            nome,
            descricao,
            categoria,
            modalidade,
            tipo,
            meta,
            ticket_minimo,
            prazo_texto,
            tir_esperada,
            empresa_id,
            data_inicio,
            data_fim,
            status,
            created_at,
            updated_at,
            sobre_operacao,
            sobre_empresa,
            empreendedores,
            financeiros,
            documentos,
            informacoes_essenciais,
            investidores,
            tipo_categoria,
            subtitulo,
            pagamento,
            tir,
            resumo_pdf,
            cover_url
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
          ) RETURNING id
        `, [
          oferta.nome,
          oferta.subtitulo || oferta.produto || 'Descrição não disponível',
          oferta.categoria || 'Outros',
          oferta.modalidade,
          mapTipo(oferta.modalidade),
          oferta.meta ? parseFloat(oferta.meta) : null,
          oferta.minimo_investimento ? parseFloat(oferta.minimo_investimento) : null,
          oferta.prazo_texto,
          oferta.tir ? parseFloat(oferta.tir) : null,
          empresaId,
          oferta.created_at,
          oferta.data_limite,
          mapStatus(oferta.status),
          oferta.created_at,
          oferta.updated_at,
          oferta.sobre_operacao,
          oferta.sobre_empresa,
          oferta.empreendedores ? JSON.stringify(oferta.empreendedores) : null,
          oferta.financeiros ? JSON.stringify(oferta.financeiros) : null,
          oferta.documentos ? JSON.stringify(oferta.documentos) : null,
          oferta.informacoes_essenciais ? JSON.stringify(oferta.informacoes_essenciais) : null,
          oferta.investidores ? JSON.stringify(oferta.investidores) : null,
          oferta.tipo_categoria,
          oferta.subtitulo,
          oferta.pagamento,
          oferta.tir,
          oferta.resumo_pdf,
          oferta.capa
        ]);

        console.log(`Oferta migrada com sucesso. Novo ID: ${insertResult.rows[0].id}`);
      } catch (error) {
        console.error(`Erro ao migrar oferta ${oferta.nome}:`, error.message);
        // Continuar com a próxima oferta
      }
    }

    console.log('Migração de ofertas concluída!');

    // Verificar quantas ofertas foram migradas
    const countResult = await pgClient.query('SELECT COUNT(*) as total FROM ofertas');
    console.log(`Total de ofertas no PostgreSQL após migração: ${countResult.rows[0].total}`);

  } catch (error) {
    console.error('Erro durante a migração:', error);
    throw error;
  } finally {
    if (oldDbClient) oldDbClient.release();
    if (pgClient) pgClient.release();
  }
}

// Executar migração
if (require.main === module) {
  migrateOfertas()
    .then(() => {
      console.log('Migração finalizada com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro na migração:', error);
      process.exit(1);
    });
}

module.exports = { migrateOfertas };