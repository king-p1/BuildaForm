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