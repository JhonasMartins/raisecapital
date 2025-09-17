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
      return NextResponse.json({ transactions: [] });
    }
    
    const investidor = investidorResult.rows[0];
    
    // Buscar movimentações do investidor com dados do investimento/oferta
    const transactionsQuery = `
      SELECT 
        m.id,
        m.tipo,
        m.valor,
        m.descricao,
        m.data_movimentacao,
        m.status,
        m.receipt_url,
        inv.id as investimento_id,
        o.titulo as oferta_nome,
        o.categoria as oferta_categoria
      FROM movimentacoes m
      LEFT JOIN investimentos inv ON m.investimento_id = inv.id
      LEFT JOIN ofertas o ON inv.oferta_id = o.id
      WHERE m.investidor_id = $1
      ORDER BY m.data_movimentacao DESC
      LIMIT 50
    `;
    
    const transactionsResult = await query(transactionsQuery, [investidor.id]);
    
    const transactions = transactionsResult.rows.map(transaction => ({
      id: transaction.id,
      tipo: transaction.tipo,
      valor: parseFloat(transaction.valor || 0),
      descricao: transaction.descricao,
      data: transaction.data_movimentacao,
      status: transaction.status,
      receiptUrl: transaction.receipt_url,
      investimento: transaction.investimento_id ? {
        id: transaction.investimento_id,
        nome: transaction.oferta_nome,
        categoria: transaction.oferta_categoria
      } : null
    }));
    
    return NextResponse.json({ transactions });
    
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}