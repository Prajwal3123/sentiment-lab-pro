import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  ChevronsLeft,
  ChevronsRight,
  Database,
  FlaskConical,
  GitCompareArrows,
  History,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Bell,
  PanelLeft,
  ScanText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Navigate, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/lab/states";
import { DEMO_CREDENTIALS } from "@/services/authService";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const PRIMARY_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze Text", icon: ScanText },
  { to: "/datasets", label: "Datasets", icon: Database },
  { to: "/preprocessing", label: "Preprocessing", icon: SlidersHorizontal },
  { to: "/models", label: "Models", icon: BrainCircuit },
  { to: "/comparison", label: "Model Comparison", icon: GitCompareArrows },
  { to: "/explainability", label: "Explainability", icon: Lightbulb },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/history", label: "Prediction History", icon: History },
];

const ADMIN_NAV: NavItem[] = [{ to: "/admin", label: "Administration", icon: ShieldCheck }];

const SIDEBAR_COLLAPSE_KEY = "sentiment-lab.sidebar.collapsed";

function NavLinks({
  items,
  collapsed,
  onNavigate,
}: {
  items: NavItem[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-body-md text-sidebar-foreground transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring",
              isActive &&
                "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--sidebar-primary)]",
              collapsed && "justify-center px-2",
            )
          }
          title={collapsed ? item.label : undefined}
        >
          <item.icon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  onNavigate,
  mobile = false,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const { user, isAdministrator, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4",
          collapsed && "justify-center px-2",
        )}
      >
        <Link
          to="/dashboard"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="Sentiment Analysis Lab home"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FlaskConical aria-hidden className="size-4.5" strokeWidth={2} />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-body-md font-semibold text-on-surface">
                Sentiment Lab
              </span>
              <span className="block font-mono text-label-sm text-on-surface-variant">
                Research Platform
              </span>
            </span>
          )}
        </Link>
        {mobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            aria-label="Close navigation"
            onClick={onToggleCollapse}
          >
            <X aria-hidden className="size-4" />
          </Button>
        ) : null}
      </div>

      {/* Primary navigation */}
      <div className="flex-1 overflow-y-auto lab-scroll px-3 py-4">
        <NavLinks items={PRIMARY_NAV} collapsed={collapsed} onNavigate={onNavigate} />
        {isAdministrator ? (
          <>
            <p
              className={cn(
                "mb-1 mt-6 px-3 font-mono text-label-sm uppercase tracking-[0.12em] text-on-surface-variant",
                collapsed && "px-0 text-center",
              )}
            >
              {collapsed ? "•••" : "Administration"}
            </p>
            <NavLinks items={ADMIN_NAV} collapsed={collapsed} onNavigate={onNavigate} />
          </>
        ) : null}
      </div>

      {/* Bottom: user block + controls */}
      <div className="border-t border-sidebar-border p-3">
        {collapsed && !mobile ? (
          <button
            type="button"
            onClick={signOut}
            aria-label="Log out"
            className="mb-2 flex w-full items-center justify-center rounded-lg px-2 py-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut aria-hidden className="size-4" />
          </button>
        ) : (
          <div className="mb-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-high font-mono text-label-md font-semibold text-primary">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-md text-on-surface">{user.name}</span>
              <span className="block truncate font-mono text-label-sm capitalize text-on-surface-variant">
                {user.role}
              </span>
            </span>
            {mobile ? null : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Log out"
                onClick={signOut}
                className="size-8 text-sidebar-foreground"
              >
                <LogOut aria-hidden className="size-4" />
              </Button>
            )}
          </div>
        )}
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-body-md text-sidebar-foreground hover:bg-sidebar-accent",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
            )
          }
        >
          <Settings aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        {!mobile ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 font-mono text-label-md text-on-surface-variant hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? (
              <ChevronsRight aria-hidden className="size-4" />
            ) : (
              <>
                <ChevronsLeft aria-hidden className="size-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}

const BREADCRUMB_LABELS: Record<string, string> = Object.fromEntries(
  [...PRIMARY_NAV, ...ADMIN_NAV, { to: "/settings", label: "Settings" }].map((i) => [i.to, i.label]),
);

function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  let path = "";
  const crumbs = segments.map((segment, i) => {
    path += `/${segment}`;
    return {
      label: BREADCRUMB_LABELS[path] ?? segment.replace(/-/g, " "),
      to: i < segments.length - 1 ? path : undefined,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 md:flex">
      {crumbs.map((crumb, i) => (
        <span key={crumb.label + String(i)} className="flex min-w-0 items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-on-surface-variant">/</span>}
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="truncate font-mono text-label-md capitalize text-on-surface-variant hover:text-on-surface"
            >
              {crumb.label}
            </Link>
          ) : (
            <span aria-current="page" className="truncate font-mono text-label-md capitalize text-on-surface">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h1 className="text-headline-lg font-semibold tracking-tight text-on-surface">{title}</h1>
        {subtitle ? <p className="mt-1 text-body-lg text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-outline-variant bg-background/90 px-4 backdrop-blur lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={onOpenMobileNav}
      >
        <PanelLeft aria-hidden className="size-4.5" />
      </Button>
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell aria-hidden className="size-4.5" />
              <span
                aria-hidden
                className="absolute right-2 top-2 size-1.5 rounded-full bg-secondary"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="font-mono text-label-sm uppercase tracking-wide">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="text-body-md text-on-surface">RoBERTa v2.4 evaluation finished</span>
              <span className="font-mono text-label-sm text-on-surface-variant">Accuracy 92.4% · 2h ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="text-body-md text-on-surface">Amazon Product Reviews reindexed</span>
              <span className="font-mono text-label-sm text-on-surface-variant">128,450 records · 6h ago</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/**
 * Authenticated application shell: fixed sidebar (240px / 64px), topbar with
 * breadcrumbs, and the routed page content. Unauthenticated visitors are
 * redirected to /login.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { user, hydrated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Restore the sidebar preference after hydration (browser storage only).
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleCollapse = () =>
    setCollapsed((prev) => {
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, prev ? "0" : "1");
      } catch {
        /* storage unavailable */
      }
      return !prev;
    });

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Restoring session…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border transition-[width] duration-200 lg:block",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </aside>

      {/* Mobile navigation drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-sidebar-border shadow-xl">
            <SidebarContent
              collapsed={false}
              mobile
              onToggleCollapse={() => setMobileNavOpen(false)}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "lg:pl-16" : "lg:pl-60")}>
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        <footer className="border-t border-outline-variant px-4 py-4 lg:px-8">
          <p className="flex items-center gap-2 font-mono text-label-sm text-on-surface-variant">
            <Activity aria-hidden className="size-3" />
            Sentiment Analysis Lab — mock inference layer active; connect the Python backend to run
            real models.
          </p>
        </footer>
      </div>
    </div>
  );
}

/** Exported for the login screen's demo-account hint. */
export { DEMO_CREDENTIALS };
