"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  FolderOpen,
  Image as ImageIcon,
  Boxes,
  Workflow,
  Rss,
  User,
  HelpCircle,
  CreditCard,
  UserPlus,
  Plus,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewProjectModal } from "@/components/new-project-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLang();
  const [credits, setCredits] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data) => {
        const limit =
          data.plan === "pro" ? 100 : data.plan === "studio" ? 500 : 5;
        setCredits(Math.max(0, limit - (data.rendersThisMonth ?? 0)));
        setAvatarUrl(data.avatarUrl ?? null);
      });
  }, []);

  const MAIN_NAV = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: LayoutGrid },
    { href: "/dashboard/projects", label: t("sidebar.projects"), icon: FolderOpen },
    { href: "/history", label: t("sidebar.renders"), icon: ImageIcon },
    { href: "/dashboard/assets", label: t("sidebar.assets"), icon: Boxes },
    { href: "/dashboard/workflows", label: t("sidebar.workflows"), icon: Workflow },
    { href: "/dashboard/feed", label: t("sidebar.feed"), icon: Rss },
    { href: "/profile", label: t("sidebar.profile"), icon: User },
  ];

  const BOTTOM_NAV = [
    { href: "/dashboard/help", label: t("sidebar.help"), icon: HelpCircle },
    { href: "/dashboard/billing", label: t("sidebar.billing"), icon: CreditCard },
    { href: "/dashboard/invite", label: t("sidebar.invite"), icon: UserPlus },
    { href: "/account", label: t("sidebar.account"), icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col justify-between border-r border-surface-border p-4 md:flex">
        <div>
          <Link href="/" className="mb-6 flex items-center px-2 text-lg font-semibold tracking-tight">
            Render<span className="text-accent">SaaS</span>
          </Link>

          <button onClick={() => setShowModal(true)} className="mb-6 w-full">
            <Button className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              {t("sidebar.create")}
            </Button>
          </button>

          <nav className="flex flex-col gap-1">
            {MAIN_NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary hover:bg-muted hover:text-text-primary",
                    active && "bg-muted text-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-surface-border pt-4">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary hover:bg-muted hover:text-text-primary"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-black">
                {session?.user?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-text-secondary">{session?.user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <ThemeToggle />
            <div className="flex items-center gap-1.5 rounded-full border border-surface-border px-3 py-1.5 text-sm text-text-primary">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {credits ?? "…"} {t("topbar.credits")}
            </div>
            <Link href="/pricing">
              <Button variant="primary" className="px-4 py-1.5 text-sm">
                {t("topbar.upgrade")}
              </Button>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              {t("nav.signout")}
            </button>
          </div>
        </div>
        <main className="animate-fade-in p-6">{children}</main>
      </div>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
