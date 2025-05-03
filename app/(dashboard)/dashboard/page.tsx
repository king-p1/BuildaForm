"use client"
import { CreateFormButton } from '@/components/form-elements/form-btns/create-form-btn'
import { FormCards } from '@/components/form-elements/form-cards/form-cards'
import { FormCardSkeleton } from '@/components/form-elements/form-cards/form-card-skeleton'
import { StatCardWrapper } from '@/components/stats-card/card-wrapper'
import { StatCards } from '@/components/stats-card/stats-cards'
import React, { Suspense } from 'react'
import { useUser } from "@clerk/nextjs";

const DashboardPage = () => {
  const {user} = useUser()

  return (
    <div className='p-2 w-full flex flex-col gap-4 '>
       {/* <Suspense fallback={<StatCards loading={true}/>}>
<StatCardWrapper/>
       </Suspense>
 

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Suspense fallback={[1,2,3,4].map((el) => (<FormCardSkeleton key={el}/>))}>
  <FormCards />
  </Suspense>
</div> */}

<h1 className='font-bold text-4xl'>Welcome {user?.firstName},</h1>

{/* Recent forms */}

       </div>
  )
}

export default DashboardPage