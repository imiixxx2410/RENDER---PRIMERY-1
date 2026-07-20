import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-muted text-text-primary",
        variant === "accent" && "bg-accent/15 text-accent",
        variant === "success" && "bg-green-500/15 text-green-400"
      )}
    >
      {children}
    </span>
  );
}
