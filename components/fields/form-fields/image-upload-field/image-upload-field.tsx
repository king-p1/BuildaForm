"use client";
import { ImageUp } from 'lucide-react';

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { ImageUploadDesignerComponent } from "../../designer-component";
import { ImageUploadPropertiesComponent } from "../../properties-component";
import { FormComponent } from "./image-upload-form-component";

const type: ElementsType = "ImageUploadField";

const extraAttributes = {
  label: "Image Upload field",
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
    icon: ImageUp ,
    label:'Image Upload'
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

