/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Plus, Settings, Share2, BarChart2, Clipboard, CircleCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell, 
  TableHeader,
  TableRow,TableCaption
} from "@/components/ui/table";
import { useState } from "react";
import Link from "next/link";
interface QuickActionsProps {
  forms: any[];
}

export function QuickActions({ forms }: QuickActionsProps) {
  const router = useRouter();
  const [copiedForms, setCopiedForms] = useState<Set<string>>(new Set());

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Forms
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
        <Table>
        <TableCaption>Share your forms.</TableCaption>

          <TableHeader>
      
          </TableHeader>
          <TableBody>
            {forms?.slice(0, 5).map((form) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{form.name}</TableCell>
                <TableCell>
                  {form.published? (
  <div className="flex items-center gap-2">
  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"/>
  <span>Live</span>
</div>
                  ) :(
                    <div className="flex gap-2 items-center">
                    <div className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse"/>
                    <span className="font-semibold">draft</span>
                  </div>
                  )}
                
                </TableCell>
               
                <TableCell>
                 <Button
                 key={form.id}
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/submit/${form.shareURL}`);
                    toast({
                      title: "Copied",
                      description: "Link copied to clipboard",
                    });
                    
                    // Add the form ID to the copied set
                    setCopiedForms(prev => new Set(prev).add(form.id));
                    
                    // Remove the form ID after 3 seconds
                    setTimeout(() => {
                      setCopiedForms(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(form.id);
                        return newSet;
                      });
                    }, 3000);
                  }}
                >
                 {copiedForms.has(form.id) ? (
                    <CircleCheckBig className="text-green-500 animate-in fade-in zoom-in" />
                  ) : (
                    <Clipboard />
                  )} 
                </Button>
                
                </TableCell>
          
                
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        </PopoverContent>
      </Popover>
     
      <Button variant="outline" asChild>
        <Link href={'/dashboard/user'}  className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
        </Link>
      </Button>
    </div>
  );
} 