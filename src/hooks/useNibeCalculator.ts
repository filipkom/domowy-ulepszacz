import { useState, useEffect } from "react";
import { HouseStatus } from "@/components/StatusSelector";

export interface CalculationResults {
  curve: number;
  offset: number;
  stopHeating: number;
  waterMode: string;
  desc: string;
  maxSupply: number;
  predictedSupply: number;
  cost: string;
  kwh: string;
  cop: number;
}

interface UseNibeCalculatorProps {
  houseStatus: HouseStatus;
  targetTemp: number;
  outsideTemp: number;
  kwhPrice: number;
}

export const useNibeCalculator = ({
  houseStatus,
  targetTemp,
  outsideTemp,
  kwhPrice,
}: UseNibeCalculatorProps): CalculationResults | null => {
  const [results, setResults] = useState<CalculationResults | null>(null);

  useEffect(() => {
    // Stałe dla dobrze ocieplonego domu
    const HEAT_LOSS_COEFFICIENT = 120; // W na °C różnicy (dobrze ocieplony dom)
    const DUTY_CYCLE = 0.70; // Pompa pracuje ~70% czasu

    let curve = 3;
    let offset = 0;
    let stopHeating = 0;
    let waterMode = "";
    let desc = "";
    let maxSupply = 35;

    offset = targetTemp - 21;

    if (houseStatus === "renovation_wet") {
      stopHeating = 17;
      waterMode = "Oszczędny";
      curve = 4;
      maxSupply = 32;
      desc = "Suszenie budynku. Parametry podwyższone dla usunięcia wilgoci.";
    } else if (houseStatus === "renovation_dry") {
      stopHeating = 12;
      waterMode = "Oszczędny";
      curve = 3;
      desc = "Tryb oszczędny wykończeniowy. Utrzymanie temp. roboczej.";
    } else {
      stopHeating = 17;
      waterMode = "Normalny";
      curve = targetTemp > 22 ? 4 : 3;
      desc = "Standardowy tryb mieszkalny. Pełny komfort.";
    }

    if (houseStatus !== "renovation_wet") {
      curve = Math.max(1, curve - 1);
    }

    const calculateSupply = (c: number, o: number, out: number): number => {
      const base = 20;
      const delta = 20 - out;
      return Math.round(base + delta * 0.1 * c + o * 2.5);
    };

    const predSupply = calculateSupply(curve, offset, outsideTemp);

    let cop = 4.5;
    if (outsideTemp < 7) cop = 3.8;
    if (outsideTemp < 0) cop = 3.2;
    if (outsideTemp < -7) cop = 2.6;
    if (outsideTemp < -15) cop = 2.1;

    const deltaT = targetTemp - outsideTemp;
    // Zaktualizowana formuła: współczynnik izolacji × duty cycle
    let watts = (deltaT * HEAT_LOSS_COEFFICIENT * DUTY_CYCLE) / cop;
    if (outsideTemp > stopHeating) watts = 15;

    const dailyCost = ((watts * 24) / 1000) * kwhPrice;

    setResults({
      curve,
      offset,
      stopHeating,
      waterMode,
      desc,
      maxSupply,
      predictedSupply: Math.min(predSupply, maxSupply),
      cost: dailyCost.toFixed(2),
      kwh: ((watts * 24) / 1000).toFixed(1),
      cop,
    });
  }, [houseStatus, targetTemp, outsideTemp, kwhPrice]);

  return results;
};
