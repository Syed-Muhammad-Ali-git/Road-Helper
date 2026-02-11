/* ---------------- IMPORTS ---------------- */
import type { Metadata } from "next";
import React, { ReactNode } from "react";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { SearchProvider } from "./context/searchContext";
import { LayoutProvider } from "./context/layoutContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import ClientLayout from "./client-layout";

/* ---------------- METADATA ---------------- */
export const metadata: Metadata = {
  title: "Road Helper | Instant Roadside Assistance",
  description:
    "Road Helper provides instant roadside assistance and vehicle support anywhere. Quick, reliable, and trusted service.",
  keywords: [
    "Roadside Assistance",
    "Car Repair",
    "Tow Service",
    "Emergency Road Help",
    "Vehicle Assistance",
  ],
  authors: [{ name: "Road Helper Team", url: "https://roadhelper.vercel.app" }],
  creator: "Road Helper",
  publisher: "Road Helper",
  robots: "index, follow",
  openGraph: {
    title: "Road Helper | Instant Roadside Assistance",
    description:
      "Road Helper provides instant roadside assistance and vehicle support anywhere. Quick, reliable, and trusted service.",
    url: "https://roadhelper.vercel.app",
    siteName: "Road Helper",
    type: "website",
    images: [
      {
        url: "https://roadhelper.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Road Helper - Instant Roadside Assistance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Road Helper | Instant Roadside Assistance",
    description:
      "Quick, reliable, and trusted roadside assistance and vehicle support anywhere.",
    site: "@RoadHelper",
    creator: "@RoadHelper",
    images: ["https://roadhelper.vercel.app/og-image.png"],
  },
};

/* ---------------- COMPONENT ---------------- */
const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en" {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className="antialiased font-satoshi" style={{ margin: "0 auto" }}>
        <ReduxProvider>
          <MantineProvider
            defaultColorScheme="dark"
            theme={{
              fontFamily: "Satoshi, sans-serif",
              primaryColor: "yellow",
              colors: {
                yellow: [
                  "#FFFBEB",
                  "#FEF3C7",
                  "#FDE68A",
                  "#FCD34D",
                  "#FBBF24",
                  "#F59E0B",
                  "#D97706",
                  "#B45309",
                  "#92400E",
                  "#78350F",
                ],
                dark: [
                  "#C1C2C5",
                  "#A6A7AB",
                  "#909296",
                  "#5c5f66",
                  "#373A40",
                  "#2C2E33",
                  "#1F1F1F", // brand-charcoal
                  "#171717", // brand-dark-gray
                  "#0A0A0A", // brand-black
                  "#000000",
                ],
              },
              components: {
                Button: {
                  defaultProps: {
                    fw: 700,
                    radius: "md",
                  },
                },
              },
            }}
          >
            <ThemeProvider>
              <LanguageProvider>
                <LayoutProvider>
                  <LoadingProvider>
                    <SearchProvider>
                      <ClientLayout>{children}</ClientLayout>
                    </SearchProvider>
                  </LoadingProvider>
                </LayoutProvider>
              </LanguageProvider>
            </ThemeProvider>
          </MantineProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
