"use server"

import { formSchema } from "@/lib/form-schema"
import prisma from "@/lib/prisma"
import { formSchemaType } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"


export const handleUserSignIn = async () => {
    const user = await currentUser();

    if (!user) {
        throw new Error("User not found");
    }


    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
        where: { email: user.emailAddresses[0].emailAddress },
    });

    // If the user does not exist, create a new user
    if (!existingUser) {
        await prisma.user.create({
            data: {
                email: user.emailAddresses[0].emailAddress,
                name: user.fullName || "", // Adjust based on your user object structure
                username: user.username || user.emailAddresses[0].emailAddress.split('@')[0],   
            },
        });
    }
}; 


export const getFormStats = async () => {
    const user = await currentUser()

    if (!user) {
        return { message: 'User not found!', error: true }
    }

    // Get overall form statistics
    const stats = await prisma.form.aggregate({
        where: {
            userId: user.id
        },
        _sum: {
            visits: true,
            submissions: true
        },
        _count: {
            id: true
        }
    })

    // Get form status counts
    const statusCounts = await prisma.form.groupBy({
        by: ['published'],
        where: {
            userId: user.id
        },
        _count: {
            id: true
        }
    })

    // Get recent submission trends
    const recentSubmissions = await prisma.formSubmissions.groupBy({
        by: ['createdAt'],
        where: {
            form: {
                userId: user.id
            }
        },
        _count: {
            id: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 7 // Last 7 days
    })

    const visits = stats._sum.visits || 0
    const submissions = stats._sum.submissions || 0
    const totalForms = stats._count.id || 0
    const publishedForms = statusCounts.find(s => s.published)?._count.id || 0
    const draftForms = statusCounts.find(s => !s.published)?._count.id || 0

    let submissionRate = 0
    if (visits > 0) {
        submissionRate = (submissions / visits) * 100 // Convert to percentage
    }

    const bounceRate = 100 - submissionRate

    // Format recent submissions data for charts
    const submissionTrends = recentSubmissions.map(sub => ({
        date: sub.createdAt,
        count: sub._count.id
    }))

    return {
        visits,
        submissions,
        totalForms,
        publishedForms,
        draftForms,
        submissionRate,
        bounceRate,
        submissionTrends,
        error: false
    }
}

export const generateForm = async (data: formSchemaType) => {
    const validation = formSchema.safeParse(data)
    if (!validation) return { message: 'Invalid form data!', error: true }

    const user = await currentUser()


    if (!user) {
        return { message: 'User not found!', error: true }
    }

    const { name, description, maxSubmissions, allowMultipleSubmissions, expiresAt } = data
    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name,
            description: description || "",
            maxSubmissions: maxSubmissions || 0,
            allowMultipleSubmissions: allowMultipleSubmissions || false,
            expiresAt: expiresAt || null,
            createdBy: user.emailAddresses[0].emailAddress,

        }
    })

    if (!form) {
        return { message: 'An error occurred!', error: true }
    }

    return { message: 'Form created successfully!', error: false, formID: form.id }
}

export const getUserForms = async () => {
    const user = await currentUser()

    if (!user) {
        return { message: 'User not found!', error: true }
    }

    const formData = await prisma.form.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return { error: false, formData }

}

export const getUserFormById = async (id: number) => {
    const user = await currentUser()

    if (!user) {
        return { message: 'User not found!', error: true }
    }

    const formData = await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        }
    })

    return { error: false, formData }

}

export const updateFormContentAction = async (id: number, JsonContent: string) => {
    const user = await currentUser()

    if (!user) {
        return { message: 'User not found!', error: true }
    }

    const formData = await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            content: JsonContent
        }
    })

    return { error: false, formData }

}

