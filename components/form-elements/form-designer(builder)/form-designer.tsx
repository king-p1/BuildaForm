"use client"
import { DesignSidebar } from './form-designer-sidebar'
import {DragEndEvent, useDndMonitor, useDroppable} from '@dnd-kit/core'
import { cn, idGenerator } from '@/lib/utils'
import { ElementsType, FormElements } from '../sidebar-form-values/form-elemts-type'
import { useDesigner } from '@/hooks/use-designer'
import { DesignerElementWrapper } from './designer-element-wrapper'
import { toast } from '@/hooks/use-toast'

export const FormDesigner = () => {

    const {elements,addElement,selectedElement,setSelectedElement,removeElement} = useDesigner()

    const droppable = useDroppable({
        id:'designer-drop-area',
        data:{
            isDesignerDropArea : true
        }
    })

useDndMonitor({
    onDragEnd : (event:DragEndEvent) =>{
        const {active,over}= event

        if(!active || !over) return


        // first scenario
        const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement
        const isDroppingOverDesigningArea = over.data?.current?.isDesignerDropArea

        if(isDesignerBtnElement && isDroppingOverDesigningArea){
            const type = active.data?.current?.type
            const newElememt = FormElements[type as ElementsType].construct(
                idGenerator()
            )
            addElement(elements.length,newElememt)
            return
        }


        // second scenario
        const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement

        const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement


        const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf ||isDroppingOverDesignerElementBottomHalf


const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement

if(droppingSidebarBtnOverDesignerElement){
    const type = active.data?.current?.type
            const newElememt = FormElements[type as ElementsType].construct(
                idGenerator()
            )
const overId = over.data?.current?.elementId

const overElementIndex = elements.findIndex((el)=>el.id === overId)

if(overElementIndex === -1){
    toast({
        title:'Error',
        description:'Element not found!'
    })
    return
}

let indexForNewElement = overElementIndex

if(isDroppingOverDesignerElementBottomHalf){
    indexForNewElement = overElementIndex + 1
}

            addElement(indexForNewElement,newElememt)
            return
}



// third scenario

const isDraggingDesignerElement = active.data?.current?.isDesignerElement

const draggingDesignerOverAnotherDesignElement = isDroppingOverDesignerElement && isDraggingDesignerElement

if(draggingDesignerOverAnotherDesignElement){
    const activeId = active.data?.current?.elementId
    const overId = over.data?.current?.elementId

    const activeElementIndex = elements.findIndex((el) => el.id === activeId)
    const overElementIndex = elements.findIndex((el) => el.id === overId)

    if(activeElementIndex === -1 || overElementIndex === -1 ){
        toast({
            title:'Error',
            description:'Element not found!'
        })
        return
    }


    const activeElement = {...elements[activeElementIndex]}
    removeElement(activeId,false)

    let indexForNewElement = overElementIndex

if(isDroppingOverDesignerElementBottomHalf){
    indexForNewElement = overElementIndex + 1
}


addElement(indexForNewElement,activeElement)

 
}

}})

console.log('Elements:', elements);

  return (
    <div className='flex w-full h-full'>

<div className="p-4 w-full"
onClick={()=>{ 
    // selectedElement && setSelectedElement(null)
    if(selectedElement) setSelectedElement(null)
}
}
>

    <div 
    ref={droppable.setNodeRef}
    className={cn("dark:bg-neutral-950 bg-white border-2 max-w-[920px] m-auto rounded-xl flex flex-col flex-grow justify-start items-center flex-1 overflow-y-auto h-full",
        droppable.isOver && 'border-4 dark:border-neutral-800 border-neutral-500'
    )}>

{!droppable.isOver && elements.length === 0 && (<p className="flex flex-grow items-center font-bold text-muted-foregroundtext-3xl">
    Drop here
</p>)}

{droppable.isOver && elements.length === 0 && (
    <div className='w-full p-4'>
        <div className="h-[120px] rounded-md bg-primary/20"/>
    </div>
)}
{elements.length > 0 && (
    <div className="flex flex-col w-full p-4 gap-2">
        {elements.map((element)=>(
            <DesignerElementWrapper key={element.id} element={element}/>
        ))}
    </div>
)}
    </div>

</div>

<DesignSidebar/>

        </div>
  )
}
