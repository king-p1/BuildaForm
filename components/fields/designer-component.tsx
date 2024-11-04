import React from 'react'
import { FormElementsInstance } from '../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance } from './text-field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export const DesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold'>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Input readOnly disabled placeholder={placeholder} className='border-2 dark:border-white border-neutral-700'/>
        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        </div>
  )
}
