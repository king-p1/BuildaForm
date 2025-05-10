"use client";

import { getUserForms, toggleFormArchived, toggleFormDeactivated, toggleFormFavorite } from '@/actions/form';
import { Form } from '@prisma/client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatDistanceToNow, isBefore,subDays } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"  
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FolderOpen, 
  Star, 
  Trash2, 
  FileEdit, 
  Eye, 
  BarChart3, 
  Share2,
  CircleCheckBig,
  Archive,
  Ellipsis,
  LockKeyhole,
  FilterX,
} from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TbWorldCancel,TbLoader3, TbFolderX, } from "react-icons/tb";
import { CreateFormButton } from '@/components/form-elements/form-btns/create-form-btn';
import { toast } from "@/hooks/use-toast";
import { DeleteFormBtn } from '@/components/form-elements/form-btns/delete-form-btn';
import { PiFoldersDuotone } from "react-icons/pi";
import { LuFolderCheck } from 'react-icons/lu';
import { IoEarth } from "react-icons/io5";




const AllFormsPage = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [copiedForms, setCopiedForms] = useState<Set<string>>(new Set());
  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFavorite = searchParams.get('isFavorite') === 'true';
  const isArchived = searchParams.get('isArchived') === 'true';
  const isDeactivated = searchParams.get('isDeactivated') === 'true';
  
  useEffect(() => {
    const fetchForms = async () => {
      setIsLoading(true);
      try {
        const { formData } = await getUserForms();
        setForms(formData || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchForms();
  }, []);

  const applyDateFilter = (form: Form) => {
    if (!dateFilter) return true;
    
    const currentDate = new Date();
    const formDate = new Date(form.createdAt);
    
    switch (dateFilter) {
      case "today":
        return formDate >= new Date(currentDate.setHours(0, 0, 0, 0));
      case "7days":
        return formDate >= subDays(currentDate, 7);
      case "14days":
        return formDate >= subDays(currentDate, 14);
      case "30days":
        return formDate >= subDays(currentDate, 30);
      default:
        return true;
    }
  };

  const applyRoomTypeFilter = (form: Form) => {
    // if (!roomTypeFilter) return "PUBLIC";
    // return form.roomType === roomTypeFilter;

    switch (roomTypeFilter) {
      case "PUBLIC":
        return form.roomType === roomTypeFilter;
        case "PRIVATE":
          return form.roomType === roomTypeFilter;
      case "ALL":
     return true;
      default:
        return true;
    }
  };


  
  const getPageTitle = () => {
    if (isFavorite) return "Favorite Forms";
    if (isArchived) return "Archived Forms";
    if (isDeactivated) return "Deactivated Forms";
    return "All Forms";
  };

  const filteredForms = forms.filter(form => {
    const baseFilterCondition = isFavorite ? form.isFavorite : 
                              isArchived ? form.isArchived : 
                              isDeactivated ? form.isDeactivated : true;
    
    return baseFilterCondition && applyDateFilter(form) && applyRoomTypeFilter(form);
  });
  
  const resetFilters = () => {
    setRoomTypeFilter(null);
    setDateFilter(null);
  };

  const truncateText = (text: string, wordCount: number) => {
    const words = text.split(' ')
    if (words.length <= wordCount) return text
    return words.slice(0, wordCount).join(' ') + '...'
  }

  const getCurrentIcon = () => {
    if (isFavorite) return <Star className="h-6 w-6 text-yellow-300" fill='yellow' />;
    if (isArchived) return <Trash2 className="h-6 w-6 text-red-500" />;
    if (isDeactivated) return <TbWorldCancel className="h-6 w-6 text-emerald-500" />;
    return <FolderOpen className="h-6 w-6 text-blue-500" />;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleFavoriteToggle = async (formId: number) => {
    setActionLoading(formId);
    try {
      const result = await toggleFormFavorite(formId);
      if (result.error) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      } else {
        // Update form in local state
        setForms(forms.map(form => 
          form.id === formId 
            ? { ...form, isFavorite: !form.isFavorite } 
            : form
        ));
        
        toast({
          title: "Success",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update form status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveToggle = async (formId: number) => {
    setActionLoading(formId);
    try {
      const result = await toggleFormArchived(formId);
      if (result.error) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      } else {
        // Update form in local state
        setForms(forms.map(form => 
          form.id === formId 
            ? { ...form, isArchived: !form.isArchived } 
            : form
        ));
        
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Refresh if we're on a filtered view and the form no longer matches
        if (isArchived) {
          router.refresh();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update form status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivateToggle = async (formId: number) => {
    setActionLoading(formId);
    try {
      const result = await toggleFormDeactivated(formId);
      if (result.error) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      } else {
        // Update form in local state
        setForms(forms.map(form => 
          form.id === formId 
            ? { ...form, isDeactivated: !form.isDeactivated } 
            : form
        ));
        
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Refresh if we're on a filtered view and the form no longer matches
        if (isDeactivated) {
          router.refresh();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update form status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-2 py-8 -mt-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {getCurrentIcon()}
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        </div>
        
        <div className="flex gap-3 items-center">
          {(roomTypeFilter || dateFilter) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="flex items-center gap-2"
            >
              <FilterX className="h-4 w-4" />
              Reset Filters
            </Button>
          )}
          
          <Select
            value={roomTypeFilter || ""}
            onValueChange={(value) => setRoomTypeFilter(value || null)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Access Types</SelectItem>
              <SelectItem value="PUBLIC">Public Forms</SelectItem>
              <SelectItem value="PRIVATE">Private Forms</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={dateFilter || ""}
            onValueChange={(value) => setDateFilter(value || null)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="14days">Last 14 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Card key={item} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredForms.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredForms.map((form) => (
            <motion.div key={form.id} variants={itemVariants}>
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center gap-1 w-full">
                    <div className="flex gap-2">
                      {form.isFavorite && (
                        <Badge variant="outline" className="bg-yellow-100 border-yellow-300 rounded-full p-1">
                          <Star className="text-yellow-300 fill-yellow-300 size-5" />
                        </Badge>
                      )}
                      {form.isArchived && (
                        <Badge variant="outline" className="p-1.5 rounded-full bg-red-100 text-red-700 border-red-300">
                          <Trash2 className="size-4" />
                        </Badge>
                      )}
                      {form.isDeactivated && (
                        <Badge variant="outline" className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 border-emerald-300">
                          <TbWorldCancel className="size-5" />     
                        </Badge>
                      )}
                      <CardTitle className="text-lg">
                        <Link href={
                          form.published
                            ? `/dashboard/form/${form.id}`
                            : `/dashboard/form-builder/${form.id}`
                        }
                        className="flex items-center gap-2 hover:underline"
                        >
                          {form.name}
                        </Link>
                      </CardTitle>
                    </div>

                    <div className="flex gap-2 items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {form.roomType === 'PUBLIC' ? (
                              <IoEarth className="size-5 text-emerald-500" />
                            ) : (
                              <LockKeyhole className='size-5 text-red-500' />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {form.roomType === 'PUBLIC' ? (
                              <p>This form is public.</p>
                            ) : (
                              <p>This form is private.</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {form.published ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-cyan-100 text-cyan-400 border-cyan-500">Draft</Badge>  
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger> 
                        <p className="text-sm text-gray-600">
                          {truncateText(form.description, 12) || "No description provided"}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        {form.description || "No description provided"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye size={14} /> {form.visits} views
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <BarChart3 size={14} /> {form.submissions} submissions
                    </Badge>
                    {form.expiresAt && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-300" variant="outline">
                        {isBefore(new Date(form.expiresAt), new Date())
                          ? `Expired ${formatDistanceToNow(new Date(form.expiresAt), { addSuffix: true })}`
                          : `Expires ${formatDistanceToNow(new Date(form.expiresAt), { addSuffix: true })}`}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="secondary">
                          {actionLoading === form.id ? (
                            <TbLoader3 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Ellipsis className="h-4 w-4" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side='bottom' sideOffset={40} align='start'>
                        <h2 className='w-full border-b p-1 mb-2 flex items-center gap-3'>
                          <PiFoldersDuotone className='size-5 font-normal' />
                          Form Actions
                        </h2>
                        <div className="grid gap-1">
                          <Button 
                            variant="ghost" 
                            className="flex items-center justify-start gap-3"
                            onClick={() => handleFavoriteToggle(form.id)}
                            disabled={actionLoading === form.id}
                          >
                            <Star 
                              className={`h-4 w-4 ${form.isFavorite ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-300'}`} 
                            />
                            {form.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          </Button>

                          <Button 
                            variant="ghost" 
                            className="flex items-center justify-start gap-2"
                            onClick={() => handleArchiveToggle(form.id)}
                            disabled={actionLoading === form.id}
                          >
                            <Archive className={`h-4 w-4 ${form.isArchived ? 'text-red-500' : ''}`} />
                            {form.isArchived ? 'Unarchive form' : 'Archive form'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="flex items-center justify-start gap-2"
                            onClick={() => handleDeactivateToggle(form.id)}
                            disabled={actionLoading === form.id}
                          >
                            {form.isDeactivated ? (
                              <LuFolderCheck className="h-5 w-5 text-green-500" />
                            ) : (
                              <TbFolderX className="h-5 w-5 text-emerald-500" />
                            )}
                            {form.isDeactivated ? 'Activate form' : 'Deactivate form'}
                          </Button>
                          
                          {isArchived && (
                            <DeleteFormBtn id={form.id}/>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button variant="outline" asChild>
                      <Link href={`/forms/${form.id}/edit`}>
                        <FileEdit className="h-4 w-4 mr-2" /> Edit
                      </Link>
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      key={form.id}
                      variant="outline" 
                      size="icon" 
                      title="Share Form"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/submit/${form.shareURL}`);
                        toast({
                          title: "Copied",
                          description: "Link copied to clipboard",
                        });
                        
                        // Add the form ID to the copied set
                        setCopiedForms(prev => new Set(prev).add(String(form.id)));
                        
                        // Remove the form ID after 3 seconds
                        setTimeout(() => {
                          setCopiedForms(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(String(form.id));
                            return newSet;
                          });
                        }, 3000);
                      }}
                    >
                      {copiedForms.has(String(form.id)) ? (
                        <CircleCheckBig className="text-green-500 animate-in fade-in zoom-in" />
                      ) : (
                        <Share2 />
                      )} 
                    </Button>

                    <Button variant="outline" size="icon" title="View Form" asChild>
                      <Link
                        href={
                          form.published
                            ? `/dashboard/form/${form.id}`
                            : `/dashboard/form-builder/${form.id}`
                        }
                        className="flex items-center gap-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            {dateFilter || roomTypeFilter ? (
              <FilterX className="h-6 w-6 text-gray-500" />
            ) : (
              getCurrentIcon()
            )}
          </div>
          <h3 className="text-xl font-medium mb-2">
            {dateFilter || roomTypeFilter ? "No matching forms found" : `No ${getPageTitle()} Found`}
          </h3>
          <p className="text-gray-500 mb-6">
            {dateFilter || roomTypeFilter ? (
              "Try adjusting your filters or create a new form."
            ) : (
              isFavorite 
                ? "You haven't marked any forms as favorite yet." 
                : isArchived 
                  ? "You don't have any archived forms." 
                  : isDeactivated 
                    ? "You don't have any deactivated forms." 
                    : "You haven't created any forms yet."
            )}
          </p>
          <div className="flex justify-center items-center gap-4">
            {(dateFilter || roomTypeFilter) && (
              <Button variant="outline" onClick={resetFilters}>
                <FilterX className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            )}
            <CreateFormButton isOpen={true}/>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AllFormsPage;