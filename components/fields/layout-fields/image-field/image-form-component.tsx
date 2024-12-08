/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type';
import { CustomInstance } from './image-field';
import { Label } from '../../../ui/label';
import { cn } from '@/lib/utils';
import { IKImage } from 'imagekitio-next';
import { Download } from 'lucide-react'; // You can use any icon library for the download icon
import { Button } from '@/components/ui/button';

export const FormComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValues,
}: {
  elementInstance: FormElementsInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValues?: string;
}) => {
  const element = elementInstance as CustomInstance;
  const [value, setValue] = useState(defaultValues || '');
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { helperText, label, src, width, height } = element.extraAttributes;

  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

 
  const downloadImage = async () => {
    try {
      // Construct the full URL of the image
      const fullImageUrl = `${urlEndpoint}/${src}`;
  
      // Fetch the image as a blob
      const response = await fetch(fullImageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the image');
      }
      const blob = await response.blob();
  
      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(blob);
  
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'image.png'; // Set the desired filename
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  return (
    <div>
      {label && <Label>{label}</Label>}
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      <div className="relative group w-fit">
        <IKImage
          path={src}
          width={width}
          height={height}
          urlEndpoint={urlEndpoint}
          alt={label || 'Uploaded Image'}
          className="rounded shadow-md"
        />
        <Button
        size='icon'
          onClick={downloadImage}
          variant='secondary'
          className="absolute right-0   flex items-center justify-center   opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Download className="  w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};
