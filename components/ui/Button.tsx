import React from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "underline" | "ghost";
  className?: string;
  hoverClassName?: string;
  showArrow?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  hoverClassName = "bg-primary dark:bg-white",
  showArrow = true,
  isLoading = false,
  disabled = false,
}: ButtonProps) => {
  const isLink = !!href;

  const baseStyles =
    "relative inline-flex items-center justify-center transition-all duration-500 font-bold uppercase tracking-[0.3em] text-[10px]";

  const variants = {
    primary:
      "px-12 py-6 bg-foreground text-background dark:bg-primary dark:text-black overflow-hidden group/btn min-w-[200px] hover:text-primary-foreground dark:hover:text-black",
    underline:
      "border-b border-foreground pb-2 hover:text-primary hover:border-primary transition-all tracking-[0.3em]",
    ghost: "px-10 py-4 hover:text-primary transition-colors",
  };

  const content = (
    <>
      <span
        className={cn(
          "relative z-10 flex items-center justify-center gap-3 transition-transform duration-300",
          variant === "primary" && "group-hover/btn:scale-105",
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {children}
            {showArrow && (
              <ArrowRight
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-300",
                  variant === "primary" && "group-hover/btn:translate-x-1",
                  variant === "underline" && "ml-2",
                )}
              />
            )}
          </>
        )}
      </span>
      {variant === "primary" && (
        <div
          className={cn(
            "absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out",
            hoverClassName,
          )}
        />
      )}
    </>
  );

  const finalClassName = cn(
    baseStyles,
    variants[variant],
    className,
    (disabled || isLoading) && "opacity-50 cursor-not-allowed",
  );

  if (isLink) {
    return (
      <Link href={href} className={finalClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={finalClassName}
    >
      {content}
    </button>
  );
};
