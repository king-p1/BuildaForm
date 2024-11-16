"use client"
import React, { useState } from 'react'
import { FormElements, FormElementsInstance } from '../sidebar-form-values/form-elemts-type'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { LuTrash2 } from "react-icons/lu";
import { useDesigner } from '@/hooks/use-designer'
import { cn } from '@/lib/utils'

export const DesignerElementWrapper = ({element}:{element :FormElementsInstance}) => {
    const DesignerElement = FormElements[element.type].designerComponent

const {removeElement,setSelectedElement,selectedElement} = useDesigner()

    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)

    const topHalf = useDroppable({
      id:element.id + '-top',
      data:{
        type:element.type,
        elementId:element.id,
        isTopHalfDesignerElement:true
      }
    })

    const bottomHalf = useDroppable({
      id:element.id + '-bottom',
      data:{
        type:element.type,
        elementId:element.id,
        isBottomHalfDesignerElement:true
      }
    })

    const draggable = useDraggable({
      id:element.id + '-drag-handler',
      data:{
        type:element.type,
        elementId:element.id,
        isDesignerElement:true,
      }
    })

    
    if(draggable.isDragging) return null
    
    return (
      <div 
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onMouseEnter={()=>{
        setMouseIsOver(true)
      }}
      onMouseLeave={()=>{
        setMouseIsOver(false)
      }}
      onClick={(e)=>{
        e.stopPropagation()
        setSelectedElement(element)
      }}
      className='relative border-2 h-[140px] flex flex-col text-foreground 
      hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'>

<div ref={topHalf.setNodeRef}  className= 'absolute top-0  w-full h-1/2 rounded-t-md'/>
<div ref={bottomHalf.setNodeRef} className='absolute  bottom-0 w-full h-1/2 rounded-b-md'/>

{mouseIsOver && (<>
<div className='absolute top-1/2 h-[140px] w-full left-1/2 -translate-x-1/2  -translate-y-1/2 z-50 items-center bg-accent justify-between rounded-md flex flex-row'>
<p className="text-muted-foreground text-base w-full h-full flex justify-center items-center animate-pulse ">
  Click for properties or drag to move
</p>
<Button variant='outline' 
className='hover:bg-red-600  bg-red-500 h-full flex justify-center items-center border rounded-md rounded-l-none'
onClick={(e)=>{
  e.stopPropagation()
  removeElement(element.id,true)
}}
>
  <LuTrash2 size={32} color='white'/>
</Button>
</div>
</>
)}

{topHalf.isOver && (
  <div className='absolute top-0 w-full rounded-t-md h-[7px] bg-primary'/>
)}

    <div className={cn("flex w-full items-center rounded-md bg-accent/40 pointer-events-none px-4 py-2  h-[140px]")}>

    <DesignerElement elementInstance={element}/>
    </div>
{bottomHalf.isOver && (
  <div className='absolute bottom-0 w-full rounded-b-md h-[7px] bg-primary'/>
)}
      </div>
  )
}
