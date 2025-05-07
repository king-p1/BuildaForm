"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

interface EmailVisibilityToggleProps {
  email: string
  isAnonymous: boolean
}

export function EmailVisibilityToggle({ email, isAnonymous }: EmailVisibilityToggleProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayText, setDisplayText] = useState(isAnonymous ? "**********" : email)
  
  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    if (isAnonymous) {
      if (isVisible) {
        timeout = setTimeout(() => {
          setDisplayText(email)
        }, 150)
      } else {
        timeout = setTimeout(() => {
          setDisplayText("**********")
        }, 150)
      }
    }
    
    return () => clearTimeout(timeout)
  }, [isVisible, email, isAnonymous])
  
  // If not anonymous, always show email
  if (!isAnonymous) {
    return <span>{email}</span>
  }

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={isVisible ? "visible" : "hidden"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className=""
        >
          {displayText}
        </motion.span>
      </AnimatePresence>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 transition-all duration-200 hover:bg-slate-100"
              onClick={() => setIsVisible(!isVisible)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isVisible ? "visible" : "hidden"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="sr-only">Toggle email visibility</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle email visibility</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}