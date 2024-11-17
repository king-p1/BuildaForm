"use client"
import { Button } from '@/components/ui/button'
import React, { useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TbLoader3 } from 'react-icons/tb'
import { publishForm } from '@/actions/form'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ImUpload } from "react-icons/im";


export const PublishFormBtn = ({id}:{id:number}) => {

 const  [loading,startTransition]= useTransition()

 const router = useRouter()

 const PublishForm = async()=>{
  try {
    await publishForm(id)
toast({
  title:'Congratulations',
  description:'Your form is now available to the public!'
})
router.refresh()
  } catch (error) {
    console.log(error)
    toast({
      title:'Error',
      description:'An error occurred!'
    })
  }
 }
  return (
    <AlertDialog>
  <AlertDialogTrigger asChild>

  <Button variant='default' className='flex items-center gap-2'>
    <ImUpload size={27}/>
    Publish</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. After publishing, this form cannot be edited.
<br />
<span className="font-medium mt-2">By clicking continue you make this form availavle to the public and  will be able to collect submissions</span>

      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={(e)=>{
        e.preventDefault()
        startTransition(PublishForm)
      }}>{
    loading ? (<TbLoader3 size={22} className='text-white dark:text-black animate-spin'/>):'Continue'
    }</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  )
}
