"use client"

import { publishForm } from '@/actions/form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MdOutlinePublish } from 'react-icons/md'
import { TbLoader3 } from 'react-icons/tb'

export const PublishFormBtn = ({id}:{id:number}) => {
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast()
    const router = useRouter()

    const handlePublish = async () => {
        setIsLoading(true)
        try {
            const response = await publishForm(id)
            if(response.error){
                toast({
                    title: 'Error',
                    description: response.message,
                    variant: 'destructive'
                })
                return
            }

            toast({
                title: 'Success',
                description: 'Your form has been published!'
            })

            router.push(`/dashboard/form/${id}`)
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'Something went wrong'
            })
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <Button 
        className='gap-2 '
        variant='default'
        disabled={isLoading}
        onClick={handlePublish}
    >
        {isLoading ? <TbLoader3 className='animate-spin'/> : <MdOutlinePublish className='h-4 w-4'/>}
        Publish
    </Button>
  )
}
