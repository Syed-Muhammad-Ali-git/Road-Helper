import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Road Helper | Premium Roadside Assistance",
  description:
    "Stuck on the Road? We've Got You. Flat tire, dead battery, or empty tank — help is just a tap away.",
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
      <body className="antialiased font-body min-h-screen bg-transparent relative">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
