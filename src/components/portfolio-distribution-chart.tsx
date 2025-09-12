"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

type Item = { key: string; label: string; value: number; color: string }

export default function PortfolioDistributionChart({ data }: { data: ReadonlyArray<Item> }) {
  // Transformar dados de distribuição em dados temporais fictícios
  const lineData = data.flatMap((item, categoryIndex) => {
    // Criar série temporal para cada categoria com 6 pontos (últimos 6 meses)
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
    return months.map((month, monthIndex) => ({
      month,
      [item.key]: Math.max(0, item.value * (0.7 + Math.random() * 0.6)), // Variação fictícia
      [`${item.key}Color`]: item.color
    }))
  }).reduce((acc, curr) => {
    const existing = acc.find(a => a.month === curr.month)
    if (existing) {
      Object.assign(existing, curr)
    } else {
      acc.push(curr)
    }
    return acc
  }, [] as any[])

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((i) => [i.key, { label: i.label, color: i.color }])
  )

  return (
    <ChartContainer config={chartConfig} className="w-full">
      <LineChart data={lineData}>
        <XAxis 
          dataKey="month" 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
          tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
        />
        {data.map((item) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            stroke={item.color}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        ))}
        <ChartTooltip 
          content={<ChartTooltipContent 
            formatter={(value, name) => [
              `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              chartConfig[name as string]?.label || name
            ]}
          />} 
        />
      </LineChart>
    </ChartContainer>
  )
}