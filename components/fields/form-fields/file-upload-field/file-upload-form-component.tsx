import React, { useEffect, useState } from 'react'
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance, FileUploadFieldFormElement } from './file-upload-field'
import { Label } from '../../../ui/label'
import { Input } from '../../../ui/input'
import { cn } from '@/lib/utils'
 

export const FormComponent =  ({elementInstance,submitValue,isInvalid,defaultValues}:{elementInstance:FormElementsInstance,submitValue?:SubmitFunction,isInvalid?:boolean,defaultValues?:string}) => {
    const element = elementInstance as CustomInstance
const [value, setValue] = useState(defaultValues||'')
const [error, setError] = useState(false)

useEffect(()=>{
  setError(isInvalid === true)
},[isInvalid])

    const {helperText, label, placeholder, required, limit} = element.extraAttributes

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (limit && newValue.length > limit) return
      setValue(newValue)
    }

    const handleBlur = (e) => {
      if (!submitValue) return;
      
      const valid = FileUploadFieldFormElement.validate(element, e.target.value);
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
      {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
    </Label>

    <Input 
      placeholder={placeholder} 
      className={cn(
        error && 'border-red-500',
        value.length === limit && 'border-yellow-500',
        'border-2 dark:border-white border-neutral-700'
      )}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    
    <div className="flex justify-between">
      {helperText && (
        <p className={cn(error && 'text-red-500', 'text-muted-foreground text-xs')}>
          {helperText}
        </p>
      )}
      {limit && (
        <p className={cn(
          value.length === limit && 'text-yellow-500',
          'text-muted-foreground text-xs'
        )}>
          {`${value.length}/${limit} characters`}
        </p>
      )}
    </div>
</div>
  )
}

 
 