/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance } from './image-field'
import { Label } from '../../../ui/label'
import { cn } from '@/lib/utils'
import { IKImage } from 'imagekitio-next'
 

export const FormComponent =  ({elementInstance,submitValue,isInvalid,defaultValues}:{elementInstance:FormElementsInstance,submitValue?:SubmitFunction,isInvalid?:boolean,defaultValues?:string}) => {
    const element = elementInstance as CustomInstance
const [value, setValue] = useState(defaultValues||'')
const [error, setError] = useState(false)

useEffect(()=>{
  setError(isInvalid === true)
},[isInvalid])

const {helperText, label,src,width,height} = element.extraAttributes
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
     

     

  return (
    <div className='flex flex-col gap-2 w-full p-2.5 '>
    <Label className={cn(error && 'text-red-500', 'font-semibold')}>
      {label}
    </Label>

    <div className="flex justify-center items-center">

<IKImage
alt='image'
path={src}
urlEndpoint={urlEndpoint}
className=''
width={width}
height={height} 

/>
</div>

    <div className="flex justify-between">
      {helperText && (
        <p className={cn(error && 'text-red-500', 'text-muted-foreground text-xs')}>
          {helperText}
        </p>
      )}
       
    </div>
</div>
  )
}

 
 