import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Variants deliberately match the site's existing "no boxes" language —
// underlined/plain text links and icon-only circular hit areas — rather
// than shadcn's default filled/bordered button look.
const buttonVariants = cva(
  "inline-flex items-center gap-1.5 text-text-muted transition-colors duration-200 hover:text-text-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        link: "text-sm",
        underline:
          "text-sm [&>span]:border-b [&>span]:border-rule-strong [&>span]:pb-0.5 [&>span]:transition-colors [&>span]:duration-200 hover:[&>span]:border-text-primary",
        icon: "h-9 w-9 justify-center rounded-full hover:bg-bg-surface",
      },
      size: {
        default: "",
        sm: "gap-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "link",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
