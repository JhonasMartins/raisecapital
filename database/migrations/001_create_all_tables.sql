-- Migração para criar todas as tabelas do sistema RaiseCapital
-- Baseado na análise das páginas do dashboard da empresa e do investidor

-- Tabela de usuários (base para empresas e investidores)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('empresa', 'investidor')),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pendente')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de empresas
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    setor VARCHAR(100),
    descricao TEXT,
    website VARCHAR(255),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    total_captado DECIMAL(15,2) DEFAULT 0,
    meta_captacao DECIMAL(15,2),
    numero_investidores INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de investidores
CREATE TABLE investidores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cpf_cnpj VARCHAR(18) UNIQUE NOT NULL,
    tipo_pessoa VARCHAR(20) NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
    empresa VARCHAR(255),
    cargo VARCHAR(100),
    saldo_disponivel DECIMAL(15,2) DEFAULT 0,
    posicao_investida DECIMAL(15,2) DEFAULT 0,
    rentabilidade_acumulada DECIMAL(8,4) DEFAULT 0,
    rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    investimentos_anteriores INTEGER DEFAULT 0,
    ticket_medio DECIMAL(15,2) DEFAULT 0,
    kyc_status VARCHAR(20) DEFAULT 'pendente' CHECK (kyc_status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado')),
    suitability_status VARCHAR(20) DEFAULT 'pendente' CHECK (suitability_status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de ofertas de investimento
CREATE TABLE ofertas (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    modalidade VARCHAR(100),
    produto VARCHAR(100),
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('equity', 'debt', 'hybrid')),
    meta DECIMAL(15,2) NOT NULL,
    captado DECIMAL(15,2) DEFAULT 0,
    ticket_minimo DECIMAL(15,2) NOT NULL,
    ticket_maximo DECIMAL(15,2),
    numero_investidores INTEGER DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    prazo_investimento INTEGER, -- em meses
    tir_esperada DECIMAL(8,4),
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'ativa', 'pausada', 'encerrada', 'cancelada')),
    cover_url VARCHAR(500),
    summary_pdf_url VARCHAR(500),
    about_operation TEXT,
    about_company TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de investimentos
CREATE TABLE investimentos (
    id SERIAL PRIMARY KEY,
    investidor_id INTEGER REFERENCES investidores(id) ON DELETE CASCADE,
    oferta_id INTEGER REFERENCES ofertas(id) ON DELETE CASCADE,
    valor DECIMAL(15,2) NOT NULL,
    data_investimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'resgatado')),
    rentabilidade_atual DECIMAL(8,4) DEFAULT 0,
    valor_atual DECIMAL(15,2),
    data_vencimento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de movimentações financeiras
CREATE TABLE movimentacoes (
    id SERIAL PRIMARY KEY,
    investidor_id INTEGER REFERENCES investidores(id) ON DELETE CASCADE,
    investimento_id INTEGER REFERENCES investimentos(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('aporte', 'retirada', 'provento', 'taxa', 'deposito', 'pix', 'saque')),
    valor DECIMAL(15,2) NOT NULL,
    descricao TEXT,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'confirmado' CHECK (status IN ('pendente', 'confirmado', 'falhou', 'cancelado')),
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de rendimentos/proventos
CREATE TABLE rendimentos (
    id SERIAL PRIMARY KEY,
    investimento_id INTEGER REFERENCES investimentos(id) ON DELETE CASCADE,
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('dividendo', 'juros', 'amortizacao', 'bonus')),
    data_pagamento DATE NOT NULL,
    data_base DATE,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relatórios
CREATE TABLE relatorios (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('mensal', 'trimestral', 'anual', 'personalizado')),
    periodo_inicio DATE,
    periodo_fim DATE,
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'processando' CHECK (status IN ('processando', 'disponivel', 'erro')),
    arquivo_url VARCHAR(500),
    tamanho_arquivo INTEGER, -- em bytes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de documentos
CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    oferta_id INTEGER REFERENCES ofertas(id) ON DELETE CASCADE,
    investidor_id INTEGER REFERENCES investidores(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('contrato', 'termo', 'prospecto', 'lamina', 'kyc', 'comprovante')),
    arquivo_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'assinado', 'cancelado')),
    data_assinatura TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de dados bancários
