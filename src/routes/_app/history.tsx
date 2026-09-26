import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoTag, SectionTitle, StatusPill, riskTone, scoreTone } from "@/components/kf/primitives";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Test History · KrishiFeed AI" },
      { name: "description", content: "Searchable history of feed and silage tests with quality scores and risk levels." },
      { property: "og:title", content: "Test History · KrishiFeed AI" },
      { property: "og:description", content: "Filter past feed and silage tests by type, quality and risk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function HistoryPage() {
  const { t } = useI18n();
  const { tests, setActiveSampleId } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [quality, setQuality] = useState("all");
  const [risk, setRisk] = useState("all");

  const rows = tests.filter((s) => {
    if (q && !`${s.id} ${s.subtype} ${s.batch}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (type !== "all" && s.sampleType !== type) return false;
    if (quality === "good" && s.qualityScore < 80) return false;
    if (quality === "attention" && (s.qualityScore >= 80 || s.qualityScore < 60)) return false;
    if (quality === "poor" && s.qualityScore >= 60) return false;
    if (risk !== "all" && s.mouldRisk !== risk) return false;
    return true;
  });

  const openReport = (id: string, sampleType: "feed" | "silage") => {
    setActiveSampleId(id);
    navigate({ to: sampleType === "feed" ? "/feed-analysis" : "/silage-analysis" });
  };

  return (
    <div className="space-y-6">
      <SectionTitle title={t("nav_history")} subtitle="All samples tested on this device." action={<DemoTag>{t("demoBadge")}</DemoTag>} />

      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="h-11 pl-9" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="feed">{t("feed")}</SelectItem>
              <SelectItem value="silage">{t("silage")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Quality" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All quality</SelectItem>
              <SelectItem value="good">Good (80+)</SelectItem>
              <SelectItem value="attention">Attention (60–79)</SelectItem>
              <SelectItem value="poor">Poor (below 60)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Risk" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              <SelectItem value="low">{t("lowRisk")}</SelectItem>
              <SelectItem value="medium">{t("mediumRisk")}</SelectItem>
              <SelectItem value="high">{t("highRisk")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("sample")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("protein")}</TableHead>
                <TableHead>{t("moisture")}</TableHead>
                <TableHead>{t("quality")}</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-semibold">{s.id}</TableCell>
                  <TableCell className="capitalize">{s.sampleType === "feed" ? t("feed") : t("silage")}</TableCell>
                  <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                  <TableCell>{s.protein}%</TableCell>
                  <TableCell>{s.moisture}%</TableCell>
                  <TableCell>
                    <StatusPill tone={scoreTone(s.qualityScore)}>{s.qualityScore}/100</StatusPill>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={riskTone(s.mouldRisk)} className="capitalize">{s.mouldRisk}</StatusPill>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openReport(s.id, s.sampleType)}>
                        {t("viewReport")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`${s.id} report prepared (prototype)`)}>
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    No samples match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
