"use client";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { ImageDesignerComponent } from "../../designer-component";
import { ImagePropertiesComponent } from "../../properties-component";
import { FormComponent } from "./image-form-component";
import { ImagePlus } from "lucide-react";

const type: ElementsType = "ImageField";

const extraAttributes = {
  label: "Image field",
  helperText: "Helper text",
  src:"",
  width:100,
  height:100,
}

export const ImageFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: ImagePlus ,
    label:'Image Field'
  },
  designerComponent:  ImageDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: ImagePropertiesComponent,
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

