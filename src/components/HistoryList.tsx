import { GlassCard } from "@/components/ui/GlassCard";
import { History, Trash2 } from "lucide-react";

export interface HistoryEntry {
  id: number;
  date: string;
  temp: number;
  target: number;
  cost: string;
  settings: {
    curve: number;
    offset: number;
  };
}

interface HistoryListProps {
  history: HistoryEntry[];
  onDelete: (id: number) => void;
  onClear: () => void;
}

export const HistoryList = ({ history, onDelete, onClear }: HistoryListProps) => (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-4 px-2">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <History size={14} /> Dziennik Zmian
      </span>
      {history.length > 0 && (
        <button
          onClick={onClear}
          className="text-[10px] text-destructive hover:text-destructive/80 flex items-center gap-1"
        >
          <Trash2 size={12} /> Wyczyść
        </button>
      )}
    </div>

    {history.length > 0 ? (
      <div className="space-y-2">
        {history.map((item) => (
          <GlassCard key={item.id} className="relative group !p-4" noPadding>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-muted-foreground font-medium">
                {item.date}
              </span>
              <button
                onClick={() => onDelete(item.id)}
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block">Warunki</span>
                <span className="font-bold">Zew: {item.temp}°C</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block">Ustawienia</span>
                <span className="font-bold text-primary">
                  K: {item.settings.curve}, O: {item.settings.offset}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    ) : (
      <div className="text-center py-4 opacity-40 text-xs">
        Brak zapisanych zmian
      </div>
    )}
  </div>
);
