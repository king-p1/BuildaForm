"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"


const ErrorPage = ({error}:{error:Error}) => {
    useEffect(()=>{
        console.error(error)
    },[error])
  return (
    <div className="w-full h-full flex flex-col  gap-4 justify-center items-center">
        <p className="font-semibold text-2xl text-red-500">
        An error occurred!
        </p>

<Button asChild variant='link' className=" text-red-600">
  <Link href={'/dashboard'}>Return to Dashboard</Link>
</Button>

    </div>
  )
}

export default ErrorPage