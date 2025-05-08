"use client";

import { useState, useEffect } from "react";
import { getFormMetrics, getUserForms } from "@/actions/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceMetrics } from "../_components/performance-metrics"; // Your existing component
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Users, 
  ArrowRight, 
  Calendar,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [formOptions, setFormOptions] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [timeRange, setTimeRange] = useState("7d");
  const [metrics, setMetrics] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  
  // Dummy data for historical representation - in production you'd fetch this
  const generateHistoricalData = () => {
    const ranges = {
        "1d": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90
    };
    
    const days = ranges[timeRange] ;
    const data = [];
    
    let completion = metrics?.completionRate;
    let bounce = metrics?.bounceRate ;
    let responseTime = metrics?.avgResponseTime ;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some variance for visual effect
      const variance = Math.random() * 10 - 5;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completionRate: Math.max(0, Math.min(100, completion + variance)),
        bounceRate: Math.max(0, Math.min(100, bounce + variance/2)),
        responseTime: Math.max(0.5, responseTime + (variance/10))
      });
      
      // Small trend changes for more realistic data
      completion += (Math.random() * 2 - 1);
      bounce += (Math.random() * 1.5 - 0.75);
      responseTime += (Math.random() * 0.2 - 0.1);
    }
    
    return data;
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // In a real implementation, fetch your forms data
        const { formData } = await getUserForms(); // You'll need to implement this
        const forms = Array.isArray(formData) ? formData : [formData];
        
        if (forms && forms.length > 0) {
          const options = forms.map(form => ({
            id: form.id.toString(),
            name: form.name || `Form ${form.id}`
          }));
          
          setFormOptions(options);
          
          // Set first form as default
          if (options.length > 0 && !selectedFormId) {
            setSelectedFormId(options[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    
     
    
    fetchForms();
  }, []);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!selectedFormId) return;
      
      setLoading(true);
      try {
        const result = await getFormMetrics(selectedFormId);
        setMetrics(result.metrics);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    
    
    fetchMetrics();
  }, [selectedFormId]);
  
  useEffect(() => {
    setHistoricalData(generateHistoricalData());
  }, [metrics, timeRange]);

  const COLORS = ['#10b981', '#ef4444', '#d1d5db'];
  

  // todo: dynamically render the change and trends
  const statCards = [
    {
      title: "Completion Rate",
      value: metrics?.completionRate.toFixed(1) + "%",
      change: "+5.2%",
      trend: "up",
      icon: <Users className="size-4" />,
      description: "Users completing your form"
    },
    {
      title: "Avg. Response Time",
      value: metrics?.avgResponseTime.toFixed(1) + "s",
      change: "-0.8s",
      trend: "down",
      icon: <Clock className="size-4" />,
      description: "Time spent on form"
    },
    {
      title: "Bounce Rate",
      value: metrics?.bounceRate.toFixed(1) + "%",
      change: "+2.1%",
      trend: "up",
      icon: <ArrowRight className="size-4" />,
      description: "Users abandoning your form"
    }
  ];



  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Analytics</h1>
        
        <div className="flex items-center gap-4">
          <Select value={selectedFormId} onValueChange={setSelectedFormId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Form" />
            </SelectTrigger>
            <SelectContent>
              {formOptions.map(form => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      {stat.icon}
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (stat.trend === "up" && stat.title.includes("Bounce")) || 
                    (stat.trend === "down" && !stat.title.includes("Bounce")) 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  }`}>
                    {stat.trend === "up" ? <ArrowUpRight className="size-3 mr-1" /> : <ArrowDownRight className="size-3 mr-1" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{stat.description}</p>
                <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded">
                  <div 
                    className={`h-1 rounded ${
                      stat.title.includes("Bounce") ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: stat.title.includes("Response") 
                        ? `${Math.min(100, (metrics?.avgResponseTime / 10) * 100)}%` 
                        : `${stat.title.includes("Bounce") ? metrics?.bounceRate : metrics?.completionRate}%`
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <PieChartIcon className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="completion" className="flex items-center gap-1.5">
            <LineChartIcon className="size-4" />
            Completion Analysis
          </TabsTrigger>
          <TabsTrigger value="response" className="flex items-center gap-1.5">
            <BarChartIcon className="size-4" />
            Response Time
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="size-4" />
                  Completion Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Completed", value: metrics?.completionRate },
                          { name: "Bounced", value: metrics?.bounceRate },
                          { name: "Partially Completed", value: 100 - metrics?.completionRate - metrics?.bounceRate }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1, 2].map((index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Daily Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="completionRate" 
                        name="Completion Rate (%)" 
                        stroke="#10b981" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="bounceRate" 
                        name="Bounce Rate (%)" 
                        stroke="#ef4444" 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="responseTime" 
                        name="Avg Response Time (s)" 
                        stroke="#6366f1" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completionRate" 
                      name="Completion Rate (%)" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-sm font-medium text-muted-foreground">Average Completion</p>
                  <p className="text-2xl font-bold mt-1">{metrics?.completionRate.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-sm font-medium text-muted-foreground">Highest Day</p>
                  <p className="text-2xl font-bold mt-1">{Math.max(...historicalData.map(d => d.completionRate)).toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-sm font-medium text-muted-foreground">Lowest Day</p>
                  <p className="text-2xl font-bold mt-1">{Math.min(...historicalData.map(d => d.completionRate)).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="response" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}s`} />
                    <Legend />
                    <Bar dataKey="responseTime" name="Avg Response Time (s)" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-sm font-medium text-muted-foreground">Average Time</p>
                  <p className="text-2xl font-bold mt-1">{metrics?.avgResponseTime.toFixed(1)}s</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-sm font-medium text-muted-foreground">Fastest Day</p>
                  <p className="text-2xl font-bold mt-1">{Math.min(...historicalData.map(d => d.responseTime)).toFixed(1)}s</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-sm font-medium text-muted-foreground">Slowest Day</p>
                  <p className="text-2xl font-bold mt-1">{Math.max(...historicalData.map(d => d.responseTime)).toFixed(1)}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PerformanceMetrics formIds={selectedFormId ? [selectedFormId] : []} />
    </div>
  );
}
 