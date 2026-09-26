import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_TESTS, type TestRecord } from "./demo-data";

export interface DraftTest {
  sampleType: "feed" | "silage";
  sampleId: string;
  subtype: string;
  batch: string;
  datetime: string;
  imageUrl?: string;
  sensors?: {
    moisture: number;
    ph: number;
    temperature: number;
    humidity: number;
    nir: string;
  };
  result?: TestRecord;
}

interface Ctx {
  tests: TestRecord[];
  addTest: (t: TestRecord) => void;
  draft: DraftTest | null;
  setDraft: (d: DraftTest | null | ((prev: DraftTest | null) => DraftTest | null)) => void;
  online: boolean;
  toggleOnline: () => void;
  pendingSync: number;
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
  activeSampleId: string;
  setActiveSampleId: (id: string) => void;
}

const AppContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "kf-tests";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tests, setTests] = useState<TestRecord[]>(DEMO_TESTS);
  const [draft, setDraft] = useState<DraftTest | null>(null);
  const [online, setOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(0);
  const [demoMode, setDemoMode] = useState(true);
  const [activeSampleId, setActiveSampleId] = useState("FD-2026-01024");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as TestRecord[];
        setTests([...saved, ...DEMO_TESTS]);
      }
    } catch {
      /* ignore corrupt local cache */
    }
  }, []);

  const addTest = useCallback(
    (t: TestRecord) => {
      setTests((prev) => [t, ...prev]);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const saved = raw ? (JSON.parse(raw) as TestRecord[]) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...t, imageUrl: undefined }, ...saved]));
      } catch {
        /* storage full or unavailable */
      }
      if (!online) setPendingSync((n) => n + 1);
    },
    [online],
  );

  const toggleOnline = useCallback(() => {
    setOnline((prev) => {
      if (!prev) setPendingSync(0);
      return !prev;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      tests,
      addTest,
      draft,
      setDraft,
      online,
      toggleOnline,
      pendingSync,
      demoMode,
      setDemoMode,
      activeSampleId,
      setActiveSampleId,
    }),
    [tests, addTest, draft, online, toggleOnline, pendingSync, demoMode, activeSampleId],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}
