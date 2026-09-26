import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LabDisclaimer, SectionTitle, StatusPill } from "@/components/kf/primitives";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/advisory")({
  component: AdvisoryPage,
  head: () => ({
    meta: [
      { title: "Farmer Advisory · KrishiFeed AI" },
      { name: "description", content: "Simple feed and silage advice in English and Hindi based on the latest test results." },
      { property: "og:title", content: "Farmer Advisory · KrishiFeed AI" },
      { property: "og:description", content: "Plain-language actions for feed storage, silage monitoring and lab follow-up." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AdvisoryPage() {
  const { t, lang } = useI18n();

  const feed = {
    titleEn: "Feed Advisory",
    titleHi: "चारा सलाह",
    msgEn: "Your feed appears to have acceptable nutritional quality.",
    msgHi: "आपके चारे की पोषण गुणवत्ता ठीक लग रही है।",
    tone: "good" as const,
    itemsEn: ["Maintain dry storage", "Keep the feed protected from moisture", "Re-test if colour, smell or texture changes"],
    itemsHi: ["भंडारण सूखा रखें", "चारे को नमी से बचाएँ", "रंग, गंध या बनावट बदलने पर दोबारा जाँचें"],
  };

  const silage = {
    titleEn: "Silage Advisory",
    titleHi: "साइलेज सलाह",
    msgEn: "Silage requires monitoring.",
    msgHi: "साइलेज पर नज़र रखने की ज़रूरत है।",
    tone: "attention" as const,
    itemsEn: ["Monitor moisture", "Check storage temperature", "Inspect for mould", "Consider laboratory testing if contamination is suspected"],
    itemsHi: ["नमी पर नज़र रखें", "भंडारण तापमान जाँचें", "फफूंदी देखें", "संदेह होने पर प्रयोगशाला जाँच कराएँ"],
  };

  const cards = [
    { ...feed, icon: Leaf },
    { ...silage, icon: Sprout },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("nav_advisory")}
        subtitle={lang === "hi" ? "आसान भाषा में अगले कदम।" : "Simple next steps, in plain language."}
      />

      <div className="flex flex-wrap gap-3 text-sm">
        <StatusPill tone="good">🟢 {t("good")}</StatusPill>
        <StatusPill tone="attention">🟡 {t("attention")}</StatusPill>
        <StatusPill tone="risk">🔴 {t("highRisk")}</StatusPill>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((c) => (
          <Card key={c.titleEn} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                  <c.icon className="size-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{lang === "hi" ? c.titleHi : c.titleEn}</h3>
                  <StatusPill tone={c.tone}>{c.tone === "good" ? t("good") : t("attention")}</StatusPill>
                </div>
              </div>
              <p className="mt-4 text-lg">{lang === "hi" ? c.msgHi : c.msgEn}</p>
              <p className="mt-5 text-sm font-semibold text-muted-foreground">{t("recommendations")}</p>
              <ul className="mt-2 space-y-2.5">
                {(lang === "hi" ? c.itemsHi : c.itemsEn).map((i) => (
                  <li key={i} className="flex items-start gap-2 rounded-xl bg-secondary/60 px-4 py-3 text-base">
                    <span className={c.tone === "good" ? "text-good" : "text-warn-foreground"}>✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <LabDisclaimer text={t("labNote")} />
    </div>
  );
}
