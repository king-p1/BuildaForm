/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FormElementsInstance, SubmitFunction } from '../../../form-elements/sidebar-form-values/form-elemts-type';
import { CustomInstance } from './link-field';
import { Label } from '../../../ui/label';
import { cn } from '@/lib/utils';
import { IKImage } from 'imagekitio-next';
import { Download } from 'lucide-react'; // You can use any icon library for the download icon
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

  const { text,bgColor,color,helperText,href,label,padding,size,width} = element.extraAttributes;

  
  
  return (
    <div className='flex flex-col gap-2 w-full'>
    <Label className='font-semibold'>
    {label}
    </Label>
    <Link href={href} 
   style={{
    color:color,
    backgroundColor:bgColor
  }}
    className={` text-neutral-900 text-[${size}px] w-[${width}px] `}>{text}</Link>


    <div className="flex justify-between">

    {helperText && (<p className='text-muted-foreground text-xs'>{helperText}</p>)}
    
    </div>
    </div>
  );
};
