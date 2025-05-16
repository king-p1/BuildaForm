
import React from "react";
import { useState, useEffect } from "react";
import { PiConfettiDuotone } from "react-icons/pi";
import { Input } from "./input";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import Confetti from 'react-confetti';
import { LuLayoutDashboard } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { Copy, Check, CheckCircle2 } from "lucide-react";

export const PublishedFormView = ({
  shareUrl,
  id,
}: {
  shareUrl: string;
  id: number;
}) => {
  const [copied, setCopied] = useState(false);
  const [confettiComplete, setConfettiComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copied) setCopied(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Success!",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="relative w-full h-full ">
      {!confettiComplete && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          onConfettiComplete={() => setConfettiComplete(true)}
          className="w-full h-full absolute top-0 left-0 z-50"
        />
      )}
      
      <div className="relative  flex flex-col items-center justify-center w-full h-[80vh]   ">
        <div className="bg-white dark:bg-black  rounded-xl shadow-lg p-8 max-w-md w-full animate-fade-in-up border-2 border-emerald-500">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute -top-2 -left-4">
                  <PiConfettiDuotone size={28} className="text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-4">
                  <PiConfettiDuotone size={24} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-center h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full mb-2 mx-auto">
                  <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="absolute -bottom-1 -right-3">
                  <PiConfettiDuotone size={26} className="text-emerald-300" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Form Published!</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Your form is now live and ready to share</p>
          </div>
          
          <div className="border-t border-b border-t-emerald-400 border-gray-100 dark:border-gray-800 py-6 mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Share this form</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Anyone with this link can view and respond to the form
            </p>
            
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input 
                  readOnly 
                  value={shareUrl} 
                  className="pr-10 bg-gray-50  dark:bg-neutral-900 truncate border border-gray-200 dark:border-gray-700 text-sm" 
                />
              </div>
              <Button
                onClick={handleCopy}
                size="sm"
                className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white"
              >
                {copied ? (
                  <Check size={16} className="mr-1" />
                ) : (
                  <Copy size={16} className="mr-1" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href={"/"} className="flex items-center justify-center gap-2">
                <LuLayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </Button>

            <Button asChild className="w-full sm:w-auto dark:hover:bg-gray-600"
            variant="secondary"
            >
              <Link href={`/dashboard/form/${id}`} className="flex items-center justify-center gap-2">
                <span>Form Details</span>
                <TbListDetails size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

