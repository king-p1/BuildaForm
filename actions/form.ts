/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { formSchema } from "@/lib/form-schema"
import prisma from "@/lib/prisma"
import { encryptRoomCode } from "@/lib/room-code"
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

export const generateForm = async (values: {
    name: string;
    description: string;
    maxSubmissions: number;
    allowMultipleSubmissions: boolean;
    expiresAt: Date | null;
    roomType: "PUBLIC" | "PRIVATE";
    roomCode?: string;
    roomCodeSalt?: string;
  }) => {
    try {
        
    const user = await currentUser()

    if (!user) {
        return { message: 'User not found!', error: true }
    }

  
    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name: values.name,
            description: values.description|| "",
            maxSubmissions: values.maxSubmissions || 0,
            allowMultipleSubmissions: values.allowMultipleSubmissions || false,
            expiresAt: values.expiresAt || null,
            roomType: values.roomType,
            roomCode: values.roomCode,
        roomCodeSalt: values.roomCodeSalt,
            createdBy: user.emailAddresses[0].emailAddress,

        }
    })

    if (!form) {
        return { message: 'An error occurred!', error: true }
    }

    return {
        error: false,
        message: "Form created successfully",
        formID: form.id,
      };
}catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Failed to create form",
    };
  }
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
                id: true,
                published:true,
                roomCode:true,
                roomCodeSalt:true,
                roomType:true
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
            return { error: true, message: 'This form has been ARCHIVED and is no longer accepting submissions.\n Check back later or reach out to the author.' };
        }
    
        
        if (formData.isDeactivated) {
            return { error: true, message: 'This form has been DEACTIVATED and is no longer accepting submissions.\n Check back later or reach out to the author.' };
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

export async function calculateFormMetrics(formId: string) {
    try {
        // Get all submissions for this form
        const submissions = await prisma.formSubmissions.findMany({
            where: { formId: parseInt(formId) }
        });

        // Calculate average response time
        const avgResponseTime = submissions.reduce((acc, submission) => {
            return acc + (Number(submission.lastUpdatedAt) - Number(submission.createdAt));
        }, 0) / submissions.length;

        // Calculate completion rate
        const totalVisits = await prisma.activity.count({
            where: { 
                formId: parseInt(formId),
                type: 'visit'
            }
        });
        const completionRate = (submissions.length / totalVisits) * 100;

        // Calculate bounce rate (visits with no interaction)
        const bounceRate = 100 - completionRate;

        // Update metrics
        await prisma.formMetrics.upsert({
            where: { formId: parseInt(formId) },
            update: {
                avgResponseTime,
                completionRate,
                bounceRate,
                updatedAt: new Date()
            },
            create: {
                formId: parseInt(formId),
                avgResponseTime,
                completionRate,
                bounceRate
            }
        });

        return { success: true };
    } catch (error) {
        throw new Error('Failed to calculate metrics');
    }
}

 
 


export const saveDraft = async (
    url: string,
    content: string,
    isAnonymous: boolean,
    feedback: string 
) => {
    const user = await currentUser();

    if (!user) {
        return { error: true, message: 'User not found!' };
    }

    try {
        // First find the form to get its ID
        const form = await prisma.form.findUnique({
            where: {
                shareURL: url
            },
            select: {
                id: true,
                published: true
            }
        });

        if (!form) {
            return { error: true, message: 'Form not found' };
        }

        // Get the user's primary email
        const userEmail = user.emailAddresses[0].emailAddress;

        // Find any existing draft for this user and form, regardless of anonymous setting
        const existingDraft = await prisma.formSubmissions.findFirst({
            where: {
                formId: form.id,
                email: userEmail, // Always use the real email to find existing drafts
                status: 'DRAFT'
            }
        });

        if (existingDraft) {
            // Update existing draft - only change the isAnonymous flag and content
            await prisma.formSubmissions.update({
                where: { 
                    id: existingDraft.id 
                },
                data: {
                    content,
                    isAnonymous, // Just update the flag
                    feedback,
                    lastUpdatedAt: new Date()
                }
            });
            
        } else {
            // Create new draft - always with user's real email for identification
            await prisma.formSubmissions.create({
                data: {
                    formId: form.id,
                    content,
                    email: userEmail, // Always store the real email
                    isAnonymous, // Store anonymous preference
                    feedback,
                    status: 'DRAFT'
                }
            });
            
            console.log(`Created new draft for user ${userEmail} with isAnonymous: ${isAnonymous}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Draft save error:', error);
        return { error: true, message: 'Failed to save draft' };
    }
};

export async function loadDraft(formUrl: string) {
    try {
      // Get the current authenticated user
      const user = await currentUser();
      
      if (!user) {
        return { error: true, message: "Authentication required", draft: null };
      }
      
      // Use the user's primary email address
      const userEmail = user.emailAddresses[0]?.emailAddress;
      
      if (!userEmail) {
        return { error: true, message: "User email not found", draft: null };
      }
  
      // Find the form by URL
      const form = await prisma.form.findUnique({
        where: { shareURL: formUrl }
      });
  
      if (!form) {
        return { error: true, message: "Form not found", draft: null };
      }
  
      // Find the draft for this form and user
      const draft = await prisma.formSubmissions.findFirst({
        where: {
          formId: form.id,
          email: userEmail,
          status: 'DRAFT'
        }
      });
  
      return { 
        error: false, 
        draft,
        message: draft ? "Draft loaded successfully" : "No draft found"
      };
    } catch (error) {
      console.error("Error loading draft:", error);
      return { 
        error: true, 
        message: "Failed to load draft", 
        draft: null 
      };
    }
  }


  export const createUserResponse = async (
    formId: string,
    userId: string,
    content: string,
    userEmail: string
  ) => {
    if (!formId || !userId || !content) {
      console.error('Missing required parameters for tracking user response');
      return { error: true, message: 'Missing required parameters' };
    }
  
    try {
      // First, verify the user exists in the database
      let user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });
  
      // If user doesn't exist in our database but we have their email (from Clerk),
      // create the user record first
      if (!user && userEmail) {
        // Try to find by email
        user = await prisma.user.findUnique({
          where: {
            email: userEmail
          }
        });
  
        // If user still not found, we can't proceed
        if (!user) {
          console.error('User not found in database and cannot be created');
          return { 
            error: true, 
            message: 'User not found in database. This is likely because you are using Clerk for authentication and the user data has not been synchronized with your database.' 
          };
        }
      }
  
      // Now create the response with the verified userId
      const response = await prisma.response.create({
        data: {
          formId: parseInt(formId),
          userId: user.id, // Use the verified user ID
          content: content,
        },
      });
  
      return { error: false, response };
    } catch (error) {
      console.error('Error tracking user response:', error);
      return { error: true, message: 'Failed to track user response' };
    }
  };


  export const getUserResponses = async (email: string) => {
    if (!email) {
      return { error: true, message: 'Email is required' };
    }
  
    try {
      // Step 1: First find the user by email to get their UUID
      const user = await prisma.user.findUnique({
        where: {
          email: email
        },
        select: {
          id: true // Select only the id field to keep the query efficient
        }
      });
      
      // If no user found with this email
      if (!user) {
        return { error: true, message: 'User not found with the provided email' };
      }
      
      // Step 2: Now fetch all responses for the user using their UUID
      const responses = await prisma.response.findMany({
        where: {
          userId: user.id // Use the UUID from the user query
        },
        include: {
          // Include form details to provide context for each response
          form: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              createdBy: true,
              expiresAt: true,
              isEditing: true,
              published: true,
              roomType: true,
              shareURL:true,       
FormSubmissions:{
  select:{
    id:true,
    content:true,
    createdAt:true,
    email:true,
    isAnonymous:true,
    status:true,
    feedback:true,
  }, orderBy:{
    createdAt:'desc'
  }
}
            }
          }
        },
        orderBy: {
          // Sort by newest first
          createdAt: 'desc'
        }
      });
  
      return {
        error: false,
        responses,
        count: responses.length
      };
    } catch (error) {
      console.error('Error fetching user responses:', error);
      return { error: true, message: 'Failed to fetch user responses' };
    }
  };


  export const SubmitFormAction = async (
    url: string, 
    JsonContent: string,
    isAnonymous: boolean,
    feedback: string,
    submissionId?: number // Add submissionId parameter for editing
) => {
    const user = await currentUser();

    if (!user) {
        return { message: 'User not found!', error: true };
    }

    try {
        // First, find the form by URL to ensure it exists
        const form = await prisma.form.findUnique({
            where: {
                shareURL: url,
                published: true
            }
        });

        if (!form) {
            return { error: true, message: 'Form not found or not published' };
        }

        // Get the user's real email for identification
        const userEmail = user.emailAddresses[0].emailAddress;

        // If we're editing an existing submission
        if (submissionId) {
            // Verify the submission exists and belongs to this user
            const existingSubmission = await prisma.formSubmissions.findUnique({
                where: {
                    id: submissionId,
                    email: userEmail,
                    formId: form.id
                }
            });

            if (!existingSubmission) {
                return { error: true, message: 'Submission not found or not authorized to edit' };
            }

            // Update the existing submission
            await prisma.formSubmissions.update({
                where: { 
                    id: submissionId 
                },
                data: {
                    content: JsonContent,
                    isAnonymous: isAnonymous,
                    feedback: feedback,
                    lastUpdatedAt: new Date(),
                    isEditing: false // Set editing back to false
                }
            });

            return { error: false, message: 'Submission updated successfully' };
        }

        // Original submission logic for new submissions
        // Check if form allows multiple submissions from the same user
        if (!form.allowMultipleSubmissions) {
            const existingSubmission = await prisma.formSubmissions.findFirst({
                where: {
                    formId: form.id,
                    email: userEmail,
                    status: 'COMPLETED'
                }
            });

            if (existingSubmission) {
                return { error: true, message: 'You have already submitted this form' };
            }
        }

        // Check if form has a max submissions limit
        if (form.maxSubmissions > 0 && form.submissions >= form.maxSubmissions) {
            return { error: true, message: 'This form has reached its maximum submission limit' };
        }

        // Prepare updated form data with atomic operations
        const formData = await prisma.form.update({
            where: {
                id: form.id
            },
            data: {
                submissions: {
                    increment: 1
                }
            }
        });

        // Check for existing draft using the real email
        const existingDraft = await prisma.formSubmissions.findFirst({
            where: {
                formId: form.id,
                email: userEmail, // Use real email to find draft
                status: 'DRAFT'
            }
        });

        // Handle submission (update draft or create new)
        if (existingDraft) {
            await prisma.formSubmissions.update({
                where: { 
                    id: existingDraft.id 
                },
                data: {
                    content: JsonContent,
                    // For anonymous submissions, we keep the real email but mark as anonymous
                    isAnonymous: isAnonymous,
                    feedback: feedback,
                    status: 'COMPLETED',
                    lastUpdatedAt: new Date()
                }
            });
        } else {
            await prisma.formSubmissions.create({
                data: {
                    formId: form.id,
                    content: JsonContent,
                    email: userEmail, // Always store real email
                    isAnonymous: isAnonymous, // But mark if anonymous
                    feedback: feedback,
                    status: 'COMPLETED'
                }
            });
        }

        // Calculate metrics in a separate operation to avoid transaction issues
        await calculateFormMetrics(String(form.id));

        await createUserResponse(String(form.id), user.id, JsonContent, userEmail);
        // todo add responses stuff here to keep track and populate your responses array once youve sent in your response

        return { error: false, formData };
    } catch (error) {
        console.error('Form submission error:', error);
        return { error: true, message: 'Failed to submit form' };
    }
};


//todo find a work around with the anonymous p for now depending on the response ill do some p onthe frontend but yh for the sake of production level find something cooler maybe a bcrypt hash or something

// help build out the responses page. I essentially want to display the responses  in a card, show the form name its description, the author, the roomType, when it was created, whether or not if its published, and the content in the responses, btw use the  getUserResponses in building the page cause, that's the function that we will make use of




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
                    isAnonymous: true,
                    status:true,
                    feedback:true,
                    formId:true,
                }
            }
        },
    });

    return { error: false, formData };
};
 

export const deleteForm = async (id: number) => {
    const user = await currentUser();

    if (!user) {
        return { message: 'User not found!', error: true };
    }

    try {
        // First check if the form exists and belongs to the user
        const form = await prisma.form.findUnique({
            where: {
                id,
                userId: user.id, // Ensure the user owns the form
            },
        });

        if (!form) {
            return { message: 'Form not found or you do not have permission to delete it', error: true };
        }

        // Use a transaction to delete all related data and the form
        await prisma.$transaction(async (prisma) => {
            // Delete form submissions
            await prisma.formSubmissions.deleteMany({
                where: {
                    formId: id,
                },
            });

            // Delete form metrics
            await prisma.formMetrics.deleteMany({
                where: {
                    formId: id,
                },
            });

            // Delete activities related to the form
            await prisma.activity.deleteMany({
                where: {
                    formId: id,
                },
            });

            // Finally delete the form itself
            await prisma.form.delete({
                where: {
                    id,
                    userId: user.id, // Double check user permission
                },
            });
        });

        return { message: 'Form and all associated data deleted successfully!', error: false };
    } catch (error) {
        console.error('Error deleting form:', error);
        return { message: 'Failed to delete form. Please try again.', error: true };
    }
};


export async function getFormActivities(formId: string) {
    try {
      const activities = await prisma.activity.findMany({
        where: { formId: parseInt(formId) }, // Convert string to number
        orderBy: { createdAt: 'desc' },
        // take: 5
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
        console.log(error)
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


  export const updateFormStatus = async (
    formId: number,
    data: {
      isFavorite?: boolean;
      isArchived?: boolean;
      isDeactivated?: boolean;
    }
  ) => {
    const user = await currentUser();
  
    if (!user) {
      return { message: "User not found!", error: true };
    }
  
    try {
      // First check if the form belongs to the user
      const form = await prisma.form.findUnique({
        where: {
          id: formId,
          userId: user.id,
        },
      });
  
      if (!form) {
        return { message: "Form not found or unauthorized", error: true };
      }
  
      // Update the form with the new status
      const updatedForm = await prisma.form.update({
        where: {
          id: formId,
        },
        data: {
          ...data,
          lastUpdatedAt: new Date(),
        },
      });
  
      // Create an activity record for the status change
      let activityType = "";
      if (data.isFavorite !== undefined) {
        activityType = data.isFavorite ? "favorited" : "unfavorited";
      } else if (data.isArchived !== undefined) {
        activityType = data.isArchived ? "archived" : "unarchived";
      } else if (data.isDeactivated !== undefined) {
        activityType = data.isDeactivated ? "deactivated" : "activated";
      }
  
      if (activityType) {
        await prisma.activity.create({
          data: {
            formId: formId,
            type: activityType,
            userId: user.id,
            userName: user.fullName,
          },
        });
      }
  
      return {
        message: "Form status updated successfully",
        error: false,
        form: updatedForm,
      };
    } catch (error) {
      console.error("Error updating form status:", error);
      return { message: "Failed to update form status", error: true };
    }
  };
  
  export const toggleFormFavorite = async (formId: number) => {
    const user = await currentUser();
  
    if (!user) {
      return { message: "User not found!", error: true };
    }
  
    try {
      // Get the current form to check its favorite status
      const form = await prisma.form.findUnique({
        where: {
          id: formId,
          userId: user.id,
        },
        select: {
          isFavorite: true,
        },
      });
  
      if (!form) {
        return { message: "Form not found or unauthorized", error: true };
      }
  
      // Toggle the favorite status
      return await updateFormStatus(formId, { isFavorite: !form.isFavorite });
    } catch (error) {
      console.error("Error toggling form favorite:", error);
      return { message: "Failed to update favorite status", error: true };
    }
  };
  
  export const toggleFormArchived = async (formId: number) => {
    const user = await currentUser();
  
    if (!user) {
      return { message: "User not found!", error: true };
    }
  
    try {
      // Get the current form to check its archived status
      const form = await prisma.form.findUnique({
        where: {
          id: formId,
          userId: user.id,
        },
        select: {
          isArchived: true,
        },
      });
  
      if (!form) {
        return { message: "Form not found or unauthorized", error: true };
      }
  
      // Toggle the archived status
      return await updateFormStatus(formId, { isArchived: !form.isArchived });
    } catch (error) {
      console.error("Error toggling form archived:", error);
      return { message: "Failed to update archived status", error: true };
    }
  };
  
  export const toggleFormDeactivated = async (formId: number) => {
    const user = await currentUser();
  
    if (!user) {
      return { message: "User not found!", error: true };
    }
  
    try {
      // Get the current form to check its deactivated status
      const form = await prisma.form.findUnique({
        where: {
          id: formId,
          userId: user.id,
        },
        select: {
          isDeactivated: true,
        },
      });
  
      if (!form) {
        return { message: "Form not found or unauthorized", error: true };
      }
  
      // Toggle the deactivated status
      return await updateFormStatus(formId, { isDeactivated: !form.isDeactivated });
    } catch (error) {
      console.error("Error toggling form deactivated:", error);
      return { message: "Failed to update deactivated status", error: true };
    }
  };

//   todo create notifications for forms submitted and commented on
 
 


export const getSubmissionById = async (submissionId: number) => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { error: true, message: "User not found", submission: null };
    }
    
    // Get the user's primary email address
    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    if (!userEmail) {
      return { error: true, message: "User email not found", submission: null };
    }

    // Find the submission by ID
    const submission = await prisma.formSubmissions.findUnique({
      where: {
        id: submissionId,
        email: userEmail, // Ensure the submission belongs to this user
        status: 'COMPLETED'
      },
      include: {
        form: {
          select: {
            content: true,
            shareURL: true,
            id: true,
            published: true,
            roomType: true,
            roomCode: true,
            roomCodeSalt: true
          }
        }
      }
    });

    if (!submission) {
      return { error: true, message: "Submission not found", submission: null };
    }

    return { 
      error: false, 
      submission,
      message: "Submission loaded successfully"
    };
  } catch (error) {
    console.error("Error loading submission:", error);
    return { 
      error: true, 
      message: "Failed to load submission", 
      submission: null 
    };
  }
}

export const toggleSubmissionEditing = async (submissionId: number, isEditing: boolean) => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { error: true, message: "User not found" };
    }
    
    // Get the user's primary email address
    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    if (!userEmail) {
      return { error: true, message: "User email not found" };
    }

    // Find and update the submission
    const submission = await prisma.formSubmissions.update({
      where: {
        id: submissionId,
        email: userEmail, // Ensure the submission belongs to this user
      },
      data: {
        isEditing: isEditing
      }
    });

    return { 
      error: false, 
      submission,
      message: isEditing ? "Editing mode enabled" : "Editing mode disabled"
    };
  } catch (error) {
    console.error("Error toggling submission editing state:", error);
    return { 
      error: true, 
      message: "Failed to update submission state"
    };
  }
}
