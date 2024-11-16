import React, { useEffect, useState } from 'react'
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance, DateFieldFormElement } from './date-field'
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


export const FormComponent =  ({elementInstance,submitValue,isInvalid,defaultValues}:{elementInstance:FormElementsInstance,submitValue?:SubmitFunction,isInvalid?:boolean,defaultValues?:string}) => {
    const element = elementInstance as CustomInstance
const [value, setValue] = useState(defaultValues||'')
const [date, setDate] = useState<Date | undefined>(defaultValues? new Date(defaultValues) : undefined)
const [error, setError] = useState(false)

useEffect(()=>{
  setError(isInvalid === true)
},[isInvalid])

    const {helperText,label,required} = element.extraAttributes

     

  return (
    <div className='flex flex-col gap-2 w-full p-2.5 border dark:border-white border-black rounded-md dark:bg-neutral-900'>
        <Label className={cn(error && 'text-red-500' ,'font-semibold')}>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Popover>
  <PopoverTrigger asChild>
  <div className="flex items-center justify-center mt-1 mb-2">
      <Button className={cn('w-3/4 flex flex-row gap-2 items-center',error && 'bg-red-500')}>
<LuCalendar size={27} className=''/>
{date ? format(date,"PPP") : 
(
  <span className='font-semibold'>Pick a date</span>
)}
      </Button>
</div>
  </PopoverTrigger>
  <PopoverContent className='w-auto p-0' align='start'>
    <Calendar
    mode='single'
    selected={date}
    onSelect={(date)=>{
      setDate(date)
      if(!submitValue) return
      const value = date?.toUTCString() ||''
      const valid = DateFieldFormElement.validate(element,value)
      setError(!valid)
      submitValue(element.id,value)
    }}
    initialFocus
    />
  </PopoverContent>
</Popover>

      
        {helperText && (<p className={cn(error && 'text-red-500','text-muted-foreground text-xs')}>{helperText}</p>)}
        </div>
  )
}

 
 