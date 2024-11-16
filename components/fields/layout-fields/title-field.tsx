"use client";
import { LuHeading1 } from "react-icons/lu";


import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../form-elements/sidebar-form-values/form-elemts-type";
import { TitleDesignerComponent } from "../designer-component";
import { TitlePropertiesComponent } from "../properties-component";
import { TitleFormComponent } from "../form-component";

const type: ElementsType = "TitleField";

const extraAttributes = {
  title: "Title field",
}

export const TitleFieldFormLayoutElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: LuHeading1 ,
    label:'Title Field'
  },
  designerComponent:  TitleDesignerComponent ,
  formComponent: TitleFormComponent,
  propertiesComponent: TitlePropertiesComponent
  ,
  validate:() => true

};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

