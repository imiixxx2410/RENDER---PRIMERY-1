"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

interface AccountInfo {
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export default function ProfilePage() {
  const [account, setAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then(setAccount);
  }, []);

  const displayName = account?.name || account?.email?.split("@")[0] || "";
  const username = account?.email?.split("@")[0] ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <AppShell>
      <div className="mb-6 h-32 rounded-2xl bg-gradient-to-br from-muted to-surface" />

      <div className="-mt-16 mb-6 flex items-end gap-4 px-2">
        {account?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={account.avatarUrl}
            alt="Avatar"
            className="h-24 w-24 rounded-full border-4 border-base object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-base bg-accent text-3xl font-semibold text-black">
            {initial}
          </div>
        )}
      </div>

      <h1 className="mb-1 text-2xl font-semibold">{displayName}</h1>
      <p className="mb-6 text-sm text-text-secondary">@{username}</p>

      <Card className="mb-8">
        <p className="text-sm text-text-secondary">
          No bio added yet. Go to Account Settings to introduce yourself.
        </p>
      </Card>

      <h2 className="mb-4 text-lg font-semibold">Renders</h2>
      <Card className="py-16 text-center text-text-secondary">
        Public renders will appear here once you mark some as public.
      </Card>
    </AppShell>
  );
}
