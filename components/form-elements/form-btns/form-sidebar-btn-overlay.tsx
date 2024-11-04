import React from 'react'
import { FormElement } from '../sidebar-form-values/form-elemts-type'
import { Button } from '../../ui/button'

export const SidebarBtnElementDRagOverlay = ({formElement}:{formElement :FormElement}) => {
    const {icon:Icon,label} = formElement.designerBtnElement

  return (
    <Button
    className='flex flex-col gap-2 h-[120px] w-[120px] cursor-grab border-2 border-neutral-800'>
        <Icon className='h-8 w-8 '/>
<p className="text-sm">{label}</p>
    </Button>
  )
}
