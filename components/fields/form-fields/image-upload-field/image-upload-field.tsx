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
  label: "Image Upload",
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

    if (!required && valuesArray.length === 0) {
      return true;
    }

    if (isMultiple) {
      // If required, must meet minimum images requirement
      if (required && minImages && valuesArray.length < minImages) {
        console.log(`Validation failed: Required field needs minimum ${minImages} images`);
        return false;
      }
  
      // If not required but some images uploaded, must still meet minimum if specified
      if (!required && valuesArray.length > 0 && minImages && valuesArray.length < minImages) {
        console.log(`Validation failed: When uploading, minimum ${minImages} images required`);
        return false;
      }
  
      if (maxImages && valuesArray.length > maxImages) {
        console.log(`Validation failed: Maximum ${maxImages} images allowed`);
        return false;
      }
    } else {

      if (required && valuesArray.length !== 1) {
        console.log('Validation failed: Exactly one image required');
        return false;
      }
  
      if (!required && valuesArray.length > 1) {
        console.log('Validation failed: Cannot upload multiple images in single mode');
        return false;
      }
    }
  
    return true;
  }
};