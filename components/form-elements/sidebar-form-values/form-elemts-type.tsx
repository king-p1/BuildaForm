import { TextFieldFormElement } from "@/components/fields/text-field"
import React from "react"
import { IconType } from "react-icons/lib"

export type ElementsType = "TextField"

export type FormElement = {
type:ElementsType

construct :(id:string)=> FormElementsInstance

designerBtnElement:{
    icon:React.ElementType | IconType,
    label:string
}


designerComponent : React.FC<{
    elementInstance : FormElementsInstance
}>,
formComponent:React.FC<{
    elementInstance : FormElementsInstance
}>,
propertiesComponent: React.FC<{
    elementInstance : FormElementsInstance
}>,
}

export type FormElementsInstance = {
    id:string,
    type:ElementsType,
    extraAttributes?:Record<string, any>
}

type FormElementsType = {
    [key in ElementsType]: FormElement
}

export const FormElements:FormElementsType = {
    TextField:TextFieldFormElement
}