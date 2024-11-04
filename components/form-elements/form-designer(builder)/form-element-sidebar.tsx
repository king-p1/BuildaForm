import React from 'react'
import { FormElements } from '../sidebar-form-values/form-elemts-type'
import { SidebarBtnElement } from '../form-btns/form-sidebar-btn'

export const FormElementSidebar = () => {
  return (
    <div>
      <SidebarBtnElement formElement={FormElements.TextField}/>
        
    </div>
  )
}
