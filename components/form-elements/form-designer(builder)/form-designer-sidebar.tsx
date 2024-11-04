import React from 'react'
 
import { useDesigner } from '@/hooks/use-designer'
import { FormElementSidebar } from './form-element-sidebar'
import { PropertiesFormSidebar } from './properties-form-sidebar'

export const DesignSidebar = () => {
 const {selectedElement}=  useDesigner()
  return (
    <aside 
    className='w-[400px] p-4   dark:bg-neutral-950 bg-white border-2 h-full flex flex-col flex-grow gap-2 border-l-2  '
    >
{selectedElement ? (<PropertiesFormSidebar />) : ( <FormElementSidebar />)}



    </aside>
  )
}
