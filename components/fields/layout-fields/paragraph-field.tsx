"use client";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../form-elements/sidebar-form-values/form-elemts-type";
import { ParagraphDesignerComponent } from "../designer-component";
import { ParagraphFormComponent } from "../form-component";
import { ParagraphPropertiesComponent } from "../properties-component";
import { PiParagraphBold } from "react-icons/pi";

const type: ElementsType = "ParagraphField";

const extraAttributes = {
  text: "Text here",
}

export const ParagraphFieldFormLayoutElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: PiParagraphBold,
    label: "Paragraph\nField"
  },
  designerComponent:  ParagraphDesignerComponent ,
  formComponent: ParagraphFormComponent,
  propertiesComponent: ParagraphPropertiesComponent
  ,
  validate:() => true

};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

