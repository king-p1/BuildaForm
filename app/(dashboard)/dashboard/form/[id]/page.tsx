import { getUserFormById } from '@/actions/form'
import { FormLinkShare } from '@/components/form-elements/form-btns/form-link-share'
import { VisitBtn } from '@/components/form-elements/form-btns/visit-btn'
import { SubmissionsTable } from '@/components/form-elements/form-cards/submissions-table'
import { StatCardWrapper } from '@/components/stats-card/card-wrapper'
import { StatCards } from '@/components/stats-card/stats-cards'
import React, { Suspense } from 'react'

const FormDetailsPage = async({params :{id}} :{params:{id:string}}) => {

    const {formData} = await getUserFormById(Number(id))

    if(!formData) {throw new Error('Form not found.')}

    const {visits,submissions,name,shareURL,id:formID,userId} = formData

    let submissionRate = 0

    if(visits > 0){
        submissionRate = (submissions/visits)/100
    }

    const bounceRate = 100 - submissionRate

  return (<>
<div className="w-full py-10 border-t border-b border-muted">

<div className="p-4 -mt-8 flex justify-between container">
  <h1 className="text-3xl font-bold truncate capitalize">
    {name}
  </h1>
  <div className="flex items-center gap-3" >
  <VisitBtn shareURL={shareURL}/>
    <FormLinkShare shareURL={shareURL}/>
  </div>
</div>
 
 <div className="p-3">
<Suspense fallback={<StatCards loading={true}/>}>
<StatCardWrapper/>
       </Suspense>
 </div>

<div className='w-full border-t-2 mt-9'/>

<div className="container pt-10">
  <SubmissionsTable id={formID}/>
</div>

</div>
  </>)
}

export default FormDetailsPage