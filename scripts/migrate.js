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

    // Compatibility with Better Auth: use default user_type and allow NULL password_hash (auth stores password elsewhere)
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
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'password_hash'
        ) THEN
          -- Allow NULL password_hash because Better Auth manages password in its own tables
          ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
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
 
     await client.query('COMMIT')
     console.log('Database setup successful: tables ofertas, blog and blog_comments are ready.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Database setup failed:', err.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
  .catch((e) => {
    console.error('Unexpected error:', e)
    process.exit(1)
  })