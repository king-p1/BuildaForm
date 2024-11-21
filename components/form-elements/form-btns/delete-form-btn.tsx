"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LuTrash2 } from "react-icons/lu";
import { toast } from "@/hooks/use-toast";
import { Button } from "../../ui/button";
import React, { useTransition, useState } from "react";
import { deleteForm } from "@/actions/form";
import { TbLoader3 } from "react-icons/tb";

export const DeleteFormBtn = ({ id }: { id: number }) => {
  const [loading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteForm = async () => {
    try {
      const { error, message } = await deleteForm(id);

      if (error) {
        return toast({
          title: "Error",
          description: "Failed to delete form.",
        });
      } else {
        toast({
          title: "Success",
          description: message,
        });
        setIsOpen(false);

        setTimeout(() => {
        window.location.reload();
    }, 800);
    }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error has occurred, please try again.",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className=" font-semibold dark:bg-red-700 dark:hover:bg-red-500 bg-red-500 hover:bg-red-700" onClick={() => setIsOpen(true)}>
          <LuTrash2 className="dark:text-white" size={33} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your form
            and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                handleDeleteForm(); 
                return Promise.resolve();  
              });
            }}
          >
            {loading ? (
              <TbLoader3
                size={22}
                className="text-white dark:text-black animate-spin"
              />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
