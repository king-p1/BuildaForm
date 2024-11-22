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

const {name, description, maxSubmissions, allowMultipleSubmissions, expiresAt} = data
const form = await prisma.form.create({
data:{
    userId: user.id,
    name,
    description: description || "",
    maxSubmissions: maxSubmissions || 0,
    allowMultipleSubmissions: allowMultipleSubmissions || false,
    expiresAt: expiresAt || null,
    createdBy: user.emailAddresses[0].emailAddress,
    
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

    export const publishForm = async(id:number)=>{
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
                published:true
            }
        })

        return {error:false,formData}
    
    }

    export const getFormContentById = async(id:string)=>{
        const user = await currentUser()

        if(!user) {
            return {message : 'User not found!',error:true}
        }

        const formData = await prisma.form.update({
           select:{
            content:true
           },
           data:{
            visits:{
                   increment:1
               }
           },
            where:{
                shareURL:id,
            },
        })

        return {error:false,formData}
    
    }

    // todo change to camelCase
    export const SubmitFormAction = async(url: string, JsonContent: string) => {
        const user = await currentUser();

        if (!user) {
            return { message: 'User not found!', error: true };
        }

        const formData = await prisma.form.update({
            data: {
                submissions: {
                    increment: 1
                },
                FormSubmissions: {
                    create: {
                        content: JsonContent,
                        email: user.emailAddresses[0].emailAddress,
                    }
                }
            },
            where: {
                shareURL: url,
                published: true
            },
        });

        return { error: false, formData };
    };

    export const getFormTableData = async(id: number) => {
        const user = await currentUser();
    
        if (!user) {
            return { message: 'User not found!', error: true };
        }
    
        const formData = await prisma.form.findUnique({
            where: {
                userId: user.id,
                id
            },
            include: {
                FormSubmissions: {
                    select: {
                        content: true,
                        createdAt: true,
                        email: true, // Include the email field here
                    }
                }
            },
        });
    
        return { error: false, formData };
    };
    // ... existing code ...

export const deleteForm = async (id: number) => {
    const user = await currentUser();

    if (!user) {
        return { message: 'User not found!', error: true };
    }

    // Use a transaction to delete the form and its submissions
      await prisma.$transaction(async (prisma) => {
        // Delete form submissions first
        await prisma.formSubmissions.deleteMany({
            where: {
                formId: id,
                form: {
                    userId: user.id, // Ensure the user owns the form
                },
            },
        });

        // Then delete the form
        await prisma.form.delete({
            where: {
                id,
                userId: user.id, // Ensure the user owns the form
            },
        });

    });

    return { message: 'Form deleted successfully!', error: false };
};

    //todo add an edit published form function


