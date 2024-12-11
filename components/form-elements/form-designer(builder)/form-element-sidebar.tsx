import React from 'react'
import { FormElements } from '../sidebar-form-values/form-elemts-type'
import { SidebarBtnElement } from '../form-btns/form-sidebar-btn'

export const FormElementSidebar = () => {
  return (
    <div className='flex flex-col gap-2'>
      <h1 className="text-base text-muted-foreground">Drag and drop elements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
        <p className="text-sm col-span-1 md:col-span-2 my-2 place-self-start">Layout elements</p>
      <SidebarBtnElement formElement={FormElements.TitleField}/>
      <SidebarBtnElement formElement={FormElements.SubTitleField}/>
      <SidebarBtnElement formElement={FormElements.ParagraphField}/>
      <SidebarBtnElement formElement={FormElements.LinkField}/>
      {/* <SidebarBtnElement formElement={FormElements.TableField}/> */}
      <SidebarBtnElement formElement={FormElements.ImageField}/>

      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
        <p className="text-sm col-span-1 md:col-span-2 my-2 place-self-start">Form elements</p>

      <SidebarBtnElement formElement={FormElements.TextField}/>
      <SidebarBtnElement formElement={FormElements.NumberField}/>
      <SidebarBtnElement formElement={FormElements.TextAreaField}/>
      <SidebarBtnElement formElement={FormElements.DateField}/>
      <SidebarBtnElement formElement={FormElements.SelectField}/>
      <SidebarBtnElement formElement={FormElements.CheckboxField}/>
      <SidebarBtnElement formElement={FormElements.ImageUploadField}/>
      <SidebarBtnElement formElement={FormElements.FileUploadField}/>
      </div>
      
        
    </div>
  )
}
