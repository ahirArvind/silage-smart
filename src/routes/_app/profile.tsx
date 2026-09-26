import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, SectionTitle, StatusPill } from "@/components/kf/primitives";
import { FARMER } from "@/lib/demo-data";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile · KrishiFeed AI" },
      { name: "description", content: "Farmer profile, farm details and testing summary." },
      { property: "og:title", content: "Profile · KrishiFeed AI" },
      { property: "og:description", content: "Farmer and farm details for the KrishiFeed AI prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProfilePage() {
  const { t } = useI18n();
  const { tests } = useApp();
  return (
    <div className="space-y-6">
      <SectionTitle title={t("nav_profile")} subtitle="Your farm details and testing summary." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">RP</span>
              <div>
                <h3 className="font-display text-xl font-semibold">{FARMER.name}</h3>
                <p className="text-sm text-muted-foreground">{FARMER.farm} · {FARMER.village}</p>
                <StatusPill tone="good" className="mt-1.5">Verified farmer (demo)</StatusPill>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Farmer ID", FARMER.farmerId],
                ["Herd size", `${FARMER.herd} cattle`],
                ["Tests on device", String(tests.length)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-secondary/70 p-4">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <QrCode value={FARMER.farmerId} />
            <p className="text-center text-xs text-muted-foreground">Farmer traceability code (prototype)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
