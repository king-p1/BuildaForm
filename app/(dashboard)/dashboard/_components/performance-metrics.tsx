"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getFormMetrics } from "@/actions/form";

interface PerformanceMetricsProps {
  formId: string;
}

export async function PerformanceMetrics({ formId }: PerformanceMetricsProps) {
  const { metrics } = await getFormMetrics(formId);

  if (!metrics) return null;

  const metricData = [
    {
      title: "Average Response Time",
      value: `${metrics.avgResponseTime.toFixed(1)}s`,
      change: 12,
      trend: 'up'
    },
    {
      title: "Completion Rate",
      value: `${metrics.completionRate.toFixed(1)}%`,
      change: 5,
      trend: 'up'
    },
    {
      title: "Bounce Rate",
      value: `${metrics.bounceRate.toFixed(1)}%`,
      change: 8,
      trend: 'down'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {metricData.map((metric) => (
        <Card key={metric.title} className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {metric.change}%
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 