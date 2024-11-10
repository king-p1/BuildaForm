import React from "react";
import { PiConfettiDuotone } from "react-icons/pi";
import { Input } from "./input";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import Confetti from 'react-confetti'
import { LuLayoutDashboard } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";

export const PublishedFormView = ({
  shareUrl,
  id,
}: {
  shareUrl: string;
  id: number;
}) => {

    console.log(window.innerWidth)

  return (
    <>
    <Confetti recycle={false}
   className="w-[100%] h-[95%] flex justify-center items-center p-2"
    numberOfPieces={1000}
    />
    <div className="flex flex-col w-full h-full justify-center items-center overflow-hidden motion-preset-expand motion-scale-in-[0.5] motion-rotate-in-[-10deg] motion-blur-in-[10px] motion-delay-[0.75s]/rotate motion-delay-[0.75s]/blur shadow-md">
      <div className="max-w-md ">
        <div className="flex flex-row items-center justify-center gap-2 mb-2">
          <PiConfettiDuotone size={50} color="yellow" className="" />
          <PiConfettiDuotone size={50} color="yellow" className="" />
          <h2 className="text-2xl">Form Published</h2>
          <PiConfettiDuotone size={50} color="yellow" className="" />
          <PiConfettiDuotone size={50} color="yellow" className="" />
        </div>
        <h2 className="text-lg">Share this form</h2>
        <h3 className="text-base text-muted-foreground border-b pb-10">
          Anyone with this link can view and respond to the form
        </h3>

        <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
          <Input readOnly className="w-full" value={shareUrl} />
          <Button
            className="mt-2 w-full"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast({
                title: "Copied",
                description: "Link copied to clipboard",
              });
            }}
          >
            Copy link
          </Button>
        </div>

        <div className="flex justify-between">
          <Button asChild variant="link">
            <Link href={"/"} className="flex gap-2 items-center">
            <LuLayoutDashboard className="dark:text-white text-black" size={22}/>
            Return to Dashboard</Link>
          </Button>

          <Button asChild variant="link">
            <Link href={`/dashboard/form/${id}`} className="flex gap-2 items-center">
            Form Details
            <TbListDetails className="dark:text-white text-black" size={22}/>
            </Link>
          </Button>
        </div>
      </div>
    </div>
    </>

  );
};
