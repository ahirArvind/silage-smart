import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LabDisclaimer, SectionTitle, StatusPill } from "@/components/kf/primitives";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings · KrishiFeed AI" },
      { name: "description", content: "Language, demo mode and offline synchronisation settings." },
      { property: "og:title", content: "Settings · KrishiFeed AI" },
      { property: "og:description", content: "Control demo mode, offline testing and language for KrishiFeed AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { online, toggleOnline, demoMode, setDemoMode, pendingSync, tests } = useApp();

  return (
    <div className="space-y-6">
      <SectionTitle title={t("nav_settings")} subtitle="Prototype controls for the demo." />

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-base">Demo mode</Label>
              <p className="text-sm text-muted-foreground">All AI results come from the prototype demo model.</p>
            </div>
            <Switch checked={demoMode} onCheckedChange={setDemoMode} />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <Label className="text-base">Connection</Label>
              <p className="text-sm text-muted-foreground">
                {online
                  ? `${tests.length} records synchronized with cloud.`
                  : `${t("offlineNote")} ${pendingSync} record(s) waiting to sync.`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill tone={online ? "good" : "attention"}>{online ? t("synced") : t("offline")}</StatusPill>
              <Button variant="outline" onClick={toggleOnline}>
                {online ? "Go offline" : "Reconnect & sync"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <Label className="text-base">Language / भाषा</Label>
              <p className="text-sm text-muted-foreground">Farmer-facing screens switch language instantly.</p>
            </div>
            <div className="flex gap-2">
              <Button variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>English</Button>
              <Button variant={lang === "hi" ? "default" : "outline"} onClick={() => setLang("hi")}>हिंदी</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <LabDisclaimer text="This prototype provides rapid AI screening estimates. It does not replace laboratory testing, and results are not laboratory-confirmed." />
    </div>
  );
}
