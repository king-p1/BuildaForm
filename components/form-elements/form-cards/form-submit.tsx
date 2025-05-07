
"use client"
import React, { useCallback, useRef, useState, useTransition, useEffect } from 'react'
import { FormElements, FormElementsInstance } from '../sidebar-form-values/form-elemts-type'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { TbLoader3 } from 'react-icons/tb'
import { createActivity, getUserForms, SubmitFormAction, saveDraft, loadDraft } from '@/actions/form'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import draftError from '@/public/draft-form-error.png'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, EyeOff, MessageSquareText, Newspaper, Send } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RxUpdate } from "react-icons/rx";
import { Textarea } from "@/components/ui/textarea"

export const FormSubmitComponent = ({content, url, formId, isPublished}: {
    url: string,
    formId: string,
    isPublished: boolean,
    content: FormElementsInstance[]
}) => {

  const [formValues, setFormValues] = useState<{[key: string]: string}>({});
  const formErrors = useRef<{[key: string]: boolean}>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [loading, startTransition] = useTransition();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftLoadAttempted, setDraftLoadAttempted] = useState(false);
  const {user, isLoaded: userLoaded} = useUser();

  // Debounced values for auto-saving
  const debouncedValues = useDebounce(formValues, 1000);
  const debouncedIsAnonymous = useDebounce(isAnonymous, 1000);
  const debouncedFeedback = useDebounce(feedback, 1000);

  // Track visits
  useEffect(() => {
    const trackVisit = async () => {
      if (!formId) return;
      
      try {
        await createActivity(
          formId,
          'visit',
          user?.id,
          user?.fullName as string,
        );
      } catch (error) {
        console.error('Visit tracking failed:', error);
      }
    };
    
    const trackComment= async () => {
      if (!formId) return;
      
      try {
        await createActivity(
          formId,
          'comment',
          user?.id,
          user?.fullName as string,
        );
      } catch (error) {
        console.error('comment tracking failed:', error);
      }
    };

    if (formId && user) {
      trackVisit();
      setStartTime(new Date());
    }

    if (formId && user && debouncedFeedback ) {
      trackComment();
    }
  }, [formId, user,debouncedFeedback]);
     
  // Load draft when user is available
  useEffect(() => {
    const fetchDraft = async () => {
      if (!user || !url || draftLoadAttempted) return;
      
      setDraftLoadAttempted(true);
      
      try {
       
        const result = await loadDraft(url);
        
        if (!result.error && result.draft) {
          // Parse the content from the draft
          const draftContent = result.draft.content ? JSON.parse(result.draft.content) : {};
         
          
          setFormValues(draftContent);
          setIsAnonymous(result.draft.isAnonymous || false);
          setFeedback(result.draft.feedback || "");
          
          // Force re-render of form elements with the loaded values
          setRenderKey(new Date().getTime());
          
          toast({
            title: 'Draft Loaded',
            description: 'Your previously saved draft has been loaded.',
            variant: 'default'
          });
        } else {
          console.log('No draft found or failed to load draft:', result.message);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      } finally {
        setIsDraftLoaded(true);
      }
    };
    
    if (userLoaded && user) {
      fetchDraft();
    } else if (userLoaded && !user) {
      // If user is not logged in, we still need to set isDraftLoaded to true
      setIsDraftLoaded(true);
    }
  }, [user, userLoaded, url, draftLoadAttempted]);

  // Auto-save draft when debounced values change
  useEffect(() => {
    // Skip initial renders and when no changes have been made
    if (!user || !isDraftLoaded) return;
    
    // Only save if we have some values to save or other important data has changed
    const hasContent = Object.keys(debouncedValues).length > 0 || debouncedFeedback.trim().length > 0;
    
    if (!hasContent && !debouncedIsAnonymous) return;
    
    const saveDraftData = async () => {
      setIsSaving(true);
      
      try {
        ;
        await saveDraft(
          url, 
          JSON.stringify(debouncedValues), 
          debouncedIsAnonymous, 
          debouncedFeedback
        );
        
    
      } catch (error) {
        console.error('Failed to save draft:', error);
        toast({
          title: 'Warning',
          description: 'Failed to save draft. Your progress may not be saved.',
          variant: 'destructive'
        });
      } finally {
        setIsSaving(false);
      }
    };
    
    saveDraftData();
  }, [debouncedValues, debouncedIsAnonymous, debouncedFeedback, url, isDraftLoaded, user]);
 
  // Validate form fields
  const validateForm = useCallback(() => {
    formErrors.current = {}; // Reset errors first
    
    for (const field of content) {
      const actualVal = formValues[field.id] || '';
      const valid = FormElements[field.type].validate(field, actualVal);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    return Object.keys(formErrors.current).length === 0;
  }, [content, formValues]);

  // Update form values when a field changes
  const submitValue = useCallback((key: string, value: string | string[]) => {
    setFormValues(prev => {
      const newValues = {
        ...prev,
        [key]: value
      };
      console.log('Updated form values:', newValues);
      return newValues;
    });
  }, []);


  const submitForm = async () => {
    const validForm = validateForm();

    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: 'Error',
        description: 'Some errors have been detected in your response.'
      });
      return;
    }

    try {
      const processedValues = Object.entries(formValues).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value.join(',') : value;
        return acc;
      }, {} as Record<string, string>);

      const JsonContent = JSON.stringify(processedValues);
      
      const {error, message} = await SubmitFormAction(
        url, 
        JsonContent, 
        isAnonymous, 
        feedback
      );
      
      if (error === false) {
        // Record submission activity
        if (formId) {
          await createActivity(
            formId,
            'submission',
            user?.id,
            user?.fullName as string
          );
        }

        setSubmitted(true);
        toast({
          title: 'Success',
          description: 'Form submitted successfully.'
        });
      } else {
        throw new Error(message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred during submission.'
      });
    }
  };

  // Show error if form is not published
  if (isPublished === false) {
    return (
      <div className='h-[65vh] w-full flex flex-col items-center justify-center gap-5'>
        <Image
          src={draftError}
          alt="Draft Error"
          width={500}
          height={500}
          className='-mt-24'
        />

        <h2 className='text-3xl'>This form is not live, please check back later.</h2>

        <Button asChild variant={'link'} className='text-2xl group'>
          <Link href={'/'} className='text-2xl flex items-center gap-3'>
            <ArrowLeft className='size-8 transform transition-transform duration-300 group-hover:-translate-x-1'/>
            Return Home
          </Link>
        </Button>
      </div>
    );
  }

  // Show success message after submission
  if (submitted) {
    return (
      <div className='h-[80vh] w-full flex items-center justify-center motion-preset-expand'>
        <Card className='w-[450px] flex flex-col gap-3 border-2 shadow-lg border-emerald-300 p-3'>
          <CardHeader>
            <CardTitle className='text-center p-2 font-semibold text-2xl'>
            <div className="flex justify-center">
            <div className="rounded-full bg-white border border-emerald-100 dark:border-emerald-200 mb-2 p-2 shadow-md motion-safe:animate-bounce">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
          </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-neutral-100 mb-2">
             Form Submission Successful!
            </h2>
            <p className="text-gray-600 text-center dark:text-gray-400 mb-4 text-muted-foreground text-lg">
              Thank you for your submission.
            </p>
            </CardTitle>
          </CardHeader>
          <div className='border-t-2 -mt-10 mx-3'/>
          <CardContent className='p-4 text-center flex flex-col items-center justify-center'>
          <div className="bg-emerald-50 dark:bg-emerald-100 rounded-lg p-3 mb-4 border-2 border-emerald-100 dark:border-emerald-200">
              <p className="text-sm text-gray-600 text-center">
                Confirmation #: <span className="font-mono font-semibold">TRN-{Math.floor(100000 + Math.random() * 900000)}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">

              <Button asChild>
<Link href="/dashboard" className="flex gap-2 items-center">
<ArrowLeft size={16} />
Return to Form
</Link>
</Button>
    
              <Button 
              variant={'secondary'}
              onClick={()=>{
                window.location.reload()
              }}
              >
 
<Newspaper size={16} />
New Submission
</Button>

               
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isDraftLoaded && user && userLoaded) {
    return (
      <div className='h-[80vh] w-full flex  items-center justify-center'>
        <Card className='w-[300px] h-[145px] border-2 p-3 shadow-md'>
          <CardContent className='p-4 text-center flex flex-col items-center justify-center gap-4'>
            <TbLoader3 size={40} className='animate-spin'/>
            <p>Loading your saved draft<span className='animate-pulse'>
              ...
              </span>
              </p>
          </CardContent>
        </Card>
      </div>
    );
  }

   
  return (
    <div className='h-full w-full items-center flex justify-center p-8'>
      <div key={renderKey} className="flex flex-col max-w-[625px] flex-grow gap-4 bg-background w-full p-8 overflow-y-auto shadow-xl rounded-lg border-2">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="text-sm text-muted-foreground">
            {isSaving && (
              <div className="flex text-emerald-500 items-center gap-2">
              <RxUpdate className='animate-spin text-emerald-500 size-5' />
              Saving...
              </div>
              )}
          </div>
          
          <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
           
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle to submit anonymously. Your responses will not be linked to your account.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
              <Switch
                id="anonymous-mode"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
            
            
          </div>
        </div>

        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement 
              key={element.id} 
              elementInstance={element} 
              submitValue={submitValue} 
              isInvalid={formErrors.current[element.id]}
              defaultValues={formValues[element.id]}
            />
          );
        })}

  <Dialog>
<TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
        <div className="flex w-full justify-end">

          <Button
            variant="secondary"
            className="-mt-2 w-12"
            size="sm"
          >
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </Button>
</div>
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipContent  side='right' sideOffset={10}>
        
          Leave your feedback.
      </TooltipContent>
    </Tooltip>
        </TooltipProvider>

    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Share Your Feedback</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Textarea
          placeholder="Tell us about your experience with this form..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
          rows={5}
          cols={8}
        />
      </div>
    </DialogContent>
  </Dialog>

        <Button 
          className='mt-1'
          onClick={() => {
            startTransition(submitForm);
          }}
          disabled={loading}
        >
          {loading ? (
            <TbLoader3 size={26} className='animate-spin text-white dark:text-black'/>
          ) : (
            <span className='flex gap-2 font-semibold items-center'>
              <Send size={35}  />
              Submit
            </span>
          )}
        </Button>

       
      </div>
    </div>


  );
}