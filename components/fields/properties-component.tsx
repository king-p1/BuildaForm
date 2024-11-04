"use client"
import React, { useEffect } from 'react'
import { FormElementsInstance } from '../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance } from './text-field'
import { propertiesSchema } from '@/lib/form-schema'
import { useForm } from 'react-hook-form'
import { propertiesSchemaType } from '@/lib/types'
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
// import { LiaBullseyeSolid } from "react-icons/lia";


export const PropertiesComponent = ({elementInstance}:{elementInstance:FormElementsInstance}) => {

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
