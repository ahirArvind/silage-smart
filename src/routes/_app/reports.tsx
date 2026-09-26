import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DemoTag, LabDisclaimer, QrCode, ScoreRing, SectionTitle, StatusPill, riskTone } from "@/components/kf/primitives";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { FARMER } from "@/lib/demo-data";
import feedImg from "@/assets/feed-sample.jpg";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Report · KrishiFeed AI" },
      { name: "description", content: "Full sample report with nutrition results, sensor readings, advisory and QR traceability code." },
      { property: "og:title", content: "Report · KrishiFeed AI" },
      { property: "og:description", content: "Downloadable feed and silage test report with QR traceability." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ReportsPage() {
  const { t } = useI18n();
  const { tests, activeSampleId } = useApp();
  const s = tests.find((x) => x.id === activeSampleId) ?? tests[0]!;

  const download = () => {
    const lines = [
      `KrishiFeed AI — Prototype Test Report`,
      `Farmer: ${FARMER.name} (${FARMER.farmerId}) · ${FARMER.farm}, ${FARMER.village}`,
      `Sample: ${s.id} · ${s.subtype} · Batch ${s.batch}`,
      `Date: ${new Date(s.date).toLocaleString()}`,
      ``,
      `Quality score: ${s.qualityScore}/100`,
      `Protein: ${s.protein}%  Moisture: ${s.moisture}%  Fibre: ${s.fibre}%  Energy: ${s.energy} kcal/kg`,
      s.ph ? `pH: ${s.ph}` : ``,
      `Temperature: ${s.temperature}°C  Humidity: ${s.humidity}%`,
      `Mould risk: ${s.mouldRisk}  Adulteration risk: ${s.adulterationRisk}`,
      `Model confidence: ${Math.round(s.confidence * 100)}%`,
      ``,
      `Advisory: ${s.advisory}`,
      ``,
      `DISCLAIMER: AI screening estimate only, generated from prototype demo data.`,
      `This is not a laboratory-confirmed result. Laboratory confirmation is recommended`,
      `when contamination or mycotoxins are suspected.`,
    ].filter(Boolean);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${s.id}-krishifeed-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Prototype report downloaded");
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("nav_reports")}
        subtitle={`${s.id} · generated ${new Date().toLocaleString()}`}
        action={
          <Button onClick={download} className="h-12">
            <Download className="mr-2 size-4" /> Download PDF Report
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Farmer</p>
              <p className="font-semibold">{FARMER.name}</p>
              <p className="text-sm text-muted-foreground">{FARMER.farm}</p>
              <p className="text-sm text-muted-foreground">{FARMER.village} · {FARMER.farmerId}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Sample</p>
              <p className="font-semibold">{s.id}</p>
              <p className="text-sm text-muted-foreground">{s.subtype} · Batch {s.batch}</p>
              <p className="text-sm text-muted-foreground">{new Date(s.date).toLocaleString()}</p>
            </div>
            <QrCode value={s.id} />
            <p className="text-xs text-muted-foreground">Scan for sample ID, date, type, quality result and advisory.</p>
          </div>

          <div className="space-y-4">
            <img src={s.imageUrl ?? feedImg} alt="Sample" loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                [t("protein"), `${s.protein}%`],
                [t("moisture"), `${s.moisture}%`],
                [t("fibre"), `${s.fibre}%`],
                [t("energy"), `${s.energy} kcal/kg`],
                ["pH", s.ph ? String(s.ph) : "—"],
                ["Temperature", `${s.temperature}°C`],
                ["Humidity", `${s.humidity}%`],
                [t("confidence"), `${Math.round(s.confidence * 100)}%`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-secondary/70 p-2.5">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <ScoreRing score={s.qualityScore} size={150} />
              <div className="mt-3 flex gap-2">
                <StatusPill tone={riskTone(s.mouldRisk)}>Mould: {s.mouldRisk}</StatusPill>
                <StatusPill tone={riskTone(s.adulterationRisk)}>Adulteration: {s.adulterationRisk}</StatusPill>
              </div>
            </div>
            <div className="rounded-xl bg-secondary/60 p-4 text-sm">
              <p className="font-semibold">Advisory</p>
              <p className="mt-1 text-muted-foreground">{s.advisory}</p>
            </div>
            <DemoTag>{t("demoBadge")}</DemoTag>
            <LabDisclaimer text="AI prediction, not a laboratory-confirmed result. Laboratory confirmation is recommended when contamination or mycotoxins are suspected." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
