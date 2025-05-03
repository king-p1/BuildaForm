import { handleUserSignIn } from '@/actions/form'
import { Navbar } from '@/components/navigations/navbar'
import { DashboardSidebar } from '@/components/sidebar/dashboard-sidebar'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const DashboardLayout = async({children}:{
    children:ReactNode
}) => {
  const clerkUser = await currentUser()

  if (!clerkUser) redirect('/sign-in')

    if(clerkUser) await handleUserSignIn()
    
  return (
<section className='flex flex-col h-screen min-w-full'>
<Navbar/>
<div className='flex flex-1 overflow-hidden'>
  <DashboardSidebar />
  <main className='flex-1 overflow-y-auto p-5'>
    {children}
  </main>
</div>
</section>  
)
}

export default DashboardLayout