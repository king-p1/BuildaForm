import { getFormStats } from "@/actions/form";
import { ReactNode } from "react";
import * as z from 'zod'  
import { formSchema, propertiesSchema } from "./form-schema";


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
export type propertiesSchemaType = z.infer<typeof propertiesSchema>