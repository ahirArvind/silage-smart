import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, SectionTitle, StatusPill } from "@/components/kf/primitives";
import { FARMER } from "@/lib/demo-data";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Farmer Details · KrishiFeed AI" },
      { name: "description", content: "Optional farmer details and contact permissions for feed and silage tests." },
      { property: "og:title", content: "Farmer Details · KrishiFeed AI" },
      { property: "og:description", content: "Review optional farmer details and withdraw contact permission while retaining test records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProfilePage() {
  const { t, lang } = useI18n();
  const { tests, withdrawContact } = useApp();
  const farmerTests = tests.filter((test) => test.farmerDetails?.name || test.farmerDetails?.phone);
  return (
    <div className="space-y-6">
      <SectionTitle title={t("nav_profile")} subtitle={lang === "hi" ? "किसान विवरण वैकल्पिक हैं। बिना फ़ोन के भी जाँच पूरी की जा सकती है।" : "Farmer details are optional. A test can be completed without a phone."} />
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">{lang === "hi" ? "हाल की जाँचों के किसान विवरण" : "Farmer details by test"}</h2>
        {farmerTests.length === 0 ? (
          <p className="text-sm text-muted-foreground">{lang === "hi" ? "अभी किसी जाँच में किसान विवरण नहीं जोड़े गए हैं।" : "No farmer details have been added to a test yet."}</p>
        ) : farmerTests.map((test) => (
          <Card key={test.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{test.id} · {new Date(test.date).toLocaleDateString()}</p>
                <h3 className="font-display text-lg font-semibold">{test.farmerDetails?.name || (lang === "hi" ? "नाम नहीं दिया गया" : "No name provided")}</h3>
                <p className="text-sm">{test.farmerDetails?.phone || (lang === "hi" ? "फ़ोन नहीं रखा गया" : "No phone kept")}</p>
                <p className="text-xs text-muted-foreground">
                  {lang === "hi" ? "अनुमति:" : "Permission:"} {[
                    test.farmerDetails?.contactForTest && (lang === "hi" ? "जाँच के लिए संपर्क" : "contact about this test"),
                    test.farmerDetails?.sendAdvice && (lang === "hi" ? "सलाह संदेश" : "advisory messages"),
                  ].filter(Boolean).join(", ") || (lang === "hi" ? "कोई नहीं" : "none")}
                </p>
              </div>
              {(test.farmerDetails?.phone || test.farmerDetails?.contactForTest || test.farmerDetails?.sendAdvice) && (
                <Button variant="outline" onClick={() => {
                  withdrawContact(test.id);
                  toast.success(lang === "hi" ? "संपर्क अनुमति वापस ली गई" : "Contact permission withdrawn");
                }}>{lang === "hi" ? "संपर्क अनुमति वापस लें" : "Withdraw contact permission"}</Button>
              )}
            </CardContent>
          </Card>
        ))}
        <p className="text-xs text-muted-foreground">{lang === "hi" ? "आप केंद्र के माध्यम से संपर्क और संदेश की अनुमति वापस ले सकते हैं। जाँच का रिकॉर्ड अलग रखा जाता है। इस डेमो में जानकारी केवल इस डिवाइस पर रहती है; कोई संदेश नहीं भेजा जाता।" : "You may withdraw contact and message permission through the centre. Test evidence remains separately recorded. In this demo, details stay on this device; no messages are sent."}</p>
      </section>
      <h2 className="font-display text-xl font-semibold">{lang === "hi" ? "उदाहरण किसान प्रोफ़ाइल" : "Demo farmer profile"}</h2>
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
