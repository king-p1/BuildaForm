import { getUserFormById } from '@/actions/form'
import { FormBuilder } from '@/components/form-elements/form-designer(builder)/form-builder'
import React from 'react'

const FormBuilderPage = async({params :{id}} :{params:{id:string}}) => {

    const {formData} = await getUserFormById(Number(id))

    if(!formData) {throw new Error('Form not found.')}

  return <FormBuilder form={formData}/>
}

export default FormBuilderPage