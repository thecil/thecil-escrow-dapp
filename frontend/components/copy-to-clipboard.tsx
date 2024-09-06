"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { CopyIcon, CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyProps {
  text: string;
  variant?: "button" | "icon";
  onCopySuccess?: () => void;
  className?: string;
}

const CopyToClipboardButton: React.FC<CopyProps> = ({ text, variant = "button", onCopySuccess, className }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => {
        setCopySuccess(false);
      }, 1000);
    }
    return () => {};
  }, [copySuccess]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      toast.success("Content copied successfully");
      if (onCopySuccess) onCopySuccess();
    } catch (err) {
      setCopySuccess(false);
      toast.error("Could not copied content");
    }
  };

  if (variant === "button")
    return (
      <Button variant="default" disabled={copySuccess} onClick={() => copyToClipboard()}>
        <div className="flex items-center justify-center space-x-1">
          <>
            {copySuccess ? (
              <>
                <CheckCircle2Icon className={cn("h-4 w-4 text-green-500", className)} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className={cn("h-4 w-4", className)} />
                <span>Copy</span>{" "}
              </>
            )}
          </>
        </div>
      </Button>
    );
  if (variant === "icon")
    return (
      <TooltipProvider>
        <Tooltip open={isHovered || copySuccess}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled={copySuccess}
              onClick={() => copyToClipboard()}
              size="icon"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {copySuccess ? (
                <CheckCircle2Icon className={cn("h-4 w-4 text-green-500", className)} />
              ) : (
                <CopyIcon className={cn("h-4 w-4", className)} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{copySuccess ? "Copied!" : "Copy to Clipboard"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
};

export default CopyToClipboardButton;
