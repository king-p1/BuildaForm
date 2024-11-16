import React, { useEffect, useState } from 'react'
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance, CheckboxFieldFormElement } from './checkbox-field'
import { Label } from '../../../ui/label'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Calendar
} from "@/components/ui/calendar"
import { Button } from '@/components/ui/button'
import { LuCalendar } from 'react-icons/lu'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'


export const FormComponent =  ({elementInstance,submitValue,isInvalid,defaultValues}:{elementInstance:FormElementsInstance,submitValue?:SubmitFunction,isInvalid?:boolean,defaultValues?:string}) => {
    const element = elementInstance as CustomInstance
const [value, setValue] = useState<boolean>(defaultValues === 'true' ? true : false)
const [error, setError] = useState(false)

useEffect(()=>{
  setError(isInvalid === true)
},[isInvalid])

    const {helperText,label,required} = element.extraAttributes

     
    const id = `Checkbox-${element.id}`

    return (
      <div className='flex items-center  space-x-2'>
  <Checkbox
  id={id}
  className={cn('-mt-3.5',error&&'border-red-500')}
checked={value}
onCheckedChange={(checked)=>{
  let value = false
  if (checked === true) value = true
  setValue(value)
  if(!submitValue) return
  const stringValue =value ? 'true' : 'false'
  const valid = CheckboxFieldFormElement.validate(element,stringValue)
  setError(!valid)
  submitValue(element.id,stringValue)
}}

  />
  <div className='grid  leading-none'>
  
          <Label className={cn(error && 'text-red-500','font-semibold flex  items-center')} htmlFor={id}>
          {label}
  {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
          </Label>
        
          {helperText && (<p className={cn(error && 'text-red-500','text-muted-foreground text-xs')}>{helperText}</p>)}
  </div>
          </div>
    )
}

 
 