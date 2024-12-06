"use client";
import { MdUploadFile } from "react-icons/md";

import {
  ElementsType,
  FormElement,
  FormElementsInstance,
  StringValue,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { FileUploadDesignerComponent } from "../../designer-component";
import { FileUploadPropertiesComponent } from "../../properties-component";
import { FormComponent } from "./file-upload-form-component";

const type: ElementsType = "FileUploadField";

const extraAttributes = {
  label: "Image Upload field",
  helperText: "Helper text",
}

export const FileUploadFieldFormElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: MdUploadFile ,
    label:'File Upload'
  },
  designerComponent:  FileUploadDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: FileUploadPropertiesComponent,
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

