import { SubTitleFieldFormLayoutElement } from "@/components/fields/layout-fields/subtitle-field"
import { ParagraphFieldFormLayoutElement } from "@/components/fields/layout-fields/paragraph-field"
import { TextFieldFormElement } from "@/components/fields/form-fields/text-field/text-field"
import { TitleFieldFormLayoutElement } from "@/components/fields/layout-fields/title-field"
import React from "react"
import { IconType } from "react-icons/lib"
import { NumberFieldFormElement } from "@/components/fields/form-fields/number-field/number-field"
import { TextAreaFieldFormElement } from "@/components/fields/form-fields/textarea-field/textarea-field"
import { DateFieldFormElement } from "@/components/fields/form-fields/date-field/date-field"
import { SelectFieldFormElement } from "@/components/fields/form-fields/select-field/select-field"
import { CheckboxFieldFormElement } from "@/components/fields/form-fields/checkbox-field/checkbox-field"
import { ImageUploadFieldFormElement } from "@/components/fields/form-fields/image-upload-field/image-upload-field"
import { ImageFieldFormElement } from "@/components/fields/layout-fields/image-field/image-field"
import { FileUploadFieldFormElement } from "@/components/fields/form-fields/file-upload-field/file-upload-field"

export type ElementsType = "TextField" | "TitleField" | "SubTitleField" |"ParagraphField"  |  "NumberField" | "TextAreaField" | "DateField" | "SelectField" | "CheckboxField"  | "ImageUploadField" | "FileUploadField" | "ImageField" 

export type SubmitFunction = (key:string,value:string)=>void

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
    elementInstance : FormElementsInstance;
    submitValue?:SubmitFunction
    isInvalid?:boolean
    defaultValues?:string
}>,
propertiesComponent: React.FC<{
    elementInstance : FormElementsInstance
}>,

validate:(formElement:FormElementsInstance,currentValue:string) => boolean
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
    TextField:TextFieldFormElement,
    TitleField:TitleFieldFormLayoutElement,
    SubTitleField:SubTitleFieldFormLayoutElement,
    ParagraphField:ParagraphFieldFormLayoutElement,
    NumberField:NumberFieldFormElement,
    TextAreaField:TextAreaFieldFormElement,
    DateField:DateFieldFormElement,
    SelectField:SelectFieldFormElement,
    CheckboxField:CheckboxFieldFormElement,
    ImageUploadField:ImageUploadFieldFormElement,
    ImageField:ImageFieldFormElement,
    FileUploadField:FileUploadFieldFormElement,
}