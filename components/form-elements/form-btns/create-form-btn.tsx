"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TbLoader3 } from "react-icons/tb";
import { LuFileEdit } from "react-icons/lu";
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

type ResponseTypes ={
    error:boolean,
    message:string,
    formID?:string | number | undefined
}

export const CreateFormButton = () => {

    const router = useRouter()

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
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
        // todo remove the log below
        setTimeout(() => {
            form.reset({
                name: '',
                description: ''
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
          <LuFileEdit className="dark:text-white" />
          Create a new form
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Form</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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

            <DialogFooter>
              <Button
                className="w-full mt-3"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <TbLoader3 className="animate-spin" size={28} />
                )}
                {!form.formState.isSubmitting && (
                  <p className="font-semibold text-base">Save</p>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
