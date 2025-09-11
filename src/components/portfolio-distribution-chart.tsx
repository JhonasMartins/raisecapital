"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { PieChart as RPieChart, Pie, Cell } from "recharts"

type Item = { key: string; label: string; value: number; color: string }

export default function PortfolioDistributionChart({ data }: { data: ReadonlyArray<Item> }) {
  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((i) => [i.key, { label: i.label, color: i.color }])
  )
  return (
    <ChartContainer config={chartConfig} className="aspect-[4/3]">
      <RPieChart>
        <Pie data={data as Item[]} dataKey="value" nameKey="label" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </RPieChart>
    </ChartContainer>
  )
}