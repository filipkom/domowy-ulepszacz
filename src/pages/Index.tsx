import { useState } from "react";
import { Sun, Moon, Cpu, Save, Info, Thermometer, Cloud, Zap } from "lucide-react";
import { toast } from "sonner";

import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { GlassCard } from "@/components/ui/GlassCard";
import { HapticButton } from "@/components/ui/HapticButton";
import { StatusSelector, HouseStatus } from "@/components/StatusSelector";
import { RangeControl } from "@/components/RangeControl";
import { DashboardCard } from "@/components/DashboardCard";
import { HeatingCurveChart } from "@/components/HeatingCurveChart";
import { Diagnostics } from "@/components/Diagnostics";
import { HistoryList } from "@/components/HistoryList";
import { ImportantNotes } from "@/components/ImportantNotes";
import { MenuLegend } from "@/components/MenuLegend";
import { WeatherWidget } from "@/components/WeatherWidget";

import { useNibeCalculator } from "@/hooks/useNibeCalculator";
import { useHistory } from "@/hooks/useHistory";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [houseStatus, setHouseStatus] = useState<HouseStatus>("renovation_dry");
  const [targetTemp, setTargetTemp] = useState(21);
  const [outsideTemp, setOutsideTemp] = useState(0);
  const [kwhPrice, setKwhPrice] = useState(1.00); // Cena brutto z dystrybucją

  const results = useNibeCalculator({
    houseStatus,
    targetTemp,
    outsideTemp,
    kwhPrice,
  });

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory();

  const handleSave = () => {
    if (!results) return;
    saveEntry({
      date: new Date().toLocaleString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: outsideTemp,
      target: targetTemp,
      cost: results.cost,
      settings: { curve: results.curve, offset: results.offset },
    });
    toast.success("Ustawienia zapisane w dzienniku");
  };

  const handleClearHistory = () => {
    if (confirm("Usunąć historię?")) {
      clearHistory();
      toast.success("Historia wyczyszczona");
    }
  };

  return (
    <div className={isDark ? "" : "light"}>
      <div className="min-h-screen relative pb-12 pt-6 px-4 md:px-0">
        <BackgroundBlobs />

        <div className="max-w-md mx-auto relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                NIBE <span className="gradient-text font-light">Asystent</span>
              </h1>
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-nibe-green animate-pulse" />
                System Online • v2.0
              </p>
            </div>
            <HapticButton
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-full glass-panel"
            >
              {isDark ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} className="text-primary" />
              )}
            </HapticButton>
          </div>

          {/* Weather Widget */}
          <WeatherWidget onTemperatureUpdate={setOutsideTemp} />

          {/* Controls Section */}
          <div className="animate-fade-in">
            <StatusSelector status={houseStatus} setStatus={setHouseStatus} />

            <RangeControl
              label="Temp. Wewnętrzna"
              icon={Thermometer}
              value={targetTemp}
              min={15}
              max={26}
              unit="°C"
              onChange={setTargetTemp}
              colorClass="text-nibe-orange"
            />

            <RangeControl
              label="Temp. Zewnętrzna"
              icon={Cloud}
              value={outsideTemp}
              min={-20}
              max={25}
              unit="°C"
              onChange={setOutsideTemp}
              colorClass="text-primary"
            />
          </div>

          {/* Results Dashboard */}
          {results && (
            <div className="mt-8">
              <div className="flex items-center justify-between px-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Symulacja
                </span>
                <button
                  onClick={handleSave}
                  className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors border bg-nibe-green/10 text-nibe-green border-nibe-green/20 active:scale-95"
                >
                  <Save size={14} /> Zapisz
                </button>
              </div>

              <GlassCard className="mb-6">
                <div className="flex items-end justify-between mb-6 pb-6 border-b border-border/50">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Przewidywane Zasilanie
                    </div>
                    <div className="text-4xl font-black tracking-tighter">
                      {results.predictedSupply}
                      <span className="text-lg text-muted-foreground font-normal align-top ml-1">
                        °C
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      Koszt
                      <input
                        type="number"
                        step="0.01"
                        value={kwhPrice}
                        onChange={(e) => setKwhPrice(parseFloat(e.target.value) || 0)}
                        className="w-10 bg-transparent text-right border-b border-border text-xs focus:outline-none"
                      />
                      zł/kWh
                    </div>
                    <div className="text-2xl font-bold text-nibe-green">
                      {results.cost}
                      <span className="text-xs text-muted-foreground ml-1">PLN</span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-secondary/40">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Zużycie dzienne
                    </span>
                  </div>
                  <span className="font-bold text-sm">{results.kwh} kWh</span>
                </div>

                {/* Grid Layout for Parameters */}
                <div className="grid grid-cols-2 gap-3">
                  <DashboardCard
                    title="Krzywa"
                    value={results.curve}
                    sub="Menu 1.9.1"
                    colorClass="text-accent"
                    delay={0}
                  />
                  <DashboardCard
                    title="Przesunięcie"
                    value={results.offset}
                    sub="Menu 1.1"
                    colorClass="text-primary"
                    delay={100}
                  />
                  <DashboardCard
                    title="Stop Grzania"
                    value={`${results.stopHeating}°C`}
                    sub="Menu 4.9.2"
                    colorClass="text-nibe-orange"
                    delay={200}
                  />
                  <DashboardCard
                    title="Max Zasilanie"
                    value={`${results.maxSupply}°C`}
                    sub="Menu 1.9.4"
                    colorClass="text-destructive"
                    delay={300}
                  />
                </div>

                <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 items-start">
                  <Info size={16} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {results.desc}
                  </p>
                </div>
              </GlassCard>

              {/* Heating Curve Chart */}
              <HeatingCurveChart
                curve={results.curve}
                offset={results.offset}
                currentOutside={outsideTemp}
                currentSupply={results.predictedSupply}
              />
            </div>
          )}

          <HistoryList
            history={history}
            onDelete={deleteEntry}
            onClear={handleClearHistory}
          />

          {/* Diagnostics & Footer */}
          <Diagnostics />

          <ImportantNotes />
          <MenuLegend />

          <div className="mt-12 text-center pb-8 opacity-50">
            <Cpu size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-[10px] text-muted-foreground">
              NIBE Asystent v2.0 • Stworzone z ❤️ dla domowego użytku
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
