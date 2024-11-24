"use client"
import React, { useEffect, useRef, useState } from 'react'
import { FormElementsInstance } from '../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance } from './form-fields/text-field/text-field'
import { propertiesSchema,propertiesTitleSchema,propertiesParagraphSchema,textAreaPropertiesSchema, datePropertiesSchema,selectPropertiesSchema, imageSchema, imageUploadSchema } from '@/lib/form-schema'
import { useForm } from 'react-hook-form'
import { dateSchemaType, paragraphSchemaType, propertiesSchemaType, propertiesTitleSchemaType,textAreaSchemaType,selectSchemaType, imageSchemaType, imageUploadSchemaType } from '@/lib/types'
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
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import axios from 'axios'
import { CloudUpload, Trash } from 'lucide-react'
import { TbLoader3 } from 'react-icons/tb'
import { toast } from '@/hooks/use-toast'
import { Label } from '../ui/label'

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

export const ImageUploadPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

    const {updateElement} = useDesigner()

    const element = elementInstance as CustomInstance

    const {helperText,label,placeholder,required,imageTypes,minImages,maxImages,isMultiple} = element.extraAttributes

    
    const form = useForm<imageUploadSchemaType>({
        resolver:zodResolver(imageUploadSchema),
        mode:'onBlur',
        defaultValues:{
            label,
            helperText,
            placeholder,
            required,
             imageTypes,
             isMultiple,
             maxImages,
             minImages 
        }
    })
    

    useEffect(()=>{
        form.reset(element.extraAttributes)
    },[form,element])

    const applyFormChanges = (values:imageUploadSchemaType) =>{
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                ...values
            }
        })
    }
    const isMultipleValue = form.watch('isMultiple');

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

{/* <IKUpload
  fileName="upload.png"
  onError={onError}
  onSuccess={onSuccess}
  onUploadProgress={onUploadProgress}
  onUploadStart={onUploadStart}
  className="hidden"
  id="uploadInput"
  ref={ikUploadRef}
  accept={imageTypes.join(',')} // Accept file types from the array
/> */}

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
          name="isMultiple"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Multiple images</FormLabel>
                <FormMessage />
                <FormDescription>
                  Toggle to enable multiple images
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

 

{isMultipleValue && (
        <>
  
  <FormField
          control={form.control}
          name="minImages"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Minimum Images - {isMultipleValue ? field.value : 1}</FormLabel>
                <FormDescription>
                Set a limit on the minimum number of images
              </FormDescription>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  value={isMultipleValue ? [field.value] : [1]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
                />
              </FormControl>
              <FormDescription>
                The minimum number of images that can be uploaded
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 
        
        <FormField
          control={form.control}
          name="maxImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Images - {isMultipleValue ? field.value : 1}</FormLabel>
                <FormDescription>
                  Set a limit on the maximum number of images
                </FormDescription>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    value={isMultipleValue ? [field.value] : [1]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
                    }}
                  />
              </FormControl>
              <FormDescription>
                The maximum number of images that can be uploaded
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        </>
        )}



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


export const FileUploadPropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

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


export const ImagePropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

  const {updateElement} = useDesigner()

  const element = elementInstance as CustomInstance


  const {helperText, label,src,width,height} = element.extraAttributes

  const form = useForm<imageSchemaType>({
      resolver:zodResolver(imageSchema),
      mode:'onBlur',
      defaultValues:{
          label,
          helperText,
         src,
         width,
         height
      }
  })

  
  
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

  const [image, setImage] = useState(src || '') 
  const [isUploading, setIsUploading] = useState(false);

  
  const authenticator = async () => {
    try {
      const { data } = await axios.get("/api/image-upload");
      const { token, expire, signature } = data;
      return { token, expire, signature };
    } catch (error) {
      toast({title:'Error' , description:"Failed to authenticate. Please try again."});
      throw error;
    }
  };

  const onError = (err) => {
    console.log(err)
    toast({title:'Error' , description:"Image uploaded failed."}); 
       setIsUploading(false);
  };

  
  
      const onUploadProgress = () => setIsUploading(true);
      const onUploadStart = () => {};
      
      const ikUploadRef = useRef(null);
      
      const applyFormChanges = (values:imageSchemaType) =>{
          updateElement(element.id,{
              ...element,
              extraAttributes:{
                ...values
              }
            })
          }
          
          useEffect(()=>{
              form.reset(element.extraAttributes)
            },[form,element])
            
            const onSuccess = (res) => {
              const uploadedImageUrl = res?.filePath;
              setImage(uploadedImageUrl);
              form.setValue('src', uploadedImageUrl);
              applyFormChanges({ ...form.getValues(), src: uploadedImageUrl });
              toast({ title: 'Success', description: "Image uploaded successfully." });
              setIsUploading(false);
            };
            
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
      name="src"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Upload an image</FormLabel>
           
          <FormControl>
        <>


        
<div className="w-full flex justify-center items-center border-2 border-dashed h-[180px] rounded-md mt-1 mb-6 ">

{image &&   (
        <div className="flex gap-2 p-2">
          <Input
            value={image}
readOnly
/>
<Button 
        size='icon'
        onClick={() => {
          setImage('');
          form.setValue('src', ''); // Reset the src field
          applyFormChanges({ ...form.getValues(), src: '' }); 
          }}
          >
          <Trash/>
          </Button>
              </div>
)
}


          <ImageKitProvider
                    urlEndpoint={urlEndpoint}
                    publicKey={publicKey}
                    authenticator={authenticator}
                  >
<IKUpload
                fileName="upload.png"
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
                onUploadStart={onUploadStart}
                className="hidden"
                id="uploadInput"
                // disabled={image}
                ref={ikUploadRef}
                accept="image/png,image/jpeg,image/jpg"
                 
                />


</ImageKitProvider>

{isUploading && (
                <div className="flex items-center justify-center">
                  <TbLoader3 size={40} className="animate-spin" />
                </div>
              )}




             {!isUploading && !image &&( <label
                htmlFor="uploadInput"
                className={`cursor-pointer text-center flex flex-col gap-3
                  justify-center items-center
                  z-50`}
              >
                  <CloudUpload
                    size={40}
                    className={`dark:text-neutral-300 text-muted-foreground`}
                    />

<p className="text-sm text-muted-foreground p-2">
  Click here to upload a picture</p>
              </label>)}
 
                    </div>

                    </>

          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

        
        <Label className='mt-6 -mb-2'>Image sizes</Label>
    
<FormField
        control={form.control}
        name="width"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Width - {field.value}px</FormLabel>
            <FormDescription >
              Set a width on this image
            </FormDescription>
            <FormControl>
              <Slider
                defaultValue={[width]}
                value={[field.value]}
                min={80}
                max={600}
                step={1}
          onValueChange={(value) => {
            field.onChange(value[0])
          }}
        />
            </FormControl>
            <FormDescription >
                The image width value  
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

       <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height - {field.value}px</FormLabel>
            <FormDescription >
            Set a width on this image
            </FormDescription>
            <FormControl>
              <Slider
                defaultValue={[height]}
                value={[field.value]}
                min={80}
                max={600}
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
              

              <p className="text-sm text-muted-foreground text-center">
                See preview tab for actual image size
              </p>







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
