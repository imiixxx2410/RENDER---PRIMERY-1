"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang-context";

export function Navbar() {
  const { data: session, status } = useSession();
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Render<span className="text-accent">SaaS</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-text-secondary md:flex">
          <Link href="/pricing" className="hover:text-text-primary">
            {t("nav.pricing")}
          </Link>
          {session && (
            <>
              <Link href="/dashboard" className="hover:text-text-primary">
                {t("nav.dashboard")}
              </Link>
              <Link href="/history" className="hover:text-text-primary">
                {t("nav.renders")}
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle />
          <ThemeToggle />
          {status === "loading" ? null : session ? (
            <>
              <Link href="/account" className="hidden text-sm text-text-secondary hover:text-text-primary sm:block">
                {session.user?.email}
              </Link>
              <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
                {t("nav.signout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t("nav.signin")}</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">{t("nav.getstarted")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
