import React, { useEffect, useRef, useState } from 'react'
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type'
import { CustomInstance, ImageUploadFieldFormElement } from './image-upload-field'
import { Label } from '../../../ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next'
import { LuImagePlus } from 'react-icons/lu'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'
import { Button } from '@/components/ui/button'


export const FormComponent =  ({elementInstance,submitValue,isInvalid,defaultValues}:{elementInstance:FormElementsInstance,submitValue?:SubmitFunction,isInvalid?:boolean,defaultValues?:string}) => {
    const element = elementInstance as CustomInstance
const [value, setValue] = useState(defaultValues||'')
const [error, setError] = useState(false)

useEffect(()=>{
  setError(isInvalid === true)
},[isInvalid])


    const {helperText, label,src,placeholder,imageTypes,isMultiple,maxImages,minImages,required} = element.extraAttributes

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

  const [image, setImage] = useState('') 
  const [isUploading, setIsUploading] = useState(false);

  
  const authenticator = async () => {
    try {
      const { data } = await axios.get("/api/image-upload");
      const { token, expire, signature } = data;
      return { token, expire, signature };
    } catch (error) {
      toast({title:'Error' , description:"Failed to authenticate. Please try again."});
      throw error;
    }
  };

  const onError = (err) => {
    console.log(err)
    toast({title:'Error' , description:"Image uploaded failed."}); 
       setIsUploading(false);
  };
 

  const onUploadProgress = () => setIsUploading(true);
  const onUploadStart = () => {
    toast({
      title:'Success',
      description:'Image upload started'
    })
  };
  
  const ikUploadRef = useRef(null);
  
   
        const onSuccess = (res) => {
          const uploadedImageUrl = res?.filePath;
          setImage(uploadedImageUrl);
          // form.setValue('src', uploadedImageUrl);
          // applyFormChanges({ ...form.getValues(), src: uploadedImageUrl });
          toast({ title: 'Success', description: "Image uploaded successfully." });
          setIsUploading(false);
        };



    const handleBlur = (e) => {
      if (!submitValue) return;
      
      const valid = ImageUploadFieldFormElement.validate(element, e.target.value);
      setError(!valid);
      
      // Trim leading/trailing whitespace
      const trimmedValue = e.target.value.trim();
      if (trimmedValue.length === 0) {
        setError(true);
        return;
      }
      if(!valid) return 

      setValue(trimmedValue);
      submitValue(element.id, trimmedValue);
    };
       
  
       
  
    return (
      <div className='flex flex-col gap-2 w-full p-2.5 '>
      <Label className={cn(error && 'text-red-500', 'font-semibold')}>
        {label}
      </Label>
  
     
{/* add the upload and the other stuff
 */}
 {!isUploading && !image &&( 
  <div 
  className="flex items-center justify-center dark:border-neutral-200 border-neutral-800 border-2 border-dashed rounded-md text-muted-foreground h-full flex-col gap-1 p-1">
  
  <label
              htmlFor="uploadInput"
              className={`cursor-pointer text-center flex flex-col gap-2
                justify-center items-center
                z-50`}
            >



<div className="flex justify-center items-center ">
        

        <Dialog>
    <DialogTrigger>
      <Button className='font-semibold flex items-center gap-2 mt-3 mb-3'>
                  <LuImagePlus
                    size={40}
                    className={`h-6 w-6  ` }
                    />
      Open upload Dialog
      </Button>
      </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
        <div className="flex flex-col gap-2">
  <span className="text-xs">{placeholder}</span>

  {imageTypes.length > 0 ? (
    <div className="flex items-center text-center text-xs w-full p-1 -mt-0.5">
      <div className='text-xs text-muted-foreground'>
        {imageTypes.some((type:string | string[]) => type.includes('image/*')) ? (
          <span>All image types accepted.</span>
        ) : (
          <>
            <span>Accepted image types:</span>
            {imageTypes.map((type:string | string[], index) => (
              <span key={index} className="ml-1">{type},</span>
            ))}
          </>
        )}
      </div>
    </div>
  ) : (
    <span className="text-xs text-muted-foreground">No file type specified.</span>
  )}
</div>
           </DialogTitle>
        <DialogDescription className='flex items-center justify-center'>


           <ImageKitProvider
                      urlEndpoint={urlEndpoint}
                      publicKey={publicKey}
                      authenticator={authenticator}
                    >
          <IKUpload
            fileName="upload.png"
            onError={onError}
            onSuccess={onSuccess}
            onUploadProgress={onUploadProgress}
            onUploadStart={onUploadStart}
            className="hidden"
            id="uploadInput"
            ref={ikUploadRef}
            accept={imageTypes.join(',')} // Accept file types from the array
            multiple={isMultiple}
            max={maxImages}
            min={minImages}
          />
          
          </ImageKitProvider>
  
         
    
    <IKImage
    alt='image'
    path={image}
    urlEndpoint={urlEndpoint}
    className=''
    width={200}
    height={200} 
    /> 
  
  <Button 
   onClick={() => {
    setImage('');
    // form.setValue('src', ''); // Reset the src field
    // applyFormChanges({ ...form.getValues(), src: '' }); 
    }}
  >
    remove
  </Button>
  
   
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  
  
  
  
    </div>



            </label>

</div>
          )}
  
      <div className="flex justify-between">
        {helperText && (
          <p className={cn(error && 'text-red-500', 'text-muted-foreground text-xs')}>
            {helperText}
          </p>
        )}
         
      </div>
  </div>
    )
  }
  

 
 