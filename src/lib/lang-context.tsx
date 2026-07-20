"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "fa";

const dictionary = {
  en: {
    "nav.pricing": "Pricing",
    "nav.dashboard": "Dashboard",
    "nav.renders": "Renders",
    "nav.signin": "Sign in",
    "nav.getstarted": "Get started",
    "nav.signout": "Sign out",
    "hero.title1": "Architecture",
    "hero.title2": "AI Rendering Studio",
    "hero.subtitle":
      "Upload a sketch or model and get a photorealistic render in seconds — powered by your own rendering pipeline.",
    "hero.cta1": "Create your first render",
    "hero.cta2": "See pricing",
    "hero.free": "Free credits on signup · No credit card required",
    "hero.tagline": "Built for architects & designers",
    "section.tools": "Tools",
    "section.workflows": "Featured Workflows",
    "section.pricing": "Pricing",
    "cta.title1": "Your Next Great Design",
    "cta.title2": "Starts Here",
    "cta.subtitle": "Start rendering with AI today.",
    "cta.button": "Start Now",
    "sidebar.create": "Create",
    "sidebar.dashboard": "Dashboard",
    "sidebar.projects": "Projects",
    "sidebar.renders": "Renders",
    "sidebar.assets": "Assets",
    "sidebar.workflows": "Workflows",
    "sidebar.feed": "Feed",
    "sidebar.profile": "Profile",
    "sidebar.help": "Help",
    "sidebar.billing": "Billing",
    "sidebar.invite": "Invite Members",
    "sidebar.account": "My Account",
    "topbar.upgrade": "Upgrade",
    "topbar.credits": "credits",
    "dashboard.banner": "What are you designing today?",
    "dashboard.newproject": "New Project",
    "dashboard.explore": "Explore Tools",
    "dashboard.recent": "Recent Projects",
    "dashboard.recentDesc": "Access and manage your recent projects",
  },
  fa: {
    "nav.pricing": "قیمت‌گذاری",
    "nav.dashboard": "داشبورد",
    "nav.renders": "رندرها",
    "nav.signin": "ورود",
    "nav.getstarted": "شروع کنید",
    "nav.signout": "خروج",
    "hero.title1": "دستیار طراحی معماری",
    "hero.title2": "با هوش مصنوعی",
    "hero.subtitle":
      "یک اسکیس یا مدل آپلود کن و در چند ثانیه یک رندر فتورئال بگیر — با موتور رندرینگ اختصاصی خودت.",
    "hero.cta1": "اولین رندرت رو بساز",
    "hero.cta2": "مشاهده‌ی قیمت‌ها",
    "hero.free": "کردیت رایگان هنگام ثبت‌نام · بدون نیاز به کارت اعتباری",
    "hero.tagline": "ساخته‌شده برای معماران و طراحان",
    "section.tools": "ابزارها",
    "section.workflows": "فرآیندهای ویژه",
    "section.pricing": "قیمت‌گذاری",
    "cta.title1": "طراحی بزرگ بعدی‌ات",
    "cta.title2": "از همین‌جا شروع می‌شه",
    "cta.subtitle": "همین امروز با هوش مصنوعی رندر بگیر.",
    "cta.button": "شروع کن",
    "sidebar.create": "ساخت پروژه",
    "sidebar.dashboard": "داشبورد",
    "sidebar.projects": "پروژه‌ها",
    "sidebar.renders": "رندرها",
    "sidebar.assets": "دارایی‌ها",
    "sidebar.workflows": "فرآیندها",
    "sidebar.feed": "فید",
    "sidebar.profile": "پروفایل",
    "sidebar.help": "راهنما",
    "sidebar.billing": "صورت‌حساب",
    "sidebar.invite": "دعوت اعضا",
    "sidebar.account": "حساب من",
    "topbar.upgrade": "ارتقا",
    "topbar.credits": "کردیت",
    "dashboard.banner": "امروز چی طراحی می‌کنی؟",
    "dashboard.newproject": "پروژه‌ی جدید",
    "dashboard.explore": "کاوش ابزارها",
    "dashboard.recent": "پروژه‌های اخیر",
    "dashboard.recentDesc": "دسترسی و مدیریت پروژه‌های اخیرت",
  },
} as const;

type Key = keyof typeof dictionary.en;

const LangContext = createContext<{
  lang: Lang;
  toggleLang: () => void;
  t: (key: Key) => string;
}>({
  lang: "en",
  toggleLang: () => {},
  t: (key) => dictionary.en[key],
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    const initial = stored ?? "en";
    setLang(initial);
    document.documentElement.dir = initial === "fa" ? "rtl" : "ltr";
  }, []);

  function toggleLang() {
    const next = lang === "en" ? "fa" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
    document.documentElement.dir = next === "fa" ? "rtl" : "ltr";
  }

  function t(key: Key) {
    return dictionary[lang][key] ?? dictionary.en[key];
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
