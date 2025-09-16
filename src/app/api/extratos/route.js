import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('API de extratos chamada');
    
    // Verificar autenticação
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    console.log('Usuário autenticado:', user.id);

    // Buscar investimentos do usuário
    const investimentosQuery = `
      SELECT 
        i.id,
        i.valor as amount,
        i.data_investimento as date,
        'investimento' as type,
        i.status,
        o.nome as description
      FROM investimentos i
      LEFT JOIN ofertas o ON i.oferta_id = o.id
      WHERE i.investidor_id = $1
      ORDER BY i.data_investimento DESC
    `;

    const investimentosResult = await query(investimentosQuery, [user.id]);
    console.log(`[API Extratos] Encontrados ${investimentosResult.rows.length} investimentos para o usuário ${user.id}`);

    // Como não há tabela transacoes, vamos usar apenas os investimentos
    const extratos = investimentosResult.rows.map(row => ({
      id: row.id,
      date: row.date,
      type: row.type,
      amount: parseFloat(row.amount),
      description: row.description || 'Investimento',
      status: row.status
    }));

    console.log('Total de extratos retornados:', extratos.length);

    return NextResponse.json({
      success: true,
      data: extratos
    });

  } catch (error) {
    console.error('Erro ao buscar extratos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}