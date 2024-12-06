"use client";
import { GoNumber } from "react-icons/go";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
  StringValue,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { NumberDesignerComponent } from "../../designer-component";
import { NumberPropertiesComponent } from "../../properties-component";
import { FormComponent } from "../number-field/number-form-component";

const type: ElementsType = "NumberField";

const extraAttributes = {
  label: "Number field",
  helperText: "Helper text",
  required: false,
  placeholder:'0'
}

export const NumberFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: GoNumber ,
    label:'Number Field'
  },
  designerComponent:  NumberDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: NumberPropertiesComponent,
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

