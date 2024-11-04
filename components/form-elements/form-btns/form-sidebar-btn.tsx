import React from 'react'
import { FormElement } from '../sidebar-form-values/form-elemts-type'
import { Button } from '../../ui/button'
import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

export const SidebarBtnElement = ({formElement}:{formElement :FormElement}) => {
    const {icon:Icon,label} = formElement.designerBtnElement

    const draggable = useDraggable({
        id:`designer-btn-${formElement.type}`,
data:{
    type:formElement.type,
    isDesignerBtnElement:true
}
    })

  return (
    <Button
    ref={draggable.setNodeRef}
    {...draggable.listeners}
    {...draggable.attributes}
    className={cn('flex flex-col gap-2 h-[120px] dark:bg-neutral-900 border-2 bg-neutral-100 dark:text-white hover:bg-neutral-200 hover:dark:bg-neutral-800 text-black w-[120px] cursor-grab',draggable.isDragging && 'border-2 border-neutral-600')}>
        <Icon className='h-9 w-9 cursor-grab'/>
<p className="text-sm font-semibold">{label}</p>
    </Button>
  )
}
