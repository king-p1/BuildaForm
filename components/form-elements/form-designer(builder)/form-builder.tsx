"use client"

import { Form } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { PublishFormBtn } from '../form-btns/publish-form'
import { SaveFormBtn } from '../form-btns/save-form'
import { PreviewDialogBtn } from '../form-btns/preview-dialog'
import { FormDesigner } from './form-designer'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { DragOverlayWrapper } from '../drag-overlay/drag-overlay-wrapper'
import { useDesigner } from '@/hooks/use-designer'
import { TbLoader3 } from 'react-icons/tb'

export const FormBuilder = ({form}:{form:Form}) => {
    const { content,createdAt,description,id,name,published,shareURL,submissions,userId,visits} = form

    const {setElements} = useDesigner()

    const [isLoaded, setisLoaded] = useState<boolean>(false)

const mouseSensor = useSensor(MouseSensor,{
  activationConstraint:{
    distance:10,
  }
})
const touchSensor = useSensor(TouchSensor,{
  activationConstraint:{
    delay:300,
    tolerance:5
  }
})

    const sensors = useSensors(mouseSensor,touchSensor)

    useEffect(()=>{
      if(isLoaded) return
const elements = JSON.parse(content)
setElements(elements)

const loadingTimer = setTimeout(() => {
  setisLoaded(true)
}, 500);

return () => clearImmediate(loadingTimer)
},[content,setElements])

if(!isLoaded){
return ( <div className='h-full w-full flex items-center justify-center'>

<TbLoader3 className='animate-spin dark:text-white text-black' size={65}/>
  </div>)
}


  return (
    <DndContext sensors={sensors}>
    <main  className='flex flex-col w-full'>

<nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
    <h2 className="text-muted-foreground truncate">
        Form :{name}
    </h2>

    <div className="flex items-center gap-2">
        <PreviewDialogBtn/>
        {!published && (<>
        <SaveFormBtn id={id}/>
        <PublishFormBtn/>
        </>)}
    </div>
</nav>


<div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_95%,black)]"></div>
     


      <FormDesigner/>
 </div>

    </main>
    <DragOverlayWrapper/>
    </DndContext>

  )
}
