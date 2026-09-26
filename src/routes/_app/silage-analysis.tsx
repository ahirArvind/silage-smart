import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoTag, LabDisclaimer, ScoreRing, SectionTitle, StatusPill, riskTone, scoreTone } from "@/components/kf/primitives";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import silageImg from "@/assets/silage-sample.jpg";

export const Route = createFileRoute("/_app/silage-analysis")({
  component: SilageAnalysis,
  head: () => ({
    meta: [
      { title: "Silage Quality Report · KrishiFeed AI" },
      { name: "description", content: "Silage pH, moisture, fermentation quality, mould risk and spoilage screening." },
      { property: "og:title", content: "Silage Quality Report · KrishiFeed AI" },
      { property: "og:description", content: "Fermentation quality and spoilage risk screening for silage samples." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function SilageAnalysis() {
  const { t, lang } = useI18n();
  const { tests, activeSampleId, setActiveSampleId } = useApp();
  const silageTests = tests.filter((x) => x.sampleType === "silage");
  const sample = silageTests.find((x) => x.id === activeSampleId) ?? silageTests[0];
  if (!sample) return <p className="text-muted-foreground">No silage samples yet.</p>;

  const img = sample.imageUrl ?? silageImg;
  const fermentation = (sample.ph ?? 4.8) <= 4.5 ? "Good" : (sample.ph ?? 4.8) <= 5 ? "Good" : "Poor";

  const params = [
    { l: "pH", v: String(sample.ph ?? 4.8), tone: (sample.ph ?? 4.8) <= 4.5 ? "good" : "attention" },
    { l: t("moisture"), v: `${sample.moisture}%`, tone: sample.moisture > 65 ? "risk" : "attention" },
    { l: "Temperature", v: `${sample.temperature}°C`, tone: sample.temperature > 33 ? "risk" : "attention" },
    { l: "Mould risk", v: sample.mouldRisk, tone: riskTone(sample.mouldRisk) },
    { l: "Fermentation quality", v: fermentation, tone: "good" },
    { l: "Spoilage risk", v: sample.mouldRisk, tone: riskTone(sample.mouldRisk) },
  ] as const;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Silage Quality Report"
        subtitle={`${sample.id} · ${new Date(sample.date).toLocaleDateString()}`}
        action={
          <div className="flex items-center gap-2">
            <Select value={sample.id} onValueChange={setActiveSampleId}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {silageTests.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild variant="outline">
              <Link to="/reports">
                <Download className="mr-2 size-4" /> {t("downloadReport")}
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <ScoreRing score={sample.qualityScore} />
            <StatusPill tone={scoreTone(sample.qualityScore)} className="mt-4 px-4 py-1.5 text-sm">
              {sample.qualityScore >= 80 ? "GOOD QUALITY" : sample.qualityScore >= 60 ? "ATTENTION REQUIRED" : "HIGH RISK"}
            </StatusPill>
            <p className="mt-3 text-xs text-muted-foreground">{t("aiEstimated")}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="mb-3 font-display text-lg font-semibold">
              Parameters <DemoTag>{t("demoBadge")}</DemoTag>
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {params.map((p) => (
                <div key={p.l} className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">{p.l}</p>
                  <p className="font-display text-2xl font-bold capitalize">{p.v}</p>
                  <StatusPill tone={p.tone as "good" | "attention" | "risk"} className="mt-2">
                    {p.tone === "good" ? t("good") : p.tone === "attention" ? t("attention") : t("highRisk")}
                  </StatusPill>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold">Visual analysis</h3>
            <div className="relative mt-3 overflow-hidden rounded-xl">
              <img src={img} alt="Silage sample" loading="lazy" className="w-full object-cover" />
              <div className="absolute right-[12%] top-[28%] h-[34%] w-[28%] rounded-md border-2 border-risk bg-risk/10">
                <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-risk px-1.5 py-0.5 text-[10px] font-semibold text-risk-foreground">
                  Potential mould / spoilage region
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Simulated detection overlay on a prototype image — not a laboratory confirmation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <h3 className="font-display text-lg font-semibold">Silage recommendation</h3>
            <p className="text-sm text-muted-foreground">{sample.advisory}</p>
            <ul className="space-y-2 text-sm">
              {["Monitor moisture", "Check storage temperature", "Inspect for mould", "Consider laboratory testing if contamination is suspected"].map(
                (r) => (
                  <li key={r} className="flex items-center gap-2">
                    <span className="text-warn-foreground">•</span> {r}
                  </li>
                ),
              )}
            </ul>
            <LabDisclaimer text={t("labNote")} />
            <Button asChild className="h-12 w-full">
              <Link to="/advisory">{lang === "hi" ? "पूरी सलाह देखें" : "Open full advisory"}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
