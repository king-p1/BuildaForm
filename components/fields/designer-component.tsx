/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { FormElementsInstance } from '../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance } from './form-fields/text-field/text-field'
import { CustomInstance as LinkCustomInstance} from './layout-fields/link-field/link-field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { LuCalendar } from "react-icons/lu";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '../ui/checkbox'
import { IKImage } from 'imagekitio-next'
import { LuImagePlus } from "react-icons/lu";
import { CustomInstance as ImageUploadCustomInstance} from './form-fields/image-upload-field/image-upload-field'
import Link from 'next/link'
import { Link2, Link as LinkIcon } from 'lucide-react'


export const DesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required,limit} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold'>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Input readOnly disabled placeholder={placeholder} className='border-2 dark:border-white border-neutral-700'/>

        <div className="flex justify-between">

        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        
        {limit && <p className='text-muted-foreground text-xs'>{`0/${limit} characters`}</p>}
        </div>
        </div>
  )
}

export const LinkDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as LinkCustomInstance

    const {helperText,label,color,href,padding,size,text,width } = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold'>
        {label}
        </Label>

        <div className="flex items-center justify-center gap-2" >
          <LinkIcon className='size-6' style={{
        color:color,
          }}/>
        <Link href={href} 
        className='-ml-4 mt-1' 
        style={{
          color:color,
          fontSize:`${size}px`,
          width:`${width}px`,
          padding:`${padding}px`,
          textAlign:'center'
        }}
        >{text}

        </Link>
</div>


        <div className="flex justify-between">

        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        
        </div>
        </div>
  )
}

export const ImageUploadDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as ImageUploadCustomInstance

    const {helperText, label,imageTypes,placeholder,required,isMultiple,maxImages,minImages,src} = element.extraAttributes

return (
  <div className='flex flex-col gap-2 w-full my-4'>
      <Label className='font-semibold'>
      {label}
      {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
      </Label>

<div className="flex justify-center items-center w-full border-2 border-dashed h-[76px] rounded-md text-muted-foreground">


<div className="flex items-center justify-center h-full flex-col gap-1 p-1">
<LuImagePlus className='h-5 w-5 mb-0.5'/>
<span className="text-xs">{placeholder}</span>
{imageTypes.length > 0 && (
                <div className="flex justify-center items-center text-center  text-xs w-full p-1 -mt-0.5">
                    <div className=' text-xs text-muted-foreground '>
                        {imageTypes.map((type, index) => (
                            <span key={index}>{type},</span>
                        ))}
                    </div>
                </div>
            )}
</div>


      
    </div>


      <div className="flex justify-between p-[5px]">

      {helperText && (<p className='text-muted-foreground text-xs -mt-2'>{helperText}</p>)}
      
     
      </div>
      </div>
)
}


export const NumberDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold'>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Input readOnly disabled type='number' placeholder={placeholder} className='border-2 dark:border-white border-neutral-700'/>
        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        </div>
  )
}

export const TextAreaDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required,limit} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold'>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Textarea  readOnly disabled  placeholder={placeholder} className='border-2 dark:border-white border-neutral-700'/>

        <div className="flex justify-between">

        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        
        {limit && <p className='text-muted-foreground text-xs'>{`0/${limit} characters`}</p>}
        </div>
        </div>
  )
}

export const DateFieldDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,required} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold'>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

<div className="flex items-center justify-center mt-1 mb-2">
      <Button className='w-3/4 flex flex-row gap-2 items-center'>
<LuCalendar size={27} className=''/>
<span className='font-semibold'>Pick a date</span>
      </Button>
</div>
      
        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        </div>
  )
}

export const CheckboxFieldDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,required} = element.extraAttributes

const id = `Checkbox-${element.id}`

  return (
    <div className='flex items-center  space-x-2'>
<Checkbox
id={id}
className='-mt-3.5'
/>
<div className='grid  leading-none'>

        <Label className='font-semibold flex  items-center' htmlFor={id}>
        {label}
{required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>
      
        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
</div>
        </div>
  )
}

export const SelectFieldDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {helperText,label,required,options,placeholder} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold'>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}
        </Label>

        <Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>
</Select>

      
        {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
        </div>
  )
}









export const TitleDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {title} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold text-muted-foreground'>
          Title
        </Label>
        <p className="text-xl">
        {title}
        </p>
 
        </div>
  )
}

export const SubTitleDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {title} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold text-muted-foreground'>
        SubTitle
        </Label>
        <p className="text-lg">
        {title}
        </p>
 
        </div>
  )
}

export const ParagraphDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance

    const {text} = element.extraAttributes

  return (
    <div className='flex flex-col gap-2 w-full'>
        <Label className='font-semibold text-muted-foreground'>
       Paragraph
        </Label>
        <p>
        {text}
        </p>
 
        </div>
  )
}

export const ImageDesignerComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {
  const element = elementInstance as CustomInstance

  const {helperText, label,src,width,height} = element.extraAttributes
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

return (
  <div className='flex flex-col gap-2 w-full my-4'>
      <Label className='font-semibold'>
      {label}
      </Label>

<div className="flex justify-center items-center w-[95px]">

      <IKImage
    alt='image'
    path={src}
    urlEndpoint={urlEndpoint}
    className='object-contain'
    width='94'
    height='82'
    />
    </div>


      <div className="flex justify-between">

      {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
      
     
      </div>
      </div>
)
}