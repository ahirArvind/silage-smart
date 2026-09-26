import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoTag, SectionTitle } from "@/components/kf/primitives";
import { NIR_FEATURE_REGIONS, nirSpectrum } from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/nir")({
  component: NirPage,
  head: () => ({
    meta: [
      { title: "NIR Spectroscopy · KrishiFeed AI" },
      { name: "description", content: "Near-infrared spectrum visualisation with feature regions and nutrition predictions." },
      { property: "og:title", content: "NIR Spectroscopy · KrishiFeed AI" },
      { property: "og:description", content: "Raw and preprocessed NIR spectra with protein, moisture, fibre and energy estimates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Mode = "raw" | "preprocessed" | "regions" | "compare";

function NirPage() {
  const { t, lang } = useI18n();
  const [mode, setMode] = useState<Mode>("raw");

  const data = useMemo(() => {
    const a = nirSpectrum(mode === "preprocessed" ? "preprocessed" : "raw", 1);
    const b = nirSpectrum(mode === "preprocessed" ? "preprocessed" : "raw", 1.7);
    return a.map((p, i) => ({ ...p, second: b[i]?.absorbance }));
  }, [mode]);

  const predictions = [
    { l: t("protein"), v: "18.4 %", c: "92% confidence" },
    { l: t("moisture"), v: "9.2 %", c: "95% confidence" },
    { l: t("fibre"), v: "13.8 %", c: "90% confidence" },
    { l: t("energy"), v: "3,150 kcal/kg", c: "89% confidence" },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("nav_nir")}
        subtitle={lang === "hi" ? "नमूने का निकट-अवरक्त स्पेक्ट्रम" : "Near-infrared absorbance of the scanned sample."}
        action={<DemoTag>Prototype NIR data</DemoTag>}
      />

      <Card>
        <CardContent className="p-5">
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="raw">Raw spectrum</TabsTrigger>
              <TabsTrigger value="preprocessed">Preprocessed</TabsTrigger>
              <TabsTrigger value="regions">Feature regions</TabsTrigger>
              <TabsTrigger value="compare">Compare samples</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="wavelength" tick={{ fontSize: 11 }} label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -5, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: "Absorbance", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                {mode === "regions" &&
                  NIR_FEATURE_REGIONS.map((r) => (
                    <ReferenceArea
                      key={r.labelEn}
                      x1={r.from}
                      x2={r.to}
                      fill="var(--color-primary)"
                      fillOpacity={0.12}
                      label={{ value: lang === "hi" ? r.labelHi : r.labelEn, fontSize: 10 }}
                    />
                  ))}
                <Line type="monotone" dataKey="absorbance" name="Sample FD-2026-01024" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
                {mode === "compare" && (
                  <Line type="monotone" dataKey="second" name="Sample FD-2026-01019" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={false} />
                )}
                {mode === "compare" && <Legend wrapperStyle={{ fontSize: 12 }} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Prototype NIR data — connect a calibrated spectrometer for real measurements.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {predictions.map((p) => (
          <Card key={p.l}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{p.l}</p>
              <p className="font-display text-2xl font-bold">{p.v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.c} · AI-estimated</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
