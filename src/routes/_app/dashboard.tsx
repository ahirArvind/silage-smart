import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ClipboardList, Leaf, Plus, Sprout, Warehouse } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DemoTag, ScoreRing, SectionTitle, StatusPill, scoreTone } from "@/components/kf/primitives";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard · KrishiFeed AI" },
      { name: "description", content: "Feed and silage testing dashboard with quality scores, recent tests and storage alerts." },
      { property: "og:title", content: "Dashboard · KrishiFeed AI" },
      { property: "og:description", content: "Track feed and silage quality tests, alerts and nutrition trends." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Dashboard() {
  const { t, lang } = useI18n();
  const { tests, setActiveSampleId } = useApp();
  const navigate = useNavigate();

  const stats = [
    { label: t("testsCompleted"), value: 128, icon: ClipboardList, tone: "bg-secondary text-primary" },
    { label: t("goodQuality"), value: 94, icon: CheckCircle2, tone: "bg-good-soft text-good" },
    { label: t("attentionRequired"), value: 21, icon: AlertTriangle, tone: "bg-warn-soft text-warn-foreground" },
    { label: t("storageAlerts"), value: 13, icon: Warehouse, tone: "bg-risk-soft text-risk" },
  ];

  const latest = tests[0];
  const overview = [
    { name: t("protein"), value: latest.protein, target: 18, unit: "%" },
    { name: t("moisture"), value: latest.moisture, target: 10, unit: "%" },
    { name: t("fibre"), value: latest.fibre, target: 14, unit: "%" },
    { name: t("energy"), value: latest.energy / 200, target: 16, unit: "" },
  ];

  const open = (id: string, type: "feed" | "silage") => {
    setActiveSampleId(id);
    navigate({ to: type === "feed" ? "/feed-analysis" : "/silage-analysis" });
  };

  return (
    <div className="space-y-8">
      <section className="surface-field rounded-3xl border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{t("greeting")}</h1>
            <p className="mt-1.5 text-muted-foreground">{t("greetingSub")}</p>
          </div>
          <DemoTag>{t("demoBadge")}</DemoTag>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="h-16 flex-1 text-lg sm:max-w-sm">
            <Link to="/new-test">
              <Plus className="mr-1 size-6" /> {t("startNewTest")}
            </Link>
          </Button>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="lg" className="h-16 flex-1 text-base">
              <Link to="/new-test" search={{ type: "feed" }}>
                <Leaf className="mr-1 size-5" /> {t("testFeed")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 flex-1 text-base">
              <Link to="/new-test" search={{ type: "silage" }}>
                <Sprout className="mr-1 size-5" /> {t("testSilage")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className={`grid size-12 place-items-center rounded-2xl ${s.tone}`}>
                <s.icon className="size-6" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionTitle
            title={t("recentTests")}
            subtitle={lang === "hi" ? "किसी नमूने पर क्लिक करके पूरी रिपोर्ट देखें।" : "Tap a sample to open its detailed report."}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/history">{t("nav_history")}</Link>
              </Button>
            }
          />
          <div className="space-y-3">
            {tests.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => open(s.id, s.sampleType)}
                className="flex w-full flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-shadow hover:shadow-soft"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                  {s.sampleType === "feed" ? <Leaf className="size-5" /> : <Sprout className="size-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.id}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {s.subtype} · {new Date(s.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold">{s.qualityScore}/100</p>
                  <StatusPill tone={scoreTone(s.qualityScore)}>
                    {s.qualityScore >= 80 ? t("good") : s.qualityScore >= 60 ? t("attention") : t("highRisk")}
                  </StatusPill>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle title={t("qualityOverview")} subtitle={t("aiEstimated")} />
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-center">
                <ScoreRing score={latest.qualityScore} size={150} />
              </div>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {overview.map((entry, i) => (
                        <Cell key={i} fill={`var(--color-chart-${(i % 4) + 1})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Energy shown scaled (kcal/kg ÷ 200) for comparison. Prototype values.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
