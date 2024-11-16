"use client";
import { LuHeading2 } from "react-icons/lu";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../form-elements/sidebar-form-values/form-elemts-type";
import { SubTitleDesignerComponent } from "../designer-component";
import { SubtitleFormComponent } from "../form-component";
import { SubtitlePropertiesComponent } from "../properties-component";

const type: ElementsType = "SubTitleField";

const extraAttributes = {
  title: "SubTitle field",
}

export const SubTitleFieldFormLayoutElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: LuHeading2 ,
    label:'SubTitle Field'
  },
  designerComponent:  SubTitleDesignerComponent ,
  formComponent: SubtitleFormComponent,
  propertiesComponent: SubtitlePropertiesComponent
  ,
  validate:() => true

};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

