"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { verifyRoomCode } from "@/lib/room-code";

interface RoomCodeDisplayProps {
  hashedCode: string;
  salt: string;
}

export const RoomCodeDisplay = ({ hashedCode, salt }: RoomCodeDisplayProps) => {
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const handleShowCode = async () => {
    if (!code) {
      // In a real application, you would need to implement a secure way
      // to retrieve the original code. This is just for demonstration.
      const originalCode = "1234"; // This should come from a secure source
      setCode(originalCode);
    }
    setShowCode(!showCode);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono">
        {showCode ? code : "••••"}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShowCode}
        className="h-8 w-8"
      >
        {showCode ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};