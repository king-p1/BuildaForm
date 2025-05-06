/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormStats } from "@/actions/form";

export function StatsDashboard() {
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

    if (loading) {
        return <StatsSkeleton />;
    }

    return (
        <>
        <Card className="h-full flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedForms} published, {stats.draftForms} drafts
            </p>
          </CardContent>
          <CardFooter className="text-xs text-primary cursor-pointer hover:underline">
            View all forms
          </CardFooter>
        </Card>
      
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visits}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
          <CardFooter className="text-xs text-primary cursor-pointer hover:underline">
            Analyze traffic
          </CardFooter>
        </Card>
      
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.submissionRate.toFixed(1)}% submission rate
            </p>
          </CardContent>
          <CardFooter className="text-xs text-primary cursor-pointer hover:underline">
            View submissions
          </CardFooter>
        </Card>
      
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              -12% from last month
            </p>
          </CardContent>
          <CardFooter className="text-xs text-primary cursor-pointer hover:underline">
            Improve engagement
          </CardFooter>
        </Card>
      </>
      
    );
}

function StatsSkeleton() {
    return (
        <>
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-[100px]" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-[50px]" />
                        <Skeleton className="h-4 w-[150px] mt-2" />
                    </CardContent>
                </Card>
            ))}
        </>
    );
}