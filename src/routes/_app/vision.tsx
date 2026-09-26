import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoTag, LabDisclaimer, SectionTitle, StatusPill } from "@/components/kf/primitives";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import feedImg from "@/assets/feed-sample.jpg";
import silageImg from "@/assets/silage-sample.jpg";

export const Route = createFileRoute("/_app/vision")({
  component: VisionPage,
  head: () => ({
    meta: [
      { title: "Image Analysis · KrishiFeed AI" },
      { name: "description", content: "Computer vision screening of colour, texture, foreign material and mould-like regions in feed and silage." },
      { property: "og:title", content: "Image Analysis · KrishiFeed AI" },
      { property: "og:description", content: "Prototype computer vision predictions for feed and silage samples." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function VisionPage() {
  const { t } = useI18n();
  const { tests } = useApp();
  const [kind, setKind] = useState<"feed" | "silage">("feed");
  const sample = tests.find((x) => x.sampleType === kind) ?? tests[0];
  const img = sample?.imageUrl ?? (kind === "feed" ? feedImg : silageImg);

  const features =
    kind === "feed"
      ? [
          { l: "Colour abnormality", tone: "good" as const, v: "Not detected" },
          { l: "Texture abnormality", tone: "good" as const, v: "Not detected" },
          { l: "Visible foreign material", tone: "attention" as const, v: "Few small particles" },
          { l: "Mould-like regions", tone: "good" as const, v: "Not detected" },
        ]
      : [
          { l: "Colour abnormality", tone: "attention" as const, v: "Darker patch on right face" },
          { l: "Texture abnormality", tone: "attention" as const, v: "Clumping detected" },
          { l: "Visible foreign material", tone: "good" as const, v: "Not detected" },
          { l: "Mould-like regions", tone: "risk" as const, v: "1 region flagged" },
        ];

  const probs =
    kind === "feed"
      ? [
          { l: "Normal sample probability", v: 88 },
          { l: "Mould probability", v: 6 },
          { l: "Foreign material probability", v: 6 },
        ]
      : [
          { l: "Normal sample probability", v: 75 },
          { l: "Mould probability", v: 18 },
          { l: "Foreign material probability", v: 7 },
        ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("nav_vision")}
        subtitle="Computer vision screening of the captured sample image."
        action={<DemoTag>Prototype predictions</DemoTag>}
      />

      <Tabs value={kind} onValueChange={(v) => setKind(v as "feed" | "silage")}>
        <TabsList>
          <TabsTrigger value="feed">{t("feed")}</TabsTrigger>
          <TabsTrigger value="silage">{t("silage")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="relative overflow-hidden rounded-xl">
              <img src={img} alt={`${kind} sample`} loading="lazy" className="w-full object-cover" />
              {kind === "silage" && (
                <div className="absolute right-[12%] top-[28%] h-[34%] w-[28%] rounded-md border-2 border-risk bg-risk/10" />
              )}
              <div className="absolute bottom-3 left-3 rounded-lg bg-card/90 px-3 py-1.5 text-xs font-semibold">
                {sample?.id ?? "Demo sample"}
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Bounding boxes are simulated and shown only when an image is available.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-3 p-5">
              <h3 className="font-display text-lg font-semibold">Detected features</h3>
              {features.map((f) => (
                <div key={f.l} className="flex items-center justify-between gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{f.l}</p>
                    <p className="text-xs text-muted-foreground">{f.v}</p>
                  </div>
                  <StatusPill tone={f.tone}>
                    {f.tone === "good" ? t("good") : f.tone === "attention" ? t("attention") : t("highRisk")}
                  </StatusPill>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <h3 className="font-display text-lg font-semibold">AI confidence panel</h3>
              {probs.map((p) => (
                <div key={p.l}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{p.l}</span>
                    <span className="font-semibold">{p.v}%</span>
                  </div>
                  <Progress value={p.v} className="h-2" />
                </div>
              ))}
              <LabDisclaimer text={t("labNote")} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
