"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function UserWelcomeClient({ userData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getWelcomeText = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };


  const NameSkeleton = () => (
    <div className="flex items-end gap-3">
      <h1 className="font-bold text-4xl">{getWelcomeText()}</h1>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-32 animate-pulse"></div>
        <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );

  // Enhanced welcome with shimmer effect when data is loaded
  const UserWelcome = () => (
    <div className="relative">
      <h1 className="font-bold text-4xl flex items-center gap-2">
        {getWelcomeText()}{" "}
        <span className={cn(
          "text-transparent bg-clip-text bg-gradient-to-r ml-3",
          "from-primary to-purple-500 dark:from-primary dark:to-blue-400",
          "animate-gradient-x relative"
        )}>
          {userData?.firstName || ""},
        </span>
      </h1>
      
      {/* Dynamic greeting tag */}
      <div className="absolute -top-4 right-0 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full text-xs text-primary/70 dark:text-primary/90 font-medium -mt-1">
        {new Date().getDay() === 1 ? "Start strong this week!" : "Let's be productive today!"}
      </div>
    </div>
  );

  if (!mounted) {
    return <NameSkeleton />;
  }

  return <UserWelcome />;
}

 