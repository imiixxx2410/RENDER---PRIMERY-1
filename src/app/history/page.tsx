"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FolderPlus, Grid, List } from "lucide-react";

interface RenderItem {
  id: string;
  originalUrl: string;
  resultUrl: string | null;
  style: string;
  status: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [renders, setRenders] = useState<RenderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/renders")
      .then((res) => res.json())
      .then((data) => {
        setRenders(data);
        setLoading(false);
      });
  }, []);

  const filtered = renders.filter((r) =>
    r.style.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Renders</h1>
          <p className="text-sm text-text-secondary">View and manage your generated images</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-text-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search renders..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-tertiary"
          />
        </div>
        <button className="rounded-xl border border-surface-border p-2 text-text-secondary hover:text-text-primary">
          <Grid className="h-4 w-4" />
        </button>
        <button className="rounded-xl border border-surface-border p-2 text-text-secondary hover:text-text-primary">
          <List className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center py-16 text-center">
          <p className="mb-4 text-text-secondary">You haven&apos;t created any renders yet.</p>
          <Link href="/dashboard/studio">
            <Button>Create your first render</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((render) => (
            <Card key={render.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={render.resultUrl ?? render.originalUrl}
                alt="Render result"
                className="mb-3 aspect-video w-full rounded-xl object-cover"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {new Date(render.createdAt).toLocaleDateString()}
                </span>
                <Badge variant="success">{render.status}</Badge>
              </div>
              <a
                href={render.resultUrl ?? render.originalUrl}
                download={`render-${render.id}.png`}
                className="mt-3 block text-center text-sm text-accent hover:underline"
              >
                Download
              </a>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
