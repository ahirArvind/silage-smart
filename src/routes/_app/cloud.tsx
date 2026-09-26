import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { DemoTag, SectionTitle } from "@/components/kf/primitives";
import { CLOUD_STATS, QUALITY_DISTRIBUTION, STORAGE_TREND, TESTS_PER_DAY } from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/cloud")({
  component: CloudPage,
  head: () => ({
    meta: [
      { title: "Cloud Dashboard · KrishiFeed AI" },
      { name: "description", content: "Aggregated analytics across farmers: sample volume, quality distribution and storage alerts." },
      { property: "og:title", content: "Cloud Dashboard · KrishiFeed AI" },
      { property: "og:description", content: "Cluster-level feed and silage testing analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tooltipStyle = { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 };

function CloudPage() {
  const { t } = useI18n();
  const stats = [
    { l: "Total Samples", v: CLOUD_STATS.totalSamples },
    { l: "Farmers", v: CLOUD_STATS.farmers },
    { l: "Average Quality", v: `${CLOUD_STATS.avgQuality}%` },
    { l: t("attentionRequired"), v: CLOUD_STATS.attentionSamples },
    { l: t("storageAlerts"), v: CLOUD_STATS.storageAlerts },
  ];
  const feedVsSilage = [
    { name: "Feed", value: 80 },
    { name: "Silage", value: 48 },
  ];
  const contaminationAlerts = [
    { week: "W1", alerts: 4 },
    { week: "W2", alerts: 7 },
    { week: "W3", alerts: 5 },
    { week: "W4", alerts: 9 },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title={t("nav_cloud")} subtitle="Aggregated view across the dairy cluster." action={<DemoTag>{t("demoBadge")}</DemoTag>} />

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="font-display text-3xl font-bold">{s.v}</p>
              <p className="text-sm text-muted-foreground">{s.l}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold">Tests per day</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TESTS_PER_DAY} margin={{ left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="feed" name="Feed" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="silage" name="Silage" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold">Feed vs silage tests</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={feedVsSilage} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {feedVsSilage.map((_, i) => (
                      <Cell key={i} fill={`var(--color-chart-${i + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold">Quality distribution</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={QUALITY_DISTRIBUTION} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="band" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold">Contamination alerts</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contaminationAlerts} margin={{ left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="alerts" stroke="var(--color-chart-5)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold">Storage temperature & humidity</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={STORAGE_TREND} margin={{ left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="temperature" name="Temp °C" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
