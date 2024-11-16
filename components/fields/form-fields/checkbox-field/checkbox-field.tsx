"use client";
import { RiCheckboxMultipleLine } from "react-icons/ri";

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { CheckboxFieldDesignerComponent } from "../../designer-component";
import { CheckboxFieldPropertiesComponent } from "../../properties-component";
import { FormComponent } from "../checkbox-field/checkbox-form-component";

const type: ElementsType = "CheckboxField";

const extraAttributes = {
  label: "Checkbox field",
  helperText: "Pick a date",
  required: false,
}

export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: RiCheckboxMultipleLine,
    label:'Checkbox field'
  },
  designerComponent:  CheckboxFieldDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: CheckboxFieldPropertiesComponent,
  validate:(formElement:FormElementsInstance,currentValue:string):boolean => {
    const element = formElement as CustomInstance
    if(element.extraAttributes.required){
      return currentValue !== 'true'
    }

    return true
  }

};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

