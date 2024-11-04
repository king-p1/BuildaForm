"use client"

import { FormElementsInstance } from "@/components/form-elements/sidebar-form-values/form-elemts-type"
import { toast } from "@/hooks/use-toast"
import React, { createContext, Dispatch, SetStateAction, useState } from "react"


type DesignerContextType = {
    elements :FormElementsInstance[],
    setElements:Dispatch<React.SetStateAction<FormElementsInstance[]>>,
    addElement:(index:number,element:FormElementsInstance)=>void
    removeElement:(id:string,bool?:boolean)=>void
    updateElement:(id:string,element:FormElementsInstance)=>void
    selectedElement:FormElementsInstance | null
    setSelectedElement:Dispatch<SetStateAction<FormElementsInstance | null>>

}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export const DesignerContextProvider = ({children}:{children:React.ReactNode}) =>{
  const  [elements, setElements] = useState<FormElementsInstance[]>([])
  const  [selectedElement, setSelectedElement] = useState<FormElementsInstance | null>(null)

  const  addElement = (index:number,element:FormElementsInstance) =>{
    setElements((prev)=>{
        const newElements = [...prev]
        newElements.splice(index,0,element)
        return newElements
    })
  }

  const  removeElement = (id:string,bool?:boolean) =>{
    setElements((prev)=> prev.filter((element)=>element.id !== id));
   if(bool === true){
     toast({
       title:'Success',
       description:'Form element removed'
      })
    }
    }

  const  updateElement = (id:string,element:FormElementsInstance) =>{
    setElements((prev)=> {
      const newElements = [...prev]
      const index = newElements.findIndex((el)=>el.id === id)
      newElements[index] = element
      return newElements
    });
   
  }


    return (<DesignerContext.Provider value={{
        elements,
        setElements,
        addElement,
        removeElement,
        updateElement,
        selectedElement, 
        setSelectedElement
    }}>{children}</DesignerContext.Provider>
)
}