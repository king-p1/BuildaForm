"use client"
import { updateFormContentAction } from '@/actions/form'
import { Button } from '@/components/ui/button'
import { useDesigner } from '@/hooks/use-designer'
import { toast } from '@/hooks/use-toast'
import React, { useTransition } from 'react'
import { TbLoader3 } from "react-icons/tb";

export const SaveFormBtn = ({id}:{id:number}) => {
  const {elements} = useDesigner()

  const [loading,startTransition] = useTransition()

  const updateFormComponent = async()=>{
    try {
      const JsonElements = JSON.stringify(elements)
      await updateFormContentAction(id,JsonElements)
      toast({
        title:'Success',
        description:'Your form has been saved!'

      })
    } catch (error) {
      console.log(error)
      toast({
        title:'Error',
        description:'An error occurred!!'

      })
    }
  }

  return (
    <Button variant='secondary' disabled={loading}
    onClick={()=>{
      startTransition(updateFormComponent)
    }}
    >
      {loading ? (
        <TbLoader3 size={22} className='animate-spin dark:text-white text-black'/>
      ) : (
        <span>Save</span>
      )}

    </Button>
  )
}
