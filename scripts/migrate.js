/*
  Simple DB setup script for Postgres
  - Creates tables: ofertas, blog
  - Uses env vars: DATABASE_URL and DATABASE_SSL (optional, defaults to true)
  - Safe to re-run (uses IF NOT EXISTS)
*/

require('dotenv').config({ path: '.env.local' })
require('dotenv').config()
const { Pool } = require('pg')

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Please set it in your environment (.env/.env.local).')
    process.exit(1)
  }
  // Default to no SSL if DATABASE_SSL is not explicitly true
  const useSSL = process.env.DATABASE_SSL === 'true'
  const pool = new Pool({
    connectionString,
    max: 5,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Criar tabela users se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        tipo_pessoa VARCHAR(10) DEFAULT 'investidor' CHECK (tipo_pessoa IN ('pf','pj')),
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
    `)

    // ofertas
    await client.query(`
      CREATE TABLE IF NOT EXISTS ofertas (
        id BIGSERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        categoria TEXT NOT NULL,
        tipo_categoria TEXT,
        modalidade TEXT NOT NULL,
        minimo_investimento NUMERIC(12,2) NOT NULL,
        arrecadado NUMERIC(14,2) NOT NULL DEFAULT 0,
        meta NUMERIC(14,2) NOT NULL,
        data_limite DATE,
        prazo_texto TEXT,
        capa TEXT,
        status TEXT NOT NULL DEFAULT 'Em captação',
        subtitulo TEXT,
        produto TEXT,
        pagamento TEXT,
        tir NUMERIC(5,2),
        resumo_pdf TEXT,
        sobre_operacao TEXT,
        sobre_empresa TEXT,
        empreendedores JSONB DEFAULT '[]'::jsonb,
        financeiros JSONB DEFAULT '[]'::jsonb,
        documentos JSONB DEFAULT '[]'::jsonb,
        informacoes_essenciais JSONB DEFAULT '[]'::jsonb,
        investidores JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS ofertas_categoria_idx ON ofertas (categoria);
      CREATE INDEX IF NOT EXISTS ofertas_modalidade_idx ON ofertas (modalidade);
      CREATE INDEX IF NOT EXISTS ofertas_status_idx ON ofertas (status);
    `)

    // Criar/ajustar tabela empresas de forma idempotente
    await client.query(`
      CREATE TABLE IF NOT EXISTS empresas (
        id BIGSERIAL PRIMARY KEY,
        razao_social TEXT,
        cnpj VARCHAR(18),
        nome_fantasia TEXT,
        setor TEXT,
        descricao TEXT,
        website TEXT,
        telefone TEXT,
        endereco_completo TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Garantir colunas essenciais e relacionamento com users
    await client.query(`
      ALTER TABLE empresas
        ADD COLUMN IF NOT EXISTS user_id BIGINT,
        ADD COLUMN IF NOT EXISTS razao_social TEXT,
        ADD COLUMN IF NOT EXISTS nome_empresa TEXT,
        ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18);
    `)

    // Garantir FK (se ainda não existir)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'empresas' AND constraint_name = 'empresas_user_id_fkey'
        ) THEN
          ALTER TABLE empresas
            ADD CONSTRAINT empresas_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END$$;
    `)

    // Índices idempotentes (protegidos por checagem de coluna)
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'empresas' AND column_name = 'user_id'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS empresas_user_id_idx ON empresas (user_id)';
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'empresas' AND column_name = 'cnpj'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS empresas_cnpj_idx ON empresas (cnpj)';
        END IF;
      END$$;
    `)

    // Garantir colunas novas em bases já existentes
    await client.query(`
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS prazo_texto TEXT;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS subtitulo TEXT;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS produto TEXT;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS pagamento TEXT;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS tir NUMERIC(5,2);
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS resumo_pdf TEXT;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS sobre_operacao TEXT;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS sobre_empresa TEXT;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS empreendedores JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS financeiros JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS documentos JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS informacoes_essenciais JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS investidores JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE ofertas ADD COLUMN IF NOT EXISTS tipo_categoria TEXT;
    `)

    // blog
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog (
        id BIGSERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        resumo TEXT NOT NULL,
        data_publicacao DATE NOT NULL,
        autor TEXT,
        capa TEXT,
        categorias TEXT[] NOT NULL DEFAULT '{}',
        corpo TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS blog_data_publicacao_idx ON blog (data_publicacao);
    `)

    // Novas colunas/estruturas para blog
    await client.query(`
      ALTER TABLE blog ADD COLUMN IF NOT EXISTS corpo_html TEXT;
    `)

    // Tabela de comentários do blog
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_comments (
        id BIGSERIAL PRIMARY KEY,
        blog_id BIGINT NOT NULL REFERENCES blog(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS blog_comments_blog_id_idx ON blog_comments (blog_id);
    `)

    // Newsletter subscriptions
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT,
        source TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_unique_idx
        ON newsletter_subscriptions ((lower(email)));
    `)

    // Arquivos binários diretamente no Postgres
    await client.query(`
      CREATE TABLE IF NOT EXISTS files (
        id BIGSERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        mime TEXT,
        size BIGINT NOT NULL,
        data BYTEA NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS files_created_at_idx ON files (created_at);
    `)

    // Users profile fields to support /conta/perfil (idempotent)
    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS tipo_pessoa VARCHAR(10) CHECK (tipo_pessoa IN ('pf','pj')),
        ADD COLUMN IF NOT EXISTS data_nascimento DATE,
        ADD COLUMN IF NOT EXISTS cpf VARCHAR(14),
        ADD COLUMN IF NOT EXISTS rg VARCHAR(20),
        ADD COLUMN IF NOT EXISTS razao_social VARCHAR(255),
        ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18),
        ADD COLUMN IF NOT EXISTS representante_nome VARCHAR(255),
        ADD COLUMN IF NOT EXISTS representante_cpf VARCHAR(14),
        ADD COLUMN IF NOT EXISTS representante_cargo VARCHAR(100),
        ADD COLUMN IF NOT EXISTS cep VARCHAR(10),
        ADD COLUMN IF NOT EXISTS endereco_logradouro VARCHAR(255),
        ADD COLUMN IF NOT EXISTS endereco_numero VARCHAR(20),
        ADD COLUMN IF NOT EXISTS endereco_complemento VARCHAR(255),
        ADD COLUMN IF NOT EXISTS endereco_bairro VARCHAR(100),
        ADD COLUMN IF NOT EXISTS endereco_cidade VARCHAR(100),
        ADD COLUMN IF NOT EXISTS endereco_estado VARCHAR(2),
        ADD COLUMN IF NOT EXISTS endereco_pais VARCHAR(100),
        ADD COLUMN IF NOT EXISTS profissao VARCHAR(100),
        ADD COLUMN IF NOT EXISTS empresa_trabalho VARCHAR(255),
        ADD COLUMN IF NOT EXISTS renda_mensal NUMERIC(15,2),
        ADD COLUMN IF NOT EXISTS patrimonio NUMERIC(15,2),
        ADD COLUMN IF NOT EXISTS banco VARCHAR(100),
        ADD COLUMN IF NOT EXISTS agencia VARCHAR(10),
        ADD COLUMN IF NOT EXISTS conta VARCHAR(20),
        ADD COLUMN IF NOT EXISTS tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente','poupanca')),
        ADD COLUMN IF NOT EXISTS pix_type VARCHAR(20) CHECK (pix_type IN ('cpf','cnpj','email','telefone','aleatoria')),
        ADD COLUMN IF NOT EXISTS pix_key VARCHAR(255),
        ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,
        ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

       CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cpf_unique ON users (cpf) WHERE cpf IS NOT NULL;
       CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cnpj_unique ON users (cnpj) WHERE cnpj IS NOT NULL;
     `)

    // Asaas customer linkage (idempotent)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_asaas_customer_id_unique
        ON users (asaas_customer_id) WHERE asaas_customer_id IS NOT NULL;
    `)

    // Ensure email_verified is boolean in existing databases where it might have been created as TIMESTAMP
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users'
            AND column_name = 'email_verified'
            AND data_type IN ('timestamp without time zone','timestamp with time zone')
        ) THEN
          ALTER TABLE users
            ALTER COLUMN email_verified DROP DEFAULT,
            ALTER COLUMN email_verified TYPE boolean USING false,
            ALTER COLUMN email_verified SET DEFAULT false;
        END IF;
      END$$;
    `)

    // Configurações para o sistema de autenticação JWT customizado
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'user_type'
        ) THEN
          -- Ensure default value for user_type to avoid NOT NULL violations on insert
          ALTER TABLE users ALTER COLUMN user_type SET DEFAULT 'investidor';
        END IF;
      END$$;
    `)

    // Drop wrong/reserved table name if it exists to avoid conflicts with Better Auth
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'user'
        ) THEN
          EXECUTE 'DROP TABLE IF EXISTS "user" CASCADE';
        END IF;
      END$$;
    `)

    // Remover tabela conflitante se existir
    await client.query('DROP TABLE IF EXISTS "session" CASCADE;');

    // Tabela de investimentos dos usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS investimentos (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        oferta_id BIGINT NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE,
        valor_investido NUMERIC(15,2) NOT NULL,
        data_investimento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status VARCHAR(20) NOT NULL DEFAULT 'pendente_pagamento' CHECK (status IN ('pendente_pagamento', 'pago', 'ativo', 'resgatado', 'cancelado')),
        tipo_investimento VARCHAR(50) NOT NULL,
        prazo_meses INTEGER,
        taxa_retorno NUMERIC(5,2),
        valor_atual NUMERIC(15,2),
        asaas_payment_link_id TEXT,
        asaas_payment_link_url TEXT,
        asaas_payment_status VARCHAR(20) DEFAULT 'PENDING',
        data_pagamento TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS investimentos_oferta_id_idx ON investimentos (oferta_id);
      CREATE INDEX IF NOT EXISTS investimentos_status_idx ON investimentos (status);
    `)

    // Garantir colunas essenciais da tabela investimentos em bases já existentes
    await client.query(`
      ALTER TABLE investimentos
        ADD COLUMN IF NOT EXISTS asaas_payment_link_id TEXT,
        ADD COLUMN IF NOT EXISTS asaas_payment_link_url TEXT,
        ADD COLUMN IF NOT EXISTS asaas_payment_status VARCHAR(20) DEFAULT 'PENDING',
        ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMPTZ;
    `)

    // Atualizar status padrão para investimentos existentes
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'investimentos' AND column_name = 'status'
        ) THEN
          -- Atualizar status padrão para 'pendente_pagamento' se ainda for 'ativo'
          UPDATE investimentos SET status = 'pendente_pagamento' WHERE status = 'ativo' AND asaas_payment_link_id IS NULL;
        END IF;
      END$$;
    `)

    // Índices adicionais para as novas colunas
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'investimentos' AND column_name = 'asaas_payment_status'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS investimentos_asaas_payment_status_idx ON investimentos (asaas_payment_status)';
        END IF;
      END$$;
    `)

    // Guard index on investimentos.user_id
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'investimentos' AND column_name = 'user_id'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS investimentos_user_id_idx ON investimentos (user_id)';
        END IF;
      END$$;
    `)

    // Tabela de transações/movimentações
    await client.query(`
      CREATE TABLE IF NOT EXISTS transacoes (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        investimento_id BIGINT REFERENCES investimentos(id) ON DELETE CASCADE,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('aporte', 'resgate', 'rendimento', 'taxa')),
        valor NUMERIC(15,2) NOT NULL,
        descricao TEXT,
        data_transacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status VARCHAR(20) NOT NULL DEFAULT 'processada' CHECK (status IN ('pendente', 'processada', 'cancelada')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS transacoes_investimento_id_idx ON transacoes (investimento_id);
      CREATE INDEX IF NOT EXISTS transacoes_tipo_idx ON transacoes (tipo);
      CREATE INDEX IF NOT EXISTS transacoes_data_idx ON transacoes (data_transacao);
    `)

    // Guard index on transacoes.user_id
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'transacoes' AND column_name = 'user_id'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS transacoes_user_id_idx ON transacoes (user_id)';
        END IF;
      END$$;
    `)

    // Tabela de distribuição de carteira (para cálculos de diversificação)
    await client.query(`
      CREATE TABLE IF NOT EXISTS distribuicao_carteira (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        categoria VARCHAR(100) NOT NULL,
        valor_investido NUMERIC(15,2) NOT NULL,
        percentual NUMERIC(5,2) NOT NULL,
        data_calculo TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS distribuicao_categoria_idx ON distribuicao_carteira (categoria);
    `)

    // Guard index on distribuicao_carteira.user_id
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'distribuicao_carteira' AND column_name = 'user_id'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS distribuicao_user_id_idx ON distribuicao_carteira (user_id)';
        END IF;
      END$$;
    `)

    // Tabela de KPIs do usuário (para métricas do dashboard)
    await client.query(`
      CREATE TABLE IF NOT EXISTS kpis_usuario (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        saldo_total NUMERIC(15,2) NOT NULL DEFAULT 0,
        valor_investido NUMERIC(15,2) NOT NULL DEFAULT 0,
        rendimento_total NUMERIC(15,2) NOT NULL DEFAULT 0,
        rentabilidade_percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
        aportes_pendentes NUMERIC(15,2) NOT NULL DEFAULT 0,
        data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS kpis_usuario_user_id_unique ON kpis_usuario (user_id);
    `)

    // Guard unique index on kpis_usuario.user_id
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'kpis_usuario' AND column_name = 'user_id'
        ) THEN
          EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS kpis_usuario_user_id_unique ON kpis_usuario (user_id)';
        END IF;
      END$$;
    `)
    // Tabela de rendimentos mensais
    await client.query(`
      CREATE TABLE IF NOT EXISTS rendimentos (
        id BIGSERIAL PRIMARY KEY
      );
    `)

    // Garantir colunas essenciais da tabela rendimentos em bases já existentes
    await client.query(`
      ALTER TABLE rendimentos
        ADD COLUMN IF NOT EXISTS investimento_id BIGINT,
        ADD COLUMN IF NOT EXISTS mes_referencia DATE,
        ADD COLUMN IF NOT EXISTS valor_rendimento NUMERIC(15,2),
        ADD COLUMN IF NOT EXISTS percentual_rendimento NUMERIC(5,4),
        ADD COLUMN IF NOT EXISTS valor_base NUMERIC(15,2),
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    `)

    // Garantir FK para investimento_id
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'rendimentos' AND constraint_name = 'rendimentos_investimento_id_fkey'
        ) THEN
          ALTER TABLE rendimentos
            ADD CONSTRAINT rendimentos_investimento_id_fkey
            FOREIGN KEY (investimento_id) REFERENCES investimentos(id) ON DELETE CASCADE;
        END IF;
      END$$;
    `)

    // Índices idempotentes (protegidos por checagem de coluna)
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'rendimentos' AND column_name = 'investimento_id'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS rendimentos_investimento_id_idx ON rendimentos (investimento_id)';
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'rendimentos' AND column_name = 'mes_referencia'
        ) THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS rendimentos_mes_referencia_idx ON rendimentos (mes_referencia)';
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns WHERE table_name = 'rendimentos' AND column_name = 'investimento_id'
        ) AND EXISTS (
          SELECT 1 FROM information_schema.columns WHERE table_name = 'rendimentos' AND column_name = 'mes_referencia'
        ) THEN
          EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS rendimentos_unique_idx ON rendimentos (investimento_id, mes_referencia)';
        END IF;
      END$$;
    `)

     await client.query('COMMIT')
     console.log('Database setup successful: tables ofertas, blog, investimentos and related tables are ready.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Database setup failed:', err && (err.stack || err.message || err))
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
  .catch((e) => {
    console.error('Unexpected error:', e && (e.stack || e.message || e))
    process.exit(1)
  })