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
  imageTypes:[],
  src:[],
  placeholder:'Click here to upload an image',
  isMultiple:false,
  required:false,
  minimage:1,
  maximage:1,
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
  validate: (formElement: FormElementsInstance, currentValue: string | string[]): boolean => {
    const element = formElement as CustomInstance;
    const { isMultiple, required, minImages, maxImages } = element.extraAttributes;

    // Convert currentValue to an array if it's a string
    const valuesArray = Array.isArray(currentValue) ? currentValue : [currentValue];

    if (required && valuesArray.length === 0) {
        return false; // If required and no images uploaded
    }

    if (isMultiple) {
        if (minImages !== undefined && valuesArray.length < minImages) {
            return false; // Not enough images uploaded
        }
        if (maxImages !== undefined && valuesArray.length > maxImages) {
            return false; // Too many images uploaded
        }
    } else {
        // If not multiple, ensure exactly one image is uploaded
        return valuesArray.length === 1;
    }

    return true; // Validation passes
}

};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

