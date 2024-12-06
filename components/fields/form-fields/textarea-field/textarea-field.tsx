"use client";
import { BsTextareaT } from "react-icons/bs";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
  StringValue,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { TextAreaDesignerComponent } from "../../designer-component";
import { TextAreaPropertiesComponent } from "../../properties-component";
import { FormComponent } from "../textarea-field/textarea-form-component";

const type: ElementsType = "TextAreaField";

const extraAttributes = {
  label: "Textarea",
  helperText: "Helper text",
  required: false,
  placeholder:'Enter value here...',
  rows:3,
  limit:150
}

export const TextAreaFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: BsTextareaT,
    label:'Textarea Field'
  },
  designerComponent:  TextAreaDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: TextAreaPropertiesComponent,
  validate:(formElement:FormElementsInstance,currentValue:StringValue):boolean => {
    const element = formElement as CustomInstance
    if(element.extraAttributes.required){
      return currentValue.length > 0
    }

    return true
  }

};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

