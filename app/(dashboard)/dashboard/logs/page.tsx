/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useEffect, useState } from "react";
import { 
  Activity, 
  Clock, 
  MessageSquare, 
  Users, 
  Archive, 
  Star, 
  RefreshCcw,
  Search,
  Download,
  X,  
  FileText,
} from "lucide-react";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsFileEarmarkPdf } from "react-icons/bs";

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const [exportOpen, setExportOpen] = useState(false);
  const [exportDays, setExportDays] = useState("7");
  const [exportFormat, setExportFormat] = useState("excel");
const [isMobile, setIsMobile] = useState(false);

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
    // Set initial state
    setLoading(true);
    setActivities([]);
    setFilteredActivities([]);
    
    const fetchActivities = async () => {
      if (!formIds || formIds.length === 0) {
        setActivities([]);
        setFilteredActivities([]);
        setLoading(false);
        return;
      }
  
      try {
        // Add a small delay to ensure loading state is visible for better UX
        setTimeout(async () => {
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
        }, 300);
      } catch (error) {
        console.error("Error in fetch process:", error);
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


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1105); // 768px is a common breakpoint for medium screens
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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





  const handleExport = async () => {
    setExportOpen(false);
    
    // Show loading state
    setLoading(true);
    
    try {
      // Get the data to export
      let dataToExport = [...activities];
      
      // Apply date filter based on selected export days
      if (exportDays !== "all") {
        const now = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - parseInt(exportDays));
        
        dataToExport = dataToExport.filter(activity => 
          new Date(activity.createdAt) >= cutoffDate
        );
      }
      
      // Format the data for export
      const exportableData = dataToExport.map(activity => ({
        Type: activity.type.charAt(0).toUpperCase() + activity.type.slice(1),
        Description: formatActivityDescription(activity),
        UserName: activity.userName || 'Anonymous',
        Date: new Date(activity.createdAt).toLocaleDateString(),
        Time: new Date(activity.createdAt).toLocaleTimeString(),
        FormID: activity.formId
      }));
      
      // Generate filename with current date
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const fileName = `activity-log_${dateStr}`;
      
      // Export based on selected format
      switch (exportFormat) {
        case 'excel':
          await exportToExcel(exportableData, fileName);
          break;
        case 'pdf':
          await exportToPDF(exportableData, fileName);
          break;
        case 'text':
          exportToCSV(exportableData, fileName);
          break;
        default:
          console.error('Unknown export format');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      // Display error message to user
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // 3. Add these export helper functions
  
  // Excel Export
  const exportToExcel = async (data: any[], fileName: string) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Activities');
      
      // Apply some styling to the worksheet
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let i = range.s.r; i <= range.e.r; i++) {
        for (let j = range.s.c; j <= range.e.c; j++) {
          const cell_address = XLSX.utils.encode_cell({ r: i, c: j });
          if (!worksheet[cell_address]) continue;
          
          // Apply header style
          if (i === 0) {
            worksheet[cell_address].s = {
              font: { bold: true },
              fill: { fgColor: { rgb: "ECECEC" } }
            };
          }
        }
      }
      
      // Auto-size columns
      const max_width = data.reduce((w: any[], r: { [x: string]: any; }) => {
        return Object.keys(r).map((k, i) => Math.max(w[i] || 0, k.length, String(r[k]).length));
      }, []);
      
      worksheet['!cols'] = max_width.map((w: number) => ({ wch: w + 2 }));
      
      // Generate buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save file
      saveAs(blob, `${fileName}.xlsx`);
      return true;
    } catch (error) {
      console.error('Excel export error:', error);
      throw error;
    }
  };
  
  // PDF Export
