import { HapticButton } from "@/components/ui/HapticButton";
import { Home, Droplets, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type HouseStatus = "renovation_dry" | "renovation_wet" | "inhabited";

interface StatusSelectorProps {
  status: HouseStatus;
  setStatus: (status: HouseStatus) => void;
}

const options = [
  { id: "renovation_dry" as const, icon: Home, label: "Wykończenie", desc: "Tryb suchy" },
  { id: "renovation_wet" as const, icon: Droplets, label: "Mokre tynki", desc: "Wygrzewanie" },
  { id: "inhabited" as const, icon: Users, label: "Mieszkalny", desc: "Komfort" },
];

export const StatusSelector = ({ status, setStatus }: StatusSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <HapticButton
            key={opt.id}
            onClick={() => setStatus(opt.id)}
            className={cn(
              "flex flex-col items-center justify-center py-4 rounded-2xl border transition-all",
              status === opt.id
                ? "bg-primary/10 border-primary/50 text-primary"
                : "bg-secondary/40 border-transparent text-muted-foreground hover:bg-secondary/60"
            )}
          >
            <Icon size={24} className="mb-2" />
            <span className="text-xs font-bold">{opt.label}</span>
            <span className="text-[9px] opacity-70">{opt.desc}</span>
          </HapticButton>
        );
      })}
    </div>
  );
};
