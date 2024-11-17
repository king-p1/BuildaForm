"use client"
import React, { useEffect } from 'react'
import { FormElementsInstance } from '../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance } from './form-fields/text-field/text-field'
import { propertiesSchema,propertiesTitleSchema,propertiesParagraphSchema,textAreaPropertiesSchema, datePropertiesSchema,selectPropertiesSchema } from '@/lib/form-schema'
import { useForm } from 'react-hook-form'
import { dateSchemaType, paragraphSchemaType, propertiesSchemaType, propertiesTitleSchemaType,textAreaSchemaType,selectSchemaType } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDesigner } from '@/hooks/use-designer'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
import { Switch } from '../ui/switch'
import { Slider } from '../ui/slider'
import { Button } from '../ui/button'
import { PiStackPlusLight,PiTrashDuotone } from "react-icons/pi";



export const PropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required,limit} = element.extraAttributes

    const form = useForm<propertiesSchemaType>({
        resolver:zodResolver(propertiesSchema),
        mode:'onBlur',
        defaultValues:{
            label,
            helperText,
            placeholder,
            required,
            limit
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:propertiesSchemaType) =>{
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                ...values
            }
        })
    }

  return (
    <Form {...form}>
    <form onBlur={form.handleSubmit(applyFormChanges)} onSubmit={(e)=>{e.preventDefault()}} className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The label of the field this will be displayed on the field above
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeholder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placeholder</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The placeholder value  
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="limit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Character Limit - {field.value}</FormLabel>
            <FormDescription >
              Set a character limit on this field
            </FormDescription>
            <FormControl>
              <Slider
                defaultValue={[limit]}
                value={[field.value]}
                min={1}
                max={200}
                step={1}
          onValueChange={(value) => {
            field.onChange(value[0])
          }}
        />
            </FormControl>
            <FormDescription >
                The character limit value  
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="helperText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Helper Text</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/180
            </FormDescription>
            <FormControl>
              <Textarea rows={3} {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The helper text value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border-2 p-3 shadow-md '>

            <div className="space-y-0 5">

            <FormLabel>Required</FormLabel>
                <FormMessage />
            <FormDescription >
             Toggle switch to make this field required.
            </FormDescription>
            </div>

            <FormControl>
              <Switch checked={field.value}
onCheckedChange={field.onChange}               
              />
            </FormControl>
          </FormItem>
        )}
      />
      </form>
      </Form>
  )
}

export const NumberPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required} = element.extraAttributes

    const form = useForm<propertiesSchemaType>({
        resolver:zodResolver(propertiesSchema),
        mode:'onBlur',
        defaultValues:{
            label,
            helperText,
            placeholder,
            required
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:propertiesSchemaType) =>{
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                ...values
            }
        })
    }

  return (
    <Form {...form}>
    <form onBlur={form.handleSubmit(applyFormChanges)} onSubmit={(e)=>{e.preventDefault()}} className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The label of the field this will be displayed on the field above
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeholder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placeholder</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The placeholder value  
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="helperText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Helper Text</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/180
            </FormDescription>
            <FormControl>
              <Textarea rows={3} {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The helper text value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border-2 p-3 shadow-md '>

            <div className="space-y-0 5">

            <FormLabel>Required</FormLabel>
                <FormMessage />
            <FormDescription >
             Toggle switch to make this field required.
            </FormDescription>
            </div>

            <FormControl>
              <Switch checked={field.value}
onCheckedChange={field.onChange}               
              />
            </FormControl>
          </FormItem>
        )}
      />
      </form>
      </Form>
  )
}


export const TextAreaPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required,rows,limit} = element.extraAttributes

    const form = useForm<textAreaSchemaType>({
        resolver:zodResolver(textAreaPropertiesSchema),
        mode:'onBlur',
        defaultValues:{
            label,
            helperText,
            placeholder,
            required,
            rows,
            limit
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:textAreaSchemaType) =>{
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                ...values
            }
        })
    }

  return (
    <Form {...form}>
    <form onBlur={form.handleSubmit(applyFormChanges)} onSubmit={(e)=>{e.preventDefault()}} className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The label of the field this will be displayed on the field above
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="placeholder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placeholder</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The placeholder value  
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rows"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rows - {form.watch("rows")}</FormLabel>
            <FormDescription >
              Specify the amount of rows
            </FormDescription>
            <FormControl>
              <Slider
              defaultValue={[field.value]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value)=>{
                field.onChange(value[0])
              }}
              />
            </FormControl>
            <FormDescription >
                The rows value  
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

