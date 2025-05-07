/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Clock, 
  MessageSquare, 
  Users, 
  Archive, 
  Star, 
  Power, 
  Filter, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  RefreshCcw,
  Search,
  Download,
  X
} from "lucide-react";
import { getFormActivities, getUserForms } from "@/actions/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TbFolderX } from "react-icons/tb";
import { LuFolderCheck } from "react-icons/lu";

interface Activity {
  id: string;
  type: string;
  userName: string;
  createdAt: string;
  formId: number;
  // Add other fields as needed
}

const ITEMS_PER_PAGE = 10;

const LogPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [formIds, setFormIds] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Get all possible activity types from the data
  const activityTypes = Array.from(new Set(activities.map(a => a.type)));

  useEffect(() => {
    // Simulate fetching form IDs (replace with your actual data fetching)
    const fetchFormIds = async () => {
      try {
        const { formData } = await getUserForms();
        const forms = Array.isArray(formData) ? formData : [formData];
        const ids = forms?.map(form => form?.id) || [];
        setFormIds(ids);
      } catch (error) {
        console.error("Error fetching forms:", error);
        setFormIds([]);
      }
    };

    fetchFormIds();
  }, []);
 

  useEffect(() => {
    const fetchActivities = async () => {
      if (!formIds || formIds.length === 0) {
        setActivities([]);
        setFilteredActivities([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch activities for all forms
        const activitiesPromises = formIds.map(formId => getFormActivities(formId));
        const activitiesResults = await Promise.all(activitiesPromises);
        
        // Merge all activities into a single array
        const allActivities = activitiesResults.flatMap(result => result.activities);
        
        // Sort activities by creation date (most recent first)
        const sortedActivities = allActivities.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setActivities(sortedActivities);
        setFilteredActivities(sortedActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]);
        setFilteredActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [formIds]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...activities];
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(activity => selectedTypes.includes(activity.type));
    }
    
    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "yesterday":
          cutoffDate.setDate(now.getDate() - 1);
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(activity => 
        new Date(activity.createdAt) >= cutoffDate
      );
    }
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.userName?.toLowerCase().includes(query) || 
        activity.type.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(activity => activity.type === activeTab);
    }
    
    setFilteredActivities(filtered);
    // Reset visible count when filters change
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activities, selectedTypes, dateRange, searchQuery, activeTab]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Fetch activities for all forms
      const activitiesPromises = formIds.map(formId => getFormActivities(formId));
      const activitiesResults = await Promise.all(activitiesPromises);
      
      // Merge all activities into a single array
      const allActivities = activitiesResults.flatMap(result => result.activities);
      
      // Sort activities by creation date (most recent first)
      const sortedActivities = allActivities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      
      setActivities(sortedActivities);
      setFilteredActivities(sortedActivities);
    } catch (error) {
      console.error("Error refreshing activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setDateRange("all");
    setSearchQuery("");
    setActiveTab("all");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <Activity className="size-4" />;
      case 'comment':
        return <MessageSquare className="size-4" />;
      case 'visit':
        return <Users className="size-4" />;
      case 'archived':
        return <Archive className="size-4" />;
      case 'unarchived':
        return <Archive className="size-4" />;
      case 'favorited':
        return <Star className="size-4" fill='yellow' />;
      case 'unfavorited':
        return <Star className="size-4" />;
      case 'deactivated':
        return <TbFolderX className="size-4" />;
      case 'activated':
        return <LuFolderCheck className="size-4" />;
      default:
        return <Activity className="size-4" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'submission':
        return "bg-green-100 text-green-800";
      case 'comment':
        return "bg-blue-100 text-blue-800";
      case 'visit':
        return "bg-purple-100 text-purple-800";
      case 'archived':
        return "bg-red-100 text-red-500";
      case 'unarchived':
        return "bg-emerald-100 text-emerald-500";
      case 'favorited':
        return "bg-yellow-100 text-yellow-800";
      case 'unfavorited':
        return "bg-yellow-100 text-yellow-800";
      case 'deactivated':
        return "bg-red-100 text-red-600";
      case 'activated':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'visit':
        return `New visit from ${activity.userName || 'someone'}`;
      case 'submission':
        return `${activity.userName || 'Someone'} submitted a form`;
      case 'comment':
        return `${activity.userName || 'Someone'} commented on a form`;
      case 'archived':
        return `${activity.userName || 'Someone'} archived form`;
      case 'unarchived':
        return `${activity.userName || 'Someone'} unarchived form`;
      case 'favorited':
        return `${activity.userName || 'Someone'} favorited form`;
      case 'unfavorited':
        return `${activity.userName || 'Someone'} unfavorited form`;
      case 'deactivated':
        return `${activity.userName || 'Someone'} deactivated form`;
      case 'activated':
        return `${activity.userName || 'Someone'} activated form`;
      default:
        return `Unknown activity`;
    }
  };

  const isFiltering = selectedTypes.length > 0 || dateRange !== "all" || searchQuery !== "" || activeTab !== "all";

  

  

  return (
    <div className="container mx-auto py-6 space-y-6 -mt-7">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">
            View and filter all form activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={cn(loading && 'animate-pulse' ,"text-sm font-medium")}>Activity Type</span>
                  {selectedTypes.length > 0 && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setSelectedTypes([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {activityTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeSelect(type)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <label htmlFor={`type-${type}`} className="text-sm flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${getActivityBadgeColor(type)}`}>
                          {getActivityIcon(type)}
                          <span className="ml-1">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Date Range</span>
                  {dateRange !== "all" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setDateRange("all")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="space-y-1">
                  {["all", "today", "yesterday", "week", "month"].map((range) => (
                    <div key={range} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`range-${range}`}
                        checked={dateRange === range}
                        onChange={() => setDateRange(range)}
                        className="text-primary focus:ring-primary"
                      />
                      <label htmlFor={`range-${range}`} className="text-sm capitalize">
                        {range === "all" ? "All time" :
                         range === "week" ? "Last 7 days" :
                         range === "month" ? "Last 30 days" : range}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {isFiltering && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className={cn(loading && 'animate-pulse' ,"text-sm")}>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Activities</span>
                  <span className="font-medium">{activities.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Forms Tracked</span>
                  <span className="font-medium">{formIds.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Filtered Results</span>
                  <span className="font-medium">{filteredActivities.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-9">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 sm:grid-cols-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="submission">Submissions</TabsTrigger>
                    <TabsTrigger value="visit">Visits</TabsTrigger>
                    <TabsTrigger value="comment">Comments</TabsTrigger>
                    <TabsTrigger value="favorited">Favorites</TabsTrigger>
                    <TabsTrigger value="archived">Archives</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-12">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex items-start gap-4 mt-5">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-32">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No activities found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isFiltering 
                      ? "Try adjusting your filters to see more results." 
                      : "There are no activities logged for your forms yet."}
                  </p>
                  {isFiltering && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Table >
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Form ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.slice(0, visibleCount).map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getActivityBadgeColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                              <span className="ml-1 capitalize">{activity.type}</span>
                            </span>
                          </TableCell>
                          <TableCell>{formatActivityDescription(activity)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.formId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredActivities.length > visibleCount && (
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" onClick={handleLoadMore}>
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

 

export default LogPage;