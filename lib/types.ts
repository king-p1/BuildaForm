import { getFormStats } from "@/actions/form";
import { ReactNode } from "react";
import * as z from 'zod'  
import { formSchema, propertiesSchema,propertiesTitleSchema,propertiesParagraphSchema,textAreaPropertiesSchema,datePropertiesSchema,selectPropertiesSchema, feedbackFormSchema, imageSchema, imageUploadSchema } from "./form-schema";


export interface StatCardsProps {
    loading : boolean;
    statsData?:Awaited<ReturnType<typeof getFormStats>>
}

export interface StatCardProps {
    loading : boolean;
    title:string
    helperText:string
    className:string
    icon: ReactNode
    value:string | number | undefined

}

export type formSchemaType = z.infer<typeof formSchema>
export type feedbackFormSchemaType = z.infer<typeof feedbackFormSchema>

export type propertiesSchemaType = z.infer<typeof propertiesSchema>
export type imageSchemaType = z.infer<typeof imageSchema>
export type imageUploadSchemaType = z.infer<typeof imageUploadSchema>
export type propertiesTitleSchemaType = z.infer<typeof propertiesTitleSchema>
export type paragraphSchemaType = z.infer<typeof propertiesParagraphSchema>
export type textAreaSchemaType = z.infer<typeof textAreaPropertiesSchema>
export type dateSchemaType = z.infer<typeof datePropertiesSchema>
export type selectSchemaType = z.infer<typeof selectPropertiesSchema>

export type Row = {[key:string]:string} &{
    submittedAt:Date,
    email:string
}