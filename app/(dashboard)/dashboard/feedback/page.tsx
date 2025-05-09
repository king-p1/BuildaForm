
import { getFormTableData, getUserForms } from '@/actions/form'
import { FeedbackPageClient } from './feedback-client'


// This needs to be a Server Component to fetch the initial data
const FeedbackPageServer = async () => {
  // Fetch all user forms
  const { formData: userForms } = await getUserForms()
  
  if (!userForms || userForms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold">No forms found</h2>
        <p className="text-gray-500">Create a form to start collecting feedback</p>
      </div>
    )
  }

  // Fetch all feedback data upfront
  const allFeedback = await Promise.all(
    userForms.map(async (form) => {
      const { formData } = await getFormTableData(form.id)
      if (!formData) return []
      
      // Map submissions to include the form name
      return formData.FormSubmissions.map(submission => ({
        ...submission,
        formName: formData.name || "Unnamed form",
        formId: formData.id,
        published: form.published || false
      }))
    })
  )
  
  // Flatten the array of arrays
  const flattenedFeedback = allFeedback.flat()

  // Pass the data to the client component
  return <FeedbackPageClient initialFeedback={flattenedFeedback} userForms={userForms} />
}
 


export default FeedbackPageServer