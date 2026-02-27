"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  History,
  User,
  PlusCircle,
  Settings,
  LogOut,
  Wallet,
  AlertCircle,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

interface SidebarProps {
  role: "customer" | "helper" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUiStore();

  const customerLinks = [
    { name: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Request Help", href: "/customer/request-help", icon: PlusCircle },
    { name: "History", href: "/customer/history", icon: History },
    { name: "Profile", href: "/customer/profile", icon: User },
  ];

  const helperLinks = [
    { name: "Dashboard", href: "/helper/dashboard", icon: LayoutDashboard },
    { name: "Available Jobs", href: "/helper/requests", icon: AlertCircle },
    { name: "Earnings", href: "/helper/earnings", icon: Wallet },
    { name: "Profile", href: "/helper/profile", icon: User },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "All Requests", href: "/admin/requests", icon: AlertCircle },
    { name: "All Users", href: "/admin/users", icon: User },
    { name: "Earnings", href: "/admin/earnings", icon: Wallet },
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
        className={`fixed inset-y-0 start-0 w-64 bg-dark-surface border-e border-dark-border z-[60] flex flex-col p-6 transition-transform duration-300 ${
          isSidebarOpen
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full"
        } lg:translate-x-0`}
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-dark-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-white"}`}
                />
                <span className="font-medium text-sm">{link.name}</span>
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
