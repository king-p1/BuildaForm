import * as z from 'zod'  

export const formSchema = z.object({
    name:z.string().min(4).max(40),
    description:z.string().optional(),
    maxSubmissions: z.number().min(0).default(0),
    allowMultipleSubmissions: z.boolean().default(false),
    expiresAt: z.date().optional().nullable(),
})

export const feedbackFormSchema = z.object({
    content:z.string().min(10).max(320),
})

export const propertiesSchema = z.object({
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
    placeholder:z.string().min(4).max(40),
    required:z.boolean().default(false),
    limit: z.number().min(1).max(200).default(50)
})

export const imageSchema = z.object({
    src:z.string(),
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
})

export const selectPropertiesSchema = z.object({
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
    placeholder:z.string().min(4).max(40),
    required:z.boolean().default(false),
    options:z.array(z.string()).default([])
})

export const textAreaPropertiesSchema = z.object({
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
    placeholder:z.string().min(4).max(40),
    required:z.boolean().default(false),
    rows:z.number().min(1).max(10),
    limit: z.number().min(10).max(400).default(150)
})

export const datePropertiesSchema = z.object({
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
    required:z.boolean().default(false),
})

export const propertiesTitleSchema = z.object({
    title:z.string().min(4).max(40),
})

export const propertiesParagraphSchema = z.object({
    text:z.string().min(4).max(200),
})