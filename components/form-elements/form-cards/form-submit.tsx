"use client"
import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElements, FormElementsInstance } from '../sidebar-form-values/form-elemts-type'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { TbLoader3 } from 'react-icons/tb'
import { SubmitFormAction } from '@/actions/form'

export const FormSubmitComponent = ({content,url}:{
    url:string,
    content:FormElementsInstance[]
}) => {

const formValues = useRef<{[key:string]:string}>({})
const formErrors = useRef<{[key:string]:boolean}>({})
const [renderKey, setRenderKey] = useState(new Date().getTime())
const [submitted, setSubmitted] = useState(false)
const [loading,startTransition] =useTransition()

const validateForm:() => boolean = useCallback(()=>{
for(const field of content){
    const actualVal = formValues.current[field.id] || ''
    const valid =FormElements[field.type].validate(field,actualVal)

    if(!valid){
        formErrors.current[field.id] = true
    }
}

if(Object.keys(formErrors.current).length > 0)return false

return true

},[content])

const submitValue = useCallback((key:string,value:string)=>{
    formValues.current[key]=value
},[])

    const submitForm = async() =>{
        formErrors.current = {}
const validForm = validateForm()

if(!validForm){
    setRenderKey(new Date().getTime())
    toast({
    title:'Error',
    description:'Some errors are in your field, please correct them.'
    }
)
return
}

try {

    const JsonContent = JSON.stringify(formValues.current)

  const {error} =  await SubmitFormAction(url,JsonContent)

   if(error === false){
     setSubmitted(true)
     toast({
         title:'Success',
         description:'Form submitted successfully.'
         })
    
    }
    
} catch (error) {
    console.log(error)
    toast({
        title:'Error',
        description:'An error occurred.'
        })
}

console.log(formValues.current)
    }


// create a custom ui to show something prompting the user to close this page once the forms submitted successsfully


  return (
    <div className='h-full w-full items-center flex justify-center p-8 '>
        <div key={renderKey} className="flex flex-col max-w-[625px] flex-grow gap-4 bg-background w-full p-8 overflow-y-auto shadow-xl rounded-lg border-2">
            {content.map((element)=>{
                const FormElement = FormElements[element.type].formComponent
                return <FormElement key={element.id} elementInstance={element} submitValue={submitValue} isInvalid={formErrors.current[element.id]}
                defaultValues={formValues.current[element.id]}
                />
            })}
            {/* todo add icon */}
            <Button className='mt-5'
            onClick={()=>{
                startTransition(submitForm)
            }}
            disabled={loading}
            > {loading ? (
                <TbLoader3 size={26} className='animate-spin  text-white dark:text-black'/>
              ) : (
                <span>Submit</span>
              )}
        </Button>
        </div>

    </div>
  )
}
