"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TbLoader3 } from "react-icons/tb";
import { LuFileEdit } from "react-icons/lu";
import { HiOutlineSaveAs } from "react-icons/hi";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "@/lib/form-schema";
import { formSchemaType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { generateForm } from "@/actions/form";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch"; // Add this
import { Calendar } from "@/components/ui/calendar"; // Add this
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Add this
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Add this
import { CalendarIcon } from "lucide-react"; // Add this

type ResponseTypes ={
    error:boolean,
    message:string,
    formID?:string | number | undefined
}

export const CreateFormButton = ({isOpen}:{
  isOpen?:boolean
}) => {

    const router = useRouter()

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      maxSubmissions: 0,
      allowMultipleSubmissions: false,
      expiresAt: null,
  },
  });

  const onSubmit =async (values: formSchemaType) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(values);
try {
    const {error,message,formID} :ResponseTypes = await generateForm(values);
    
    if (error) {
      return toast({
        title: 'Error',
        description: message,
      });
    }else{
        toast({
          title: 'Success',
          description: message,
        })
         setTimeout(() => {
          form.reset({
            name: '',
            description: '',
            maxSubmissions: 0,
            allowMultipleSubmissions: false,
            expiresAt: null
        });

              router.push(`/dashboard/form-builder/${formID}`)
        }, 1000);
    }


} catch (error) {
    console.error(error)
    toast({
        title:'Error',
description:'An error has occurred, please try again.'
    })
}

};

  return (
<Dialog>
<DialogTrigger asChild>
<Button variant="secondary" className="flex items-center gap-3">
  {isOpen ? (
  <>
    <LuFileEdit className="dark:text-white" />
    Create a new form
  </>
  ) : (
    <LuFileEdit className="dark:text-white" />
  )}
</Button>
</DialogTrigger>
<DialogContent className="sm:max-w-[425px]">
<DialogHeader>
<DialogTitle>Create a Form</DialogTitle>
</DialogHeader>

<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
{/* Existing name and description fields ... */}

         <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Character count: {field.value?.length || 0}/40
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
control={form.control}
name="maxSubmissions"
render={({ field }) => (
<FormItem>
    <FormLabel>Maximum Submissions</FormLabel>
    <FormControl>
        <Input 
            type="number" 
            {...field} 
            onChange={e => field.onChange(Number(e.target.value))}
            min={0}
        />
    </FormControl>
    <FormDescription>
        Set to 0 for unlimited submissions
    </FormDescription>
    <FormMessage />
</FormItem>
)}
/>

<FormField
control={form.control}
name="allowMultipleSubmissions"
render={({ field }) => (
<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
    <div className="space-y-0.5">
        <FormLabel className="text-base">
            Allow Multiple Submissions
        </FormLabel>
        <FormDescription>
            Let users submit the form multiple times
        </FormDescription>
    </div>
    <FormControl>
        <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
        />
    </FormControl>
</FormItem>
)}
/>

<FormField
control={form.control}
name="expiresAt"
render={({ field }) => (
<FormItem className="flex flex-col">
    <FormLabel>Expiry Date</FormLabel>
    <Popover>
        <PopoverTrigger asChild>
            <FormControl>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                    )}
                >
                    {field.value ? (
                        format(field.value, "PPP")
                    ) : (
                        <span>No expiration date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                mode="single"
                selected={field.value || undefined}
                onSelect={field.onChange}
                disabled={(date) =>
                    date < new Date()
                }
                initialFocus
            />
        </PopoverContent>
    </Popover>
    <FormDescription>
        Set a date when the form will automatically close
    </FormDescription>
    <FormMessage />
</FormItem>
)}
/>

<DialogFooter>
<Button
className="w-full mt-1"
disabled={form.formState.isSubmitting}
type="submit"
>
{form.formState.isSubmitting && (
    <TbLoader3 className="animate-spin" size={28} />
)}
{!form.formState.isSubmitting && (
    <p className="font-semibold text-base flex items-center gap-2">
      <HiOutlineSaveAs size={33}/>
       Create</p>
)}
</Button>
</DialogFooter>
</form>
</Form>
</DialogContent>
</Dialog>

);
};
