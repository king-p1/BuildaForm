"use client"
import React from "react";
import { Form } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { formatDistance } from "date-fns";
import { Badge } from "../../ui/badge";
import { LuView } from "react-icons/lu";
import { Button } from "../../ui/button";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { DeleteFormBtn } from "../form-btns/delete-form-btn";

export const FormCard = ({ form }: { form: Form }) => {
  const {
    name,
    createdAt,
    description,
    id,
    published,
    submissions,
    visits,
    isDeactivated,
    isArchived,expiresAt
  } = form;

  //todo when you have enacted total ui revamp use lastupdated and expiresat 
  return (
    <Card className="my-2 p-1 flex flex-col gap-2 justify-between border-2">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between gap-3 items-center">
          <span className="truncate font-semibold capitalize">{name}</span>
          {published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="destructive">Draft</Badge>
          )}
         
          {isDeactivated && (
            <Badge variant="destructive">Deactivated</Badge>
          )  }
         
          {isArchived && (
            <Badge variant="destructive">Archived</Badge>
          )  }
        </CardTitle>

        <CardDescription className="flex flex-col gap-2 text-muted-foreground text-sm">
          <span>
            {formatDistance(createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>

          {!published && (
            <span className="flex items-center gap-2 text-muted-foreground">
              <LuView />
              <span>{visits.toLocaleString()}</span>
              <LuView />
              <span>{submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-base text-muted-foreground mb-2">
        {description || "No description available"}
      </CardContent>

      <CardFooter className="flex items-center justify-between w-full gap-3">
        {published ? (
          <Button className="w-full font-semibold" variant="default" asChild>
            <Link href={`/dashboard/form/${id}`} className="flex items-center gap-2">
            <HiOutlineViewfinderCircle size={27}/>
            View Submissions</Link>
          </Button>
        ) : (
          <Button className="w-full font-semibold" variant="secondary">
            <Link href={`/dashboard/form-builder/${id}`} className="flex items-center gap-2"><FiEdit className="dark:text-white" size={27}/>Edit Form</Link>
          </Button>
        )}

       <DeleteFormBtn id={id}/>

      </CardFooter>
    </Card>
  );
};
