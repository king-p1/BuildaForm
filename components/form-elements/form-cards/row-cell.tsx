"use client"
import { ElementsType } from "../sidebar-form-values/form-elemts-type";
import { ReactNode, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LiaFolderOpen } from "react-icons/lia";
import { IKImage } from "imagekitio-next"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TableCell } from "@/components/ui/table"
import { format } from "date-fns"

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export const RowCell = ({ type, value }: { type: ElementsType; value: string }) => {
  let node: ReactNode = value;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Convert comma-separated string to array for images
  const imageArray = type === "ImageUploadField" && value ? value.split(',').filter(Boolean) : [];

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % imageArray.length);
  };

  const previousImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + imageArray.length) % imageArray.length);
  };

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge>{format(date, "dd/MM/yyyy")}</Badge>;
      break;

    case "CheckboxField":
      if (!value) break;
      const checked = value === 'true';
      node = <Checkbox checked={checked} disabled />;
      break;

    case "ImageUploadField":
      if (!value) break;

      node = (
        <Dialog>
          <DialogTrigger>
            <Button
              className="flex items-center gap-2 font-medium"
              size="sm"
            >
              <LiaFolderOpen className="h-4 w-4" />
              View Image{imageArray.length > 1 && `s`} {imageArray.length > 1 && `(${imageArray.length})`}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <div className="relative w-full flex items-center justify-center">
                  {imageArray.length > 1 && (
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
                      path={imageArray[currentImageIndex]}
                      urlEndpoint={urlEndpoint}
                      className='border-none'
                      width={400}
                      height={300}
                    />
                  </div>

                  {imageArray.length > 1 && (
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
                {imageArray.length > 1 && (
                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    Image {currentImageIndex + 1} of {imageArray.length}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      break;

    default:
      break;
  }

  return (
    <TableCell>{node}</TableCell>
  );
};