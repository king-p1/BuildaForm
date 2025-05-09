/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormMetrics } from "@/actions/form";
import { PieChart as RechartPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { usePathname } from "next/navigation";

interface PerformanceMetricsProps {
  formIds: string[];
}

export function PerformanceMetrics({ formIds }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [metricCards, setMetricCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const noShow = pathname.startsWith('/dashboard/form')

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!formIds || formIds.length === 0) {
        setMetrics(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch metrics for all forms
        const metricsPromises = formIds.map(formId => getFormMetrics(formId));
        const metricsResults = await Promise.all(metricsPromises);

        // Find the most recent metrics
        const validMetrics = metricsResults
          .filter(result => result.metrics)
          .map(result => result.metrics)
          .sort((a, b) => {
            // Sort by updatedAt if available, otherwise by default order
            if (a.updatedAt && b.updatedAt) {
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
            return 0;
          });

        if (validMetrics.length === 0) {
          setMetrics(null);
          setLoading(false);
          return;
        }

        // Use the most recent metrics
        const latestMetrics = validMetrics[0];
        setMetrics(latestMetrics);

        // Prepare data for metric cards
        const cards = [
          {
            title: "Average Response Time",
            value: `${latestMetrics.avgResponseTime.toFixed(1)}s`,
            change: 12,
            trend: 'up'
          },
          {
            title: "Completion Rate",
            value: `${latestMetrics.completionRate.toFixed(1)}%`,
            change: 5,
            trend: 'up'
          },
          {
            title: "Bounce Rate",
            value: `${latestMetrics.bounceRate.toFixed(1)}%`,
            change: 8,
            trend: 'down'
          }
        ];
        setMetricCards(cards);

        // Prepare data for pie chart
        const pieData = [
          { name: "Completion", value: latestMetrics.completionRate, color: "#10b981" },
          { name: "Bounce", value: latestMetrics.bounceRate, color: "#ef4444" },
          { name: "Other", value: 100 - latestMetrics.completionRate - latestMetrics.bounceRate, color: "#d1d5db" }
        ].filter(item => item.value > 0); // Filter out zero values
        setChartData(pieData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [formIds]);

  

  if (loading) {
    return <PerformanceMetricsSkeleton />;
  }

  if (!metrics) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="size-4" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            No performance metrics available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="size-4" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RechartPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
            </RechartPieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {metricCards.map((metric) => (
            <div key={metric.title} className="flex flex-col p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-sm font-medium text-muted-foreground mb-2">{metric.title}</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {!noShow && 
                 (
                  <div className="flex gap-2 items-center">

                 { metric.trend === 'up' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                {metric.change}%
                  </div>
                )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceMetricsSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="size-4" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}