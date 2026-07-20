"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Compass, ImageIcon } from "lucide-react";

interface RenderItem {
  id: string;
  originalUrl: string;
  resultUrl: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [renders, setRenders] = useState<RenderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/renders")
      .then((res) => res.json())
      .then((data) => {
        setRenders(data.slice(0, 4));
        setLoading(false);
      });
  }, []);

  return (
    <AppShell>
      {/* Banner */}
      <Card className="mb-8 bg-gradient-to-br from-muted to-base">
        <h1 className="mb-4 text-2xl font-semibold">
          What are you designing today?
        </h1>
        <div className="flex gap-3">
          <Link href="/dashboard/studio">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
          <Link href="/dashboard/studio">
            <Button variant="secondary" className="gap-2">
              <Compass className="h-4 w-4" />
              Explore Tools
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Projects */}
      <div className="mb-8">
        <h2 className="mb-1 text-lg font-semibold">Recent Projects</h2>
        <p className="mb-4 text-sm text-text-secondary">
          Access and manage your recent projects
        </p>

        {loading ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : renders.length === 0 ? (
          <Card className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-5 w-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-text-primary">Your projects will appear here</p>
              <p className="text-sm text-text-secondary">
                Create your first project to get started
              </p>
            </div>
            <Link href="/dashboard/studio">
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renders.map((render) => (
              <Card key={render.id} className="p-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={render.resultUrl ?? render.originalUrl}
                  alt="Project"
                  className="aspect-video w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-xs text-text-secondary">
                    {new Date(render.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Featured Workflows placeholder */}
      <div>
        <h2 className="mb-1 text-lg font-semibold">Featured Workflows</h2>
        <p className="mb-4 text-sm text-text-secondary">
          Get inspired by step-by-step design processes.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Exterior Redesign", "Interior Styling", "Sketch to Render"].map(
            (title) => (
              <Card key={title}>
                <div className="mb-3 aspect-video rounded-xl bg-gradient-to-br from-muted to-surface" />
                <p className="text-sm font-medium">{title}</p>
              </Card>
            )
          )}
        </div>
      </div>
    </AppShell>
  );
}
