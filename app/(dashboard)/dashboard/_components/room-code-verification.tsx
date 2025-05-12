"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { encryptRoomCode } from "@/lib/room-code";
import { TbLoader3 } from "react-icons/tb";

interface RoomCodeVerificationProps {
  formId: string;
  hashedCode: string;
  salt: string;  // This is actually the IV in hex format
  onVerified: () => void;
}

export const RoomCodeVerification = ({
  hashedCode,
  salt,  // This is the IV from the original encryption
  onVerified,
}: RoomCodeVerificationProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // Use the same IV (salt) that was used to create the original encrypted code
      const { encryptedCode } = encryptRoomCode(code, salt);
    
      
      const isValid = encryptedCode === hashedCode;
      
      if (isValid) {
        onVerified();
      } else {
        toast({
          title: "Invalid Code",
          description: "The access code you entered is incorrect.",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-[450px] flex flex-col gap-3 border-2 shadow-lg">
  <CardHeader>
    <CardTitle className="text-center p-2 font-semibold text-2xl flex gap-3 items-center">
    <Lock className="h-8 w-8 text-muted-foreground" />
      Private Form
    </CardTitle>
  </CardHeader>
  <CardContent>
    <form
      onSubmit={(e) => {
        e.preventDefault(); // prevent page reload
        handleVerify();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-center gap-2">
        <p className="text-muted-foreground text-center">
          This form requires an access code to view
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter 4-digit code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
          }
          maxLength={4}
          pattern="[0-9]*"
          inputMode="numeric"
        />
        <Button
          type="submit"
          disabled={code.length !== 4 || isVerifying}
        >
          {isVerifying ? (
            <TbLoader3 className="size-5 animate-spin"/>
          ) : "Verify"}
        </Button>
      </div>
    </form>
  </CardContent>
</Card>

  );
};