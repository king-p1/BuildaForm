"use server"

import { formSchema } from "@/lib/form-schema"
import prisma from "@/lib/prisma"
import { formSchemaType } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"

export const getFormStats = async() =>{
    const user = await currentUser()

    if(!user) {
        return {message : 'User not found!',error:true}
    }

    const stats = await prisma.form.aggregate({
        where:{
            userId : user.id
        },
        _sum:{
            visits:true,
            submissions:true
        }
    })


    const visits = stats._sum.visits || 0 
    const submissions = stats._sum.submissions || 0 

    let submissionRate = 0

    if(visits > 0){
        submissionRate = (submissions/visits)/100
    }

    const bounceRate = 100 - submissionRate

return {
    visits,bounceRate,submissionRate,submissions
}
}

export const generateForm =async(data:formSchemaType)=>{
    const validation =formSchema.safeParse(data)
    if(!validation) return {message : 'Invalid form data!',error:true}

        const user = await currentUser()

    if(!user) {
        return {message : 'User not found!',error:true}
    }

    const {name,description} = data
    const form = await prisma.form.create({
data:{
userId:user.id,
name,
description
}
    })

if(!form) {
    return {message : 'An error occurred!',error:true}
}

return {message : 'Form created successfully!',error:false, formID:form.id}
    }

    export const getUserForms = async()=>{
        const user = await currentUser()

        if(!user) {
            return {message : 'User not found!',error:true}
        }

        const formData = await prisma.form.findMany({
            where:{
                userId:user.id
            },
            orderBy:{
                createdAt: 'desc'
            }
        })

        return {error:false,formData}
    
    }

    export const getUserFormById = async(id:number)=>{
        const user = await currentUser()

        if(!user) {
            return {message : 'User not found!',error:true}
        }

        const formData = await prisma.form.findUnique({
            where:{
                userId:user.id,
                id
            }
        })

        return {error:false,formData}
    
    }

    export const updateFormContentAction = async(id:number,JsonContent:string)=>{
        const user = await currentUser()

        if(!user) {
            return {message : 'User not found!',error:true}
        }

        const formData = await prisma.form.update({
            where:{
                userId:user.id,
                id
            },
            data:{
                content:JsonContent
            }
        })

        return {error:false,formData}
    
    }


