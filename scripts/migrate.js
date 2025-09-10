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