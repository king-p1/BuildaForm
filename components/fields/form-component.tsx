import { FormElementsInstance } from '../form-elements/sidebar-form-values/form-elemts-type'
 
import { CustomInstance } from './form-fields/text-field/text-field'
 

 

export const TitleFormComponent =  ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance
 

    const {title} = element.extraAttributes

     

  return (
    <p className='text-xl'>
     {title}
        </p>
  )
}

 

export const SubtitleFormComponent =  ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance
 

    const {title} = element.extraAttributes

     

  return (
    <p className='text-lg'>
     {title}
        </p>
  )
}

export const ParagraphFormComponent =  ({elementInstance}:{elementInstance:FormElementsInstance}) => {
    const element = elementInstance as CustomInstance
 

    const {text} = element.extraAttributes

     

  return (
    <p>
     {text}
        </p>
  )
}

 