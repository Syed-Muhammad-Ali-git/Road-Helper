import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Road Helper | Pakistan's #1 Roadside Assistance",
  description:
    "Stuck on the Road? We've Got You. Flat tire, dead battery, or empty tank — help is just a tap away.",
  keywords:
    "roadside assistance, Pakistan, towing, flat tire, battery jump, fuel delivery",
  openGraph: {
    title: "Road Helper | Premium Roadside Assistance",
    description: "Stuck on the Road? We've Got You.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-FOUC: synchronously apply stored theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('rh-theme');
                  var parsed = stored ? JSON.parse(stored) : null;
                  var theme = parsed && parsed.state && parsed.state.theme ? parsed.state.theme : 'dark';
                  document.documentElement.classList.remove('dark', 'light');
                  document.documentElement.classList.add(theme);
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* Anti-FOUC: apply stored language/dir */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('rh-lang');
                  var parsed = stored ? JSON.parse(stored) : null;
                  var lang = parsed && parsed.state && parsed.state.lang ? parsed.state.lang : 'en';
                  document.documentElement.setAttribute('lang', lang);
                  document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-body min-h-screen bg-transparent relative">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