CREATE TABLE dados_bancarios (
    id SERIAL PRIMARY KEY,
    investidor_id INTEGER REFERENCES investidores(id) ON DELETE CASCADE,
    banco VARCHAR(100) NOT NULL,
    agencia VARCHAR(10) NOT NULL,
    conta VARCHAR(20) NOT NULL,
    tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente', 'poupanca')),
    titular VARCHAR(255) NOT NULL,
    cpf_cnpj_titular VARCHAR(18) NOT NULL,
    pix_key VARCHAR(255),
    pix_type VARCHAR(20) CHECK (pix_type IN ('cpf', 'cnpj', 'email', 'telefone', 'aleatoria')),
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'verificado', 'rejeitado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de KPIs da empresa
CREATE TABLE kpis_empresa (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    data_referencia DATE NOT NULL,
    total_captado DECIMAL(15,2) DEFAULT 0,
    numero_investidores INTEGER DEFAULT 0,
    ticket_medio DECIMAL(15,2) DEFAULT 0,
    conversao_leads DECIMAL(5,2) DEFAULT 0,
    ofertas_ativas INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de captação mensal
CREATE TABLE captacao_mensal (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    valor DECIMAL(15,2) DEFAULT 0,
    meta DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, ano, mes)
);

-- Tabela de distribuição de carteira do investidor
CREATE TABLE distribuicao_carteira (
    id SERIAL PRIMARY KEY,
    investidor_id INTEGER REFERENCES investidores(id) ON DELETE CASCADE,
    categoria VARCHAR(50) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    percentual DECIMAL(5,2),
    data_referencia DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de ações/tarefas
CREate TABLE acoes (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    investidor_id INTEGER REFERENCES investidores(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('reuniao', 'relatorio', 'documento', 'kyc', 'suitability', 'pagamento')),
    data_vencimento TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);
CREATE INDEX idx_investidores_cpf_cnpj ON investidores(cpf_cnpj);
CREATE INDEX idx_ofertas_status ON ofertas(status);
CREATE INDEX idx_ofertas_empresa ON ofertas(empresa_id);
CREATE INDEX idx_investimentos_investidor ON investimentos(investidor_id);
CREATE INDEX idx_investimentos_oferta ON investimentos(oferta_id);
CREATE INDEX idx_movimentacoes_investidor ON movimentacoes(investidor_id);
CREATE INDEX idx_movimentacoes_data ON movimentacoes(data_movimentacao);
CREATE INDEX idx_rendimentos_investimento ON rendimentos(investimento_id);
CREATE INDEX idx_relatorios_empresa ON relatorios(empresa_id);
CREATE INDEX idx_documentos_oferta ON documentos(oferta_id);
CREATE INDEX idx_documentos_investidor ON documentos(investidor_id);
CREATE INDEX idx_kpis_empresa_data ON kpis_empresa(empresa_id, data_referencia);
CREATE INDEX idx_captacao_mensal_empresa ON captacao_mensal(empresa_id, ano, mes);

-- Triggers para atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investidores_updated_at BEFORE UPDATE ON investidores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ofertas_updated_at BEFORE UPDATE ON ofertas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investimentos_updated_at BEFORE UPDATE ON investimentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dados_bancarios_updated_at BEFORE UPDATE ON dados_bancarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_acoes_updated_at BEFORE UPDATE ON acoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Tabela base de usuários do sistema';
COMMENT ON TABLE empresas IS 'Dados das empresas que captam recursos';
COMMENT ON TABLE investidores IS 'Dados dos investidores';
COMMENT ON TABLE ofertas IS 'Ofertas de investimento das empresas';
COMMENT ON TABLE investimentos IS 'Investimentos realizados pelos investidores';
COMMENT ON TABLE movimentacoes IS 'Histórico de movimentações financeiras';
COMMENT ON TABLE rendimentos IS 'Proventos e rendimentos dos investimentos';
COMMENT ON TABLE relatorios IS 'Relatórios gerados pelas empresas';
COMMENT ON TABLE documentos IS 'Documentos e contratos do sistema';
COMMENT ON TABLE dados_bancarios IS 'Dados bancários dos investidores';
COMMENT ON TABLE kpis_empresa IS 'KPIs históricos das empresas';
COMMENT ON TABLE captacao_mensal IS 'Captação mensal das empresas';
COMMENT ON TABLE distribuicao_carteira IS 'Distribuição da carteira dos investidores';
COMMENT ON TABLE acoes IS 'Ações e tarefas do sistema';

-- Inserir dados iniciais de exemplo (opcional)
-- Pode ser removido em produção
INSERT INTO users (email, password_hash, name, user_type) VALUES 
('empresa@raisecapital.com', '$2b$10$example', 'Empresa Exemplo', 'empresa'),
('investidor@raisecapital.com', '$2b$10$example', 'Investidor Exemplo', 'investidor');