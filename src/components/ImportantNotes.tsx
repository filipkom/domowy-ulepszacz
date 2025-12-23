import { GlassCard } from "@/components/ui/GlassCard";
import { Activity } from "lucide-react";

export const ImportantNotes = () => (
  <GlassCard variant="warning" className="mt-6">
    <div className="flex items-center gap-2 mb-2 text-nibe-orange">
      <Activity size={16} />
      <span className="text-xs font-bold uppercase tracking-widest">
        Ważne uwagi
      </span>
    </div>
    <ul className="list-disc pl-4 text-xs space-y-2 text-muted-foreground">
      <li>
        <span className="font-bold text-foreground">Bezwładność:</span> Efekt
        zmian w podłogówce odczujesz dopiero po 24h. Nie zmieniaj ustawień
        częściej!
      </li>
      <li>Wysoka temperatura zasilania (&gt;35°C) może uszkodzić podłogę drewnianą.</li>
      <li>
        Po każdej zmianie obserwuj system przez 24-48h przed kolejną korektą.
      </li>
    </ul>
  </GlassCard>
);
