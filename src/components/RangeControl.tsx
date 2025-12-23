import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RangeControlProps {
  label: string;
  icon: LucideIcon;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit: string;
  colorClass?: string;
}

export const RangeControl = ({
  label,
  icon: Icon,
  value,
  min,
  max,
  onChange,
  unit,
  colorClass = "text-primary",
}: RangeControlProps) => (
  <GlassCard className="mb-4">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className={cn("p-2 rounded-xl bg-muted", colorClass)}>
          <Icon size={20} />
        </div>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <span className="text-2xl font-bold tracking-tight">
        {value > 0 && unit === "°C" ? "+" : ""}
        {value}
        <span className="text-sm font-medium text-muted-foreground ml-0.5">
          {unit}
        </span>
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step="1"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
    />
    <div className="flex justify-between mt-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
      <span>Min {min}</span>
      <span>Max {max}</span>
    </div>
  </GlassCard>
);
