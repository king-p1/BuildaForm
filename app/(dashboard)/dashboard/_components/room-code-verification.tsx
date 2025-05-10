"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { verifyRoomCode } from "@/lib/room-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface RoomCodeVerificationProps {
  formId: string;
  hashedCode: string;
  salt: string;
  onVerified: () => void;
}

export const RoomCodeVerification = ({
  formId,
  hashedCode,
  salt,
  onVerified,
}: RoomCodeVerificationProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const isValid = verifyRoomCode(code, hashedCode, salt);
      
      if (isValid) {
        onVerified();
      } else {
        toast({
          title: "Invalid Code",
          description: "The access code you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while verifying the code.",
        variant: "destructive",
      });
      console.log(error)
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Private Form Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This form is private. Please enter the access code to continue.
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <Button
              onClick={handleVerify}
              disabled={code.length !== 4 || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};