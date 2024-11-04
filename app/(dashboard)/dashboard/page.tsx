import { CreateFormButton } from '@/components/form-elements/form-btns/create-form-btn'
import { FormCards } from '@/components/form-elements/form-cards/form-cards'
import { FormCardSkeleton } from '@/components/form-elements/form-cards/form-card-skeleton'
import { StatCardWrapper } from '@/components/stats-card/card-wrapper'
import { StatCards } from '@/components/stats-card/stats-cards'
import React, { Suspense } from 'react'

const DashboardPage = () => {
  return (
    <div className='p-5 w-full flex flex-col gap-4 container'>
       <Suspense fallback={<StatCards loading={true}/>}>
<StatCardWrapper/>
       </Suspense>

       <div className="flex flex-col">

       <hr className='my-4' />

       <div className="flex justify-between items-center">

       <h2 className="text-2xl font-semibold">Your Forms</h2>
       <CreateFormButton/>
       
       </div>
       
       <hr className='my-4' />
       </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Suspense fallback={[1,2,3,4].map((el) => (<FormCardSkeleton key={el}/>))}>
  <FormCards />
  </Suspense>
</div>

       </div>
  )
}

export default DashboardPage