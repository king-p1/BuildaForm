"use client";
import { ImageUp } from 'lucide-react';

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
  StringValue,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { ImageUploadDesignerComponent } from "../../designer-component";
import { ImageUploadPropertiesComponent } from "../../properties-component";
import { FormComponent } from "./image-upload-form-component";

const type: ElementsType = "ImageUploadField";

const extraAttributes = {
  label: "Image Upload field",
  helperText: "Helper text",
  imageTypes:[],
  src:[],
  placeholder:'Click here to upload an image',
  isMultiple:false,
  required:false,
  minImages:1,
  maxImages:1,
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
  validate: (formElement: FormElementsInstance, currentValue:StringValue ): boolean => {
    const element = formElement as CustomInstance;
    const { isMultiple, required, minImages, maxImages } = element.extraAttributes;
    
    // Convert currentValue to an array, handling undefined/null cases
    const valuesArray = Array.isArray(currentValue) 
      ? currentValue 
      : currentValue 
        ? [currentValue] 
        : [];
    
    // Required field validation
    if (required && valuesArray.length === 0) {
      return false;
    }
    
    // Multiple images validation
    if (isMultiple) {
      // Check minimum images requirement
      if (minImages && valuesArray.length < minImages) {
        return false;
      }
      
      // Check maximum images requirement
      if (maxImages && valuesArray.length > maxImages) {
        return false;
      }
    } else {
      // Single image validation - must have exactly one image
      if (valuesArray.length !== 1) {
        return false;
      }
    }
    
    return true;
  }
};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

