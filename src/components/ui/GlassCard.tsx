import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
  variant?: "default" | "warning" | "info";
}

export const GlassCard = ({
  children,
  className = "",
  onClick,
  noPadding = false,
  variant = "default",
}: GlassCardProps) => {
  const variantStyles = {
    default: "glass-card",
    warning: "glass-card !bg-amber-500/10 !border-amber-500/20",
    info: "glass-card !bg-primary/10 !border-primary/20",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        variantStyles[variant],
        "transition-all duration-300",
        !noPadding && "p-5",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};
