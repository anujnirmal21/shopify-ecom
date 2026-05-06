"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function ThemeAwareToaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border/40 group-[.toaster]:shadow-2xl font-sans rounded-2xl backdrop-blur-xl group-[.toaster]:bg-background/80",
          description: "group-[.toast]:text-muted-foreground text-xs",
          title: "font-serif text-base",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold uppercase tracking-[0.2em] text-[10px] px-4 py-2",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px] px-4 py-2",
          success: "group-[.toast]:border-primary/50 group-[.toast]:bg-primary/5",
          error: "group-[.toast]:border-destructive/50 group-[.toast]:bg-destructive/5",
          info: "group-[.toast]:border-accent/50 group-[.toast]:bg-accent/5",
          warning: "group-[.toast]:border-accent/50 group-[.toast]:bg-accent/5",
        },
      }}
      {...props}
    />
  );
}
