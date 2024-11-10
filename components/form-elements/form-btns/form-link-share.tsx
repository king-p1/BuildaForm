"use client"
import React, { useEffect ,useState} from 'react'
  import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
  
export const FormLinkShare = ({shareURL}:{shareURL:string}) => {
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(()=>{setMounted(true)},[])

    if(!mounted) return null

const shareLink =`${window.location.origin}/submit/${shareURL}`

  return (
<Dialog>
  <DialogTrigger>
    <Button>Share Link</Button>
  </DialogTrigger>
  <DialogContent>

    <div className="ml-3 flex justify-center items-center w-[90%] flex-col gap-6">
<Input readOnly value={shareLink} className='mt-2'/>
    <Button 
    onClick={() => {
        navigator.clipboard.writeText(shareLink);
        toast({
          title: "Copied",
          description: "Link copied to clipboard",
        });
    }}
    >Copy Link</Button>

    </div>
  </DialogContent>
</Dialog>

  )
}
