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
import { CirclePlus, ChevronLeft, ChevronRight, Trash } from 'lucide-react';

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
  const [value, setValue] = useState(defaultValues || '');
  const [error, setError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { helperText, label, placeholder, imageTypes, isMultiple, maxImages, minImages, required } = element.extraAttributes;

  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

  const authenticator = async () => {
    try {
      const { data } = await axios.get("/api/image-upload");
      const { token, expire, signature } = data;
      return { token, expire, signature };
    } catch (error) {
      toast({ title: 'Error', description: "Failed to authenticate. Please try again." });
      throw error;
    }
  };

  const onError = (err) => {
    console.log(err);
    toast({ title: 'Error', description: "Image upload failed." });
    setIsUploading(false);
  };

  const onUploadProgress = () => setIsUploading(true);
  const onUploadStart = () => {
    toast({
      title: 'Success',
      description: 'Image upload started'
    });
  };

  const ikUploadRef = useRef(null);

  const onSuccess = (res) => {
    const uploadedImageUrl = res?.filePath;
    // If not multiple, replace the existing image
    if (!isMultiple) {
      setImages([uploadedImageUrl]);
      setCurrentImageIndex(0);
    } else {
      setImages(prev => [...prev, uploadedImageUrl]);
    }
    toast({ title: 'Success', description: "Image uploaded successfully." });
    setIsUploading(false);
  };

  const handleBlur = (e) => {
    if (!submitValue) return;
    
    const valid = ImageUploadFieldFormElement.validate(element, e.target.value);
    setError(!valid);
    
    const trimmedValue = e.target.value.trim();
    if (trimmedValue.length === 0) {
      setError(true);
      return;
    }
    if (!valid) return;

    setValue(trimmedValue);
    submitValue(element.id, trimmedValue);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const removeCurrentImage = () => {
    const newImages = images.filter((_, index) => index !== currentImageIndex);
    setImages(newImages);
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  return (
    <div className='flex flex-col gap-2 w-full p-2.5'>
      <Label className={cn(error && 'text-red-500', 'font-semibold')}>
        {label}
      </Label>

      <div className="flex items-center justify-center dark:border-neutral-200 border-neutral-800 border-2 border-dashed rounded-md text-muted-foreground h-full flex-col gap-1 p-1">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className='font-semibold flex items-center gap-2 mt-3 mb-3'>
              <LuImagePlus size={40} className="h-6 w-6" />
              Open upload Dialog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
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
                      onSuccess={onSuccess}
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
                      {/* Only show navigation arrows if multiple images are allowed and there are multiple images */}
                      {isMultiple && images.length > 1 && (
                        <Button 
                          variant="outline" 
                          className="absolute left-0 z-10"
                          onClick={previousImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
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
                          className="absolute right-0 z-10"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}


{/* rewrite this code and reposition it conditionally */}

                  {(!maxImages || images.length < maxImages) && (
                    <label
                      htmlFor="uploadInput"
                      className="cursor-pointer text-center flex flex-col gap-2 justify-center items-center z-50"
                    >
                      <CirclePlus className='h-8 w-8' />
                      <span className="text-sm">
                        {!isMultiple &&  images.length === 1 ? 'Replace image' : `Add ${images.length > 0 ? 'another' : 'an'} image`}
                      </span>
                    </label>
                  )}




                  {isMultiple && images.length > 1 && (
                    <div className="text-sm text-muted-foreground">
                      Image {currentImageIndex + 1} of {images.length}
                      {maxImages && ` (Max: ${maxImages})`}
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