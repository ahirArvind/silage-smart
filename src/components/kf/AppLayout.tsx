import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CloudCog,
  FlaskConical,
  Gauge,
  Home,
  Layers,
  Leaf,
  Menu,
  Scan,
  Search,
  Settings,
  ScrollText,
  Sprout,
  User,
  Warehouse,
  Wifi,
  WifiOff,
  History,
  MessageSquareHeart,
  UserRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useApp } from "@/lib/app-state";
import { FARMER } from "@/lib/demo-data";

const nav = [
  { to: "/dashboard", key: "nav_dashboard", icon: Home },
  { to: "/farmer-dashboard", key: "nav_farmerDashboard", icon: UserRound },
  { to: "/new-test", key: "nav_newTest", icon: Scan },
  { to: "/feed-analysis", key: "nav_feed", icon: Leaf },
  { to: "/silage-analysis", key: "nav_silage", icon: Sprout },
  { to: "/vision", key: "nav_vision", icon: Layers },
  { to: "/sensors", key: "nav_sensors", icon: Gauge },
  { to: "/history", key: "nav_history", icon: History },
  { to: "/storage", key: "nav_storage", icon: Warehouse },
  { to: "/advisory", key: "nav_advisory", icon: MessageSquareHeart },
  { to: "/reports", key: "nav_reports", icon: ScrollText },
  { to: "/cloud", key: "nav_cloud", icon: CloudCog },
  { to: "/profile", key: "nav_profile", icon: User },
  { to: "/settings", key: "nav_settings", icon: Settings },
] as const;

const bottomNav = [
  { to: "/dashboard", key: "nav_dashboard", icon: Home },
  { to: "/new-test", key: "nav_newTest", icon: Scan },
  { to: "/history", key: "nav_history", icon: History },
  { to: "/advisory", key: "nav_advisory", icon: MessageSquareHeart },
] as const;

function Brand({ compact }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <FlaskConical className="size-5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-bold">{t("appName")}</span>
          <span className="block text-[11px] text-muted-foreground">Feed & Silage Testing</span>
        </span>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-[18px]" />
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l === "en" ? "English" : "हिंदी"}
        </button>
      ))}
    </div>
  );
}

export function OfflineChip() {
  const { online, toggleOnline, pendingSync } = useApp();
  const { t } = useI18n();
  return (
    <button
      onClick={toggleOnline}
      title={online ? "Switch to offline demo mode" : "Reconnect and sync"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        online ? "border-good/30 bg-good-soft text-good" : "border-warn/40 bg-warn-soft text-warn-foreground",
      )}
    >
      {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
      {online ? t("synced") : t("offline")}
      {!online && pendingSync > 0 ? <span>· {pendingSync}</span> : null}
    </button>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sidebar px-4 py-5 lg:flex">
        <div className="mb-6 rounded-xl bg-sidebar-accent/50 p-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <FlaskConical className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-bold text-sidebar-foreground">
                {t("appName")}
              </span>
              <span className="block text-[11px] text-sidebar-foreground/70">Prototype · SIH 26111</span>
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <NavList />
        </div>
        <div className="mt-4 rounded-xl bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/80">
          Demo mode is on. All AI results are simulated prototype data.
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-4">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="mb-4">
                  <Brand />
                </div>
                <div className="overflow-y-auto">
                  <NavList onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="lg:hidden">
              <Brand compact />
            </div>

            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("search")} className="pl-9" />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <OfflineChip />
              <div className="hidden sm:block">
                <LangToggle />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-5" />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-risk" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Alerts</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="font-medium">Storage Unit B — high humidity</span>
                    <span className="text-xs text-muted-foreground">78% RH · inspect conditions</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="font-medium">SL-2026-01023 needs attention</span>
                    <span className="text-xs text-muted-foreground">Medium mould risk detected</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                to="/farmer-dashboard"
                className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3"
              >
                <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  RP
                </span>
                <span className="hidden text-xs font-semibold sm:block">{FARMER.name}</span>
              </Link>
            </div>
          </div>
          <div className="px-4 pb-3 sm:hidden">
            <LangToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:pb-12">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4">
          {bottomNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground [&.active]:text-primary"
              activeProps={{ className: "active" }}
            >
              <item.icon className="size-5" />
              {t(item.key)}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
