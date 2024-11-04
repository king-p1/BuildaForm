import * as z from 'zod'  

export const formSchema = z.object({
    name:z.string().min(4).max(40),
    description:z.string().optional()
})

export const propertiesSchema = z.object({
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
    placeholder:z.string().min(4).max(40),
    required:z.boolean().default(false)
})