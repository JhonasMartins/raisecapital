"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "Janeiro", aportes: 15000, rendimentos: 1200 },
  { month: "Fevereiro", aportes: 22000, rendimentos: 1800 },
  { month: "Março", aportes: 18000, rendimentos: 1450 },
  { month: "Abril", aportes: 8000, rendimentos: 2100 },
  { month: "Maio", aportes: 25000, rendimentos: 1950 },
  { month: "Junho", aportes: 20000, rendimentos: 2300 },
];

const chartConfig = {
  aportes: {
    label: "Aportes",
    color: "var(--chart-1)",
  },
  rendimentos: {
    label: "Rendimentos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function GradientBarMultipleChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Performance Mensal{" "}
          <Badge
            variant="outline"
            className="text-green-500 bg-green-500/10 border-none ml-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>+12.8%</span>
          </Badge>
        </CardTitle>
        <CardDescription>Janeiro - Junho 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-56 sm:h-64 w-full !aspect-auto">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" hideLabel />}
            />
            <Bar
              dataKey="aportes"
              shape={<CustomGradientBar />}
              fill="var(--chart-1)"
            />
            <Bar
              dataKey="rendimentos"
              shape={<CustomGradientBar />}
              fill="var(--chart-2)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomGradientBar = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string }
) => {
  const { fill, x, y, width, height } = props;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="none"
      fill={fill}
      rx={2}
    />
  );
};
