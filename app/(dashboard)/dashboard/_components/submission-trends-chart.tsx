/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getFormStats } from "@/actions/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for visualization
const mockSubmissionTrends = [
    { date: '2024-03-01', count: 12 },
    { date: '2024-03-02', count: 19 },
    { date: '2024-03-03', count: 15 },
    { date: '2024-03-04', count: 22 },
    { date: '2024-03-05', count: 18 },
    { date: '2024-03-06', count: 25 },
    { date: '2024-03-07', count: 30 },
];

export function SubmissionTrendsChart() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getFormStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    console.log(stats)

    if (loading) {
        return <SubmissionTrendsSkeleton />;
    }
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">Submission Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[330px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                        // data={mockSubmissionTrends}
                        data={stats.submissionTrends}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function SubmissionTrendsSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[330px] w-full" />
            </CardContent>
        </Card>
    );
}