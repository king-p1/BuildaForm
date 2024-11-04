"use client"

import { DesignerContext } from "@/context/designer-context"
import { useContext } from "react"

export const useDesigner = () => {
    const context = useContext(DesignerContext)

    if(!context) throw new Error ('useDesigner must be used within a designer context')

  return  context
}
