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

export const linkPropertiesSchema = z.object({
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
    href:z.string().max(150),
    text:z.string().min(4).max(100),
    color:z.string().max(80),
    width:z.number().max(500),
    bgColor:z.string().max(80).optional(),
    size:z.number().max(110),
    padding:z.number().max(80),
})

export const imageSchema = z.object({
    src:z.string(),
    label:z.string().min(4).max(40),
    helperText:z.string().min(4).max(180),
    width: z.number().min(80).max(600).default(100),
    height: z.number().min(80).max(600).default(100)
})

export const imageUploadSchema = z.object({
    src: z.array(z.string()), 
    imageTypes: z.array(z.string()),  
    label: z.string().min(4).max(40),
    isMultiple: z.boolean().default(false),
    required:z.boolean().default(false),
    placeholder: z.string().min(4).max(40),
    helperText: z.string().min(4).max(180),
    minImages: z.number().min(1),  
    maxImages: z.number().min(1).max(5),
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