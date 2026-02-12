"use client";

import React, { memo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { clearAuthStorage } from "@/lib/auth-utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, LogOut, LucideIcon } from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAppTheme } from "@/app/context/ThemeContext";

interface MenuItem {
  text: string;
  icon: LucideIcon;
  path: string;
}

interface SharedSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuItems: MenuItem[];
  logoSrc: string;
  title: string;
}

const sidebarVariants: Variants = {
  closed: (isDesktop: boolean) => ({
    x: isDesktop ? 0 : "-100%",
    width: isDesktop ? 70 : 280,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  }),
  open: {
    x: 0,
    width: 280,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const SharedSidebarComponent = ({
  open,
  setOpen,
  menuItems,
  logoSrc,
  title,
}: SharedSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const { isRTL, dict } = useLanguage();
  const { isDark } = useAppTheme();

  const handleLogout = useCallback(() => {
    clearAuthStorage();
    dispatch(logoutUser());
    const isAdmin = pathname?.includes("/admin");
    router.push(isAdmin ? "/admin/login" : "/login");
  }, [dispatch, pathname, router]);

  const handleClose = useCallback(() => {
    if (!isDesktop) {
      setOpen(false);
    }
  }, [setOpen, isDesktop]);

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      // Always return user to the very top
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // Navigate home, then scroll top
      e.preventDefault();
      router.push("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
      handleClose();
    },
    [handleClose, pathname, router],
  );

  return (
    <>
      {/* Backdrop - Only on Mobile */}
      <AnimatePresence>
        {!isDesktop && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        custom={isDesktop}
        className={cn(
          `fixed top-0 h-full z-50 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
            isDark ? "bg-brand-black" : "bg-white"
          }`,
          isRTL ? "right-0 border-l" : "left-0 border-r",
          isDark ? "border-white/10" : "border-gray-200",
          !isDesktop && !open && "pointer-events-none",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            `h-20 flex items-center justify-between px-6 border-b transition-colors duration-300 min-w-70`,
            isDark ? "border-white/5" : "border-black/5",
          )}
        >
          <Link
            href="/"
            onClick={handleLogoClick}
            className={cn(
              "flex items-center gap-3 no-underline group",
              isRTL && "flex-row-reverse",
            )}
          >
            <div className="relative w-8 h-8 bg-white rounded-lg p-1 shrink-0 group-hover:scale-105 transition-transform">
              <Image src={logoSrc} alt="Logo" fill sizes="32px" className="object-contain" />
            </div>
            <motion.h1
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : -20 }}
              className={cn(
                `font-manrope font-bold text-xl tracking-tight whitespace-nowrap group-hover:text-brand-red transition-colors`,
                isDark ? "text-white" : "text-black",
              )}
            >
              {title}
            </motion.h1>
          </Link>
          {!isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className={cn(
                `transition-colors`,
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-black hover:bg-black/5",
              )}
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Menu Items */}
        <nav className={cn("flex-1 overflow-y-auto py-6 px-3 space-y-2")}>
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleClose}
                className={cn(
                  `flex items-center gap-4 px-3.5 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden border`,
                  isRTL && "flex-row-reverse",
                  isActive
                    ? isDark
                      ? "bg-brand-red/15 border-brand-red/40 text-white shadow-lg shadow-brand-red/10"
                      : "bg-brand-red/10 border-brand-red/30 text-brand-red shadow-lg shadow-brand-red/5"
                    : isDark
                      ? "border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10"
                      : "border-transparent text-gray-600 hover:text-black hover:bg-black/5 hover:border-black/10",
                )}
              >
                {isActive && (
                  <span
                    className={cn(
                      `top-0 bottom-0 w-1 bg-brand-red rounded-r-full absolute`,
                      isRTL ? "left-0" : "left-0",
                    )}
                  />
                )}
                <item.icon
                  size={22}
                  className={cn(
                    "transition-colors shrink-0",
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-brand-red"
                      : isDark
                        ? "text-gray-400 group-hover:text-white"
                        : "text-gray-600 group-hover:text-black",
                  )}
                />
                <motion.span
                  animate={{ opacity: open ? 1 : 0, x: open ? 0 : -10 }}
                  className="font-medium text-sm md:text-base z-10 relative whitespace-nowrap"
                >
                  {item.text}
                </motion.span>

                {!isActive && (
                  <div
                    className={cn(
                      `absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`,
                      isDark
                        ? "bg-linear-to-r from-white/5 to-transparent"
                        : "bg-linear-to-r from-black/5 to-transparent",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            `p-4 border-t min-w-70 transition-colors duration-300`,
            isDark ? "border-white/5" : "border-black/5",
          )}
        >
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              `w-full justify-start gap-4 px-3.5 h-12 transition-all cursor-pointer rounded-xl`,
              isRTL && "flex-row-reverse",
              isDark
                ? "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                : "text-gray-600 hover:text-red-600 hover:bg-red-600/10",
              !open && "px-3",
            )}
          >
            <LogOut size={20} className="shrink-0" />
            <motion.span
              animate={{ opacity: open ? 1 : 0 }}
              className="font-medium whitespace-nowrap"
            >
              {dict.sidebar.logout}
            </motion.span>
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default memo(SharedSidebarComponent);
