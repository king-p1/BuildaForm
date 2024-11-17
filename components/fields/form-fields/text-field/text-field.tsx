"use client";
import { IoText } from "react-icons/io5";

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { DesignerComponent } from "../../designer-component";
import { PropertiesComponent } from "../../properties-component";
import { FormComponent } from "./text-form-component";

const type: ElementsType = "TextField";

const extraAttributes = {
  label: "Text field",
  helperText: "Helper text",
  required: false,
  placeholder:'Enter value here...',
  limit:50
}

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: IoText ,
    label:'Text Field'
  },
  designerComponent:  DesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate:(formElement:FormElementsInstance,currentValue:string):boolean => {
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

