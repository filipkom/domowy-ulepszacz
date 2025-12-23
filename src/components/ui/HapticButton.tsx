import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface HapticButtonProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  active?: boolean;
}

export const HapticButton = ({
  onClick,
  className,
  children,
  active = false,
}: HapticButtonProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      className={cn(
        "transition-all duration-150 ease-out transform",
        pressed ? "scale-95" : "scale-100",
        active && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
