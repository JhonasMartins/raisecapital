import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar extratos do investidor
    // Vamos buscar de diferentes tabelas para montar o extrato completo
    const extratos = [];

    // 1. Investimentos (aportes)
    const investimentosQuery = `
      SELECT 
        i.id,
        i.valor,
        i.data_investimento,
        o.nome as oferta_nome
      FROM investimentos i
      JOIN ofertas o ON i.oferta_id = o.id
      WHERE i.investidor_id = $1 
      AND i.status = 'confirmado'
      ORDER BY i.data_investimento DESC
    `;

    const investimentosResult = await query(investimentosQuery, [user.id]);
    
    if (investimentosResult.rows) {
      investimentosResult.rows.forEach(inv => {
        extratos.push({
          id: `inv_${inv.id}`,
          date: inv.data_investimento,
          description: `Investimento - ${inv.oferta_nome}`,
          type: 'aporte',
          amount: inv.valor
        });
      });
    }

    // 2. Rendimentos (proventos) - se existir tabela de rendimentos
    try {
      const rendimentosQuery = `
        SELECT 
          r.id,
          r.valor,
          r.data_pagamento,
          o.nome as oferta_nome
        FROM rendimentos r
        JOIN investimentos i ON r.investimento_id = i.id
        JOIN ofertas o ON i.oferta_id = o.id
        WHERE i.investidor_id = $1
        ORDER BY r.data_pagamento DESC
      `;

      const rendimentosResult = await query(rendimentosQuery, [user.id]);
      
      if (rendimentosResult.rows) {
        rendimentosResult.rows.forEach(rend => {
          extratos.push({
            id: `rend_${rend.id}`,
            date: rend.data_pagamento,
            description: `Provento - ${rend.oferta_nome}`,
            type: 'provento',
            amount: rend.valor
          });
        });
      }
    } catch (rendimentosError) {
      // Tabela de rendimentos pode não existir ainda
      console.log('Tabela de rendimentos não encontrada ou erro:', rendimentosError.message);
    }

    // 3. Taxas (se houver tabela de taxas)
    try {
      const taxasQuery = `
        SELECT 
          t.id,
          t.valor,
          t.data_cobranca,
          t.descricao,
          o.nome as oferta_nome
        FROM taxas t
        JOIN investimentos i ON t.investimento_id = i.id
        JOIN ofertas o ON i.oferta_id = o.id
        WHERE i.investidor_id = $1
        ORDER BY t.data_cobranca DESC
      `;

      const taxasResult = await query(taxasQuery, [user.id]);
      
      if (taxasResult.rows) {
        taxasResult.rows.forEach(taxa => {
          extratos.push({
            id: `taxa_${taxa.id}`,
            date: taxa.data_cobranca,
            description: `Taxa - ${taxa.descricao} - ${taxa.oferta_nome}`,
            type: 'taxa',
            amount: -Math.abs(taxa.valor) // Taxas são sempre negativas
          });
        });
      }
    } catch (taxasError) {
      // Tabela de taxas pode não existir ainda
      console.log('Tabela de taxas não encontrada ou erro:', taxasError.message);
    }

    // 4. Resgates/Retiradas (se houver tabela de resgates)
    try {
      const resgatesQuery = `
        SELECT 
          r.id,
          r.valor,
          r.data_resgate,
          o.nome as oferta_nome
        FROM resgates r
        JOIN investimentos i ON r.investimento_id = i.id
        JOIN ofertas o ON i.oferta_id = o.id
        WHERE i.investidor_id = $1
        ORDER BY r.data_resgate DESC
      `;

      const resgatesResult = await query(resgatesQuery, [user.id]);
      
      if (resgatesResult.rows) {
        resgatesResult.rows.forEach(resgate => {
          extratos.push({
            id: `resgate_${resgate.id}`,
            date: resgate.data_resgate,
            description: `Resgate - ${resgate.oferta_nome}`,
            type: 'retirada',
            amount: -Math.abs(resgate.valor) // Resgates são sempre negativos
          });
        });
      }
    } catch (resgatesError) {
      // Tabela de resgates pode não existir ainda
      console.log('Tabela de resgates não encontrada ou erro:', resgatesError.message);
    }

    // Ordenar por data (mais recente primeiro)
    extratos.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({
      success: true,
      data: extratos
    });

  } catch (error) {
    console.error('Erro ao buscar extratos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}