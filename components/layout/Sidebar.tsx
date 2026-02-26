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
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  role: "customer" | "helper";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

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

  const links = role === "customer" ? customerLinks : helperLinks;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark-surface border-r border-dark-border z-[60] hidden lg:flex flex-col p-6">
      <div className="flex items-center gap-2.5 mb-10 px-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-glow-primary"
          style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)" }}
        >
          🚗
        </div>
        <span className="font-display font-extrabold text-lg text-white">
          RoadHelper
        </span>
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
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-dark-border space-y-1.5">
        <Link
          href={role === "customer" ? "/customer/settings" : "/helper/settings"}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-muted hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
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
  );
}
