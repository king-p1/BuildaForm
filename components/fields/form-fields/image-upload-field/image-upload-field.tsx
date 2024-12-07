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
  imageTypes: [],
  src: [],
  placeholder: 'Click here to upload an image',
  isMultiple: false,
  required: false,
  minImages: 1,
  maxImages: 1,
}

export type CustomInstance = FormElementsInstance & {
  extraAttributes: typeof extraAttributes
}

export const ImageUploadFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),

  designerBtnElement: {
    icon: ImageUp,
    label: 'Image Upload'
  },
  designerComponent: ImageUploadDesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: ImageUploadPropertiesComponent,

  validate: (formElement: FormElementsInstance, currentValue: string | string[]): boolean => {
    const element = formElement as CustomInstance;
    const { isMultiple, required, minImages, maxImages } = element.extraAttributes;

    // Convert value to array regardless of input type
    const valuesArray = Array.isArray(currentValue) 
      ? currentValue 
      : typeof currentValue === 'string'
        ? currentValue.split(',').filter(Boolean)
        : [];

    // Required field validation
    if (required && valuesArray.length === 0) {
      console.log('Required field validation failed');
      return false;
    }

    // Multiple images validation
    if (isMultiple) {
      // Check minimum images requirement
      if (minImages && valuesArray.length < minImages) {
        console.log('Minimum images validation failed');
        return false;
      }

      // Check maximum images requirement
      if (maxImages && valuesArray.length > maxImages) {
        console.log('Maximum images validation failed');
        return false;
      }
    } else {
      // Single image validation - must have exactly one image if required
      if (required && valuesArray.length !== 1) {
        console.log('Single image validation failed');
        return false;
      }
    }

    return true;
  }
};