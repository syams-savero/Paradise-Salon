import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-[3px] border border-line bg-white/70 px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus-visible:outline-none focus-visible:border-rosegold-600 focus-visible:ring-2 focus-visible:ring-rosegold-600/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
