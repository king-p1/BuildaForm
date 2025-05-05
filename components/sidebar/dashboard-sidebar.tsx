

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  BarChart2,
  ArrowLeft,
  ArrowRight,
  LogOut,
  ClipboardList,
  Trash2,
  Star,User
} from "lucide-react";
import { TbWorldCancel } from "react-icons/tb";
import { TbLoader3 } from "react-icons/tb"; // Add import for TbLoader3
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateFormButton } from "../form-elements/form-btns/create-form-btn";
import { SignedIn, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
};
type SubForm = {
  icon: React.ReactNode;
  toolText: string;
  link: string;
};

export const DashboardSidebar = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [clipboardOpen, setClipboardOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Ensure hydration mismatch doesn't cause issues with animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    setIsSigningOut(true);
    router.push('/')
  };

  const sidebarItems: SidebarItem[] = [
    {
      icon: <FileText size={20} />,
      label: "Documents",
      href: "/dashboard/documents",
    },
    {
      icon: <BarChart2 size={20} />,
      label: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      icon: <User size={20} />,
      label: "User",
      href: "/dashboard/user",
    },
  ];

  const subFormItems: SubForm[] = [
    {
      icon: <Star fill="yellow" className="text-yellow-300" />,
      toolText: "Favourite forms",
      link: "/dashboard/documents",
    },
    {
      icon: <Trash2 className="text-red-500" />,
      toolText: "Archived Forms",
      link: "/dashboard/analytics",
    },
    {
      icon: <TbWorldCancel className="text-emerald-500" />,
      toolText: "Deactivated Forms",
      link: "/dashboard/settings",
    },
  ];

  const SidebarSkeleton = ({ expanded = false }: { expanded?: boolean }) => {
    return (
      <div
        className={cn(
          "border-r border-border bg-background flex flex-col h-full",
          expanded ? "w-64" : "w-16"
        )}
      >
        <div className="p-2 flex justify-center items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mt-7  " />
        </div>
        <div className="px-2 py-4 space-y-8 mt-8">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center",
                expanded ? "px-3" : "justify-center"
              )}
            >
              <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0"></div>
              {expanded && (
                <div className="ml-2 h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center p-4  bottom-0 bg-background z-10 ">
          <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0"></div>
          {expanded && (
            <div className="ml-2 h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          )}
        </div>
      </div>
    );
  };

  if (!mounted) {
    // Use the appropriate skeleton based on initial state
    return <SidebarSkeleton expanded={isOpen} />;
  }

  return (
    <div
      className={cn(
        "border-r border-border bg-background flex flex-col h-full",
        "transition-all duration-300 ease-in-out will-change-[width]",
        isOpen ? "w-64" : "w-16"
      )}
      style={{ overflowX: "hidden" }}
    >
      <div className="flex items-center justify-end p-2 mt-4  top-0 bg-background z-10 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-12 w-12 rounded-full  "
        >
          <div className="transition-transform duration-300 ">
            {isOpen ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </div>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-2 py-2">
          <TooltipProvider delayDuration={0}>
            <ul className="space-y-8 mt-8">
              {isOpen ? (
                <div className="w-full flex items-center justify-center">
                  <CreateFormButton isOpen={isOpen} />
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <CreateFormButton isOpen={isOpen} />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    Create a new form
                  </TooltipContent>
                </Tooltip>
              )}
          
              {isOpen ? (
                <div className="w-full flex items-center justify-center">
                  <Popover open={clipboardOpen} onOpenChange={setClipboardOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className={cn(
                          "w-[80%] justify-start",
                          "transition-all duration-200",
                        )}
                      >
                        <div className="cursor-pointer flex items-center">
                          <ClipboardList size={23} className="mr-2 shrink-0" />
                          <span className="truncate transition-opacity duration-300">
                            All Forms
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                        className="w-16 p-4 animate-in zoom-in-90 duration-200 border-none shadow-none -mt-8 opacity-90"
                        side="right"
                        sideOffset={45}
                      >
                       <div className="space-y-4 flex flex-col " >
                        {subFormItems.map(({icon,link,toolText})=>(
                          <>
                <Tooltip>
                  <TooltipTrigger asChild >
                         <Button asChild variant={'secondary'} size={'icon'} >
                          <Link href={link}>
                         {icon}
                          </Link>
                         </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="font-semibold">
                    {toolText}
                  </TooltipContent>
                </Tooltip>
                          </>
                        ))}
                        </div>
                      </PopoverContent>
                  </Popover>
                </div>
              ) : (
                    <Popover open={clipboardOpen} onOpenChange={setClipboardOpen}>
                      <PopoverTrigger asChild>
                        <div className="flex justify-center">
                          <Button
                            variant={"ghost"}
                            size="icon"
                            className="w-full h-10 justify-center transition-all duration-200"
                          >
                            <ClipboardList size={23} />
                          </Button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-16 p-4 animate-in zoom-in-90 duration-200 border-none shadow-none -mt-8 opacity-90"
                        side="right"
                        sideOffset={20}
                      >
                        <div className="space-y-4 flex flex-col " >
                        {subFormItems.map(({icon,link,toolText})=>(
                          <>
                <Tooltip>
                  <TooltipTrigger asChild >
                         <Button asChild variant={'secondary'} size={'icon'} >
                          <Link href={link}>
                         {icon}
                          </Link>
                         </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="font-semibold">
                    {toolText}
                  </TooltipContent>
                </Tooltip>
                          </>
                        ))}
                        </div>
                      </PopoverContent>
                    </Popover>
              )}
 

 



              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <li key={index}>
                    {isOpen ? (
                      <Button
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          "transition-all duration-200",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Link href={item.href} className="flex items-center">
                          <div className="mr-2 shrink-0">{item.icon}</div>
                          <span className="truncate transition-opacity duration-300">
                            {item.label}
                          </span>
                        </Link>
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            asChild
                            variant={isActive ? "secondary" : "ghost"}
                            size="icon"
                            className="w-full h-10 justify-center transition-all duration-200"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center justify-center"
                            >
                              <div className="shrink-0">{item.icon}</div>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={10}>
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
        </nav>
      </ScrollArea>

      <div className="flex items-center justify-center p-4  bottom-0 bg-background z-10 ">
        {isOpen ? (
          <div className="w-full flex items-center justify-center flex-col gap-3">
            <SignedIn>
              <div className="flex w-full gap-2 items-center justify-center">
                <span className="p-2 flex items-center justify-center dark:bg-white bg-neutral-800 rounded-full">
                  <UserButton />
                </span>
                <p className="font-semibold">{user?.fullName}</p>
              </div>
            </SignedIn>

            <SignOutButton signOutCallback={() => setIsSigningOut(false)}>
              <Button 
                className="flex items-center w-full gap-2" 
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <>
                    <TbLoader3 className="animate-spin" /> Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut /> Log Out
                  </>
                )}
              </Button>
            </SignOutButton>
          </div>
        ) : (
          <div className="flex flex-col gap-5 justify-center items-center">
            <span className="p-2 flex items-center justify-center dark:bg-white bg-neutral-800 rounded-full">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <SignOutButton signOutCallback={() => setIsSigningOut(false)}>
                      <Button 
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? (
                          <TbLoader3 className="animate-spin" />
                        ) : (
                          <LogOut />
                        )}
                      </Button>
                    </SignOutButton>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {isSigningOut ? "Signing Out..." : "Log Out"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};