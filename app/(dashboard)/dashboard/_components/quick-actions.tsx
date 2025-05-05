/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Plus, Settings, Share2, BarChart2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface QuickActionsProps {
  forms: any[];
}

export function QuickActions({ forms }: QuickActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        onClick={() => router.push("/dashboard/form/new")}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New Form
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Forms
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form.id} className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={`${window.location.origin}/submit/${form.shareURL}`}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/submit/${form.shareURL}`);
                    toast({
                      title: "Copied",
                      description: "Link copied to clipboard",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" className="flex items-center gap-2">
        <BarChart2 className="h-4 w-4" />
        View Analytics
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  );
} 