import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Verificar autenticação
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar o investidor pelo email do usuário
    const investidorQuery = `
      SELECT i.* 
      FROM investidores i
      JOIN users u ON i.user_id = u.id
      WHERE u.email = $1
    `;
    const investidorResult = await query(investidorQuery, [user.email]);
    
    if (investidorResult.rows.length === 0) {
      return NextResponse.json({ 
        totalInvestido: 0,
        valorAtual: 0,
        rentabilidade: 0,
        rentabilidadePercentual: 0,
        distribuicao: []
      });
    }
    
    const investidor = investidorResult.rows[0];
    
    // Buscar dados consolidados do portfólio
    const portfolioQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN inv.status = 'ativo' THEN inv.valor_investido ELSE 0 END), 0) as total_investido,
        COALESCE(SUM(CASE WHEN inv.status = 'ativo' THEN inv.valor_atual ELSE inv.valor_investido END), 0) as valor_atual,
        COALESCE(SUM(CASE WHEN inv.status = 'ativo' THEN inv.rentabilidade_valor ELSE 0 END), 0) as rentabilidade_valor,
        COALESCE(SUM(CASE WHEN inv.status IN ('pendente', 'em_analise', 'aguardando_pagamento') THEN inv.valor_investido ELSE 0 END), 0) as em_analise,
        COUNT(CASE WHEN inv.status = 'ativo' THEN inv.id END) as total_investimentos
      FROM investimentos inv
      WHERE inv.investidor_id = $1
    `;
    
    const portfolioResult = await query(portfolioQuery, [investidor.id]);
    const portfolio = portfolioResult.rows[0];
    
    // Buscar distribuição por categoria
    const distribuicaoQuery = `
      SELECT 
        o.categoria,
        COUNT(inv.id) as quantidade,
        COALESCE(SUM(inv.valor_investido), 0) as valor_investido,
        COALESCE(SUM(inv.valor_atual), SUM(inv.valor_investido), 0) as valor_atual
      FROM investimentos inv
      JOIN ofertas o ON inv.oferta_id = o.id
      WHERE inv.investidor_id = $1 AND inv.status = 'ativo'
      GROUP BY o.categoria
      ORDER BY valor_investido DESC
    `;
    
    const distribuicaoResult = await query(distribuicaoQuery, [investidor.id]);
    
    const totalInvestido = parseFloat(portfolio.total_investido || 0);
    const valorAtual = parseFloat(portfolio.valor_atual || 0);
    const rentabilidadeValor = parseFloat(portfolio.rentabilidade_valor || 0);
    const emAnalise = parseFloat(portfolio.em_analise || 0);
    const rentabilidadePercentual = totalInvestido > 0 ? ((valorAtual - totalInvestido) / totalInvestido) * 100 : 0;
    
    const distribuicao = distribuicaoResult.rows.map(item => ({
      categoria: item.categoria || 'Outros',
      quantidade: parseInt(item.quantidade || 0),
      valorInvestido: parseFloat(item.valor_investido || 0),
      valorAtual: parseFloat(item.valor_atual || 0),
      percentual: totalInvestido > 0 ? (parseFloat(item.valor_investido || 0) / totalInvestido) * 100 : 0
    }));
    
    return NextResponse.json({
      totalInvestido,
      valorAtual,
      rentabilidade: rentabilidadeValor,
      rentabilidadePercentual,
      emAnalise,
      totalInvestimentos: parseInt(portfolio.total_investimentos || 0),
      distribuicao,
      distribuicaoPorCategoria: distribuicao.map(item => ({
        categoria: item.categoria,
        valor: item.valorInvestido
      }))
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados do portfólio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}