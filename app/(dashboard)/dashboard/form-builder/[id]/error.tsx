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
width='400'
height='400'
alt="Error page"
className="-mt-16"
loading="lazy"

/>

        <p className="font-semibold text-4xl text-red-500 ">
        An Error Occurred!
        </p>

<Button asChild  className=" text-red-600 text-xl font-medium mt-2 hover:bg-red-600 hover:text-white">
  <Link href={'/dashboard'}>Return to Dashboard</Link>
</Button>

    </div>
  )
}

export default ErrorPage