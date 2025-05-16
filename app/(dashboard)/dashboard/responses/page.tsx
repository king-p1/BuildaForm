"use client"

import React, { useState, useEffect } from 'react';
import { getUserResponses } from '@/actions/form';
import { format, formatDistance, isAfter } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CalendarIcon, SearchIcon, Filter, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";
import { IoEarth } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';



// Types based on your Prisma schema
type ResponseWithForm = {
  id: number;
  userId: string;
  formId: number;
  content: string;
  createdAt: Date;
  form: {
    id: number;
    name: string;
    description: string;
    createdBy: string;
    createdAt: Date;
    published: boolean;
    roomType: 'PUBLIC' | 'PRIVATE';
    expiresAt?: Date;
  };
};

 
const ResponsesPage = () => {
  const [responses, setResponses] = useState<ResponseWithForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const responsesPerPage = 10;
  const user = useUser()

  // Fetch user responses
  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      
      // In a real implementation, you would get the email from session/context
      const userEmail = String(user?.user?.emailAddresses[0].emailAddress); // This should be replaced with actual user email
      

      try {
        const result = await getUserResponses(userEmail);
        // console.log(result)
        
        if (result.error) {
          setError(result.message || 'Failed to fetch responses');
        } else if (result.responses) {
          setResponses(result.responses);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  // Apply filters
  const filteredResponses = responses.filter(response => {
    // Filter by form name
    const nameMatch = nameFilter === '' || 
      response.form.name.toLowerCase().includes(nameFilter.toLowerCase());
    
    // Filter by date - show responses from the selected date up to now
    let dateMatch = true;
    if (dateFilter) {
      const responseDate = new Date(response.createdAt);
      dateMatch = isAfter(responseDate, dateFilter) || 
                  responseDate.toDateString() === dateFilter.toDateString();
    }
    
    return nameMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredResponses.length / responsesPerPage);
  const paginatedResponses = filteredResponses.slice(
    (currentPage - 1) * responsesPerPage,
    currentPage * responsesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter, dateFilter]);

  // Render functions
  

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Responses</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Responses</h1>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="nameFilter" className="mb-2 block">
            Filter by Form Name:
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="nameFilter"
              type="text"
              className="pl-8"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search forms..."
            />
          </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="dateFilter" className="mb-2 block">
            Filter by Date:
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="dateFilter"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : "Select start date..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={(date) => {
                  setDateFilter(date);
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {dateFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2" 
              onClick={() => setDateFilter(undefined)}
            >
              Clear date filter
            </Button>
          )}
        </div>
      </div>
      
      {/* Response Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredResponses.length} {filteredResponses.length === 1 ? 'response' : 'responses'}
      </div>

      {/* Responses Grid */}
      {paginatedResponses.length > 0 ? (
        <div className="space-y-6">
          {paginatedResponses.map((response) => (
            <Card key={response.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{response.form.name}</CardTitle>
                    <CardDescription className="mt-1">{response.form.description}</CardDescription>
                  </div>
                  <Badge variant={response.form.published ? "default" : "outline"}>
                    {response.form.published ? 'Published' : 'Draft'}
                  </Badge>
                  
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                  <div>
                    <span className="font-medium text-foreground">Author:</span> {response.form.createdBy}
                  </div>

                  <div className='flex gap-2 items-center'>
                    <span className="font-medium text-foreground">Room Type:</span>
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
    <span className="text-xs text-muted-foreground">
              {response.form.roomType  === 'PUBLIC' ? (
                <IoEarth className='size-4 text-emerald-500'/>
                ) : (<LockKeyhole className='size-4 text-red-600'/>)}
            </span>
    </TooltipTrigger>
    <TooltipContent>
    {response.form.roomType  === 'PUBLIC' ? 'This form is public' : 'This form is private'}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

                  </div>
                  <div>
                    <span className="font-medium text-foreground">Created:</span> {formatDistance(new Date(response.form.createdAt), new Date(), { addSuffix: true })}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Submitted:</span> {formatDistance(new Date(response.createdAt), new Date(), { addSuffix: true })}
                  </div>
                  {response.form.expiresAt && (
                    <div>
                      <span className="font-medium text-foreground">Expires:</span> {formatDistance(new Date(response.form.expiresAt), new Date(), { addSuffix: true })}
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-foreground mb-2">Your Response</h3>

                  <Button asChild>
                    <Link href={`/submit/${response.form.shareURL}?submissionId=${response.form.FormSubmissions[0]?.id}`}>
                      View Response
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No responses match your filters.</p>
            {(nameFilter || dateFilter) && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => {
                  setNameFilter('');
                  setDateFilter(undefined);
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      


      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show only current page, first, last, and pages around current
              if (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                (page === 2 && currentPage > 3) || 
                (page === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return <PaginationEllipsis key={page} />;
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}



    </div>
  );}

export default ResponsesPage;


// so everything looks good but in this my new component when i click view response i want to see the response and there will be a button that you can only see if your submission status is completed and the button will be edit response and that can remove the no cursor style and allow the user make edits to the form, so when the user clicks edits the isEditing boolean becomes true and when they submit again it becomes false
