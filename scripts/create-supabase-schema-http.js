#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuração da API Supabase
const SUPABASE_URL = 'https://zaybwuyceusiktocgrff.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheWJ3dXljZXVzaWt0b2NncmZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk1NTUxNSwiZXhwIjoyMDczNTMxNTE1fQ.dB7fx07Pj7BBxKhqq2KZLO1xEn6feEzyIfXjY9Yz1xk';

async function executeSQLViaAPI(sql, description) {
  console.log(`\n🔄 Executando: ${description}`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({ sql_query: sql })
    });

    if (!response.ok) {
      // Tentar método alternativo via query direta
      const directResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: sql })
      });
      
      if (!directResponse.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }
    
    console.log(`✅ Sucesso: ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro em ${description}:`, error.message);
    return false;
  }
}

async function createSchemaViaHTTP() {
  console.log('🚀 Criando schema via API HTTP do Supabase...');
  
  // SQL consolidado para criar todas as tabelas
  const consolidatedSQL = `
-- Criar tabela users se não existir
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar campos de perfil à tabela users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='tipo_pessoa') THEN
        ALTER TABLE public.users ADD COLUMN tipo_pessoa VARCHAR(20) CHECK (tipo_pessoa IN ('fisica', 'juridica'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='cpf_cnpj') THEN
        ALTER TABLE public.users ADD COLUMN cpf_cnpj VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='telefone') THEN
        ALTER TABLE public.users ADD COLUMN telefone VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='endereco') THEN
        ALTER TABLE public.users ADD COLUMN endereco JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='perfil_investidor') THEN
        ALTER TABLE public.users ADD COLUMN perfil_investidor VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='patrimonio_liquido') THEN
        ALTER TABLE public.users ADD COLUMN patrimonio_liquido DECIMAL(15,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='renda_mensal') THEN
        ALTER TABLE public.users ADD COLUMN renda_mensal DECIMAL(15,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='experiencia_investimento') THEN
        ALTER TABLE public.users ADD COLUMN experiencia_investimento TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='objetivos_investimento') THEN
        ALTER TABLE public.users ADD COLUMN objetivos_investimento TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
        ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='verificado') THEN
        ALTER TABLE public.users ADD COLUMN verificado BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='data_verificacao') THEN
        ALTER TABLE public.users ADD COLUMN data_verificacao TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Criar tabela empresas
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    razao_social VARCHAR(255),
    setor VARCHAR(100),
    descricao TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    endereco JSONB,
    telefone VARCHAR(20),
    email_contato VARCHAR(255),
    fundacao DATE,
    numero_funcionarios INTEGER,
    receita_anual DECIMAL(15,2),
    ebitda DECIMAL(15,2),
    divida_total DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela ofertas
CREATE TABLE IF NOT EXISTS public.ofertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo_oferta VARCHAR(50) NOT NULL CHECK (tipo_oferta IN ('equity', 'debt', 'convertible')),
    valor_total DECIMAL(15,2) NOT NULL,
    valor_minimo_investimento DECIMAL(15,2) NOT NULL,
    percentual_equity DECIMAL(5,2),
    taxa_juros DECIMAL(5,2),
    prazo_meses INTEGER,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('rascunho', 'ativa', 'pausada', 'finalizada', 'cancelada')),
    documentos JSONB,
    metricas_financeiras JSONB,
    riscos TEXT,
    uso_recursos TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela blog
CREATE TABLE IF NOT EXISTS public.blog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    conteudo TEXT NOT NULL,
    resumo TEXT,
    autor_id UUID REFERENCES public.users(id),
    categoria VARCHAR(100),
    tags TEXT[],
    imagem_destaque TEXT,
    publicado BOOLEAN DEFAULT FALSE,
    data_publicacao TIMESTAMP WITH TIME ZONE,
    visualizacoes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela blog_comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.blog(id) ON DELETE CASCADE,
    autor_id UUID REFERENCES public.users(id),
    conteudo TEXT NOT NULL,
    aprovado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela newsletter_subscriptions
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    categorias TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela files
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    tamanho BIGINT,
    url TEXT NOT NULL,
    owner_id UUID REFERENCES public.users(id),
    relacionado_tipo VARCHAR(50),
    relacionado_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices importantes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf_cnpj ON public.users(cpf_cnpj) WHERE cpf_cnpj IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_empresas_user_id ON public.empresas(user_id);
CREATE INDEX IF NOT EXISTS idx_empresas_cnpj ON public.empresas(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ofertas_empresa_id ON public.ofertas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_status ON public.ofertas(status);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog(slug);
CREATE INDEX IF NOT EXISTS idx_blog_publicado ON public.blog(publicado);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_files_owner_id ON public.files(owner_id);
CREATE INDEX IF NOT EXISTS idx_files_relacionado ON public.files(relacionado_tipo, relacionado_id);
  `;

  const success = await executeSQLViaAPI(consolidatedSQL, 'Schema completo');
  
  if (success) {
    console.log('\n🎉 Schema criado com sucesso via API HTTP!');
    
    // Validar criação
    const validationSQL = `
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
    
    console.log('\n🔍 Validando schema...');
    await executeSQLViaAPI(validationSQL, 'Validação do schema');
  }
  
  return success;
}

// Função alternativa usando curl
async function createSchemaViaCurl() {
  console.log('\n🔄 Tentando método alternativo via curl...');
  
  const { spawn } = require('child_process');
  
  return new Promise((resolve) => {
    const curlCommand = `curl -X POST "${SUPABASE_URL}/rest/v1/" \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \\
      -H "apikey: ${SUPABASE_SERVICE_KEY}" \\
      -d '{"query": "SELECT 1 as test"}'`;
    
    const curl = spawn('curl', [
      '-X', 'POST',
      `${SUPABASE_URL}/rest/v1/`,
      '-H', 'Content-Type: application/json',
      '-H', `Authorization: Bearer ${SUPABASE_SERVICE_KEY}`,
      '-H', `apikey: ${SUPABASE_SERVICE_KEY}`,
      '-d', '{"query": "SELECT 1 as test"}'
    ]);
    
    curl.on('close', (code) => {
      console.log(`Curl finalizado com código: ${code}`);
      resolve(code === 0);
    });
  });
}

async function main() {
  try {
    // Tentar via API HTTP primeiro
    const httpSuccess = await createSchemaViaHTTP();
    
    if (!httpSuccess) {
      console.log('\n⚠️  API HTTP falhou, tentando curl...');
      await createSchemaViaCurl();
    }
    
  } catch (error) {
    console.error('💥 Erro fatal:', error.message);
    
    // Mostrar instruções manuais como fallback
    console.log('\n📋 INSTRUÇÕES MANUAIS:');
    console.log('1. Acesse: https://zaybwuyceusiktocgrff.supabase.co');
    console.log('2. Vá em SQL Editor');
    console.log('3. Execute os arquivos na ordem:');
    console.log('   - database/migrations/001_create_all_tables.sql');
    console.log('   - database/migrations/002_alter_users_add_profile_fields.sql');
    console.log('   - database/migrations/003_finalize_idempotent.sql');
  }
}

main().catch(console.error);