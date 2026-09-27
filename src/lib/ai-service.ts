import type { RiskLevel, SampleType, TestRecord } from "./demo-data";

export interface AnalyzeInput {
  sample_type: SampleType;
  image?: string | undefined;
  nir_data?: { status: string } | undefined;
  sensor_data?: { moisture: number; ph: number; temperature: number; humidity: number };
}

export interface AnalyzeResult {
  quality_score: number;
  protein: number;
  moisture: number;
  fibre: number;
  energy: number;
  ph?: number;
  mould_risk: RiskLevel;
  adulteration_risk: RiskLevel;
  confidence: number;
  advisory: string;
  source: string;
}

/** Local demo model used when the API is unreachable or offline mode is on. */
function localDemoModel(input: AnalyzeInput): AnalyzeResult {
  const s = input.sensor_data;
  if (input.sample_type === "silage") {
    const moisture = s?.moisture ?? 61;
    const ph = s?.ph ?? 4.8;
    const temperature = s?.temperature ?? 31;
    const risky = moisture > 65 || ph > 5 || temperature > 33;
    return {
      quality_score: risky ? 48 : 72,
      protein: 8.6,
      moisture,
      fibre: 24.5,
      energy: risky ? 2110 : 2450,
      ph,
      mould_risk: risky ? "high" : "medium",
      adulteration_risk: "low",
      confidence: risky ? 0.79 : 0.88,
      advisory:
        "Monitor moisture and storage conditions. Inspect the affected portion and consider laboratory confirmation if mould or toxin contamination is suspected.",
      source: "local_demo_model",
    };
  }
  const moisture = s?.moisture ?? 9.2;
  const poor = moisture > 13;
  return {
    quality_score: poor ? 52 : 86,
    protein: poor ? 11.2 : 18.4,
    moisture,
    fibre: poor ? 19.4 : 13.8,
    energy: poor ? 2380 : 3150,
    mould_risk: poor ? "medium" : "low",
    adulteration_risk: poor ? "medium" : "low",
    confidence: poor ? 0.81 : 0.92,
    advisory: poor
      ? "Moisture is high. Dry the feed, review the supplier and send a sample for laboratory testing."
      : "Maintain dry storage conditions.",
    source: "local_demo_model",
  };
}

export async function analyzeSample(input: AnalyzeInput, online: boolean): Promise<AnalyzeResult> {
  if (!online) return localDemoModel(input);
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as AnalyzeResult;
  } catch {
    return localDemoModel(input);
  }
}

export function toTestRecord(
  result: AnalyzeResult,
  meta: { id: string; sampleType: SampleType; subtype: string; batch: string; imageUrl?: string | undefined; humidity: number; temperature: number; farmerDetails?: TestRecord["farmerDetails"] },
): TestRecord {
  return {
    id: meta.id,
    sampleType: meta.sampleType,
    subtype: meta.subtype,
    batch: meta.batch,
    date: new Date().toISOString(),
    qualityScore: result.quality_score,
    protein: result.protein,
    moisture: result.moisture,
    fibre: result.fibre,
    energy: result.energy,
    ph: result.ph,
    temperature: meta.temperature,
    humidity: meta.humidity,
    mouldRisk: result.mould_risk,
    adulterationRisk: result.adulteration_risk,
    fungalRisk: result.mould_risk,
    sandRisk: result.adulteration_risk,
    confidence: result.confidence,
    advisory: result.advisory,
    imageUrl: meta.imageUrl,
    demo: true,
    farmerDetails: meta.farmerDetails,
  };
}

export function newSampleId(type: SampleType) {
  const n = Math.floor(Math.random() * 900 + 100);
  return `${type === "feed" ? "FD" : "SL"}-2026-00${n}`;
}
