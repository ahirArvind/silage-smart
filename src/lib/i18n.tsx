import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const dict: Record<string, { en: string; hi: string }> = {
  appName: { en: "KrishiFeed AI", hi: "कृषिफीड AI" },
  tagline: {
    en: "AI-Powered Feed & Silage Quality Testing for Dairy Farmers",
    hi: "डेयरी किसानों के लिए AI आधारित चारा व साइलेज गुणवत्ता जाँच",
  },
  nav_dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  nav_newTest: { en: "New Test", hi: "नई जाँच" },
  nav_feed: { en: "Feed Analysis", hi: "चारा विश्लेषण" },
  nav_silage: { en: "Silage Analysis", hi: "साइलेज विश्लेषण" },
  nav_vision: { en: "Image Analysis", hi: "छवि विश्लेषण" },
  nav_nir: { en: "NIR Spectroscopy", hi: "NIR स्पेक्ट्रोस्कोपी" },
  nav_sensors: { en: "Sensor Monitoring", hi: "सेंसर निगरानी" },
  nav_history: { en: "Test History", hi: "जाँच इतिहास" },
  nav_storage: { en: "Storage Monitoring", hi: "भंडारण निगरानी" },
  nav_advisory: { en: "Farmer Advisory", hi: "किसान सलाह" },
  nav_reports: { en: "Reports", hi: "रिपोर्ट" },
  nav_cloud: { en: "Cloud Dashboard", hi: "क्लाउड डैशबोर्ड" },
  nav_profile: { en: "Profile", hi: "प्रोफ़ाइल" },
  nav_settings: { en: "Settings", hi: "सेटिंग्स" },
  greeting: { en: "Good Morning, Farmer", hi: "सुप्रभात, किसान जी" },
  greetingSub: {
    en: "Check your feed and silage quality in minutes.",
    hi: "अपने चारे और साइलेज की गुणवत्ता कुछ ही मिनटों में जाँचें।",
  },
  startNewTest: { en: "Start New Test", hi: "नई जाँच शुरू करें" },
  testFeed: { en: "Test Feed", hi: "चारा जाँचें" },
  testSilage: { en: "Test Silage", hi: "साइलेज जाँचें" },
  testsCompleted: { en: "Tests Completed", hi: "पूरी हुई जाँचें" },
  goodQuality: { en: "Good Quality Samples", hi: "अच्छी गुणवत्ता के नमूने" },
  attentionRequired: { en: "Samples Requiring Attention", hi: "ध्यान देने योग्य नमूने" },
  storageAlerts: { en: "Storage Alerts", hi: "भंडारण चेतावनी" },
  recentTests: { en: "Recent Tests", hi: "हाल की जाँचें" },
  qualityOverview: { en: "Quality Overview", hi: "गुणवत्ता सारांश" },
  sample: { en: "Sample", hi: "नमूना" },
  type: { en: "Type", hi: "प्रकार" },
  date: { en: "Date", hi: "दिनांक" },
  quality: { en: "Quality", hi: "गुणवत्ता" },
  status: { en: "Status", hi: "स्थिति" },
  good: { en: "Good", hi: "अच्छा" },
  attention: { en: "Attention", hi: "ध्यान दें" },
  highRisk: { en: "High Risk", hi: "अधिक जोखिम" },
  feed: { en: "Feed", hi: "चारा" },
  silage: { en: "Silage", hi: "साइलेज" },
  cattleFeed: { en: "Cattle Feed", hi: "पशु चारा" },
  today: { en: "Today", hi: "आज" },
  yesterday: { en: "Yesterday", hi: "कल" },
  protein: { en: "Crude Protein", hi: "कच्चा प्रोटीन" },
  moisture: { en: "Moisture", hi: "नमी" },
  fibre: { en: "Fibre", hi: "रेशा" },
  energy: { en: "Energy", hi: "ऊर्जा" },
  minerals: { en: "Mineral Status", hi: "खनिज स्थिति" },
  normal: { en: "Normal", hi: "सामान्य" },
  viewReport: { en: "View Report", hi: "रिपोर्ट देखें" },
  downloadReport: { en: "Download Report", hi: "रिपोर्ट डाउनलोड करें" },
  demoBadge: { en: "Demo data", hi: "डेमो डेटा" },
  aiEstimated: { en: "AI-estimated (prototype)", hi: "AI अनुमान (प्रोटोटाइप)" },
  labNote: {
    en: "AI screening only — laboratory confirmation recommended when contamination is suspected.",
    hi: "केवल AI स्क्रीनिंग — संदेह होने पर प्रयोगशाला जाँच कराएँ।",
  },
  offline: { en: "Offline", hi: "ऑफ़लाइन" },
  synced: { en: "Synced", hi: "सिंक हो गया" },
  offlineNote: {
    en: "Tests can continue using the local AI/demo model.",
    hi: "जाँच स्थानीय AI/डेमो मॉडल से जारी रह सकती है।",
  },
  search: { en: "Search samples", hi: "नमूने खोजें" },
  next: { en: "Next", hi: "आगे" },
  back: { en: "Back", hi: "पीछे" },
  runAnalysis: { en: "Run AI Analysis", hi: "AI विश्लेषण चलाएँ" },
  recommendations: { en: "Recommendations", hi: "सुझाव" },
  overallQuality: { en: "Overall Quality", hi: "कुल गुणवत्ता" },
  confidence: { en: "Confidence", hi: "विश्वास स्तर" },
  contamination: { en: "Contamination Screening", hi: "संदूषण जाँच" },
  lowRisk: { en: "Low Risk", hi: "कम जोखिम" },
  mediumRisk: { en: "Medium Risk", hi: "मध्यम जोखिम" },
  screeningRequired: { en: "Screening Required", hi: "जाँच आवश्यक" },
  saveTest: { en: "Save Test", hi: "जाँच सहेजें" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict | string) => string };

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => String(k) });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("kf-lang");
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        localStorage.setItem("kf-lang", l);
      },
      t: (k) => dict[k as string]?.[lang] ?? String(k),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  return useContext(LangContext);
}
