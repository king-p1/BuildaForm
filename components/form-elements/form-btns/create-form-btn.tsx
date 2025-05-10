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
import { CalendarIcon, RefreshCw } from "lucide-react"; // Add this
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { generateRoomCode } from "@/lib/room-code";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

type ResponseTypes ={
    error:boolean,
    message:string,
    formID?:string | number | undefined
}

export const CreateFormButton = ({isOpen}:{
  isOpen?:boolean
}) => {

    const router = useRouter()
    const [showRoomCode, setShowRoomCode] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [useCustomCode, setUseCustomCode] = useState(false);
    const [customCode, setCustomCode] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

  

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      maxSubmissions: 0,
      allowMultipleSubmissions: false,
      expiresAt: null,
      roomType: "PUBLIC",
      roomCode: "",
  },
  });

  const roomType = form.watch("roomType")


  const generateRandomCode = useCallback(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    form.setValue("roomCode", code);
  },[form]);

  // Generate initial random code when switching to private
  useEffect(() => {
    if (roomType === "PRIVATE" && !generatedCode && !useCustomCode) {
      generateRandomCode();
    }
  }, [roomType, generatedCode, useCustomCode,generateRandomCode]);

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setCustomCode(value);
    form.setValue("roomCode", value);
  };



  const onSubmit = async (values: formSchemaType) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    try {
      // Generate hashed code if form is private
      let roomCodeData = null;
      if (values.roomType === "PRIVATE" && values.roomCode) {
        roomCodeData = generateRoomCode();
      }

      const {error, message, formID} = await generateForm({
        ...values,
        roomCode: roomCodeData?.hashedCode,
        roomCodeSalt: roomCodeData?.salt,
      });
      
      if (error) {
         toast({
          title: 'Error',
          description: message,
        });
        return
      }

      toast({
        title: 'Success',
        description: message,
      });

      setTimeout(() => {
        form.reset({
          name: '',
          description: '',
          maxSubmissions: 0,
          allowMultipleSubmissions: false,
          expiresAt: null,
          roomType: "PUBLIC",
          roomCode: "",
        });
        setGeneratedCode(null);
        setIsDialogOpen(false)
        router.push(`/dashboard/form-builder/${formID}`);
      }, 1000);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error has occurred, please try again.'
      });
    }
  };

  return (
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
<DialogContent  className="max-w-2xl custom-scrollbar max-h-[90vh] overflow-y-auto">
<DialogHeader>
<DialogTitle>Create a Form</DialogTitle>
</DialogHeader>

<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
{/* Existing name and description fields ... */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4"> 

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
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Access</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select form access type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === "PRIVATE" 
                      ? "Only users with the access code can view and submit this form"
                      : "Anyone with the link can view and submit this form"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <div className="space-y-4">

{roomType === "PRIVATE" && (
        <FormField
          control={form.control}
          name="roomCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Code</FormLabel>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-custom-code"
                    checked={useCustomCode}
                    onCheckedChange={(checked) => {
                      setUseCustomCode(checked);
                      if (!checked) {
                        generateRandomCode();
                      } else {
                        setCustomCode("");
                        form.setValue("roomCode", "");
                      }
                    }}
                  />
                  <Label htmlFor="use-custom-code">Use custom code</Label>
                </div>

                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type={showRoomCode ? "text" : "password"}
                      value={useCustomCode ? customCode : field.value}
                      onChange={useCustomCode ? handleCustomCodeChange : undefined}
                      readOnly={!useCustomCode}
                      placeholder="Enter 4-digit code"
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </FormControl>
                  {!useCustomCode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateRandomCode}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowRoomCode(!showRoomCode)}
                  >
                    {showRoomCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <FormDescription>
                  {useCustomCode 
                    ? "Enter your custom 4-digit access code"
                    : "This code will be required to access your form"}
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      )}

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
</div>
</div>

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
