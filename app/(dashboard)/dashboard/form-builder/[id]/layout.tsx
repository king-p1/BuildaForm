import React, { ReactNode } from 'react'

const FormBuilderLayout = ({children}:{children : ReactNode}) => {
  return (
    <div className='flex w-full mx-auto flex-grow h-screen'>{
        children
    }</div>
  )
}

export default FormBuilderLayout