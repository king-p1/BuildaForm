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

export const FormCard = ({ form }: { form: Form }) => {
  const {
    name,
    content,
    createdAt,
    description,
    id,
    published,
    shareURL,
    submissions,
    userId,
    visits,
  } = form;
  return (
    <Card className="my-2 p-1">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between gap-3 items-center">
          <span className="truncate font-semibold capitalize">{name}</span>
          {published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="destructive">Draft</Badge>
          )}
        </CardTitle>

        <CardDescription className="flex  flex-col gap-2 text-muted-foreground text-sm">
          {formatDistance(createdAt, new Date(), {
            addSuffix: true,
          })}

          {!published && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <LuView />
              <span>{visits.toLocaleString()}</span>
              <LuView />
              <span>{submissions.toLocaleString()}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-base text-muted-foreground mb-2">
        {description || "No description available"}
      </CardContent>

      <CardFooter>
        {published ? (
          <Button className="w-full" variant="outline" asChild>
            <Link href={`/dashboard/form/${id}`}>View Submissions</Link>
          </Button>
        ) : (
          <Button className="w-full" variant="secondary">
            <Link href={`/dashboard/form-builder/${id}`} className="flex gap-4"><FiEdit className="dark:text-white" size={22}/>Edit Form</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
