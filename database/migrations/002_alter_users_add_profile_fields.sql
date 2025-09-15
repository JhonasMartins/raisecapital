-- Migration: Add comprehensive profile fields to users table to support /conta/perfil
-- This migration normalizes all personal, company, contact, address, professional, banking,
-- pix and security fields into the users table as required by the profile page.

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tipo_pessoa VARCHAR(10) CHECK (tipo_pessoa IN ('pf','pj')),
  ADD COLUMN IF NOT EXISTS data_nascimento DATE,
  ADD COLUMN IF NOT EXISTS cpf VARCHAR(14),
  ADD COLUMN IF NOT EXISTS rg VARCHAR(20),

  -- Pessoa Jurídica
  ADD COLUMN IF NOT EXISTS razao_social VARCHAR(255),
  ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18),
  ADD COLUMN IF NOT EXISTS representante_nome VARCHAR(255),
  ADD COLUMN IF NOT EXISTS representante_cpf VARCHAR(14),
  ADD COLUMN IF NOT EXISTS representante_cargo VARCHAR(100),

  -- Endereço
  ADD COLUMN IF NOT EXISTS cep VARCHAR(10),
  ADD COLUMN IF NOT EXISTS endereco_logradouro VARCHAR(255),
  ADD COLUMN IF NOT EXISTS endereco_numero VARCHAR(20),
  ADD COLUMN IF NOT EXISTS endereco_complemento VARCHAR(255),
  ADD COLUMN IF NOT EXISTS endereco_bairro VARCHAR(100),
  ADD COLUMN IF NOT EXISTS endereco_cidade VARCHAR(100),
  ADD COLUMN IF NOT EXISTS endereco_estado VARCHAR(2),
  ADD COLUMN IF NOT EXISTS endereco_pais VARCHAR(100),

  -- Profissionais
  ADD COLUMN IF NOT EXISTS profissao VARCHAR(100),
  ADD COLUMN IF NOT EXISTS empresa_trabalho VARCHAR(255),
  ADD COLUMN IF NOT EXISTS renda_mensal DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS patrimonio DECIMAL(15,2),

  -- Bancários
  ADD COLUMN IF NOT EXISTS banco VARCHAR(100),
  ADD COLUMN IF NOT EXISTS agencia VARCHAR(10),
  ADD COLUMN IF NOT EXISTS conta VARCHAR(20),
  ADD COLUMN IF NOT EXISTS tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente','poupanca')),

  -- PIX
  ADD COLUMN IF NOT EXISTS pix_type VARCHAR(20) CHECK (pix_type IN ('cpf','cnpj','email','telefone','aleatoria')),
  ADD COLUMN IF NOT EXISTS pix_key VARCHAR(255),

  -- Segurança
  ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,

  -- Auth integrations
  ADD COLUMN IF NOT EXISTS email_verified TIMESTAMP;

-- Partial unique indexes for CPF / CNPJ when provided
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cpf_unique ON users (cpf) WHERE cpf IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cnpj_unique ON users (cnpj) WHERE cnpj IS NOT NULL;

COMMIT;