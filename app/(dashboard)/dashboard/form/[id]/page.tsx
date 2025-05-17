import { getUserFormById, toggleFormEditing } from '@/actions/form'
import { FormLinkShare } from '@/components/form-elements/form-btns/form-link-share'
import { VisitBtn } from '@/components/form-elements/form-btns/visit-btn'
import { SubmissionsTable } from '@/components/form-elements/form-cards/submissions-table'
import { PerformanceMetrics } from '../../_components/performance-metrics'
import { RoomCodeDisplay } from '../../_components/room-code-display'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const FormDetailsPage = async({params :{id}} :{params:{id:string}}) => {

    const {formData} = await getUserFormById(Number(id))

    if(!formData) {throw new Error('Form not found.')}

    const {visits,submissions,name,shareURL,id:formID,userId,isEditing} = formData

    let submissionRate = 0

    if(visits > 0){
        submissionRate = (submissions/visits)/100
    }

    const bounceRate = 100 - submissionRate

  return (<>
<div className="w-full py-10">

<div className="p-4 -mt-8 flex justify-between">
  <div className="flex flex-col gap-2">

  <h1 className="text-3xl font-bold truncate capitalize">
    {name}
  </h1>
  {formData.roomType === "PRIVATE" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Access Code:</span>
              <RoomCodeDisplay
                hashedCode={formData.roomCode!}
                salt={formData.roomCodeSalt!}
              />
            </div>
          )}
  </div>

  <div className="flex items-center gap-3">
 
  <VisitBtn shareURL={shareURL}/>
    <Button asChild>
      <Link href={`/dashboard/form-builder/${formID}`} className="flex items-center gap-2">
        <Edit className="h-4 w-4" />
        {isEditing ? "Continue Editing" : "Edit Form"}
      </Link>
    </Button>
    <FormLinkShare shareURL={shareURL}/>

  </div>

</div>

{isEditing && (
  <Alert className="mx-4 my-2 bg-amber-50 border-amber-200">
    <AlertTriangle className="h-4 w-4 text-amber-600" />
    <AlertTitle className="text-amber-600">Form is in editing mode</AlertTitle>
    <AlertDescription className="text-amber-700">
      This form is currently being edited. Users who have previously submitted responses have been notified.
      Changes will be applied when you publish the form again.
    </AlertDescription>
  </Alert>
)}
 
<div className="p-3">
  <PerformanceMetrics formIds={formID ? [formID] : []}/>
</div>
<div className="pt-10">
  <SubmissionsTable id={formID}/>
</div>

</div>
  </>)
}

export default FormDetailsPage
