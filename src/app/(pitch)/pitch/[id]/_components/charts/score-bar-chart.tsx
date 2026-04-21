"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

interface BarChartData {
  category: string;
  fullCategory?: string;
  score: number;
  fill: string;
}

interface ScoreBarChartProps {
  data: Array<{
    criteria: string;
    score: number;
  }>;
}

const getScoreColor = (score: number): string => {
  if (score >= 8) return "#4ade80";
  if (score >= 6) return "#F2EAD3";
  if (score >= 4) return "#f59e0b";
  return "#f87171";
};

export const ScoreBarChart = ({ data }: ScoreBarChartProps) => {
  const [chartData, setChartData] = useState<BarChartData[]>([]);

  useEffect(() => {
    // Prepare initial data for animation with shortened labels
    const shortenLabel = (label: string) => {
      const labelMap: Record<string, string> = {
        "Problem-Solution Fit": "Problem-Solution",
        "Business Model & Market": "Business Model", 
        "Team & Execution": "Team",
        "Pitch Quality": "Presentation"
      };
      return labelMap[label] || label;
    };

    const initialData = data.map((item) => ({
      category: shortenLabel(item.criteria),
      fullCategory: item.criteria, // Keep full name for tooltip
      score: 0,
      fill: getScoreColor(item.score),
    }));
    setChartData(initialData);

    // Animate to actual scores
    const timer = setTimeout(() => {
      setChartData(
        data.map((item) => ({
          category: shortenLabel(item.criteria),
          fullCategory: item.criteria,
          score: item.score,
          fill: getScoreColor(item.score),
        }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);

  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
    },
  };

  return (
    <div>
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>
            Performance across all evaluation categories
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <ChartContainer
            config={chartConfig}
            className="h-[300px] sm:h-[350px] w-full"
          >
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 10, bottom: 80 }}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent
                    labelFormatter={(value) => {
                      const item = chartData.find(d => d.category === value);
                      return item?.fullCategory || value;
                    }}
                  />}
                />
                <XAxis
                  dataKey="category"
                  tick={{
                    fontSize: 10,
                    fill: 'hsl(var(--foreground))',
                    textAnchor: 'end',
                    dominantBaseline: 'ideographic'
                  }}
                  interval={0}
                  angle={-30}
                  height={70}
                  className="text-foreground"
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{
                    fontSize: 10,
                    fill: 'hsl(var(--foreground))'
                  }}
                  className="text-foreground"
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Bar
                  dataKey="score"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </BarChart>
          </ChartContainer>
          
          {/* Score Legend */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#4ade80" }}></div>
              <span className="text-muted-foreground">Excellent (8-10)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#F2EAD3" }}></div>
              <span className="text-muted-foreground">Good (6-7.9)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#f59e0b" }}></div>
              <span className="text-muted-foreground">Fair (4-5.9)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#f87171" }}></div>
              <span className="text-muted-foreground">Poor (0-3.9)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};