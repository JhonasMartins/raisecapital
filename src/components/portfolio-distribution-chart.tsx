"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"

type Item = { key: string; label: string; value: number; color: string }

// Dotted background pattern generator based on chart config colors
function DottedBackgroundPattern({ config }: { config: ChartConfig }) {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, (value as any).color])
  ) as Record<string, string>

  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <pattern
          key={key}
          id={`dotted-background-pattern-${key}`}
          x="0"
          y="0"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="1.5" fill={value as string} opacity={0.5}></circle>
        </pattern>
      ))}
    </>
  )
}

export default function PortfolioDistributionChart({ data, height = 260 }: { data: ReadonlyArray<Item>; height?: number }) {
  // Transformar dados de distribuição em dados temporais fictícios
  const lineData = data
    .flatMap((item) => {
      // Criar série temporal para cada categoria com 6 pontos (últimos 6 meses)
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
      return months.map((month) => ({
        month,
        [item.key]: Math.max(0, item.value * (0.7 + Math.random() * 0.6)), // Variação fictícia
      }))
    })
    .reduce((acc, curr) => {
      const existing = acc.find((a) => (a as any).month === (curr as any).month) as any
      if (existing) {
        Object.assign(existing, curr)
      } else {
        acc.push(curr as any)
      }
      return acc
    }, [] as any[])

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((i) => [i.key, { label: i.label, color: i.color }])
  )

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <AreaChart data={lineData} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
          tickFormatter={(value) => `R$${(Number(value) / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                (chartConfig as any)[name as string]?.label || (name as string),
              ]}
            />
          }
        />
        <defs>
          <DottedBackgroundPattern config={chartConfig} />
        </defs>
        {data.map((item) => (
          <Area
            key={item.key}
            type="natural"
            dataKey={item.key}
            fill={`url(#dotted-background-pattern-${item.key})`}
            fillOpacity={0.35}
            stroke={item.color}
            strokeWidth={1}
            stackId="a"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}