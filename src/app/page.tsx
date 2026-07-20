"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants";
import { useLang } from "@/lib/lang-context";
import { ArrowRight, Star } from "lucide-react";

// عکس‌های واقعی معماری/رندر (Unsplash، مجوز Unsplash License — رایگان برای استفاده تجاری)
const IMG = {
  exteriorMilan: "https://images.unsplash.com/photo-1748324687716-022bec19fe9b?w=1200&q=80&auto=format&fit=crop",
  macauCultural: "https://images.unsplash.com/photo-1758913864864-7cc0d494a944?w=1600&q=80&auto=format&fit=crop",
  interiorLiving: "https://images.unsplash.com/photo-1759238136854-a43787126db7?w=1200&q=80&auto=format&fit=crop",
  londonFacade: "https://images.unsplash.com/photo-1774358287868-c2b6396fea32?w=1200&q=80&auto=format&fit=crop",
  sunsetFacade: "https://images.unsplash.com/photo-1759167582278-b3a5179487de?w=1200&q=80&auto=format&fit=crop",
  nycNight: "https://images.unsplash.com/photo-1762194859810-003063d4c85d?w=1600&q=80&auto=format&fit=crop",
};

const TOOLS = [
  { title: "Exterior AI", desc: "Turn viewport captures into photorealistic exterior visualizations.", img: IMG.londonFacade },
  { title: "Interior AI", desc: "Reimagine any room with dozens of professional interior styles.", img: IMG.interiorLiving },
  { title: "Sketch to Image", desc: "Transform hand-drawn sketches into photorealistic renders.", img: IMG.sunsetFacade },
];

const WORKFLOWS = [
  { title: "Exterior Pro ArchViz", tags: ["Exterior", "Visualization"], img: IMG.macauCultural },
  { title: "Dressing Room — Full Detail Render", tags: ["Interior", "Redesign"], img: IMG.interiorLiving },
  { title: "2D → 3D Isometric", tags: ["Plans", "Illustration"], img: IMG.nycNight },
];

// ⚠️ These are example/marketing numbers — replace with your project's
// real stats (actual render count, real rating, etc.) before going live
const STATS = [
  { value: "250K+", label: "renders generated" },
  { value: "4.9/5", label: "user rating" },
  { value: "90s", label: "avg. render time" },
  { value: "40+", label: "architectural styles" },
];

export default function Home() {
  const { t } = useLang();
  const { status } = useSession();
  const router = useRouter();

  // اگه لاگین کرده باشه می‌بره به استودیوی رندر، وگرنه اول می‌بره صفحه‌ی لاگین
  const goToStudio = () => {
    if (status === "authenticated") {
      router.push("/dashboard/studio");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-4xl animate-fade-in px-6 pb-16 pt-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          {t("hero.title1")}
          <br />
          <span className="text-accent">{t("hero.title2")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
          {t("hero.subtitle")}
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/signup">
            <Button variant="primary" className="gap-2 px-6 py-3 text-base hover:scale-[1.03]">
              {t("hero.cta1")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary" className="px-6 py-3 text-base hover:scale-[1.03]">
              {t("hero.cta2")}
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-text-secondary">{t("hero.free")}</p>
        <div className="mt-6 flex items-center justify-center gap-1 text-sm text-text-secondary">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
          ))}
          <span className="ml-2">{t("hero.tagline")}</span>
        </div>
      </section>

      {/* Hero image */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl border border-surface-border shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG.macauCultural}
            alt="AI architectural render showcase"
            className="h-[420px] w-full object-cover md:h-[560px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
          <div className="absolute bottom-6 right-6 rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-black backdrop-blur">
            ✨ Rendered by AI in under a minute
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-surface-border bg-muted/30 p-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-semibold text-accent md:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm text-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery mosaic */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-semibold">AI Render Showcase</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            IMG.exteriorMilan,
            IMG.londonFacade,
            IMG.macauCultural,
            IMG.interiorLiving,
            IMG.sunsetFacade,
            IMG.nycNight,
            IMG.exteriorMilan,
            IMG.londonFacade,
          ].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt="Architecture render sample"
              className={`aspect-square w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.03] ${
                i === 2 || i === 5 ? "col-span-2 row-span-2 aspect-auto" : ""
              }`}
            />
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-semibold">{t("section.tools")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Card
              key={tool.title}
              onClick={goToStudio}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goToStudio();
              }}
              className="cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.img}
                alt={tool.title}
                className="mb-4 aspect-video w-full rounded-xl object-cover"
              />
              <h3 className="mb-2 text-lg font-medium">{tool.title}</h3>
              <p className="text-sm text-text-secondary">{tool.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured workflows */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-1 text-center text-2xl font-semibold">{t("section.workflows")}</h2>
        <div className="mb-8" />
        <div className="grid gap-6 md:grid-cols-3">
          {WORKFLOWS.map((w) => (
            <Card
              key={w.title}
              onClick={goToStudio}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goToStudio();
              }}
              className="cursor-pointer overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.img}
                alt={w.title}
                className="aspect-video w-full object-cover"
              />
              <div className="p-4">
                <p className="mb-2 font-medium">{w.title}</p>
                <div className="flex gap-2">
                  {w.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-semibold">{t("section.pricing")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
                plan.highlighted ? "border-accent" : ""
              }`}
            >
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold">
                ${plan.price}
                <span className="text-base font-normal text-text-secondary">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 block">
                <Button variant={plan.highlighted ? "primary" : "secondary"} className="w-full">
                  {t("nav.getstarted")}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-surface-border bg-muted/30 py-24 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">
          {t("cta.title1")}
          <br />
          {t("cta.title2")}
        </h2>
        <p className="mt-4 text-text-secondary">{t("cta.subtitle")}</p>
        <Link href="/signup">
          <Button variant="primary" className="mt-8 gap-2 px-6 py-3 text-base hover:scale-[1.03]">
            {t("cta.button")} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      <Footer />
    </>
  );
}
