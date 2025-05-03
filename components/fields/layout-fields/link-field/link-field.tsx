"use client";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { LinkDesignerComponent } from "../../designer-component";
import { LinkPropertiesComponent } from "../../properties-component";
import { FormComponent } from "./link-form-component";
import { FiLink } from "react-icons/fi";

const type: ElementsType = "LinkField";

const extraAttributes = {
  label: "link field",
  helperText:"Your link field",
  href:`#`,
  text:'Enter Link here',
  color:'#ccc', //text-[#ffff]
  bgColor:'#ccc', //bg-[#ffff]
  size:20,
  width:200,
  padding:4,
}

export const LinkFieldFormLayoutElement: FormElement = {
  type,
  construct: (id:string) => ({
    id,
    type,
    extraAttributes ,
  }),
  
  designerBtnElement:{
    icon: FiLink ,
    label:'Link Field'
  },
  designerComponent:  LinkDesignerComponent ,
  formComponent: FormComponent,
  propertiesComponent: LinkPropertiesComponent,
  validate:() => true

};

export type CustomInstance = FormElementsInstance & {
  extraAttributes : typeof extraAttributes
}

