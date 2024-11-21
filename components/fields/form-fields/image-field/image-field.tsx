"use client";
import { LuImagePlus } from "react-icons/lu";

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { ImageUploadDesignerComponent } from "../../designer-component";
import { ImageUploadPropertiesComponent } from "../../properties-component";
import { FormComponent } from "./image-form-component";

const type: ElementsType = "ImageUploadField";

const extraAttributes = {
  label: "Image field",
  helperText: "Helper text",
}

export const ImageUploadFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: LuImagePlus ,
    label:'Image Field'
  },
  designerComponent:  ImageUploadDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: ImageUploadPropertiesComponent,
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