export const publishForm = async (id: number) => {
    const user = await currentUser()

    if (!user) {
        return { message: 'User not found!', error: true }
    }

    const formData = await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            published: true
        }
    })

    return { error: false, formData }

}

 
export const getFormContentById = async (id: string) => {
    const user = await currentUser()
    
    if (!user) {
        return { message: 'User not found!', error: true, formData: null }
    }

    try {
        const formData = await prisma.form.update({
            select: {
                content: true,
                expiresAt: true,
                submissions: true,
                maxSubmissions: true,
                isArchived: true,
                isDeactivated: true,
                allowMultipleSubmissions: true,
                id: true
            },
            data: {
                visits: {
                    increment: 1
                }
            },
            where: {
                shareURL: id,
            },
        })



        if (formData.isArchived) {
            return { error: true, message: 'This form has been ARCHIVED and is no longer accepting submissions. Check back later or reach out to the author.' };
        }
    
        
        if (formData.isDeactivated) {
            return { error: true, message: 'This form has been DEACTIVATED and is no longer accepting submissions. Check back later or reach out to the author.' };
        }
    

        // Check if form has expired
        if (formData.expiresAt && formData.expiresAt < new Date()) {
            return {
                error: true,
                message: 'Oops! This form has expired and is no longer accepting submissions.',
                formData: null
            }
        }

        // Check if max submissions reached
        if (formData.maxSubmissions > 0 && formData.submissions >= formData.maxSubmissions) {
            return {
                error: true,
                message: 'This form has reached its maximum number of submissions.',
                formData: null
            }
        }

        // Check for previous submissions if multiple aren't allowed
        if (!formData.allowMultipleSubmissions) {
            const previousSubmission = await prisma.formSubmissions.findFirst({
                where: {
                    formId: formData.id,
                    email:user.emailAddresses[0].emailAddress,
                }
            })

            if (previousSubmission) {
                return {
                    error: true,
                    message: 'You have already submitted this form. Multiple submissions are not allowed.',
                    formData: null
                }
            }
        }

        return { error: false, message: 'Form retrieved successfully.', formData }

    } catch (error) {
        console.log(error)
        return { message: 'Failed to fetch form!', error: true, formData: null }
    }
}

// todo change to camelCase
export const SubmitFormAction = async (url: string, JsonContent: string) => {
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

export const getFormTableData = async (id: number) => {
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
//todo a function to send in form feedback from the user and the options to be anonymous or not and the option for the author to see/bypass that 

// export async function getFormActivities(formId: string) {
//   try {
//     const activities = await prisma.activity.findMany({
//       where: { formId },
//       orderBy: { createdAt: 'desc' },
//       take: 5
//     });
//     return { activities };
//   } catch (error) {
//     throw new Error('Failed to fetch activities');
//   }
// }

// export async function getFormMetrics(formId: string) {
//   try {
//     const metrics = await prisma.formMetrics.findUnique({
//       where: { formId }
//     });
//     return { metrics };
//   } catch (error) {
//     throw new Error('Failed to fetch metrics');
//   }
// }

// export async function createActivity(formId: string, type: string, userId?: string, userName?: string) {
//   try {
//     const activity = await prisma.activity.create({
//       data: {
//         formId,
//         type,
//         userId,
//         userName
//       }
//     });
//     return { activity };
//   } catch (error) {
//     throw new Error('Failed to create activity');
//   }
// }

export async function getFormActivities(formId: string) {
    try {
      const activities = await prisma.activity.findMany({
        where: { formId: parseInt(formId) }, // Convert string to number
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      return { activities };
    } catch (error) {
      throw new Error('Failed to fetch activities');
    }
  }
  
  export async function getFormMetrics(formId: string) {
    try {
      const metrics = await prisma.formMetrics.findUnique({
        where: { formId: parseInt(formId) } // Convert string to number
      });
      return { metrics };
    } catch (error) {
      throw new Error('Failed to fetch metrics');
    }
  }
  
  export async function createActivity(formId: string, type: string, userId?: string, userName?: string) {
    try {
      const activity = await prisma.activity.create({
        data: {
          formId: parseInt(formId), // Convert string to number
          type,
          userId,
          userName
        }
      });
      return { activity };
    } catch (error) {
      throw new Error('Failed to create activity');
    }
  }