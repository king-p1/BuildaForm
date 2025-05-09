/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EyeOff, ArrowRight, Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'

export const FeedbackPageClient = ({ 
  initialFeedback, 
  userForms 
}: { 
  initialFeedback: any[], 
  userForms: any[] 
}) => {
    const [selectedForm, setSelectedForm] = useState("all")
    const [selectedDateRange, setSelectedDateRange] = useState("all")
    const [filteredFeedback, setFilteredFeedback] = useState(initialFeedback)
    // Function to truncate text to a specific word count
    const truncateText = (text: string, wordCount: number) => {
      const words = text.split(' ')
      if (words.length <= wordCount) return text
      return words.slice(0, wordCount).join(' ') + '...'
    }
  
    // Apply filters whenever selection changes
    useEffect(() => {
      let filtered = [...initialFeedback]
      
      // Filter by form
      if (selectedForm !== "all") {
        filtered = filtered.filter(feedback => 
          feedback.formId.toString() === selectedForm
        )
      }
      
      // Filter by date range
      if (selectedDateRange !== "all") {
        const now = new Date()
        let dateLimit
        
        switch (selectedDateRange) {
          case "today":
            dateLimit = subDays(now, 1)
            break
          case "7days":
            dateLimit = subDays(now, 7)
            break
          case "14days":
            dateLimit = subDays(now, 14)
            break
          case "30days":
            dateLimit = subDays(now, 30)
            break
          default:
            dateLimit = null
        }
        
        if (dateLimit) {
          filtered = filtered.filter(feedback => 
            new Date(feedback.createdAt) >= dateLimit
          )
        }
      }
      
      setFilteredFeedback(filtered)
    }, [selectedForm, selectedDateRange, initialFeedback])
  
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Form Feedback</h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select value={selectedForm} onValueChange={setSelectedForm}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All forms</SelectItem>
                {userForms.map((form) => (
                <SelectItem key={form.id} value={form.id.toString()}>
                  {form.name || `Form #${form.id}`}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="14days">Last 14 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  
        {filteredFeedback.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl font-bold">No feedback found</h2>
            <p className="text-gray-500">Try changing your filters or share your form to collect feedback</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {filteredFeedback.map((submission: unknown, index: number) => (
                <motion.div
                  key={`${submission.formId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <FeedbackCard submission={submission} truncateText={truncateText} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    )
  }
  
  // Separate FeedbackCard component for better organization
  const FeedbackCard = ({ submission, truncateText }: { 
    submission: { 
      content?: string;
      createdAt: string;
      email?: string;
      isAnonymous: boolean;
      formName: string;
      feedback?: string;
      status:string;
      formId:number
    };
    truncateText: (text: string, length: number) => string;
  }) => {
    const [isRevealed, setIsRevealed] = useState(false)
    const { content, createdAt, email, isAnonymous, formName, feedback, formId, status } = submission
    const feedbackContent = feedback || content || "No feedback provided"
    const truncatedFeedback = truncateText(feedbackContent, 50)
    const needsTruncation = feedbackContent.split(' ').length > 50
      const formUrl = status === 'COMPLETED' ? `/dashboard/form/${formId}` : `/dashboard/form-builder/${formId}`
  
    const toggleReveal = () => {
      if (isAnonymous) {
        setIsRevealed(!isRevealed)
      }
    }
  
    return (
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">
            <Link href={formUrl} className="hover:underline cursor-pointer">
              {formName}
            </Link>
              </CardTitle>
            <div className="text-sm text-gray-500">
              {format(new Date(createdAt), "MMM d, yyyy")}
            </div>
          </div>
          <CardDescription className="flex items-center">
            {isAnonymous ? (
              <>
                <AnimatePresence mode="wait">
                  {isRevealed ? (
                    <motion.span
                      key="revealed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="font-medium text-blue-600"
                    >
                      {email || "Unknown user"}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="anonymous"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      Anonymous
                    </motion.span>
                  )}
                </AnimatePresence>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger onClick={toggleReveal} className="ml-1 cursor-pointer">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {isRevealed ? (
                          <Eye className="h-4 w-4 text-blue-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isRevealed ? "Hide identity" : "Reveal identity"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <span className="font-medium">{email || "Unknown user"}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-700">
            {truncatedFeedback}
            {needsTruncation && (
              <Dialog>
                <DialogTrigger asChild>
                  <motion.button 
                    className="ml-1 inline-flex items-center text-blue-600 hover:text-blue-800"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Feedback from {isRevealed ? email : "Anonymous"}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 text-gray-700 whitespace-pre-wrap">
                    {feedbackContent}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Submitted on {format(new Date(createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </p>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 border-t pt-4">
          Form #{submission.formId}
        </CardFooter>
      </Card>
    )
  }