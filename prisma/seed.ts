"use server"

// import { formSchema } from "@/lib/form-schema"
import prisma from "../lib/prisma"
// import { formSchemaType } from "@/lib/types"
// import { currentUser } from "@clerk/nextjs/server"
async function seedActivities() {
  const forms = await prisma.form.findMany();
  
  for (const form of forms) {
    await prisma.activity.createMany({
      data: [
        {
          formId: form.id,
          type: 'submission',
          userName: 'John Doe',
          createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
        },
        {
          formId: form.id,
          type: 'comment',
          userName: 'Jane Smith',
          createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
        },
        {
          formId: form.id,
          type: 'visit',
          createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
        }
      ]
    });

    await prisma.formMetrics.create({
      data: {
        formId: form.id,
        avgResponseTime: 2.3,
        completionRate: 78,
        bounceRate: 22
      }
    });
  }
}

// Add to your main seed function
async function main() {
  // ... existing seed code ...
  await seedActivities();
} 

main()