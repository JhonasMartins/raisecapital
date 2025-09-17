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
      return NextResponse.json({ investments: [] });
    }
    
    const investidor = investidorResult.rows[0];
    
    // Buscar investimentos do investidor com dados da oferta
    const investmentsQuery = `
      SELECT 
        inv.id,
        inv.valor_investido,
        inv.data_investimento,
        inv.status,
        inv.valor_atual,
        inv.rentabilidade_percentual,
        inv.rentabilidade_valor,
        o.titulo as nome,
        o.categoria,
        o.modalidade,
        o.rentabilidade_anual,
        o.prazo_meses,
        o.valor_minimo,
        o.valor_maximo,
        o.status as oferta_status,
        o.slug
      FROM investimentos inv
      JOIN ofertas o ON inv.oferta_id = o.id
      WHERE inv.investidor_id = $1
      ORDER BY inv.data_investimento DESC
    `;
    
    const investmentsResult = await query(investmentsQuery, [investidor.id]);
    
    const investments = investmentsResult.rows.map(investment => ({
      id: investment.id,
      nome: investment.nome,
      categoria: investment.categoria,
      modalidade: investment.modalidade,
      valorInvestido: parseFloat(investment.valor_investido || 0),
      valorAtual: parseFloat(investment.valor_atual || investment.valor_investido || 0),
      rentabilidade: parseFloat(investment.rentabilidade_percentual || 0),
      rentabilidadeValor: parseFloat(investment.rentabilidade_valor || 0),
      dataInvestimento: investment.data_investimento,
      status: investment.status,
      rentabilidadeAnual: parseFloat(investment.rentabilidade_anual || 0),
      prazoMeses: investment.prazo_meses,
      valorMinimo: parseFloat(investment.valor_minimo || 0),
      valorMaximo: parseFloat(investment.valor_maximo || 0),
      slug: investment.slug
    }));
    
    return NextResponse.json({ investments });
    
  } catch (error) {
    console.error('Erro ao buscar investimentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}