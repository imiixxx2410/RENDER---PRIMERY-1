"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">All Projects</h1>
          <p className="text-sm text-text-secondary">Manage all your AI-generated projects</p>
        </div>
        <Link href="/dashboard/studio">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <FileText className="h-6 w-6 text-text-secondary" />
        </div>
        <p className="text-lg font-medium">No Projects Found</p>
        <p className="text-sm text-text-secondary">
          You don&apos;t have any projects yet. Create your first project to get started.
        </p>
        <Link href="/dashboard/studio">
          <Button className="mt-2">New Project</Button>
        </Link>
      </div>
    </AppShell>
  );
}
