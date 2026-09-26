import { cn } from "@/lib/utils";
import { Info, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { RiskLevel } from "@/lib/demo-data";

type Tone = "good" | "attention" | "risk" | "neutral";

const toneClass: Record<Tone, string> = {
  good: "bg-good-soft text-good border-good/30",
  attention: "bg-warn-soft text-warn-foreground border-warn/40",
  risk: "bg-risk-soft text-risk border-risk/30",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClass[tone],
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          tone === "good" && "bg-good",
          tone === "attention" && "bg-warn",
          tone === "risk" && "bg-risk",
          tone === "neutral" && "bg-muted-foreground",
        )}
      />
      {children}
    </span>
  );
}

export const riskTone = (r: RiskLevel): Tone =>
  r === "low" ? "good" : r === "medium" ? "attention" : "risk";

export const scoreTone = (score: number): Tone =>
  score >= 80 ? "good" : score >= 60 ? "attention" : "risk";

export function ScoreRing({
  score,
  size = 176,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const tone = scoreTone(score);
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color =
    tone === "good" ? "var(--color-good)" : tone === "attention" ? "var(--color-warn)" : "var(--color-risk)";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
        {label ? <span className="mt-1 text-xs font-semibold uppercase tracking-wide">{label}</span> : null}
      </div>
    </div>
  );
}

export function DemoTag({ children }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-earth/10 px-2 py-0.5 text-[11px] font-semibold text-earth">
      <Info className="size-3" />
      {children ?? "Prototype / demo data"}
    </span>
  );
}

export function LabDisclaimer({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warn/40 bg-warn-soft p-3 text-xs leading-relaxed text-warn-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      <p>{text}</p>
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-semibold sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** Deterministic decorative QR-style matrix for prototype traceability codes. */
export function QrCode({ value, size = 132 }: { value: string; size?: number }) {
  const n = 21;
  let h = 7;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push(((h >> 16) & 1) === 1);
  }
  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const s = size / n;
  return (
    <svg width={size} height={size} role="img" aria-label={`QR code for ${value}`} className="rounded-md bg-card">
      <rect width={size} height={size} fill="white" />
      {cells.map((on, i) => {
        const x = i % n;
        const y = Math.floor(i / n);
        if (isFinder(x, y)) return null;
        return on ? <rect key={i} x={x * s} y={y * s} width={s} height={s} fill="#14331f" /> : null;
      })}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx * s} y={fy * s} width={7 * s} height={7 * s} fill="#14331f" />
          <rect x={(fx + 1) * s} y={(fy + 1) * s} width={5 * s} height={5 * s} fill="white" />
          <rect x={(fx + 2) * s} y={(fy + 2) * s} width={3 * s} height={3 * s} fill="#14331f" />
        </g>
      ))}
    </svg>
  );
}
