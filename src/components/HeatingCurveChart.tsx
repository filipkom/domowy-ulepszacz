import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Activity, ChevronUp, ChevronDown } from "lucide-react";

interface HeatingCurveChartProps {
  curve: number;
  offset: number;
  currentOutside: number;
  currentSupply: number;
}

export const HeatingCurveChart = ({
  curve,
  offset,
  currentOutside,
  currentSupply,
}: HeatingCurveChartProps) => {
  const [expanded, setExpanded] = useState(false);

  const width = 1000;
  const height = 500;
  const padding = 60;

  const minX = -20;
  const maxX = 20;
  const minY = 10;
  const maxY = 65;

  const mapX = (val: number) =>
    padding + ((val - minX) / (maxX - minX)) * (width - 2 * padding);
  const mapY = (val: number) =>
    height - padding - ((val - minY) / (maxY - minY)) * (height - 2 * padding);

  const points: string[] = [];
  for (let t = minX; t <= maxX; t += 2) {
    let supply = 20 + (20 - t) * 0.1 * curve + offset * 2.5;
    supply = Math.max(minY, Math.min(maxY, supply));
    points.push(`${mapX(t)},${mapY(supply)}`);
  }
  const pathD = `M ${points.join(" L ")}`;

  const cx = mapX(Math.max(minX, Math.min(maxX, currentOutside)));
  const cy = mapY(Math.max(minY, Math.min(maxY, currentSupply)));

  return (
    <div className="mt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center mb-4 px-2 group"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Activity size={14} /> Wykres Krzywej
        </span>
        {expanded ? (
          <ChevronUp size={16} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground" />
        )}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <GlassCard className="mb-4 relative !p-6" noPadding>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Grid Lines */}
            {[20, 30, 40, 50, 60].map((temp) => (
              <g key={temp}>
                <line
                  x1={padding}
                  y1={mapY(temp)}
                  x2={width - padding}
                  y2={mapY(temp)}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4"
                />
                <text
                  x={padding - 10}
                  y={mapY(temp)}
                  dy="4"
                  textAnchor="end"
                  className="text-[30px] fill-muted-foreground font-medium"
                >
                  {temp}°
                </text>
              </g>
            ))}
            {[-20, -10, 0, 10, 20].map((temp) => (
              <g key={temp}>
                <line
                  x1={mapX(temp)}
                  y1={height - padding}
                  x2={mapX(temp)}
                  y2={padding}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4"
                />
                <text
                  x={mapX(temp)}
                  y={height - padding + 40}
                  textAnchor="middle"
                  className="text-[30px] fill-muted-foreground font-medium"
                >
                  {temp}°
                </text>
              </g>
            ))}

            {/* Axis Labels */}
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              className="text-[30px] fill-muted-foreground font-bold uppercase"
            >
              Temp. Zewnętrzna
            </text>
            <text
              x={10}
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90 15,${height / 2})`}
              className="text-[30px] fill-muted-foreground font-bold uppercase"
            >
              Temp. Zasilania
            </text>

            {/* Curve Path */}
            <path
              d={pathD}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              className="opacity-80"
            />
            <path
              d={pathD}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Current Point Indicator */}
            <circle
              cx={cx}
              cy={cy}
              r="16"
              className="fill-background stroke-primary stroke-[4] animate-pulse"
            />
            <circle cx={cx} cy={cy} r="8" className="fill-primary" />

            {/* Current Label */}
            <rect
              x={cx - 60}
              y={cy - 80}
              width="120"
              height="50"
              rx="10"
              className="fill-secondary/90"
            />
            <text
              x={cx}
              y={cy - 48}
              textAnchor="middle"
              className="text-[32px] font-bold fill-foreground"
            >
              {Math.round(currentSupply)}°C
            </text>
          </svg>
          <div className="absolute top-4 right-4 text-[10px] text-muted-foreground text-right">
            <div>Krzywa: {curve}</div>
            <div>Przesunięcie: {offset > 0 ? `+${offset}` : offset}</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
