import React, { useEffect, useRef, useState } from 'react';
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type';
import { CustomInstance, ImageUploadFieldFormElement } from './image-upload-field';
import { Label } from '../../../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import { LuImagePlus } from 'react-icons/lu';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {  ChevronLeft, ChevronRight, Trash, Replace,   ImageUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TbLoader3 } from 'react-icons/tb';

export const FormComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValues
}: {
  elementInstance: FormElementsInstance,
  submitValue?: SubmitFunction,
  isInvalid?: boolean,
  defaultValues?: string
}) => {
  const element = elementInstance as CustomInstance;
  const [images, setImages] = useState<string[]>([]);
  console.log(defaultValues)
  const [error, setError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const ikUploadRef = useRef(null);
  const { helperText, label, placeholder, imageTypes, isMultiple, maxImages, minImages, required } = element.extraAttributes;

  useEffect(() => {
    if (isInvalid === true) {
      setError(true);
    }
  }, [isInvalid]);

  useEffect(() => {
    const valid = ImageUploadFieldFormElement.validate(element, images);
    setError(!valid);
    
    if (valid && submitValue) {
      submitValue(element.id, images);
    }
  }, [images, element, submitValue]);

  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

  const authenticator = async () => {
    try {
      const { data } = await axios.get("/api/image-upload");
      return data;
    } catch (error) {
      toast({ title: 'Error', description: "Failed to authenticate" });
      throw error;
    }
  };

  const onError = (err) => {
    console.error(err);
    toast({ title: 'Error', description: "Upload failed" });
    setIsUploading(false);
  };

  const onUploadProgress = () => setIsUploading(true);
  const onUploadStart = () => {
    toast({
      title: 'Success',
      description: 'Image upload started'
    });
  };


  const onSuccess = (res) => {
    const uploadedImageUrl = res?.filePath;
    setImages(prev => {
      const newImages = isMultiple ? [...prev, uploadedImageUrl] : [uploadedImageUrl];
      return newImages;
    });
    setCurrentImageIndex(isMultiple ? images.length : 0);
    setIsUploading(false);
    toast({ title: 'Success', description: "Upload successful" });
  };

  const removeCurrentImage = () => {
    setImages(prev => prev.filter((_, index) => index !== currentImageIndex));
    setCurrentImageIndex(prev => Math.max(0, prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  console.log("images",images)
  console.log("error",error)
  
  return (
    <div className='flex flex-col gap-2 w-full p-2.5'>
      <Label className={cn(error && 'text-red-500', 'font-semibold')}>
        {label}
        {required && (<span className='text-lg text-red-500 ml-1'>*</span>)}

      </Label>

      <div className="flex items-center justify-center dark:border-neutral-200 border-neutral-800 border-2 border-dashed rounded-md text-muted-foreground h-full flex-col gap-1 p-1">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         {images.length < 1 ? 
          (<DialogTrigger>
            <Button className='font-semibold flex items-center gap-2 mt-3 mb-3'>
              <LuImagePlus size={40} className="h-6 w-6" />
              Open upload Dialog
            </Button>
          </DialogTrigger>)
            : (
              
              <div className="relative w-full flex items-center justify-center">
                    
                      {isMultiple && images.length > 1 && (
                        <Button 
                          variant="outline" 
                          className="absolute -left-4 z-10"
                          onClick={previousImage}
                          size="icon"

                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                      )}
                      
                      <div className="relative">
                        <IKImage
                          alt='uploaded image'
                          path={images[currentImageIndex]}
                          urlEndpoint={urlEndpoint}
                          className='border-none'
                          width={400}
                          height={300}
                        />
                        

                        <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        
                        <div className="absolute bottom-[41%] right-[45%] flex gap-2 opacity-0 hover:opacity-100 ">
                          <Button 
                            size="icon"
                            onClick={()=>{
                              setIsDialogOpen(true)
                            }}
                            className='rounded-full'
                            variant='secondary'
                          >
              <ImageUp className='h-6 w-6' />
              </Button>
                        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
         Open upload dialog
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>


                        <div className="absolute bottom-2 right-2 flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={removeCurrentImage}
                          >
                            <Trash className='w-8 h-8'/>
                          </Button>
                        </div>
                      </div>

                      {isMultiple && images.length > 1 && (
                        <Button 
                          variant="outline" 
                          className="absolute -right-4 z-10"
                          onClick={nextImage}
                          size="icon"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
            )}




          <DialogContent className="w-[85%]">
            <DialogHeader>
              <DialogTitle>
                <div className="flex flex-col gap-2">
                  <span className="text-xs">{placeholder}</span>
                  <div className="flex items-center text-center text-xs w-full p-1 -mt-0.5">
                    <div className='text-xs text-muted-foreground'>
                      {imageTypes.length > 0 ? (
                        imageTypes.some((type: string | string[]) => type.includes('image/*')) 
                          ? <span>All image types accepted.</span>
                          : <>
                              <span>Accepted image types:</span>
                              {imageTypes.map((type: string | string[], index) => (
                                <span key={index} className="ml-1">{type},</span>
                              ))}
                            </>
                      ) : (
                        <span className="text-xs text-muted-foreground">No file type specified.</span>
                      )}
                    </div>
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>
                <div className="flex flex-col items-center justify-center gap-4">
                  <ImageKitProvider
                    urlEndpoint={urlEndpoint}
                    publicKey={publicKey}
                    authenticator={authenticator}
                  >
                    <IKUpload
                      fileName="upload.png"
                      onError={onError}
                      onSuccess={ onSuccess }
                      onUploadProgress={onUploadProgress}
                      onUploadStart={onUploadStart}
                      className="hidden"
                      id="uploadInput"
                      ref={ikUploadRef}
                      accept={imageTypes.join(',')}
                      multiple={isMultiple}
                      max={maxImages}
                      min={minImages}
                      />
                  </ImageKitProvider>

                  {/* Image Gallery */}
                  {images.length > 0 && (
                    <div className="relative w-full flex items-center justify-center">
                    
                      {isMultiple && images.length > 1 && (
                        <Button 
                          variant="outline" 
                          className="absolute -left-4 z-10"
                          onClick={previousImage}
                          size="icon"

                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                      )}
                      
                      <div className="relative">
                        <IKImage
                          alt='uploaded image'
                          path={images[currentImageIndex]}
                          urlEndpoint={urlEndpoint}
                          className='border-none'
                          width={400}
                          height={300}
                        />

                        
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={removeCurrentImage}
                          >
                            <Trash className='w-8 h-8'/>
                          </Button>
                        </div>
                      </div>

                      {isMultiple && images.length > 1 && (
                        <Button 
                          variant="outline" 
                          className="absolute -right-4 z-10"
                          onClick={nextImage}
                          size="icon"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
                  )}


{/* rewrite this code and reposition it conditionally */}

{(!maxImages || images.length < maxImages) && (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="cursor-pointer text-center flex flex-col gap-2 justify-center items-center z-50"
          onClick={() => {
            const uploadInput = document.getElementById('uploadInput');
            if (uploadInput) {
              uploadInput.click();
            }
          }}
        >
          {!isMultiple && images.length === 1 ? (
            <div className='p-3 border-2 text-muted-foreground hover:text-white rounded-full'>
              <Replace className='h-6 w-6'/> 
            </div>
          ) : (
            <div className={cn('p-2 border-2 text-muted-foreground hover:text-neutral-800 dark:hover:text-white rounded-full hover:border-neutral-800 dark:hover:border-white', isMultiple && images.length > 1 && 'absolute right-5 top-[11%] p-1.5')}>
              {isUploading ?(
                <TbLoader3 className='animate-spin h-5 w-5' />
              ):(

                <ImageUp className={cn('h-5 w-5',isMultiple && images.length > 1 && 'h-4 w-4')} />
              )}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {!isMultiple && images.length === 1 
            ? 'Click to replace image' 
            : 'Click to upload image'
          }
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)}



                  {isMultiple   && (
                    <div className="text-sm text-muted-foreground">
                      Image {images.length >= 1 ? currentImageIndex + 1 : 0} of {images.length}
                      {maxImages && ` (Min: ${minImages}, Max: ${maxImages})`}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between">
        {helperText && (
          <p className={cn(error && 'text-red-500', 'text-muted-foreground text-xs')}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};