import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  sub: string;
  colorClass: string;
  delay: number;
}

export const DashboardCard = ({
  title,
  value,
  sub,
  colorClass,
  delay,
}: DashboardCardProps) => (
  <div
    className="bg-secondary/40 p-4 rounded-2xl border border-border/50 flex flex-col items-center text-center animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wide">
      {title}
    </span>
    <span className={cn("text-2xl font-bold", colorClass)}>{value}</span>
    <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
      {sub}
    </span>
  </div>
);
