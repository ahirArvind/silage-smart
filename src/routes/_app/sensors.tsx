import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, Droplets, Gauge, Radio, Thermometer, Waves } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { DemoTag, SectionTitle, StatusPill } from "@/components/kf/primitives";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/sensors")({
  component: SensorsPage,
  head: () => ({
    meta: [
      { title: "Sensor Monitoring · KrishiFeed AI" },
      { name: "description", content: "Live pH, moisture, temperature and humidity sensor readings with trend chart." },
      { property: "og:title", content: "Sensor Monitoring · KrishiFeed AI" },
      { property: "og:description", content: "Simulated live IoT sensor dashboard for feed and silage testing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const seed = Array.from({ length: 10 }, (_, i) => ({
  time: `${String(9 + i).padStart(2, "0")}:00`,
  ph: Number((4.6 + Math.sin(i / 2) * 0.25).toFixed(2)),
  moisture: 58 + Math.round(Math.cos(i / 3) * 4 + i * 0.3),
  temperature: 28 + Math.round(Math.sin(i / 2.5) * 2 + i * 0.25),
  humidity: 64 + Math.round(Math.cos(i / 2) * 5),
}));

function SensorsPage() {
  const { t } = useI18n();
  const [series, setSeries] = useState(seed);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((n) => n + 1);
      setSeries((prev) => {
        const last = prev[prev.length - 1]!;
        const next = {
          time: `${String((9 + prev.length) % 24).padStart(2, "0")}:00`,
          ph: Number(Math.min(5.6, Math.max(4.1, last.ph + (Math.random() - 0.5) * 0.2)).toFixed(2)),
          moisture: Math.min(72, Math.max(52, last.moisture + Math.round((Math.random() - 0.5) * 4))),
          temperature: Math.min(36, Math.max(24, last.temperature + Math.round((Math.random() - 0.5) * 3))),
          humidity: Math.min(82, Math.max(55, last.humidity + Math.round((Math.random() - 0.5) * 5))),
        };
        return [...prev.slice(-11), next];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const latest = series[series.length - 1]!;
  const cards = [
    { l: "pH", v: latest.ph, icon: Waves, tone: latest.ph <= 4.5 ? "good" : "attention", s: latest.ph <= 4.5 ? t("normal") : t("attention") },
    { l: t("moisture"), v: `${latest.moisture}%`, icon: Droplets, tone: latest.moisture > 65 ? "risk" : "attention", s: latest.moisture > 65 ? t("highRisk") : t("attention") },
    { l: "Temperature", v: `${latest.temperature}°C`, icon: Thermometer, tone: latest.temperature > 32 ? "risk" : "good", s: latest.temperature > 32 ? "Warning" : t("normal") },
    { l: "Humidity", v: `${latest.humidity}%`, icon: Gauge, tone: latest.humidity > 70 ? "risk" : "attention", s: latest.humidity > 70 ? t("highRisk") : t("attention") },
    { l: "NIR", v: "Connected", icon: Radio, tone: "good", s: "Online" },
    { l: "Camera", v: "Connected", icon: Camera, tone: "good", s: "Online" },
  ] as const;

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("nav_sensors")}
        subtitle={`Simulated live updates · refresh #${tick}`}
        action={<DemoTag>Prototype sensor stream</DemoTag>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.l}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{c.l}</p>
                <p className="font-display text-2xl font-bold">{c.v}</p>
              </div>
              <StatusPill tone={c.tone as "good" | "attention" | "risk"}>{c.s}</StatusPill>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="font-display text-lg font-semibold">Sensor values over time</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="moisture" name="Moisture %" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="temperature" name="Temp °C" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
