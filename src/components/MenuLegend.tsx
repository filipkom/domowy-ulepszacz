import { GlassCard } from "@/components/ui/GlassCard";

export const MenuLegend = () => (
  <GlassCard className="mt-4 !bg-secondary/30">
    <div className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
      Legenda Menu NIBE
    </div>
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[10px] text-muted-foreground">
      <div>1.1 → Przesunięcie krzywej</div>
      <div>1.9.1.1 → Wybór krzywej</div>
      <div>1.9.3 → Min. temp. zasilania</div>
      <div>1.9.4 → Max. temp. zasilania</div>
      <div>1.9.7 → Własna krzywa</div>
      <div>2.2 → Tryb CWU</div>
      <div>4.9.2 → Wyłącz ogrzewanie</div>
      <div>4.9.3 → Stopniominuty</div>
      <div className="col-span-2 pt-2 border-t border-border/20 text-center opacity-50 mt-2">
        NIBE AMS 10-12
      </div>
    </div>
  </GlassCard>
);
