import React, { useEffect, useState } from 'react'
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance, ImageFieldFormElement } from './image-field'
import { Label } from '../../../ui/label'
import { cn } from '@/lib/utils'
 

export const FormComponent =  ({elementInstance,submitValue,isInvalid,defaultValues}:{elementInstance:FormElementsInstance,submitValue?:SubmitFunction,isInvalid?:boolean,defaultValues?:string}) => {
    const element = elementInstance as CustomInstance
const [value, setValue] = useState(defaultValues||'')
const [error, setError] = useState(false)

useEffect(()=>{
  setError(isInvalid === true)
},[isInvalid])

    const {helperText, label,src} = element.extraAttributes

     

    const handleBlur = (e) => {
      if (!submitValue) return;
      
      const valid = ImageFieldFormElement.validate(element, e.target.value);
      setError(!valid);
      
      // Trim leading/trailing whitespace
      const trimmedValue = e.target.value.trim();
      if (trimmedValue.length === 0) {
        setError(true);
        return;
      }
      if(!valid) return 

      setValue(trimmedValue);
      submitValue(element.id, trimmedValue);
    };

  return (
    <div className='flex flex-col gap-2 w-full p-2.5 border dark:border-white border-black rounded-md dark:bg-neutral-900'>
    <Label className={cn(error && 'text-red-500', 'font-semibold')}>
      {label}
    </Label>

 imagekit image upload area and upload image space here.
    
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

 
 