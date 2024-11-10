import React, { ReactNode } from 'react'

const FormPageLayout = ({children}:{children : ReactNode}) => {
  return (
    <div className='flex w-full mx-auto flex-grow'>{
        children
    }</div>
  )
}

export default FormPageLayout