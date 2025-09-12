"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { PieChart as RPieChart, Pie, Cell } from "recharts"

type Item = { key: string; label: string; value: number; color: string }

export default function PortfolioDistributionChart({ data }: { data: ReadonlyArray<Item> }) {
  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((i) => [i.key, { label: i.label, color: i.color }])
  )
  return (
    // Neutraliza o aspect-ratio padrão e força um tamanho mais "encorpado" ao donut
    <ChartContainer config={chartConfig} className="aspect-auto min-h-[260px] w-full">
      <RPieChart>
        {/* Usa raios em % para ocupar melhor o container, evitando donut pequeno em telas largas */}
        <Pie data={data as Item[]} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="82%" paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </RPieChart>
    </ChartContainer>
  )
}