import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Camera,
  CloudCog,
  FlaskConical,
  Leaf,
  LineChart,
  MessageSquareHeart,
  Radio,
  Sprout,
  WifiOff,
  ArrowRight,
} from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "KrishiFeed AI — Smart Feed & Silage Testing in Minutes" },
      {
        name: "description",
        content:
          "Prototype of an AI-powered rapid feed and silage quality testing system for dairy farmers: nutrition estimation, contamination screening, IoT sensors and farmer advisory.",
      },
      { property: "og:title", content: "KrishiFeed AI — Smart Feed & Silage Testing in Minutes" },
      {
        property: "og:description",
        content:
          "AI-powered nutritional analysis, contamination screening and silage monitoring for dairy farmers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const features = [
  { icon: Brain, en: "AI Nutritional Analysis", hi: "AI पोषण विश्लेषण", d: "Rapid estimates of protein, fibre, moisture and energy." },
  { icon: LineChart, en: "NIR Spectroscopy", hi: "NIR स्पेक्ट्रोस्कोपी", d: "Spectral signatures converted into nutrition estimates." },
  { icon: Camera, en: "Computer Vision", hi: "कंप्यूटर विज़न", d: "Colour, texture, foreign material and mould-like regions." },
  { icon: Radio, en: "IoT Sensors", hi: "IoT सेंसर", d: "pH, moisture, temperature and humidity in one reading." },
  { icon: Sprout, en: "Silage Monitoring", hi: "साइलेज निगरानी", d: "Fermentation quality and spoilage risk tracking." },
  { icon: MessageSquareHeart, en: "Farmer Advisory", hi: "किसान सलाह", d: "Plain-language actions in English and Hindi." },
  { icon: WifiOff, en: "Offline Support", hi: "ऑफ़लाइन सुविधा", d: "Keep testing without network, sync later." },
  { icon: CloudCog, en: "Cloud Traceability", hi: "क्लाउड ट्रेसेबिलिटी", d: "Every sample gets a unique ID and QR code." },
];

const steps = [
  { t: "Collect Sample", d: "Take a representative handful of feed or silage." },
  { t: "Scan Sample", d: "Capture an image and take sensor + NIR readings." },
  { t: "AI Analysis", d: "Multimodal model fuses image, spectra and sensors." },
  { t: "Get Results", d: "Quality score, nutrition estimates and risk screening." },
  { t: "Follow Advisory", d: "Simple steps for storage, feeding and lab follow-up." },
];

function Landing() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <FlaskConical className="size-5" />
          </span>
          <span className="font-display text-lg font-bold">{t("appName")}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
              {(["en", "hi"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={
                    lang === l
                      ? "rounded-full bg-primary px-3 py-1.5 text-primary-foreground"
                      : "rounded-full px-3 py-1.5 text-muted-foreground"
                  }
                >
                  {l === "en" ? "EN" : "हिंदी"}
                </button>
              ))}
            </div>
            <Button asChild size="sm">
              <Link to="/dashboard">Open App</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="surface-field">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <Leaf className="size-3.5" /> SIH 26111 · Working prototype
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Smart Feed & Silage <span className="text-gradient-leaf">Testing in Minutes</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              AI-powered nutritional analysis, contamination screening and silage monitoring for dairy
              farmers. Rapid screening on the farm — laboratory testing stays available for confirmation.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-14 px-7 text-base">
                <Link to="/new-test">
                  Start Testing <ArrowRight className="ml-1 size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-7 text-base">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Prototype demo data. AI results are rapid estimates, not laboratory-confirmed results.
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              width={1600}
              height={1104}
              alt="Dairy farmer checking cattle feed quality with a handheld scanner"
              className="w-full rounded-3xl border border-border object-cover shadow-lift"
            />
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-border bg-card p-4 shadow-lift">
              <p className="text-xs text-muted-foreground">Sample FD-2026-01024</p>
              <p className="font-display text-2xl font-bold text-good">86 / 100</p>
              <p className="text-xs font-semibold text-good">Good quality (demo)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">Everything in one rapid test</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Camera, NIR spectra and IoT sensors are fused by a multimodal model to produce a quality score
          and a farmer-friendly advisory.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.en} className="border-border/70 transition-shadow hover:shadow-soft">
              <CardContent className="p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{lang === "hi" ? f.hi : f.en}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold">How It Works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-border bg-card p-5">
                <span className="grid size-9 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
        <p className="font-semibold text-foreground">{t("appName")}</p>
        <p className="mt-1 max-w-3xl">
          {t("tagline")}. This is a prototype: AI outputs are rapid screening estimates. Laboratory
          confirmation is recommended whenever contamination or mycotoxins are suspected.
        </p>
      </footer>
    </div>
  );
}
