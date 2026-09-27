import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Leaf, Sprout, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTag, SectionTitle, StatusPill, scoreTone } from "@/components/kf/primitives";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/farmer-dashboard")({
  component: FarmerDashboard,
  head: () => ({
    meta: [
      { title: "Farmer Dashboard · KrishiFeed AI" },
      { name: "description", content: "Review farmer details and linked feed and silage tests in the KrishiFeed AI prototype." },
      { property: "og:title", content: "Farmer Dashboard · KrishiFeed AI" },
      { property: "og:description", content: "Farmer details and recent feed and silage test results in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function FarmerDashboard() {
  const { tests, setActiveSampleId } = useApp();
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const linked = tests.filter((test) => test.farmerDetails?.name || test.farmerDetails?.phone);
  const latest = linked[0];
  const name = latest?.farmerDetails?.name;
  const phone = latest?.farmerDetails?.phone;

  return (
    <div className="space-y-7">
      <SectionTitle
        title={t("nav_farmerDashboard")}
        subtitle={lang === "hi" ? "इस डिवाइस पर सहेजे गए किसान विवरण और जाँच।" : "Farmer details and tests saved on this device."}
        action={<DemoTag>{t("demoBadge")}</DemoTag>}
      />
      <section className="grid gap-6 border-b border-border pb-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-md bg-secondary text-primary"><UserRound className="size-7" /></span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{lang === "hi" ? "नवीनतम किसान विवरण" : "Most recent farmer details"}</p>
            <h2 className="mt-1 break-words font-display text-2xl font-bold">{name || (lang === "hi" ? "अभी कोई नाम नहीं" : "No name added yet")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{phone || (lang === "hi" ? "फ़ोन नहीं रखा गया" : "No phone kept")}</p>
            {latest && <p className="mt-1 text-xs text-muted-foreground">{lang === "hi" ? "नमूना" : "Sample"} {latest.id}</p>}
          </div>
        </div>
        <Button asChild variant="outline"><Link to="/profile">{lang === "hi" ? "सभी विवरण और अनुमति देखें" : "View details & permissions"}<ArrowRight className="ml-2 size-4" /></Link></Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-3" aria-label={lang === "hi" ? "जाँच सारांश" : "Test summary"}>
        {[
          { label: lang === "hi" ? "जुड़ी जाँचें" : "Linked tests", value: linked.length },
          { label: lang === "hi" ? "चारा जाँचें" : "Feed tests", value: linked.filter((test) => test.sampleType === "feed").length },
          { label: lang === "hi" ? "साइलेज जाँचें" : "Silage tests", value: linked.filter((test) => test.sampleType === "silage").length },
        ].map((stat) => (
          <div key={stat.label} className="border-t-2 border-primary bg-card px-5 py-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">{lang === "hi" ? "किसान से जुड़ी जाँचें" : "Farmer-linked tests"}</h2>
          <Button asChild size="sm"><Link to="/new-test" search={{ type: undefined }}><ClipboardList className="mr-2 size-4" />{t("startNewTest")}</Link></Button>
        </div>
        {linked.length === 0 ? (
          <div className="border border-dashed border-border p-6 text-sm text-muted-foreground">
            {lang === "hi" ? "अभी कोई जाँच किसान विवरण से जुड़ी नहीं है। नई जाँच में किसान का नाम या फ़ोन जोड़ें।" : "No tests are linked to farmer details yet. Add a name or phone in a new test."}
          </div>
        ) : linked.map((test) => (
          <Button
            key={test.id}
            variant="outline"
            className="flex h-auto min-h-20 w-full items-center justify-start gap-4 whitespace-normal border-border bg-card p-4 text-left"
            onClick={() => {
              setActiveSampleId(test.id);
              navigate({ to: test.sampleType === "feed" ? "/feed-analysis" : "/silage-analysis" });
            }}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">{test.sampleType === "feed" ? <Leaf className="size-5" /> : <Sprout className="size-5" />}</span>
            <span className="min-w-0 flex-1">
              <span className="block break-all font-semibold">{test.id}</span>
              <span className="block text-xs text-muted-foreground">{test.farmerDetails?.name || (lang === "hi" ? "नाम नहीं दिया गया" : "No name provided")} · {new Date(test.date).toLocaleDateString()} · {test.subtype}</span>
            </span>
            <span className="shrink-0 text-right"><span className="block font-display text-lg font-bold">{test.qualityScore}/100</span><StatusPill tone={scoreTone(test.qualityScore)}>{t("aiEstimated")}</StatusPill></span>
          </Button>
        ))}
        <p className="text-xs text-muted-foreground">{lang === "hi" ? "सभी जाँच परिणाम डेमो अनुमान हैं, प्रयोगशाला पुष्टि नहीं।" : "All test results are demo estimates, not laboratory-confirmed."}</p>
      </section>
    </div>
  );
}