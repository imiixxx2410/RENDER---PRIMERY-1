"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { RENDER_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Upload, Sparkles } from "lucide-react";

const EXPERT_MODES = ["Exterior", "Interior", "Masterplan", "Landscape", "Plan"];

interface RenderItem {
  id: string;
  originalUrl: string;
  resultUrl: string | null;
  createdAt: string;
}

export default function StudioPage() {
  const [expertMode, setExpertMode] = useState("Exterior");
  const [style, setStyle] = useState("photorealistic");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<RenderItem[]>([]);

  function loadHistory() {
    fetch("/api/renders")
      .then((res) => res.json())
      .then(setHistory);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalUrl(reader.result as string);
      setResultUrl(null);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  async function handleRender() {
    if (!originalUrl) {
      setError("اول یک تصویر انتخاب کن");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageDataUrl: originalUrl, style }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "خطایی در رندرگیری رخ داد");
      return;
    }

    setResultUrl(data.resultUrl);
    loadHistory();
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr_280px]">
        {/* Left panel: Render Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Expert
            </h3>
            <div className="flex flex-wrap gap-2">
              {EXPERT_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setExpertMode(mode)}
                  className={cn(
                    "rounded-full border border-surface-border px-3 py-1.5 text-xs",
                    expertMode === mode
                      ? "border-accent bg-accent/15 text-accent"
                      : "text-text-secondary hover:border-muted-strong"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Render Style
            </h3>
            <div className="flex flex-col gap-2">
              {RENDER_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    "rounded-xl border border-surface-border px-3 py-2 text-left text-sm",
                    style === s.id
                      ? "border-accent bg-accent/15 text-accent"
                      : "text-text-secondary hover:border-muted-strong"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: canvas */}
        <div className="flex flex-col gap-4">
          <div className="flex min-h-[380px] flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border bg-base">
            {!originalUrl ? (
              <label className="flex cursor-pointer flex-col items-center gap-3 text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-4 w-4 text-text-secondary" />
                </div>
                <p className="text-sm font-medium">Select or Drop Image</p>
                <p className="text-xs text-text-secondary">
                  Drag & drop an image here, or click to browse
                </p>
                <span className="mt-2 rounded-lg bg-text-primary px-4 py-2 text-sm font-medium text-base">
                  Upload Image
                </span>
              </label>
            ) : (
              <div className="grid w-full grid-cols-2 gap-4 p-4">
                <div>
                  <p className="mb-2 text-xs text-text-secondary">Original</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={originalUrl} alt="Original" className="w-full rounded-xl" />
                </div>
                <div>
                  <p className="mb-2 text-xs text-text-secondary">Result</p>
                  <div className="flex min-h-[150px] items-center justify-center rounded-xl bg-muted">
                    {loading ? (
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    ) : resultUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resultUrl}
                        alt="Result"
                        className="w-full rounded-xl"
                      />
                    ) : (
                      <span className="text-xs text-text-tertiary">
                        Click Render to generate
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prompt bar */}
          <div className="rounded-2xl border border-surface-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-text-primary">
              <Sparkles className="h-4 w-4 text-accent" />
              Prompt
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your render or edit instruction."
              className="mb-3 w-full resize-none rounded-xl border border-surface-border bg-base p-3 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
              rows={2}
            />
            <div className="flex items-center justify-between">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button onClick={handleRender} loading={loading} className="ml-auto gap-2">
                <Sparkles className="h-4 w-4" />
                Render
              </Button>
            </div>
          </div>
        </div>

        {/* Right panel: history */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Renders
          </h3>
          {history.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-surface-border p-8 text-center">
              <Sparkles className="h-6 w-6 text-text-tertiary" />
              <p className="text-sm font-medium">Ready to create</p>
              <p className="text-xs text-text-secondary">
                Upload an image to generate your first render
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-surface-border p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.resultUrl ?? item.originalUrl}
                    alt="History item"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <span className="text-xs text-text-secondary">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
