"use client";
import { BsCalendar2Date } from "react-icons/bs";

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { DateFieldDesignerComponent } from "../../designer-component";
import { DateFieldPropertiesComponent } from "../../properties-component";
import { FormComponent } from "../date-field/date-form-component";

const type: ElementsType = "DateField";

const extraAttributes = {
  label: "Date field",
  helperText: "Pick a date",
  required: false,
}

export const DateFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: BsCalendar2Date,
    label:'Date Field'
  },
  designerComponent:  DateFieldDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: DateFieldPropertiesComponent,
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

