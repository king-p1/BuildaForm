import { getFormContentById } from '@/actions/form'
import { FormSubmitComponent } from '@/components/form-elements/form-cards/form-submit'
import { FormElementsInstance } from '@/components/form-elements/sidebar-form-values/form-elemts-type'
import { toast } from '@/hooks/use-toast'
import React from 'react'

const SubmitPage = async({params:{id}}:{params:{id:string}}) => {

  const {formData} = await getFormContentById(id)

  if(!formData){
    toast({
      title:'Error', description:'Form not found'
    })
    return 
  }

  const formContent = JSON.parse(formData.content) as FormElementsInstance[]

  return <FormSubmitComponent content={formContent} url={id}/>
  
}

export default SubmitPage