import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Droplets, Thermometer, Warehouse } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { DemoTag, SectionTitle, StatusPill, riskTone } from "@/components/kf/primitives";
import { STORAGE_TREND, STORAGE_UNITS } from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/storage")({
  component: StoragePage,
  head: () => ({
    meta: [
      { title: "Storage Monitoring · KrishiFeed AI" },
      { name: "description", content: "Monitor storage unit temperature, humidity and mould risk with spoilage alerts." },
      { property: "og:title", content: "Storage Monitoring · KrishiFeed AI" },
      { property: "og:description", content: "Feed and silage storage conditions with spoilage risk alerts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function StoragePage() {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("nav_storage")}
        subtitle="Conditions inside your feed and silage storage units."
        action={<DemoTag>{t("demoBadge")}</DemoTag>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {STORAGE_UNITS.map((u) => (
          <Card key={u.name} className={u.status === "attention" ? "border-risk/40" : undefined}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                    <Warehouse className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{lang === "hi" ? u.nameHi : u.name}</h3>
                </div>
                <StatusPill tone={u.status === "good" ? "good" : "risk"} className="px-3 py-1.5 text-sm">
                  {u.status === "good" ? "GOOD" : "ATTENTION"}
                </StatusPill>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-secondary/70 p-3">
                  <Thermometer className="size-4 text-muted-foreground" />
                  <p className="mt-1 font-display text-xl font-bold">{u.temperature}°C</p>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                </div>
                <div className="rounded-xl bg-secondary/70 p-3">
                  <Droplets className="size-4 text-muted-foreground" />
                  <p className="mt-1 font-display text-xl font-bold">{u.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </div>
                <div className="rounded-xl bg-secondary/70 p-3">
                  <p className="mt-5 font-display text-xl font-bold">{u.moisture}</p>
                  <p className="text-xs text-muted-foreground">{t("moisture")}</p>
                </div>
                <div className="rounded-xl bg-secondary/70 p-3">
                  <p className="mt-5 font-display text-xl font-bold capitalize">{u.mouldRisk}</p>
                  <p className="text-xs text-muted-foreground">Mould risk</p>
                  <StatusPill tone={riskTone(u.mouldRisk)} className="mt-2" />
                </div>
              </div>

              {u.alerts.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {u.alerts.map((a) => (
                    <li key={a} className="flex items-center gap-2 rounded-lg bg-risk-soft px-3 py-2 text-sm text-risk">
                      <AlertTriangle className="size-4" /> {a}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="font-display text-lg font-semibold">Storage conditions today</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STORAGE_TREND} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="temperature" name="Temp °C" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.18} strokeWidth={2} />
                <Area type="monotone" dataKey="humidity" name="Humidity %" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
