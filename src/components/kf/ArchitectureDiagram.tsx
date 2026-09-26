import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const blocks = [
  { id: "sample", title: "Sample", desc: "A representative handful of feed or silage is placed under even light." },
  { id: "capture", title: "Camera + NIR + Sensors", desc: "RGB image, near-infrared spectrum and pH / moisture / temperature / humidity readings are captured together." },
  { id: "pre", title: "Preprocessing", desc: "Image is cropped and colour-corrected; the spectrum is smoothed and baseline-corrected; sensor values are validated." },
  { id: "models", title: "Computer Vision + Spectral ML + Sensor ML", desc: "Three specialised models run in parallel: visual defects, spectral nutrition regression, and sensor-based spoilage risk." },
  { id: "fusion", title: "Feature Fusion", desc: "Features from all three streams are combined into one vector so weak signals reinforce each other." },
  { id: "ai", title: "Multimodal AI", desc: "The fused features drive nutrition estimates, contamination screening and a confidence value per prediction." },
  { id: "quality", title: "Quality Assessment", desc: "Predictions are scored against feed/silage reference bands to produce a 0-100 quality score." },
  { id: "advisory", title: "Farmer Advisory", desc: "The score and risks are translated into simple actions in English or Hindi, with lab-confirmation guidance." },
  { id: "cloud", title: "Mobile + Cloud", desc: "Results are stored locally when offline and synced to the cloud with a QR traceability code." },
];

export function ArchitectureDiagram() {
  const [active, setActive] = useState("fusion");
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-col items-center gap-1">
        {blocks.map((b, i) => (
          <div key={b.id} className="flex w-full max-w-xl flex-col items-center">
            <button
              onClick={() => setActive(b.id)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-all",
                active === b.id
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-secondary/60 hover:border-primary/40",
              )}
            >
              {b.title}
            </button>
            {active === b.id && (
              <p className="mt-2 w-full rounded-xl bg-muted p-3 text-sm text-muted-foreground">{b.desc}</p>
            )}
            {i < blocks.length - 1 && <ChevronDown className="my-1 size-4 text-muted-foreground" />}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Tap any block to see what it does. Prototype architecture visualisation.
      </p>
    </div>
  );
}
