"use client";

import { useRouter } from "next/navigation";
import { X, Plus, LayoutTemplate } from "lucide-react";

export function NewProjectModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Let&apos;s create something amazing</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/dashboard/studio")}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-accent py-10 text-black hover:bg-accent-hover"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-medium">New Project</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/studio")}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-surface-border py-10 hover:border-muted-strong"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <LayoutTemplate className="h-5 w-5 text-text-secondary" />
            </div>
            <span className="font-medium">Use a Workflow</span>
            <span className="text-xs text-text-secondary">Start with a preset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
