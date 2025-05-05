"use client";

import { useState, useEffect } from "react";
import { FormsSkeletonLoader } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,TableCaption
} from "@/components/ui/table";
import { Form } from "@prisma/client";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function DashboardFormClient({ forms }: { forms: Form }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

   


  const FormDashboard = () => {
     
    return(
 
      <Card className="h-full custom-scrollbar">
<div className="p-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-2xl font-semibold">Recent Forms</CardTitle>

          <div className="flex justify-end mb-4">
          <div className="flex gap-5 items-center">
            <div className="flex gap-2 items-center">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="font-semibold">live</span>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse"/>
              <span className="font-semibold">draft</span>
            </div>
          </div>
        </div>
        </div>
      </CardHeader>
      <CardContent className="">
        
      <div className="flex   flex-col gap-2  p-2  transition-all duration-200 ">
        

        <Table>
        <TableCaption>A list of your recent forms.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead></TableHead>
            </TableRow>
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
                <TableCell className="text-muted-foreground truncate">
           {form.description}
                </TableCell>
                <TableCell className="text-muted-foreground truncate">
                <span>
            {formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>             
             </TableCell>
                
                <TableCell className="text-muted-foreground truncate">
          <Button className="w-10 font-semibold hover:dark:bg-neutral-600 hover:bg-neutral-200 " variant="ghost" asChild>
            <Link href={form.published ?`/dashboard/form/${form.id}`:`/dashboard/form-builder/${form.id}`} className="flex items-center gap-2">
            <ExternalLink  size={27}/>
            </Link>
          </Button>
             </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </CardContent>
    </div>
  </Card>

  ) }

  if (!mounted) {
    return <FormsSkeletonLoader />;
  }

  return <FormDashboard />;
}

 