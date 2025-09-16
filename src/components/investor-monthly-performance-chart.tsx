"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export type MonthlyPerfPoint = { mes: string; valor: number }

export default function InvestorMonthlyPerformanceChart({
  data,
  height = 220,
}: {
  data: ReadonlyArray<MonthlyPerfPoint>
  height?: number
}) {
  const chartConfig: ChartConfig = {
    valor: {
      label: "Rendimento",
      color: "var(--chart-1)",
    },
  }

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <ChartContainer config={chartConfig} className="w-full h-full min-w-0 [&>div]:!aspect-auto [&>div]:!h-full">
        <AreaChart data={[...data]} accessibilityLayer margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
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
            tickFormatter={(v) => formatCurrency(Number(v))}
            width={80}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatter={(value) => [formatCurrency(Number(value)), "Rendimento"]} />}
          />
          <defs>
            <linearGradient id="fillValor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-valor)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-valor)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="natural"
            dataKey="valor"
            fill="url(#fillValor)"
            fillOpacity={0.4}
            stroke="var(--color-valor)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}