import React, { ReactNode } from 'react'

const FormBuilderLayout = ({children}:{children : ReactNode}) => {
  return (
    <div className='flex w-full mx-auto flex-grow'>{
        children
    }</div>
  )
}

export default FormBuilderLayout