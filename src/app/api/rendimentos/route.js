import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Descobrir colunas disponíveis nas tabelas, pois ambientes diferentes podem ter esquemas distintos
    const invColsRes = await query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'investimentos'`
    );
    const ofColsRes = await query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ofertas'`
    );

    const invCols = new Set(invColsRes.rows.map((r) => r.column_name));
    const ofCols = new Set(ofColsRes.rows.map((r) => r.column_name));

    const hasInv = (c) => invCols.has(c);
    const hasOf = (c) => ofCols.has(c);

    // Mapear colunas equivalentes
    const colValorInvestido = hasInv('valor_investido')
      ? 'i.valor_investido'
      : hasInv('valor')
      ? 'i.valor'
      : hasInv('valor_aplicado')
      ? 'i.valor_aplicado'
      : 'NULL';

    const colValorAtual = hasInv('valor_atual') ? 'i.valor_atual' : colValorInvestido;
    const colDataInvest = hasInv('data_investimento')
      ? 'i.data_investimento'
      : hasInv('data_aporte')
      ? 'i.data_aporte'
      : 'NOW()';

    const colStatus = hasInv('status') ? 'i.status' : hasInv('situacao') ? 'i.situacao' : "'ativo'";

    const colAtivoNome = hasOf('nome') ? 'o.nome' : hasOf('titulo') ? 'o.titulo' : "'Ativo'";
    const colCategoria = hasOf('categoria') ? 'o.categoria' : 'NULL';
    const colModalidade = hasOf('modalidade') ? 'o.modalidade' : 'NULL';
    // Usar apenas o.tir se existir; evitar referenciar o.yield_anual que não existe em nosso schema
    const colYieldAnual = hasOf('tir') ? 'o.tir' : 'NULL';

    // Construir SELECT com base nas colunas detectadas
    const investmentsQuery = `
      SELECT 
        i.id,
        ${colValorInvestido} AS valor_investido,
        ${colValorAtual} AS valor_atual,
        ${colStatus} AS status,
        ${colAtivoNome} AS ativo_nome,
        ${colCategoria} AS categoria,
        ${colModalidade} AS modalidade,
        ${colYieldAnual} AS yield_anual,
        ${colDataInvest} AS data_investimento,
        (COALESCE(${colValorAtual}, ${colValorInvestido}) - ${colValorInvestido}) AS rendimento_bruto,
        CASE 
          WHEN ${colValorInvestido} IS NOT NULL AND ${colValorInvestido}::numeric > 0 
          THEN ((COALESCE(${colValorAtual}, ${colValorInvestido}) - ${colValorInvestido}) / ${colValorInvestido}::numeric) * 100
          ELSE 0
        END AS rentabilidade_percentual
      FROM investimentos i
      JOIN ofertas o ON i.oferta_id = o.id
      WHERE i.user_id = $1
      ORDER BY ${colDataInvest} DESC
    `;

    // Logs de debug para rastrear erro 42703
    try {
      console.log('[rendimentos] invCols:', Array.from(invCols));
      console.log('[rendimentos] ofCols:', Array.from(ofCols));
      console.log('[rendimentos] SQL:', investmentsQuery);
    } catch {}

    const investmentsResult = await query(investmentsQuery, [user.id]);
    const investments = investmentsResult.rows;

    // Calcular KPIs de rendimentos
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrar investimentos do mês atual
    const currentMonthInvestments = investments.filter((inv) => {
      const investDate = new Date(inv.data_investimento);
      return investDate.getMonth() === currentMonth && investDate.getFullYear() === currentYear;
    });

    // Filtrar investimentos do ano atual
    const currentYearInvestments = investments.filter((inv) => {
      const investDate = new Date(inv.data_investimento);
      return investDate.getFullYear() === currentYear;
    });

    // Calcular rendimento do mês atual
    const rendimentoMesAtual = currentMonthInvestments.reduce((total, inv) => {
      return total + (parseFloat(inv.rendimento_bruto) || 0);
    }, 0);

    // Calcular rendimento do ano atual
    const rendimentoAnoAtual = currentYearInvestments.reduce((total, inv) => {
      return total + (parseFloat(inv.rendimento_bruto) || 0);
    }, 0);

    // Calcular yield médio ponderado
    const totalInvestido = investments.reduce((total, inv) => {
      return total + (parseFloat(inv.valor_investido) || 0);
    }, 0);

    const yieldMedioPonderado = totalInvestido > 0
      ? investments.reduce((total, inv) => {
          const peso = (parseFloat(inv.valor_investido) || 0) / totalInvestido;
          return total + ((parseFloat(inv.yield_anual) || 0) * peso);
        }, 0)
      : 0;

    // Preparar dados dos ativos para a tabela
    const ativosComRendimentos = investments.map((inv) => ({
      id: inv.id,
      nome: inv.ativo_nome,
      categoria: inv.categoria,
      modalidade: inv.modalidade,
      valorInvestido: parseFloat(inv.valor_investido) || 0,
      valorAtual: parseFloat(inv.valor_atual) || 0,
      rendimentoBruto: parseFloat(inv.rendimento_bruto) || 0,
      rentabilidadePercentual: parseFloat(inv.rentabilidade_percentual) || 0,
      yieldAnual: parseFloat(inv.yield_anual) || 0,
      dataInvestimento: inv.data_investimento,
      status: inv.status,
    }));

    // Agrupar por categoria para distribuição
    const distribuicaoPorCategoria = investments.reduce((acc, inv) => {
      const categoria = inv.categoria || 'Outros';
      if (!acc[categoria]) {
        acc[categoria] = {
          categoria,
          valorInvestido: 0,
          rendimento: 0,
          quantidade: 0,
        };
      }
      acc[categoria].valorInvestido += parseFloat(inv.valor_investido) || 0;
      acc[categoria].rendimento += parseFloat(inv.rendimento_bruto) || 0;
      acc[categoria].quantidade += 1;
      return acc;
    }, {});

    const response = {
      kpis: {
        mesAtual: rendimentoMesAtual,
        anoAtual: rendimentoAnoAtual,
        yieldMedio: yieldMedioPonderado,
      },
      ativos: ativosComRendimentos,
      distribuicaoPorCategoria: Object.values(distribuicaoPorCategoria),
      totalInvestimentos: investments.length,
      totalInvestido: totalInvestido,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar rendimentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}