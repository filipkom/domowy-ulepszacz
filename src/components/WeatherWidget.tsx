import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MapPin, RefreshCw, CloudSun, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WeatherWidgetProps {
  onTemperatureUpdate: (temp: number) => void;
}

interface WeatherData {
  temp: number;
  city: string;
  description: string;
}

// Stała lokalizacja: Rybnik, ul. Polna
const LOCATION = {
  latitude: 50.0971,
  longitude: 18.5463,
  city: "Rybnik"
};

export const WeatherWidget = ({ onTemperatureUpdate }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&current=temperature_2m,weather_code&timezone=auto`
      );

      if (!response.ok) throw new Error("Błąd pobierania pogody");

      const data = await response.json();
      const temp = Math.round(data.current.temperature_2m);

      const weatherData: WeatherData = {
        temp,
        city: LOCATION.city,
        description: getWeatherDescription(data.current.weather_code),
      };

      setWeather(weatherData);
      onTemperatureUpdate(temp);
      toast.success(`Temperatura zewnętrzna: ${temp}°C`);
    } catch (err) {
      setError("Błąd pobierania pogody");
      toast.error("Nie udało się pobrać danych pogodowych");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number): string => {
    if (code === 0) return "Bezchmurnie";
    if (code <= 3) return "Częściowe zachmurzenie";
    if (code <= 49) return "Mgła";
    if (code <= 59) return "Mżawka";
    if (code <= 69) return "Deszcz";
    if (code <= 79) return "Śnieg";
    if (code <= 99) return "Burza";
    return "Brak danych";
  };

  useEffect(() => {
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minut

    const checkAndFetch = () => {
      const cached = localStorage.getItem("nibe-weather");
      if (!cached) {
        fetchWeather();
        return;
      }
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - data.timestamp;
      if (cacheAge > CACHE_DURATION) {
        fetchWeather();
      } else {
        setWeather(data.weather);
        onTemperatureUpdate(data.weather.temp);
      }
    };

    checkAndFetch();

    // Odświeżaj co 30 minut
    const interval = setInterval(fetchWeather, CACHE_DURATION);

    // Odśwież gdy użytkownik wraca do karty
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const cached = localStorage.getItem("nibe-weather");
        if (cached) {
          const cacheAge = Date.now() - JSON.parse(cached).timestamp;
          if (cacheAge > CACHE_DURATION) {
            fetchWeather();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (weather) {
      localStorage.setItem(
        "nibe-weather",
        JSON.stringify({ weather, timestamp: Date.now() })
      );
    }
  }, [weather]);

  return (
    <GlassCard className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <CloudSun size={20} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Pogoda na żywo</div>
            {weather ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{weather.temp}°C</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={10} />
                  {weather.city}
                </span>
              </div>
            ) : error ? (
              <span className="text-xs text-destructive">{error}</span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Kliknij aby pobrać
              </span>
            )}
          </div>
        </div>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin text-primary" />
          ) : (
            <RefreshCw size={18} className="text-muted-foreground" />
          )}
        </button>
      </div>
      {weather && (
        <div className="mt-2 text-[10px] text-muted-foreground">
          {weather.description} • Kliknij odśwież aby zaktualizować
        </div>
      )}
    </GlassCard>
  );
};
