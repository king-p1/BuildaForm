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
import {Row} from '@/lib/types'
import { format, formatDistance } from "date-fns"
import { RowCell } from "./row-cell"







export const SubmissionsTable = async({id}:{id:number}) => {

const {formData} = await getFormTableData(id)

if(!formData){
  toast({
title:'Error',description:'Form data not found.'
  })
}

const formElements = formData?.content ? JSON.parse(formData.content) as FormElementsInstance[] : []

const columns :{
  id:string 
  label:string
  required:boolean 
  type:ElementsType
}[] =[]

formElements.forEach(element => {
  switch(element.type){
    case"TextField":
    case"NumberField":
    case"TextAreaField":
    case"DateField":
    case"CheckboxField":
    case"SelectField":
    case"ImageUploadField":
    case"FileUploadField":
    columns.push({
id:element.id,
label:element.extraAttributes?.label,
required:element.extraAttributes?.required,
type:element.type
    })
    break

    default:
      break
  }
})

const rows:Row[] = []

formData?.FormSubmissions.forEach((submission: { content: string; createdAt: Date; email:string })=>{
  const content = JSON.parse(submission.content)
  rows.push({
    ...content,
    submittedAt: submission.createdAt,
    email: submission.email,  
});
})

  return (
    <div className="p-4 -mt-10">
      <h1 className="text-2xl font-semibold">
      Submissions Table
      </h1>

      <Table className="mt-6 border-2  ">
      <TableCaption>All Form Submissions</TableCaption>
      <TableHeader className="">
        <TableRow className="">
          {columns. map(({label,id})=>(
            <TableHead className="" key={id}>{label}</TableHead>
          ))}
          <TableHead>Submitted At</TableHead>
          <TableHead>User</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
         {rows.map((row,index)=>(
        <TableRow key={index}>
{columns.map((column)=>(
  <RowCell
  key={column.id}
  type={column.type}
  value={row[column.id]}
  />
))}

          <TableCell className="">
            {formatDistance(row.submittedAt,new Date(),{addSuffix:true})}
          </TableCell>
          <TableCell className="">{row.email}</TableCell>  
          </TableRow>
         ))}
      </TableBody>


 
    </Table>


      </div>
  )
}
