"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import errorImg from '@/public/No data-bro.png'

const ErrorPage = ({error}:{error:Error}) => {
    useEffect(()=>{
        console.error(error)
    },[error])
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">

<Image
src={errorImg}
width='350'
height='350'
alt="Error page"
className="-mt-16"
/>

        <p className="font-semibold text-4xl text-red-500 -mt-10">
        An Error Occurred!
        </p>

<Button asChild variant='link' className=" text-red-600 text-xl">
  <Link href={'/dashboard'}>Return to Dashboard</Link>
</Button>

    </div>
  )
}

export default ErrorPage