<FormField
        control={form.control}
        name="limit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Character Limit - {form.watch("limit")}</FormLabel>
            <FormDescription >
              Set a character limit on this field
            </FormDescription>
            <FormControl>
              <Slider
                defaultValue={[limit]}
                min={10}
                max={400}
                step={1}
          onValueChange={(value) => {
            field.onChange(value[0])
          }}
        />
            </FormControl>
            <FormDescription >
                The character limit value  
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="helperText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Helper Text</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/180
            </FormDescription>
            <FormControl>
              <Textarea rows={3} {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The helper text value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border-2 p-3 shadow-md '>

            <div className="space-y-0 5">

            <FormLabel>Required</FormLabel>
                <FormMessage />
            <FormDescription >
             Toggle switch to make this field required.
            </FormDescription>
            </div>

            <FormControl>
              <Switch checked={field.value}
onCheckedChange={field.onChange}               
              />
            </FormControl>
          </FormItem>
        )}
      />
      </form>
      </Form>
  )
}

export const DateFieldPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {helperText,label,required} = element.extraAttributes

    const form = useForm<dateSchemaType>({
        resolver:zodResolver(datePropertiesSchema),
        mode:'onBlur',
        defaultValues:{
            label,
            helperText,
            required,
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:dateSchemaType) =>{
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                ...values
            }
        })
    }

  return (
    <Form {...form}>
    <form onBlur={form.handleSubmit(applyFormChanges)} 
    onSubmit={(e)=>{e.preventDefault()}} className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The label of the field this will be displayed on the field above
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
 
     

      <FormField
        control={form.control}
        name="helperText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Helper Text</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/180
            </FormDescription>
            <FormControl>
              <Textarea rows={3} {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The helper text value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border-2 p-3 shadow-md '>

            <div className="space-y-0 5">

            <FormLabel>Required</FormLabel>
                <FormMessage />
            <FormDescription >
             Toggle switch to make this field required.
            </FormDescription>
            </div>

            <FormControl>
              <Switch checked={field.value}
onCheckedChange={field.onChange}               
              />
            </FormControl>
          </FormItem>
        )}
      />
      </form>
      </Form>
  )
}



export const SelectFieldPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {label,
      helperText,
      required,
      options,
      placeholder} = element.extraAttributes

    const form = useForm<selectSchemaType>({
        resolver:zodResolver(selectPropertiesSchema),
        mode:'onBlur',
        defaultValues:{
            label,
            helperText,
            required,
            options,
            placeholder
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:selectSchemaType) =>{
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                ...values
            }
        })

    }

  return (
    <Form {...form}>
    <form
     onBlur={form.handleSubmit(applyFormChanges)} 
    onSubmit={(e)=>{e.preventDefault()}} 
    
    
    className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The label of the field this will be displayed on the field above
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
 
     

      <FormField
        control={form.control}
        name="placeholder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placeholder</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The placeholder value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    


    <FormField
        control={form.control}
        name="options"
        render={({ field }) => (
          <FormItem>

            <div className="flex flex-row items-center justify-between">

            <FormLabel>Add an option</FormLabel>
          
<Button
onClick={(e)=>{
  e.preventDefault()
  form.setValue('options',field.value.concat('New option'))
}}
> 
<PiStackPlusLight size={27} className='font-bold'/>
</Button>

            </div>
            <div className='border-t-2 w-full my-3'/>
  <div className="flex flex-col gap-3 ">
    {form.watch("options").map((option,index)=>(
      <div className="flex items-center justify-between gap-2" key={index}>
        <Input
        placeholder=''
        value={option}
        onChange={(e)=>{
          field.value[index] = e.target.value
          field.onChange(field.value)
        }}
        />

<Button
variant='ghost'
size='icon'
onClick={(e)=>{
  e.preventDefault()
const newOptions = [...field.value]
newOptions.splice(index,1)
field.onChange(newOptions)
}}
> 
<PiTrashDuotone size={27} className='font-bold'/>
</Button>
      </div>
    ))}
    </div>          
            <FormDescription >
                The options
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />






      <FormField
        control={form.control}
        name="helperText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Helper Text</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/180
            </FormDescription>
            <FormControl>
              <Textarea rows={3} {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The helper text value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      

      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border-2 p-3 shadow-md '>

            <div className="space-y-0 5">

            <FormLabel>Required</FormLabel>
                <FormMessage />
            <FormDescription >
             Toggle switch to make this field required.
            </FormDescription>
            </div>

            <FormControl>
              <Switch checked={field.value}
onCheckedChange={field.onChange}               
              />
            </FormControl>
          </FormItem>
        )}
      />


      </form>
      </Form>
  )
}

