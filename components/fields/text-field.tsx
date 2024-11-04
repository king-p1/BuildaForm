"use client";
import { IoText } from "react-icons/io5";

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../form-elements/sidebar-form-values/form-elemts-type";
import { DesignerComponent } from "./designer-component";
import { PropertiesComponent } from "./properties-component";
import { FormComponent } from "./form-component";

const type: ElementsType = "TextField";

const extraAttributes = {
  label: "Text field",
  helperText: "Helper text",
  required: false,
  placeholder:'Enter value here...'
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
};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

