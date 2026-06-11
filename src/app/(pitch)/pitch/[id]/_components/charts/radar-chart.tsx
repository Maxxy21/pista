"use client";

import { useEffect, useState } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { motion } from "framer-motion";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RadarChartData {
  category: string;
  score: number;
}

interface RadarChartProps {
  data: Array<{
    criteria: string;
    score: number;
  }>;
}

export const ScoreRadarChart = ({ data }: RadarChartProps) => {
  const [chartData, setChartData] = useState<RadarChartData[]>([]);

  useEffect(() => {
    // Prepare initial data for animation
    const initialData = data.map((item) => ({
      category: item.criteria,
      score: 0,
    }));
    setChartData(initialData);

    // Animate to actual scores
    const timer = setTimeout(() => {
      setChartData(
        data.map((item) => ({
          category: item.criteria,
          score: item.score,
        }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);

  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--gold))",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[220px]"
      >
        <RadarChart data={chartData} outerRadius="80%">
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="category" tick={false} />
          <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.4} />
          <Radar
            dataKey="score"
            fill="var(--color-score)"
            fillOpacity={0.25}
            stroke="var(--color-score)"
            strokeWidth={2}
            animationDuration={1000}
            animationEasing="ease-out"
            isAnimationActive
          />
        </RadarChart>
      </ChartContainer>
    </motion.div>
  );
};