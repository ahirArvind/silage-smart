import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Leaf,
  QrCode as QrIcon,
  Sprout,
  Upload,
  Wand2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useApp } from "@/lib/app-state";
import { DEMO_SENSOR_READING, SENSORS, type SampleType } from "@/lib/demo-data";
import { analyzeSample, newSampleId, toTestRecord } from "@/lib/ai-service";
import { ArchitectureDiagram } from "@/components/kf/ArchitectureDiagram";
import { DemoTag, SectionTitle } from "@/components/kf/primitives";
import feedImg from "@/assets/feed-sample.jpg";
import silageImg from "@/assets/silage-sample.jpg";

export const Route = createFileRoute("/_app/new-test")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: search["type"] === "silage" ? ("silage" as const) : search["type"] === "feed" ? ("feed" as const) : undefined,
  }),
  component: NewTest,
  head: () => ({
    meta: [
      { title: "New Test · KrishiFeed AI" },
      { name: "description", content: "Register a feed or silage sample, capture an image, read sensors and run AI analysis." },
      { property: "og:title", content: "New Test · KrishiFeed AI" },
      { property: "og:description", content: "Step-by-step feed and silage sample testing wizard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const ANALYSIS_STEPS = [
  "Image preprocessing",
  "Computer vision analysis",
  "NIR spectral analysis",
  "Sensor analysis",
  "Feature fusion",
  "AI prediction",
  "Advisory generation",
];

function NewTest() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { addTest, online, setActiveSampleId } = useApp();
  const search = Route.useSearch();

  const [step, setStep] = useState(1);
  const [sampleType, setSampleType] = useState<SampleType>(search.type ?? "feed");
  const [sampleId, setSampleId] = useState(newSampleId(search.type ?? "feed"));
  const [subtype, setSubtype] = useState("Cattle Feed (Concentrate Mix)");
  const [batch, setBatch] = useState("B-4418");
  const [datetime, setDatetime] = useState(new Date().toISOString().slice(0, 16));
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [contactForTest, setContactForTest] = useState(false);
  const [sendAdvice, setSendAdvice] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [sensors, setSensors] = useState<typeof DEMO_SENSOR_READING | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const fileRef = useRef<HTMLInputElement>(null);

  const chooseType = (tp: SampleType) => {
    setSampleType(tp);
    setSampleId(newSampleId(tp));
    setSubtype(tp === "feed" ? "Cattle Feed (Concentrate Mix)" : "Maize Silage");
    setBatch(tp === "feed" ? "B-4418" : "S-2211");
  };

  const onUpload = (file?: File) => {
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    toast.success("Sample image added");
  };

  const useDemoImage = () => {
    setImageUrl(sampleType === "feed" ? feedImg : silageImg);
    toast.info("Demo sample image loaded (prototype)");
  };

  const loadDemoSensors = () => {
    setSensors(
      sampleType === "feed"
        ? DEMO_SENSOR_READING
        : { moisture: 61, ph: 4.8, temperature: 31, humidity: 68, nir: "Complete" },
    );
    toast.success("Demo sensor data loaded");
  };

  const runAnalysis = async () => {
    setStep(5);
    setProgress(0);
    setActiveStep(0);
    const s = sensors ?? DEMO_SENSOR_READING;

    const resultPromise = analyzeSample(
      {
        sample_type: sampleType,
        image: imageUrl,
        nir_data: { status: s.nir },
        sensor_data: { moisture: s.moisture, ph: s.ph, temperature: s.temperature, humidity: s.humidity },
      },
      online,
    );

    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 620));
      setProgress(Math.round(((i + 1) / ANALYSIS_STEPS.length) * 100));
    }

    const result = await resultPromise;
    const record = toTestRecord(result, {
      id: sampleId,
      sampleType,
      subtype,
      batch,
      imageUrl,
      humidity: s.humidity,
      temperature: s.temperature,
      farmerDetails: {
        name: farmerName.trim() || undefined,
        phone: (contactForTest || sendAdvice) && farmerPhone.trim() ? farmerPhone.trim() : undefined,
        contactForTest: Boolean(farmerPhone.trim()) && contactForTest,
        sendAdvice: Boolean(farmerPhone.trim()) && sendAdvice,
      },
    });
    addTest(record);
    setActiveSampleId(record.id);
    toast.success(`${record.id} analysed — prototype result saved`);
    navigate({ to: sampleType === "feed" ? "/feed-analysis" : "/silage-analysis" });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("nav_newTest")}
        subtitle={lang === "hi" ? "पाँच आसान चरणों में नमूने की जाँच करें।" : "Test a sample in five simple steps."}
        action={<DemoTag>{t("demoBadge")}</DemoTag>}
      />

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold",
                step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {n}
            </span>
            {n < 5 && <span className={cn("h-1 flex-1 rounded-full", step > n ? "bg-primary" : "bg-muted")} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardContent className="space-y-5 p-5 sm:p-6">
            <p className="text-sm font-semibold text-primary">{lang === "hi" ? "चरण 1 · किसान विवरण" : "Step 1 · Farmer details"}</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-semibold">{lang === "hi" ? "किसान विवरण वैकल्पिक हैं" : "Farmer details are optional"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lang === "hi" ? "बिना फ़ोन नंबर के भी जाँच पूरी की जा सकती है। संपर्क विवरण केवल आपके चुने हुए उद्देश्य के लिए रखा जाता है।" : "A test can be completed without a phone. Contact is kept only for the purpose you choose."}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="farmer-name">{lang === "hi" ? "नाम या उपनाम (वैकल्पिक)" : "Name or alias (optional)"}</Label>
                  <Input id="farmer-name" autoComplete="off" placeholder={lang === "hi" ? "नाम या उपनाम (वैकल्पिक)" : "Name or alias (optional)"} value={farmerName} onChange={(e) => setFarmerName(e.target.value)} className="mt-1.5 h-12" />
                </div>
                <div>
                  <Label htmlFor="farmer-phone">{lang === "hi" ? "फ़ोन (वैकल्पिक)" : "Phone (optional)"}</Label>
                  <Input id="farmer-phone" type="tel" inputMode="tel" autoComplete="off" placeholder={lang === "hi" ? "फ़ोन (वैकल्पिक)" : "Phone (optional)"} value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} className="mt-1.5 h-12" />
                </div>
              </div>
              {farmerPhone.trim() && (
                <div className="space-y-3" aria-label="Contact permissions">
                  <p className="text-sm font-medium">{lang === "hi" ? "इस नंबर का उपयोग कब कर सकते हैं?" : "What may this number be used for?"}</p>
                  <div className="flex items-start gap-2">
                    <Checkbox id="contact-test" checked={contactForTest} onCheckedChange={(checked) => setContactForTest(checked === true)} />
                    <Label htmlFor="contact-test" className="font-normal leading-snug">{lang === "hi" ? "इस जाँच के बारे में संपर्क करें" : "Contact me about this test"}</Label>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox id="contact-advice" checked={sendAdvice} onCheckedChange={(checked) => setSendAdvice(checked === true)} />
                    <Label htmlFor="contact-advice" className="font-normal leading-snug">{lang === "hi" ? "सलाह संबंधी संदेश भेजें" : "Send advisory messages"}</Label>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {lang === "hi" ? "आप केंद्र के माध्यम से संपर्क और संदेश की अनुमति वापस ले सकते हैं। जाँच का रिकॉर्ड अलग से रखा जाता है। इस डेमो में जानकारी केवल इस डिवाइस पर रहती है; कोई संदेश नहीं भेजा जाता।" : "You may withdraw contact and message permission through the centre. The test evidence remains separately recorded. In this demo, details stay on this device; no messages are sent."}
              </p>
            </div>
            <Button size="lg" className="h-14 w-full text-base" onClick={() => setStep(2)}>
              {lang === "hi" ? "फ़ोन के बिना जारी रखें या अनुमति सहेजें" : "Continue without phone or save consent"}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="space-y-5 p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold">{lang === "hi" ? "चरण 2 — नमूना चुनें" : "Step 2 — Select Sample"}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["feed", "silage"] as const).map((tp) => (
                <Button
                  key={tp}
                  variant="outline"
                  onClick={() => chooseType(tp)}
                  aria-pressed={sampleType === tp}
                  className={cn(
                    "h-auto min-h-20 justify-start gap-3 border-2 p-4 text-left whitespace-normal",
                    sampleType === tp ? "border-primary bg-secondary" : "border-border",
                  )}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    {tp === "feed" ? <Leaf className="size-5" /> : <Sprout className="size-5" />}
                  </span>
                  <span>
                    <span className="block text-base font-semibold">{tp === "feed" ? t("feed") : t("silage")}</span>
                    <span className="block text-xs text-muted-foreground">
                      {tp === "feed" ? "Concentrate, pellet or home mix" : "Maize, sorghum or grass silage"}
                    </span>
                  </span>
                </Button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="sid">Sample ID</Label>
                <Input id="sid" value={sampleId} onChange={(e) => setSampleId(e.target.value)} className="mt-1.5 h-12" />
              </div>
              <div>
                <Label htmlFor="sub">{sampleType === "feed" ? "Feed type" : "Silage type"}</Label>
                <Input id="sub" value={subtype} onChange={(e) => setSubtype(e.target.value)} className="mt-1.5 h-12" />
              </div>
              <div>
                <Label htmlFor="batch">Batch number</Label>
                <Input id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} className="mt-1.5 h-12" />
              </div>
              <div>
                <Label htmlFor="dt">Date / time</Label>
                <Input id="dt" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="mt-1.5 h-12" />
              </div>
            </div>
            <Button variant="outline" className="h-12" onClick={() => toast.info("QR scanning is simulated in this prototype — batch S-2211 linked")}>
              <QrIcon className="mr-2 size-5" /> Scan QR code (optional)
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="h-14 flex-1" onClick={() => setStep(1)}>{t("back")}</Button>
              <Button className="h-14 flex-[2] text-base" onClick={() => setStep(3)}>{t("next")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardContent className="space-y-5 p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold">Step 3 — Capture Sample</h3>
            {imageUrl ? (
              <img src={imageUrl} alt="Sample preview" className="max-h-80 w-full rounded-2xl object-cover" />
            ) : (
              <div className="grid min-h-56 place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                <div>
                  <Camera className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-3 font-semibold">Capture Sample Image</p>
                  <p className="text-sm text-muted-foreground">JPG or PNG, close-up of the spread sample</p>
                </div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0])}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Button className="h-14 text-base" onClick={() => fileRef.current?.click()}>
                <Camera className="mr-2 size-5" /> Open Camera
              </Button>
              <Button variant="outline" className="h-14 text-base" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-2 size-5" /> Upload Image
              </Button>
              <Button variant="secondary" className="h-14 text-base" onClick={useDemoImage}>
                <Wand2 className="mr-2 size-5" /> Use demo image
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === "hi"
                ? "नमूना समान रूप से फैलाएँ और अच्छी रोशनी में फोटो लें।"
                : "Ensure the sample is evenly spread and well illuminated."}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="h-14 flex-1" onClick={() => setStep(2)}>
                {t("back")}
              </Button>
              <Button className="h-14 flex-[2] text-base" onClick={() => setStep(4)}>
                {t("next")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <h3 className="font-display text-lg font-semibold">Step 4 — Sensor Data</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {SENSORS.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <span className="font-medium">{lang === "hi" ? s.nameHi : s.nameEn}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-good">
                      <span className="size-2 rounded-full bg-good" /> Connected
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="h-14 w-full text-base" onClick={loadDemoSensors}>
                <Wand2 className="mr-2 size-5" /> Use Demo Sensor Data
              </Button>
              {sensors && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    { l: t("moisture"), v: `${sensors.moisture}%` },
                    { l: "pH", v: sensors.ph },
                    { l: "Temperature", v: `${sensors.temperature}°C` },
                    { l: "Humidity", v: `${sensors.humidity}%` },
                    { l: "NIR Scan", v: sensors.nir },
                  ].map((x) => (
                    <div key={x.l} className="rounded-xl bg-secondary p-3 text-center">
                      <p className="text-xs text-muted-foreground">{x.l}</p>
                      <p className="font-display text-lg font-bold">{x.v}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" className="h-14 flex-1" onClick={() => setStep(3)}>
                  {t("back")}
                </Button>
                <Button className="h-14 flex-[2] text-base" onClick={runAnalysis}>
                  {t("runAnalysis")}
                </Button>
              </div>
            </CardContent>
          </Card>
          <div>
            <h3 className="mb-3 font-display text-lg font-semibold">AI architecture</h3>
            <ArchitectureDiagram />
          </div>
        </div>
      )}

      {step === 5 && (
        <Card>
          <CardContent className="space-y-6 p-6 sm:p-10">
            <div className="text-center">
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="size-9 animate-spin" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold">Running AI analysis</h3>
              <p className="text-sm text-muted-foreground">
                Sample {sampleId} · {online ? "cloud demo model" : "offline local demo model"}
              </p>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-center font-display text-3xl font-bold">{progress}%</p>
            <ul className="mx-auto max-w-md space-y-2">
              {ANALYSIS_STEPS.map((s, i) => (
                <li
                  key={s}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors",
                    i < activeStep
                      ? "border-good/30 bg-good-soft text-good"
                      : i === activeStep
                        ? "border-primary bg-secondary font-semibold"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {i < activeStep ? <CheckCircle2 className="size-4" /> : <span className="size-4 rounded-full border" />}
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
