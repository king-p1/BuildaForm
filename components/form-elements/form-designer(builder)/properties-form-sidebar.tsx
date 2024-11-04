import { useDesigner } from '@/hooks/use-designer'
import React from 'react'
import { FormElements } from '../sidebar-form-values/form-elemts-type'
import { Button } from '@/components/ui/button'
import { MdOutlineClose } from "react-icons/md";


export const PropertiesFormSidebar = () => {
    const {selectedElement,setSelectedElement}=  useDesigner()

    if(!selectedElement) return null

    const PropertiesForm = FormElements[selectedElement?.type]?.propertiesComponent

  return (
    <div className="flex flex-col p-2">
<div className="flex justify-between items-center">

<p className="text-sm text-foreground/70">
Element properties</p>

<Button variant='secondary'
size='icon'
onClick={()=>{setSelectedElement(null)}}
>
<MdOutlineClose size={22} className='dark:text-white text-black'/>
</Button>

</div>
    <PropertiesForm elementInstance={selectedElement}/>
    </div>
  )
}
 