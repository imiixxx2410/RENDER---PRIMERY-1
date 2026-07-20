import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "RenderSaaS — AI Architecture Rendering",
  description: "Transform sketches and models into photorealistic renders.",
};

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') document.documentElement.classList.add('light');
    var lang = localStorage.getItem('lang') || 'en';
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-base font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
