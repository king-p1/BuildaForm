"use client";
import { TbSquaresSelected } from "react-icons/tb";

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
  StringValue,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import {  SelectFieldDesignerComponent } from "../../designer-component";
import { SelectFieldPropertiesComponent } from "../../properties-component";
import { FormComponent } from "../select-field/select-form-component";

const type: ElementsType = "SelectField";

const extraAttributes = {
  label: "Select field",
  helperText: "Helper Text",
  required: false,
  placeholder:'Enter value here...',
  options:[]
}

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: TbSquaresSelected,
    label:'Select Field'
  },
  designerComponent:  SelectFieldDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: SelectFieldPropertiesComponent,
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

