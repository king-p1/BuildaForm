"use client";
import { RiParagraph } from "react-icons/ri";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../form-elements/sidebar-form-values/form-elemts-type";
import { ParagraphDesignerComponent } from "../designer-component";
import { ParagraphFormComponent } from "../form-component";
import { ParagraphPropertiesComponent } from "../properties-component";

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
    icon: RiParagraph ,
    label:'Paragraph Field'
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

