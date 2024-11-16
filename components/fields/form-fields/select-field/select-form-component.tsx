import React, { useEffect, useState } from 'react'
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance, SelectFieldFormElement } from './select-field'
import { Label } from '../../../ui/label'
import { cn } from '@/lib/utils'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const FormComponent =  ({elementInstance,submitValue,isInvalid,defaultValues}:{elementInstance:FormElementsInstance,submitValue?:SubmitFunction,isInvalid?:boolean,defaultValues?:string}) => {
    const element = elementInstance as CustomInstance
const [value, setValue] = useState(defaultValues||'')
const [date, setDate] = useState<Date | undefined>(defaultValues? new Date(defaultValues) : undefined)
const [error, setError] = useState(false)

useEffect(()=>{
  setError(isInvalid === true)
},[isInvalid])

    const {helperText,label,required,options,placeholder} = element.extraAttributes

     

  return (
    <div className='flex flex-col gap-2 w-full p-2.5 border dark:border-white border-black rounded-md dark:bg-neutral-900'>
        <Label className={cn(error && 'text-red-500' ,'font-semibold')}>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Select 
        defaultValue={value}
        onValueChange={(value) =>{
          setValue(value)
if(!submitValue) return
const valid = SelectFieldFormElement.validate(element,value)
setError(!valid)
submitValue(element.id,value)
        }}>
  <SelectTrigger className={cn("w-full" ,error&&'text-red-500 border-red-500' )}>
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>

<SelectContent>
  {options.map((option)=>(
    <SelectItem key={option} value={option}>{option}</SelectItem>
  ))}
</SelectContent>

</Select>
      
        {helperText && (<p className={cn(error && 'text-red-500','text-muted-foreground text-xs')}>{helperText}</p>)}
        </div>
  )
}

 
 