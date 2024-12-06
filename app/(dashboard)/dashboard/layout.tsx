import { Navbar } from '@/components/navigations/navbar'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const DashboardLayout = async({children}:{
    children:ReactNode
}) => {
  const clerkUser = await currentUser()

  if (!clerkUser) redirect('/sign-in')
    
  return (
    <section className='flex flex-col min-h-screen min-w-full max-h-screen'>
<Navbar/>
<main className='w-full'>

        {children}
</main>
        </section>
  )
}

export default DashboardLayout