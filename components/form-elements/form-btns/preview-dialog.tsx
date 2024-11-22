"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
} from "../../ui/card";
import { useDesigner } from '@/hooks/use-designer';
import { FormElements } from '../sidebar-form-values/form-elemts-type';
import { VscPreview } from "react-icons/vsc";

export const PreviewDialogBtn = () => {
const {elements} = useDesigner()

  // todo remeber to add icons
  console.log('Elements:', elements);

  return (
    <div className="">
    <Dialog>
    <DialogTrigger asChild>
      <Button variant='outline' className='flex items-center gap-2'>
        <VscPreview size={27}/>
        Preview</Button> 
    </DialogTrigger>

    <DialogContent className='h-[91vh] w-[90vw] max-h-[90vh] flex flex-col gap-4 max-w-[90vw] overflow-y-auto custom-scrollbar-2'>
      <DialogHeader >
        <DialogTitle>Form Preview</DialogTitle>
        <DialogDescription>
          This is a preview of your form and how it will appeat to your visitors.
        </DialogDescription>
      </DialogHeader>
    <div className="h-[95%] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-grow items-center justify-center border-2 dark:border-white border-neutral-700 rounded-lg mt-5 ">
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_100%,black)]"></div>

    <Card className=" max-w-[70vw] bg-transparent p-3  flex  flex-col gap-4 flex-grow w-full h-full ">
       
      <CardContent className="flex flex-col gap-4 mt-3 ">
        {elements.map((element) => {
          const FormComponent = FormElements[element.type].formComponent;
          return <FormComponent key={element.id} elementInstance={element} />;
        })}
      </CardContent>

      <CardFooter>
       
      </CardFooter>
    </Card>

    
    
</div>
        </DialogContent>

  </Dialog>
        </div>
  )
}
