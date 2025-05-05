"use client"
import React, { useCallback, useRef, useState, useTransition, useEffect } from 'react'
import { FormElements, FormElementsInstance } from '../sidebar-form-values/form-elemts-type'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { TbLoader3 } from 'react-icons/tb'
import { getUserForms, SubmitFormAction } from '@/actions/form'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { FiSave } from "react-icons/fi";
import Image from 'next/image'
import draftError from '@/public/draft-form-error.png'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const FormSubmitComponent = ({content,url}:{
    url:string,
    content:FormElementsInstance[]
}) => {

const formValues = useRef<{[key:string]:string}>({})
const formErrors = useRef<{[key:string]:boolean}>({})
const [renderKey, setRenderKey] = useState(new Date().getTime())
const [submitted, setSubmitted] = useState(false)
const [isPublished, setIsPublished] = useState<boolean>()
const [loading,startTransition] =useTransition()

useEffect(() => {
  const fetchStats = async () => {
      const {formData} = await getUserForms()

      setIsPublished(formData?.published);
  };
  fetchStats();
}, []);



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

 


const submitValue = useCallback((key: string, value: string | string[]) => {
    // Store arrays directly without joining
    formValues.current[key] = value;
  }, []);

    const submitForm = async() =>{
        formErrors.current = {}
        const validForm = validateForm()

        console.log('validform',validForm)
        
if(!validForm){
    setRenderKey(new Date().getTime())
    toast({
        title:'Error',
        description:'Some errors have been detected in your response.'
    }
)
return
}

try {
    // Create a copy of form values and process arrays
    const processedValues = Object.entries(formValues.current).reduce((acc, [key, value]) => {
      // If the value is an array, join it with commas for JSON storage
      acc[key] = Array.isArray(value) ? value.join(',') : value;
      return acc;
    }, {} as Record<string, string>);

    const JsonContent = JSON.stringify(processedValues)
    
    const {error} = await SubmitFormAction(url, JsonContent)
    
    if(error === false) {
      setSubmitted(true)
      toast({
        title: 'Success',
        description: 'Form submitted successfully.'
      })
    }
  } catch (error) {
    console.log(error)
    toast({
      title: 'Error',
      description: 'An error occurred.'
    })
  }
}

if(!isPublished){
  return(
    <div className='h-[65vh] w-full flex flex-col items-center justify-center gap-5'>
<Image
src={draftError}
alt="Draft Error"
width={500}
height={500}
className='-mt-24'
/>

<h2 className='text-3xl'>This form is not live, please check back later.</h2>

<Button asChild variant={'link'} className='text-2xl group'>
  <Link href={'/'} className='text-2xl flex items-center gap-3'>
    <ArrowLeft className='size-8 transform transition-transform duration-300 group-hover:-translate-x-1'/>
    Return Home
  </Link>
</Button>

    </div>
  )
}


if(submitted){
    return(
        <div className='h-[80vh] w-full flex items-center justify-center   motion-preset-expand  '>
            <Card className='w-1/2 border-2 shadow-lg shadow-emerald-700 p-3'>
  <CardHeader>
    <CardTitle className='text-center p-2 font-semibold text-2xl'>
    Form Submitted Successfully
        </CardTitle>

  </CardHeader>
  <div className='border-t-2 -mt-2 mx-3'/>
  <CardContent className='p-4  text-center flex items-center justify-center'>
  Thank you! Your form has been successfully submitted.
  </CardContent>

</Card>

        </div>
    )
}


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
                <span className='flex gap-2 font-semibold items-center'>
                    <FiSave size={30}/>
                    Submit</span>
              )}
        </Button>
        </div>

    </div>
  )
}
