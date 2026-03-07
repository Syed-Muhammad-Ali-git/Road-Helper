"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  History,
  User,
  PlusCircle,
  Wallet,
  AlertCircle,
  X,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useTranslation } from "@/lib/firebase/hooks/useTranslation";

interface SidebarProps {
  role: "customer" | "helper" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const t = useTranslation();

  const customerLinks = [
    { nameKey: "nav.dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { nameKey: "dashboard.requestHelp", href: "/customer/request-help", icon: PlusCircle },
    { nameKey: "dashboard.history", href: "/customer/history", icon: History },
    { nameKey: "dashboard.profile", href: "/customer/profile", icon: User },
  ];

  const helperLinks = [
    { nameKey: "nav.dashboard", href: "/helper/dashboard", icon: LayoutDashboard },
    { nameKey: "dashboard.availableJobs", href: "/helper/requests", icon: AlertCircle },
    { nameKey: "dashboard.earnings", href: "/helper/earnings", icon: Wallet },
    { nameKey: "dashboard.profile", href: "/helper/profile", icon: User },
  ];

  const adminLinks = [
    { nameKey: "nav.dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { nameKey: "dashboard.allRequests", href: "/admin/requests", icon: AlertCircle },
    { nameKey: "dashboard.allUsers", href: "/admin/users", icon: User },
    { nameKey: "dashboard.earnings", href: "/admin/earnings", icon: Wallet },
  ];

  const links =
    role === "customer"
      ? customerLinks
      : role === "helper"
        ? helperLinks
        : adminLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 w-64 bg-dark-surface border-e border-dark-border z-[60] flex flex-col p-6 transition-all duration-300 transform lg:translate-x-0 ${
          isSidebarOpen
            ? "translate-x-0"
            : "max-lg:ltr:-translate-x-full max-lg:rtl:translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 mb-10 px-2 relative">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-glow-primary"
            style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)" }}
          >
            🚗
          </div>
          <span className="font-display font-extrabold text-lg text-white">
            RoadHelper
          </span>
          <button
            onClick={closeSidebar}
            className="lg:hidden absolute end-0 p-2 text-dark-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,45,45,0.1)]"
                    : "text-dark-muted hover:text-white hover:bg-white/5 hover:translate-x-1 rtl:hover:-translate-x-1"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-white"}`}
                />
                <span className="font-medium text-sm">{t(link.nameKey as "nav.dashboard" | "dashboard.requestHelp" | "dashboard.history" | "dashboard.profile" | "dashboard.availableJobs" | "dashboard.earnings" | "dashboard.allRequests" | "dashboard.allUsers")}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute start-0 w-1 h-6 bg-primary rounded-e-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-dark-border space-y-1.5">
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
