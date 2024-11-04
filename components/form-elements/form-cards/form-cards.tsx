import { getUserForms } from '@/actions/form'
import React from 'react'
import { FormCard } from './form-card'

export const FormCards = async() => {

    const {formData} = await getUserForms()
  return (
    <>
        {formData?.map((form)=>(
            <FormCard form={form} key={form.id}/>
        ))}
    </>
  )
}
