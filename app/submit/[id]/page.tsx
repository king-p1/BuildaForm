import { getFormContentById } from '@/actions/form'
import { FormSubmitComponent } from '@/components/form-elements/form-cards/form-submit'
import { FormElementsInstance } from '@/components/form-elements/sidebar-form-values/form-elemts-type'
import Image from 'next/image'
import React from 'react'
import formError from '@/public/form-error.png'
const SubmitPage = async ({ params: { id } }: { params: { id: string } }) => {
    const { formData, message, error } = await getFormContentById(id)

    if (error || !formData) {
        return (
            <div className='h-[70vh] -mt-14 p-2 w-full flex items-center justify-center flex-col gap-3'>

<Image
src={formError}
alt='form error'
width='480'
height='430'
/>

                <p className='text-3xl text-center '>
                  
                    {message || 'Something went wrong. Please try again later.'}
                </p>
            </div>
        )
    }


    try {
        const formContent = JSON.parse(formData.content) as FormElementsInstance[]
        return <FormSubmitComponent content={formContent} url={id} formId={String(formData?.id)} isPublished={formData?.published} />
    } catch (e) {
        console.log(e)
        return (
            <div className='h-[70vh] -mt-14 p-2 w-full flex items-center justify-center flex-col gap-3'>
<Image
src={formError}
alt='form error'
width='480'
height='430'
/>
                <p className='text-3xl text-center'>
                    Invalid form content. Please contact the form author.
                </p>
            </div>
        )
    }
}

export default SubmitPage