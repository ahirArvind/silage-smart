import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoTag, LabDisclaimer, ScoreRing, SectionTitle, StatusPill, riskTone, scoreTone } from "@/components/kf/primitives";
import { ArchitectureDiagram } from "@/components/kf/ArchitectureDiagram";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { CONFIDENCES } from "@/lib/demo-data";
import feedImg from "@/assets/feed-sample.jpg";

export const Route = createFileRoute("/_app/feed-analysis")({
  component: FeedAnalysis,
  head: () => ({
    meta: [
      { title: "Feed Quality Report · KrishiFeed AI" },
      { name: "description", content: "AI-estimated cattle feed nutrition, contamination screening and confidence values." },
      { property: "og:title", content: "Feed Quality Report · KrishiFeed AI" },
      { property: "og:description", content: "Protein, moisture, fibre and energy estimates with contamination screening." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function FeedAnalysis() {
  const { t, lang } = useI18n();
  const { tests, activeSampleId, setActiveSampleId } = useApp();
  const feedTests = tests.filter((x) => x.sampleType === "feed");
  const sample = feedTests.find((x) => x.id === activeSampleId) ?? feedTests[0];

  if (!sample) return <p className="text-muted-foreground">No feed samples yet.</p>;

  const params = [
    { label: t("protein"), value: `${sample.protein}%`, note: "Target 16–20%" },
    { label: t("moisture"), value: `${sample.moisture}%`, note: "Target below 12%" },
    { label: t("fibre"), value: `${sample.fibre}%`, note: "Target 10–16%" },
    { label: t("energy"), value: `${sample.energy.toLocaleString()} kcal/kg`, note: "Target 2,800–3,400" },
    { label: t("minerals"), value: t("normal"), note: "Screened, not quantified" },
  ];

  const contamination = [
    { label: "Urea adulteration", risk: sample.adulterationRisk },
    { label: "Sand / silica", risk: sample.sandRisk },
    { label: "Fungal contamination", risk: sample.fungalRisk },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Feed Quality Report"
        subtitle={`${sample.id} · ${new Date(sample.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
        action={
          <div className="flex items-center gap-2">
            <Select value={sample.id} onValueChange={setActiveSampleId}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {feedTests.map((s) => (
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
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6">
            <ScoreRing score={sample.qualityScore} />
            <StatusPill tone={scoreTone(sample.qualityScore)} className="mt-4 px-4 py-1.5 text-sm">
              {sample.qualityScore >= 80 ? "GOOD QUALITY" : sample.qualityScore >= 60 ? "ATTENTION REQUIRED" : "HIGH RISK"}
            </StatusPill>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {t("overallQuality")} · {t("aiEstimated")}
            </p>
            <img
              src={sample.imageUrl ?? feedImg}
              alt="Feed sample"
              loading="lazy"
              className="mt-5 aspect-[4/3] w-full rounded-xl object-cover"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div>
            <h3 className="mb-3 font-display text-lg font-semibold">
              Nutritional parameters <DemoTag>{t("aiEstimated")}</DemoTag>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {params.map((p) => (
                <Card key={p.label}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{p.label}</p>
                    <p className="font-display text-2xl font-bold">{p.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-lg font-semibold">{t("contamination")}</h3>
            <Card>
              <CardContent className="space-y-3 p-5">
                {contamination.map((c) => (
                  <div key={c.label} className="flex items-center justify-between border-b border-border pb-2.5 last:border-0 last:pb-0">
                    <span className="text-sm font-medium">{c.label}</span>
                    <StatusPill tone={riskTone(c.risk)}>
                      {c.risk === "low" ? t("lowRisk") : c.risk === "medium" ? t("mediumRisk") : t("highRisk")}
                    </StatusPill>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mycotoxin / aflatoxin</span>
                  <StatusPill tone="attention">{t("screeningRequired")}</StatusPill>
                </div>
                <LabDisclaimer text={t("labNote")} />
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="mb-3 font-display text-lg font-semibold">{t("confidence")}</h3>
            <Card>
              <CardContent className="space-y-4 p-5">
                {CONFIDENCES.map((c) => (
                  <div key={c.labelEn}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>{lang === "hi" ? c.labelHi : c.labelEn}</span>
                      <span className="font-semibold">{c.value}%</span>
                    </div>
                    <Progress value={c.value} className="h-2" />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Confidence describes how certain the prototype model is — it is not an accuracy guarantee.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold">Advisory</h3>
            <p className="mt-2 text-sm text-muted-foreground">{sample.advisory}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Maintain dry storage", "Keep the feed protected from moisture", "Re-test if colour, smell or texture changes"].map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <span className="text-good">✓</span> {r}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-5 h-12 w-full">
              <Link to="/advisory">
                <FlaskConical className="mr-2 size-4" /> Open full advisory
              </Link>
            </Button>
          </CardContent>
        </Card>
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold">How this result was produced</h3>
          <ArchitectureDiagram />
        </div>
      </div>
    </div>
  );
}
