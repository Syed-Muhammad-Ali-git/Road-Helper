import React, { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Road Helper - Instant Roadside Assistance",
    template: "%s | Road Helper",
  },
  description:
    "Road Helper is a smart roadside assistance web platform that connects drivers with nearby certified helpers for car and bike emergencies.",
  keywords: [
    "road helper",
    "roadside assistance",
    "car breakdown help",
    "bike puncture service",
  ],
  authors: [{ name: "Road Helper Team" }],
  creator: "Road Helper",
  publisher: "Road Helper",
  robots: {
    index: true,
    follow: true,
  },
  category: "Technology",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
