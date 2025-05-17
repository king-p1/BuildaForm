"use client"
import { Button } from '@/components/ui/button'
import { Telescope } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const VisitBtn = ({shareURL}:{shareURL:string}) => {

    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(()=>{setMounted(true)},[])

    if(!mounted) return null

const shareLink =`${window.location.origin}/submit/${shareURL}`

  return (
    <Button
    variant='secondary'
    onClick={()=>{
        window.open(shareLink,'_blank')
    }}
    className='flex items-center gap-2'
    >
      <Telescope className='size-4'/>
      Visit</Button>
  )
}