const exportToPDF = async (data: any[], fileName: string) => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      // Add title
      doc.setFontSize(18);
      doc.text('Activity Log Report', 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Report period: ${exportDays === 'all' ? 'All time' : `Last ${exportDays} days`}`, 14, 36);
      
      // Prepare table data
      const tableColumn = Object.keys(data[0]);
      const tableRows = data.map((item: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(item));
      
      // Use autoTable as a function instead of a method
      autoTable(doc, {
        head: [tableColumn as string[]],
        body: tableRows as string[][],
        startY: 45,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [66, 66, 66],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          Type: { cellWidth: 25 },
          Description: { cellWidth: 70 },
          Date: { cellWidth: 25 },
          Time: { cellWidth: 25 },
          UserName: { cellWidth: 30 },
          FormID: { cellWidth: 20 }
        }
      });
      
      // Fix for getNumberOfPages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      
      // Save file
      doc.save(`${fileName}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF export error:', error);
      throw error;
    }
  };
  
  
  // CSV Export
  const exportToCSV = (data: unknown[] | Papa.UnparseObject<unknown>, fileName: string) => {
    try {
      const csv = Papa.unparse(data, {
        quotes: true, // Use quotes around fields
        delimiter: ',',
        header: true
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${fileName}.csv`);
      return true;
    } catch (error) {
      console.error('CSV export error:', error);
      throw error;
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
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
          <Popover open={exportOpen} onOpenChange={setExportOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Export Activity Log</h4>
        {loading && <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent" />}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Time Range</label>
        <Select value={exportDays} onValueChange={(value) => setExportDays(value)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select export range" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Today</SelectItem>
    <SelectItem value="7">Last 7 days</SelectItem>
    <SelectItem value="30">Last 30 days</SelectItem>
    <SelectItem value="60">Last 60 days</SelectItem>
    <SelectItem value="90">Last 90 days</SelectItem>
    <SelectItem value="all">All time</SelectItem>
  </SelectContent>
</Select>
        <p className="text-xs text-muted-foreground">
          {exportDays === "all" 
            ? "Exporting all activity logs" 
            : `Exporting activities from ${new Date(Date.now() - parseInt(exportDays) * 24 * 60 * 60 * 1000).toLocaleDateString()} to today`}
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Format</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={exportFormat === "excel" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setExportFormat("excel")}
            disabled={loading}
          >
            <PiMicrosoftExcelLogoFill className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button
            type="button"
            variant={exportFormat === "pdf" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setExportFormat("pdf")}
            disabled={loading}
          >
            <BsFileEarmarkPdf className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            type="button"
            variant={exportFormat === "text" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setExportFormat("text")}
            disabled={loading}
          >
            <FileText className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          className="w-full" 
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Records
            </>
          )}
        </Button>
      </div>
    </div>
  </PopoverContent>
</Popover>
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
                    <X className="size-4" />
                  </Button>
                )}
 

{isMobile ? (
  // Select dropdown for mobile
  <div className="w-full">
    <Select 
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
    //   className="w-full p-2 border border-gray-300 rounded-md bg-background"
    >
         <SelectTrigger className="w-full">
    <SelectValue placeholder="Select log type" />
  </SelectTrigger>
  <SelectContent>
      <SelectItem value="all">All</SelectItem>
      <SelectItem value="submission">Submissions</SelectItem>
      <SelectItem value="visit">Visits</SelectItem>
      <SelectItem value="comment">Comments</SelectItem>
      <SelectItem value="favorited">Favorites</SelectItem>
      <SelectItem value="archived">Archives</SelectItem>
      </SelectContent>
    </Select>
  </div>
) : (
  // Tabs for desktop
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    <TabsList className="flex flex-wrap">
      <TabsTrigger value="all" className="flex-grow">All</TabsTrigger>
      <TabsTrigger value="submission" className="flex-grow">Submissions</TabsTrigger>
      <TabsTrigger value="visit" className="flex-grow">Visits</TabsTrigger>
      <TabsTrigger value="comment" className="flex-grow">Comments</TabsTrigger>
      <TabsTrigger value="favorited" className="flex-grow">Favorites</TabsTrigger>
      <TabsTrigger value="archived" className="flex-grow">Archives</TabsTrigger>
    </TabsList>
  </Tabs>
)}
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
              ) : 
              
              ( loading === false && filteredActivities.length === 0 ? (
                <div className="text-center py-32 animate-pulse">
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
                <div className="max-h-[76vh] overflow-auto border rounded-md">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
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
                </div>
                {filteredActivities.length > visibleCount && (
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" onClick={handleLoadMore}>
                      Load More
                    </Button>
                  </div>
                )}
                </>
              )
              
          )    }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

 

export default LogPage;