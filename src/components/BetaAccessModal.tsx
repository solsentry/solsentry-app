"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BetaAccessModal({
  children,
  triggerClassName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={triggerClassName}>{children}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-white/10 bg-black/90 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl text-[#d97706] font-display">
            Request Beta Access
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            We are onboarding users gradually. Closed beta expected mid-July.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-[500px] bg-white/5 relative mt-4">
          <iframe
            className="w-full h-full border-none bg-transparent"
            src="https://docs.google.com/forms/d/e/1FAIpQLSfaY4yIzE-crwFI8z8GrGYfQd8OY5DPs0Q6i93s3-5dS1vBoQ/viewform?embedded=true"
            title="Request beta access form"
            marginHeight={0}
            marginWidth={0}
          >
            Carregando…
          </iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