export const CheckboxFieldPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {label,
      helperText,
      required,
      } = element.extraAttributes

    const form = useForm<dateSchemaType>({
        resolver:zodResolver(datePropertiesSchema),
        mode:'onBlur',
        defaultValues:{
            label,
            helperText,
            required,
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:dateSchemaType) =>{
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                ...values
            }
        })

    }

  return (
    <Form {...form}>
    <form
     onBlur={form.handleSubmit(applyFormChanges)} 
    onSubmit={(e)=>{e.preventDefault()}} 
    
    
    className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The label of the field this will be displayed on the field above
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
 
     

     
    


    






      <FormField
        control={form.control}
        name="helperText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Helper Text</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/180
            </FormDescription>
            <FormControl>
              <Textarea rows={3} {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The helper text value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      

      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border-2 p-3 shadow-md '>

            <div className="space-y-0 5">

            <FormLabel>Required</FormLabel>
                <FormMessage />
            <FormDescription >
             Toggle switch to make this field required.
            </FormDescription>
            </div>

            <FormControl>
              <Switch checked={field.value}
onCheckedChange={field.onChange}               
              />
            </FormControl>
          </FormItem>
        )}
      />


      </form>
      </Form>
  )
}






export const TitlePropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {title} = element.extraAttributes

    const form = useForm<propertiesTitleSchemaType>({
        resolver:zodResolver(propertiesTitleSchema),
        mode:'onBlur',
        defaultValues:{
            title
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:propertiesTitleSchemaType) =>{
      const {title} = values
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                title
            }
        })
    }

  return (
    <Form {...form}>
    <form onBlur={form.handleSubmit(applyFormChanges)} 
    onSubmit={(e)=>{e.preventDefault()}} className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

  
      </form>
      </Form>
  )
}


export const SubtitlePropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {title} = element.extraAttributes

    const form = useForm<propertiesTitleSchemaType>({
        resolver:zodResolver(propertiesTitleSchema),
        mode:'onBlur',
        defaultValues:{
            title
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:propertiesTitleSchemaType) =>{
      const {title} = values
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                title
            }
        })
    }

  return (
    <Form {...form}>
    <form onBlur={form.handleSubmit(applyFormChanges)} 
    onSubmit={(e)=>{e.preventDefault()}} className="space-y-3">
        {/* helper text max is 180 */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sub Title</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/40
            </FormDescription>
            <FormControl>
              <Input {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

  
      </form>
      </Form>
  )
}



export const ParagraphPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {text} = element.extraAttributes

    const form = useForm<paragraphSchemaType>({
        resolver:zodResolver(propertiesParagraphSchema),
        mode:'onBlur',
        defaultValues:{
            text
        }
    })

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:paragraphSchemaType) =>{
      const {text} = values
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                text
            }
        })
    }

  return (
    <Form {...form}>
    <form onBlur={form.handleSubmit(applyFormChanges)} 
    onSubmit={(e)=>{e.preventDefault()}} className="space-y-3">

<FormField
        control={form.control}
        name="text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paragraph</FormLabel>
            <FormDescription >
              Character count: {field.value?.length || 0}/200
            </FormDescription>
            <FormControl>
              <Textarea rows={3} {...field}
              onKeyDown={(e)=>{
                if(e.key === 'Enter') e.currentTarget.blur() //saves the info 
              }}
              />
            </FormControl>
            <FormDescription >
                The paragraph text 
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

  
      </form>
      </Form>
  )
}
