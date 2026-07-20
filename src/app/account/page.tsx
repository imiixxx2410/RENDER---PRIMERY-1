"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLANS } from "@/lib/constants";
import { Mail, Lock, Globe, LockKeyhole } from "lucide-react";

interface AccountInfo {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  isPublic: boolean;
  plan: string;
  rendersThisMonth: number;
}

export default function AccountPage() {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data: AccountInfo) => {
        setAccount(data);
        setName(data.name ?? "");
        setAvatarUrl(data.avatarUrl ?? null);
        setBio(data.bio ?? "");
        setWebsite(data.website ?? "");
        setIsPublic(data.isPublic ?? true);
      });
  }

  useEffect(() => {
    load();
  }, []);

  function handleAvatarChange(file: File) {
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, website, isPublic, avatarUrl }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!account) {
    return (
      <AppShell>
        <p className="text-sm text-text-secondary">Loading...</p>
      </AppShell>
    );
  }

  const plan = PLANS.find((p) => p.id === account.plan) ?? PLANS[0];
  const usagePercent = Math.min(100, (account.rendersThisMonth / plan.renderLimit) * 100);

  return (
    <AppShell>
      <h1 className="mb-1 text-2xl font-semibold">Account Settings</h1>
      <p className="mb-8 text-sm text-text-secondary">Personal information</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan + usage */}
        <Card>
          <h2 className="mb-4 text-sm font-medium text-text-secondary">Current Plan</h2>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl font-semibold">{plan.name}</span>
            <Badge variant="accent">Active</Badge>
          </div>
          <p className="mb-6 text-sm text-text-secondary">{account.email}</p>
          <Button variant="secondary" disabled>
            Manage Subscription (Stripe — coming soon)
          </Button>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-medium text-text-secondary">Usage this month</h2>
          <p className="mb-3 text-sm text-text-secondary">
            {account.rendersThisMonth} / {plan.renderLimit} renders used
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Profile */}
      <Card className="mt-6">
        <h2 className="mb-4 text-sm font-medium text-text-secondary">Profile</h2>
        <div className="mb-6 flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-black">
              {(name || account.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarChange(file);
                }}
              />
              <span className="inline-block rounded-xl border border-surface-border px-4 py-2 text-sm text-text-primary hover:border-muted-strong">
                Upload photo
              </span>
            </label>
            {avatarUrl && (
              <button
                onClick={() => setAvatarUrl(null)}
                className="ml-3 text-sm text-text-secondary hover:text-red-400"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://your-website.com"
          />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Tell us about yourself."
            className="w-full resize-none rounded-xl border border-surface-border bg-base p-3 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
          />
          <p className="mt-1 text-right text-xs text-text-tertiary">{bio.length}/500</p>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
          {saved && <span className="text-sm text-green-400">Saved</span>}
        </div>
      </Card>

      {/* Email */}
      <Card className="mt-6">
        <h2 className="mb-4 text-sm font-medium text-text-secondary">Email</h2>
        <div className="flex items-center justify-between rounded-xl border border-surface-border p-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-sm">{account.email}</p>
              <p className="text-xs text-text-secondary">Managed by password</p>
            </div>
          </div>
          <Badge variant="success">Verified</Badge>
        </div>
      </Card>

      {/* Security */}
      <Card className="mt-6">
        <h2 className="mb-4 text-sm font-medium text-text-secondary">Security</h2>
        <div className="flex items-center justify-between rounded-xl border border-surface-border p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-sm">Password</p>
              <p className="text-xs text-text-secondary">Change your account password.</p>
            </div>
          </div>
          <Button variant="secondary">Change Password</Button>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="mt-6">
        <h2 className="mb-4 text-sm font-medium text-text-secondary">Privacy</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsPublic(true)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 ${
              isPublic ? "border-accent bg-accent/10" : "border-surface-border"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Public</span>
          </button>
          <button
            onClick={() => setIsPublic(false)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 ${
              !isPublic ? "border-accent bg-accent/10" : "border-surface-border"
            }`}
          >
            <LockKeyhole className="h-4 w-4" />
            <span className="text-sm font-medium">Private</span>
          </button>
        </div>
      </Card>
    </AppShell>
  );
}
