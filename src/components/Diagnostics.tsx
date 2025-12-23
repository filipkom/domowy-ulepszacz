import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, Search, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ERROR_CODES = [
  {
    code: "163",
    title: "Wysoka temp. skraplacza",
    desc: "Brak przepływu wody. Sprawdź filtry i pętle.",
    severity: "high",
  },
  {
    code: "52",
    title: "Błąd czujnika gazu",
    desc: "Awaria czujnika BT14. Wymagany restart.",
    severity: "medium",
  },
  {
    code: "220",
    title: "Niskie ciśnienie",
    desc: "Ciśnienie < 1.0 bar. Dopompuj wody.",
    severity: "high",
  },
  {
    code: "294",
    title: "Błąd grzałki",
    desc: "Bezpiecznik termiczny. Wciśnij reset na obudowie.",
    severity: "medium",
  },
  {
    code: "45",
    title: "Wysoka temp. powrotu",
    desc: "Zbyt mały odbiór ciepła. Otwórz pętle.",
    severity: "low",
  },
  {
    code: "LP",
    title: "Alarm niskiego ciśnienia",
    desc: "Problem chłodniczy. Wezwij serwis.",
    severity: "critical",
  },
];

export const Diagnostics = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = ERROR_CODES.filter(
    (e) =>
      e.code.includes(search) ||
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center mb-4 px-2 group"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <AlertTriangle size={14} /> Centrum Diagnostyki
        </span>
        {expanded ? (
          <ChevronUp size={16} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground" />
        )}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <GlassCard className="mb-4 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="Szukaj kodu błędu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((err, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-3"
                >
                  <div
                    className={cn(
                      "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                      err.severity === "critical"
                        ? "bg-destructive animate-pulse"
                        : "bg-destructive/60"
                    )}
                  />
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm">Błąd {err.code}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {err.title}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {err.desc}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-xs text-muted-foreground">
                Brak wyników
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
