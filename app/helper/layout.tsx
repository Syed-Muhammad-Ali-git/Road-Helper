"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function HelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar role="helper" />
      <div className="flex-1 flex flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
