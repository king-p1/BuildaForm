"use client"
import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useState } from 'react'
import { SidebarBtnElementDRagOverlay } from '../form-btns/form-sidebar-btn-overlay'
import { ElementsType, FormElements } from '../sidebar-form-values/form-elemts-type'
import { useDesigner } from '@/hooks/use-designer'

export const DragOverlayWrapper = () => {

    const [draggedItem,setDraggedItem]= useState<Active | null>(null)

    const {elements} = useDesigner()

    useDndMonitor({
        onDragStart :(event) =>{
setDraggedItem(event.active)
        },
        onDragCancel : () =>{
            setDraggedItem(null)
        },
        onDragEnd : () =>{
            setDraggedItem(null)
        },
    })

    if(!draggedItem) return null
 
    const isSidebarBtnElement = draggedItem?.data.current?.isDesignerBtnElement
    
    let node = <div>No drag overlay</div>
    
    if(isSidebarBtnElement){
        const type = draggedItem.data?.current?.type as ElementsType
        node = <SidebarBtnElementDRagOverlay formElement={FormElements[type]}/>
    }
    
    const isDesignerElement = draggedItem?.data?.current?.isDesignerElement

    if(isDesignerElement){
const elementId = draggedItem.data?.current?.elementId
const element = elements.find((el)=> el.id === elementId)
if(!element){
    node = <div>Element not found</div>
}else{
    const DesignerElementComponent = FormElements[element.type].designerComponent

    node = <div className='bg-accent w-full h-[120px] py-2 px-4 rounded-md opacity-80 pointer-events-none'> 
        <DesignerElementComponent elementInstance={element}/>
        </div>
}
    }

 return <DragOverlay>
    {node}
  </DragOverlay> 
  
}