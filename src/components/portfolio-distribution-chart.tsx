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
    data.map((i) => [i.key, { label: i.label, color: `hsl(${i.color})` }])
  )

  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <ChartContainer config={chartConfig} className="w-full h-full min-w-0 [&>div]:!aspect-auto [&>div]:!h-full">
      <AreaChart data={lineData} accessibilityLayer margin={{ left: 12, right: 12 }}>
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
          {data.map((item) => (
            <linearGradient key={item.key} id={`fill${item.key.charAt(0).toUpperCase() + item.key.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={`var(--color-${item.key})`}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${item.key})`}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>
        {data.map((item) => (
          <Area
            key={item.key}
            type="natural"
            dataKey={item.key}
            fill={`url(#fill${item.key.charAt(0).toUpperCase() + item.key.slice(1)})`}
            fillOpacity={0.4}
            stroke={`var(--color-${item.key})`}
            strokeWidth={1}
            stackId="a"
          />
        ))}
      </AreaChart>
    </ChartContainer>
    </div>
  )
}