 
import { getFormTableData } from "@/actions/form"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { ElementsType, FormElementsInstance } from "../sidebar-form-values/form-elemts-type"
import { Row } from '@/lib/types'
import { formatDistance } from "date-fns"
import { RowCell } from "./row-cell"
import { StatusIndicator } from "./status-indicator"
import { EmailVisibilityToggle } from "./email-visibilty"

export const SubmissionsTable = async({ id }: { id: number }) => {
  const { formData } = await getFormTableData(id)

  if (!formData) {
    toast({
      title: 'Error',
      description: 'Form data not found.'
    })
    return null
  }

  const formElements = formData?.content ? JSON.parse(formData.content) as FormElementsInstance[] : []

  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []

  formElements.forEach(element => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "CheckboxField":
      case "SelectField":
      case "ImageUploadField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type
        })
        break

      default:
        break
    }
  })

  type SubmissionData = {
    content: string;
    createdAt: Date;
    email: string;
    isAnonymous: boolean;
    status: string;
    feedback?: string;
  }

  const rows: (Row & { isAnonymous: boolean; status: string; })[] = []

  formData?.FormSubmissions.forEach((submission: SubmissionData) => {
    const content = JSON.parse(submission.content)
    rows.push({
      ...content,
      submittedAt: new Date(submission.createdAt),
      email: submission.email,
      isAnonymous: submission.isAnonymous,
      status: submission.status || 'PENDING'
    });
  })

  // Sort rows by submittedAt in descending order (most recent first)
  const sortedRows = [...rows].sort((a, b) => 
    b.submittedAt.getTime() - a.submittedAt.getTime()
  );

  return (
    <div className="p-4 -mt-10">
      <h1 className="text-2xl font-semibold">
        Submissions Table
      </h1>

      <Table className="mt-6 ">
        <TableCaption>All Form Submissions</TableCaption>
        <TableHeader className="border-t">
          <TableRow>
            <TableHead>Status</TableHead>
            {columns.map(({ label, id }) => (
              <TableHead key={id}>{label}</TableHead>
            ))}
            <TableHead>Submitted At</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b">
          {sortedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <StatusIndicator status={row.status} />
              </TableCell>
              {columns.map((column) => (
                <RowCell
                  key={column.id}
                  type={column.type}
                  value={row[column.id]}
                />
              ))}
              <TableCell>
                {formatDistance(row.submittedAt, new Date(), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <EmailVisibilityToggle 
                  email={row.email} 
                  isAnonymous={row.isAnonymous} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}