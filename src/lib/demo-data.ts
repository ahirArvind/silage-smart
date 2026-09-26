export type SampleType = "feed" | "silage";
export type RiskLevel = "low" | "medium" | "high";

export interface TestRecord {
  id: string;
  sampleType: SampleType;
  subtype: string;
  batch: string;
  date: string; // ISO
  qualityScore: number;
  protein: number;
  moisture: number;
  fibre: number;
  energy: number;
  ph?: number | undefined;
  temperature: number;
  humidity: number;
  mouldRisk: RiskLevel;
  adulterationRisk: RiskLevel;
  fungalRisk: RiskLevel;
  sandRisk: RiskLevel;
  confidence: number;
  advisory: string;
  imageUrl?: string | undefined;
  demo: boolean;
}

export const FARMER = {
  name: "Ramesh Patil",
  farm: "Shree Gokul Dairy Farm",
  village: "Baramati, Maharashtra",
  herd: 24,
  farmerId: "KF-FARMER-0042",
};

const iso = (daysAgo: number) => {
  const d = new Date("2026-09-26T09:15:00Z");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const DEMO_TESTS: TestRecord[] = [
  {
    id: "FD-2026-01024",
    sampleType: "feed",
    subtype: "Cattle Feed (Concentrate Mix)",
    batch: "B-4417",
    date: iso(0),
    qualityScore: 86,
    protein: 18.4,
    moisture: 9.2,
    fibre: 13.8,
    energy: 3150,
    temperature: 27,
    humidity: 62,
    mouldRisk: "low",
    adulterationRisk: "low",
    fungalRisk: "low",
    sandRisk: "low",
    confidence: 0.92,
    advisory: "Maintain dry storage conditions and re-test if colour or smell changes.",
    demo: true,
  },
  {
    id: "SL-2026-01023",
    sampleType: "silage",
    subtype: "Maize Silage",
    batch: "S-2210",
    date: iso(1),
    qualityScore: 72,
    protein: 8.6,
    moisture: 61,
    fibre: 24.5,
    energy: 2450,
    ph: 4.8,
    temperature: 31,
    humidity: 68,
    mouldRisk: "medium",
    adulterationRisk: "low",
    fungalRisk: "medium",
    sandRisk: "low",
    confidence: 0.88,
    advisory:
      "Monitor moisture and storage conditions. Inspect the affected portion and consider laboratory confirmation if mould or toxin contamination is suspected.",
    demo: true,
  },
  {
    id: "FD-2026-01022",
    sampleType: "feed",
    subtype: "Cattle Feed (Pellet)",
    batch: "B-4416",
    date: iso(1),
    qualityScore: 91,
    protein: 19.8,
    moisture: 8.4,
    fibre: 12.6,
    energy: 3260,
    temperature: 26,
    humidity: 58,
    mouldRisk: "low",
    adulterationRisk: "low",
    fungalRisk: "low",
    sandRisk: "low",
    confidence: 0.94,
    advisory: "Feed quality is good. Continue current storage practice.",
    demo: true,
  },
  {
    id: "FD-2026-01019",
    sampleType: "feed",
    subtype: "Cattle Feed (Home Mix)",
    batch: "B-4402",
    date: iso(4),
    qualityScore: 52,
    protein: 11.2,
    moisture: 15.8,
    fibre: 19.4,
    energy: 2380,
    temperature: 30,
    humidity: 74,
    mouldRisk: "medium",
    adulterationRisk: "medium",
    fungalRisk: "medium",
    sandRisk: "medium",
    confidence: 0.81,
    advisory:
      "Moisture is high and protein is low. Dry the feed, review the supplier, and send a sample for laboratory testing.",
    demo: true,
  },
  {
    id: "SL-2026-01015",
    sampleType: "silage",
    subtype: "Maize Silage (Bunker 1)",
    batch: "S-2198",
    date: iso(7),
    qualityScore: 91,
    protein: 9.1,
    moisture: 60,
    fibre: 23.1,
    energy: 2520,
    ph: 4.2,
    temperature: 26,
    humidity: 61,
    mouldRisk: "low",
    adulterationRisk: "low",
    fungalRisk: "low",
    sandRisk: "low",
    confidence: 0.93,
    advisory: "Fermentation is good. Keep the pit sealed and remove silage evenly from the face.",
    demo: true,
  },
  {
    id: "SL-2026-01011",
    sampleType: "silage",
    subtype: "Sorghum Silage",
    batch: "S-2187",
    date: iso(11),
    qualityScore: 48,
    protein: 7.2,
    moisture: 69,
    fibre: 27.8,
    energy: 2110,
    ph: 5.4,
    temperature: 34,
    humidity: 79,
    mouldRisk: "high",
    adulterationRisk: "low",
    fungalRisk: "high",
    sandRisk: "low",
    confidence: 0.79,
    advisory:
      "High spoilage risk. Remove visibly spoiled portions, improve sealing and drainage, and arrange laboratory confirmation before feeding.",
    demo: true,
  },
];

export const CONFIDENCES = [
  { labelEn: "Protein prediction", labelHi: "प्रोटीन अनुमान", value: 92 },
  { labelEn: "Moisture prediction", labelHi: "नमी अनुमान", value: 95 },
  { labelEn: "Fibre prediction", labelHi: "रेशा अनुमान", value: 90 },
  { labelEn: "Adulteration screening", labelHi: "मिलावट जाँच", value: 87 },
];

export const SENSORS = [
  { id: "nir", nameEn: "NIR Spectrometer", nameHi: "NIR स्पेक्ट्रोमीटर" },
  { id: "moisture", nameEn: "Moisture Sensor", nameHi: "नमी सेंसर" },
  { id: "ph", nameEn: "pH Sensor", nameHi: "pH सेंसर" },
  { id: "temp", nameEn: "Temperature Sensor", nameHi: "तापमान सेंसर" },
  { id: "humidity", nameEn: "Humidity Sensor", nameHi: "आर्द्रता सेंसर" },
];

export const DEMO_SENSOR_READING = {
  moisture: 9.2,
  ph: 4.8,
  temperature: 27,
  humidity: 62,
  nir: "Complete",
};

export const STORAGE_UNITS = [
  {
    name: "Storage Unit A",
    nameHi: "भंडार इकाई A",
    temperature: 29,
    humidity: 65,
    moisture: "Normal",
    mouldRisk: "low" as RiskLevel,
    status: "good" as const,
    alerts: [] as string[],
  },
  {
    name: "Storage Unit B",
    nameHi: "भंडार इकाई B",
    temperature: 34,
    humidity: 78,
    moisture: "High",
    mouldRisk: "high" as RiskLevel,
    status: "attention" as const,
    alerts: [
      "High humidity detected.",
      "Inspect storage conditions.",
      "Potential spoilage risk.",
    ],
  },
];

export const CLOUD_STATS = {
  totalSamples: 128,
  farmers: 42,
  avgQuality: 84,
  attentionSamples: 21,
  storageAlerts: 13,
};

export const TESTS_PER_DAY = [
  { day: "Mon", feed: 8, silage: 4 },
  { day: "Tue", feed: 11, silage: 6 },
  { day: "Wed", feed: 9, silage: 7 },
  { day: "Thu", feed: 14, silage: 5 },
  { day: "Fri", feed: 12, silage: 9 },
  { day: "Sat", feed: 16, silage: 8 },
  { day: "Sun", feed: 10, silage: 9 },
];

export const QUALITY_DISTRIBUTION = [
  { band: "Good (80-100)", count: 94 },
  { band: "Attention (60-79)", count: 21 },
  { band: "Poor (<60)", count: 13 },
];

export const STORAGE_TREND = Array.from({ length: 12 }, (_, i) => ({
  time: `${String(8 + i).padStart(2, "0")}:00`,
  temperature: 26 + Math.round(Math.sin(i / 2) * 3 + i * 0.35),
  humidity: 60 + Math.round(Math.cos(i / 2.4) * 6 + i * 0.5),
}));

/** Deterministic smooth demo NIR spectrum. */
export function nirSpectrum(kind: "raw" | "preprocessed" = "raw", seed = 1) {
  const points: { wavelength: number; absorbance: number }[] = [];
  for (let w = 900; w <= 1700; w += 10) {
    const x = (w - 900) / 800;
    const base =
      0.42 +
      0.22 * Math.exp(-Math.pow((w - 1200) / 55, 2)) +
      0.3 * Math.exp(-Math.pow((w - 1450) / 45, 2)) +
      0.16 * Math.exp(-Math.pow((w - 1020) / 40, 2)) +
      0.1 * Math.sin(x * 9 * seed) * 0.12 +
      x * 0.18;
    const value = kind === "raw" ? base : base - (0.42 + x * 0.18) + 0.25;
    points.push({ wavelength: w, absorbance: Number(value.toFixed(4)) });
  }
  return points;
}

export const NIR_FEATURE_REGIONS = [
  { from: 1000, to: 1060, labelEn: "Protein (N-H)", labelHi: "प्रोटीन (N-H)" },
  { from: 1170, to: 1240, labelEn: "Fibre (C-H)", labelHi: "रेशा (C-H)" },
  { from: 1420, to: 1490, labelEn: "Moisture (O-H)", labelHi: "नमी (O-H)" },
];

export const scoreStatus = (score: number): "good" | "attention" | "risk" =>
  score >= 80 ? "good" : score >= 60 ? "attention" : "risk";
