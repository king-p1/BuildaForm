"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { decryptRoomCode } from "@/lib/room-code";

interface RoomCodeDisplayProps {
  hashedCode: string; // This will now be the encrypted code
  salt: string; // This will now be the IV
}

export const RoomCodeDisplay = ({ hashedCode, salt }: RoomCodeDisplayProps) => {
  const [showCode, setShowCode] = useState(false);
  const [decryptedCode, setDecryptedCode] = useState<string | null>(null);

  const handleShowCode = () => {
    if (!decryptedCode) {
      try {
        const code = decryptRoomCode(hashedCode, salt);
        setDecryptedCode(code);
      } catch (error) {
        console.error('Failed to decrypt code:', error);
      }
    }
    setShowCode(!showCode);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono">
        {showCode ? decryptedCode : "••••"}
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