import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar investimentos do usuário para calcular rendimentos
    const investmentsQuery = `
      SELECT 
        i.id,
        i.valor_investido,
        i.valor_atual,
        i.status,
        o.nome as ativo_nome,
        o.categoria,
        o.modalidade,
        o.yield_anual,
        i.data_investimento,
        CASE 
          WHEN i.status = 'ativo' THEN i.valor_atual - i.valor_investido
          ELSE 0
        END as rendimento_bruto,
        CASE 
          WHEN i.status = 'ativo' AND i.valor_investido > 0 
          THEN ((i.valor_atual - i.valor_investido) / i.valor_investido) * 100
          ELSE 0
        END as rentabilidade_percentual
      FROM investimentos i
      JOIN ofertas o ON i.oferta_id = o.id
      WHERE i.investidor_email = $1 AND i.investidor_id = $2
      ORDER BY i.data_investimento DESC
    `;

    const investmentsResult = await query(investmentsQuery, [user.email, user.id]);
    const investments = investmentsResult.rows;

    // Calcular KPIs de rendimentos
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrar investimentos do mês atual
    const currentMonthInvestments = investments.filter(inv => {
      const investDate = new Date(inv.data_investimento);
      return investDate.getMonth() === currentMonth && investDate.getFullYear() === currentYear;
    });

    // Filtrar investimentos do ano atual
    const currentYearInvestments = investments.filter(inv => {
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
    const ativosComRendimentos = investments.map(inv => ({
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
      status: inv.status
    }));

    // Agrupar por categoria para distribuição
    const distribuicaoPorCategoria = investments.reduce((acc, inv) => {
      const categoria = inv.categoria || 'Outros';
      if (!acc[categoria]) {
        acc[categoria] = {
          categoria,
          valorInvestido: 0,
          rendimento: 0,
          quantidade: 0
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
        yieldMedio: yieldMedioPonderado
      },
      ativos: ativosComRendimentos,
      distribuicaoPorCategoria: Object.values(distribuicaoPorCategoria),
      totalInvestimentos: investments.length,
      totalInvestido: totalInvestido
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