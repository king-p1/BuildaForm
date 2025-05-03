/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  FormElementsInstance,
  SubmitFunction,
} from "../../../form-elements/sidebar-form-values/form-elemts-type";
import { CustomInstance } from "./link-field";
import { Label } from "../../../ui/label";
import { cn } from "@/lib/utils";
import { IKImage } from "imagekitio-next";
import { Download, LinkIcon } from "lucide-react"; // You can use any icon library for the download icon
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const [value, setValue] = useState(defaultValues || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const {
    text,
    bgColor,
    color,
    helperText,
    href,
    label,
    padding,
    size,
    width,
  } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="font-semibold">{label}</Label>

      <div className="flex gap-2 items-center">

      <LinkIcon className='size-6'
      style={{
        color: color,
      }}
      />

      <a
        href={`https://www.${href}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: color,
          fontSize: `${size}px`,
          width: `${width}px`,
          padding: `${padding}px`,
          display: "inline-block",
          textAlign: "center",
        }}
        className="rounded-md hover:opacity-80 transition-opacity"
        >
        {text}
      </a>
        </div>

      <div className="flex justify-between">
        {helperText && (
          <p className="text-muted-foreground text-xs">{helperText}</p>
        )}
      </div>
    </div>
  );
};
