import React from 'react'
import { FormElementsInstance } from '../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance } from './text-field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
 

export const FormComponent =  ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full p-2.5 border dark:border-white border-black rounded-md dark:bg-neutral-900'>
        <Label className='font-semibold'>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Input placeholder={placeholder} className='border-2 dark:border-white border-neutral-700'/>
        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        </div>
  )
}

 