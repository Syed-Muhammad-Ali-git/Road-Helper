"use client";

import React, { useEffect, useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Group,
  Avatar,
  Menu,
  Text,
  Badge,
  ActionIcon,
} from "@mantine/core";
import Image from "next/image";
import { IconMenu2, IconSun, IconMoon, IconLanguage } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { clearAuthStorage } from "@/lib/auth-utils";
import { auth } from "@/lib/firebase/config";
import { getUserByUid } from "@/lib/services/userService";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAppTheme } from "@/app/context/ThemeContext";

interface AdminHeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  sidebarOpen = false,
  setSidebarOpen,
}) => {
  const router = useRouter();
  const [adminName, setAdminName] = useState<string>("Admin");
  const [adminEmail, setAdminEmail] = useState<string>("admin@example.com");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get language and theme contexts
  const { language, setLanguage, dict, isRTL } = useLanguage();
  const { theme, toggleTheme, isDark } = useAppTheme();

  // Responsive check
  const isMobile = useMediaQuery("(max-width: 900px)");

  const drawerWidth = 280;
  const collapsedWidth = 70;

  useEffect(() => {
    let alive = true;
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u || !alive) return;
      const p = await getUserByUid(u.uid);
      if (!alive) return;
      setAdminName(p?.displayName ?? u.displayName ?? "Admin");
      setAdminEmail(p?.email ?? u.email ?? "");
    });
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  const handleSignOut = useCallback(() => {
    clearAuthStorage();
    router.push("/admin/login");
  }, [router]);

  const handleToggle = useCallback(() => {
    if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen);
    }
  }, [setSidebarOpen, sidebarOpen]);

  const headerLeft = isMobile ? 0 : sidebarOpen ? drawerWidth : collapsedWidth;

  return (
    <div
      className={`h-16 fixed top-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 border-b transition-all duration-200 ease-in-out backdrop-blur-xl ${
        isDark
          ? "bg-[#0a0a0a]/98 border-white/10"
          : "bg-white/98 border-black/10"
      }`}
      style={{
        left: headerLeft,
        width: isMobile ? "100%" : `calc(100% - ${headerLeft}px)`,
        flexDirection: isRTL ? "row-reverse" : "row",
      }}
    >
      <div
        className="flex items-center gap-3"
        style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleToggle}
          className={`${
            isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-black"
          } transition-colors`}
        >
          <IconMenu2 size={20} />
        </ActionIcon>

        <Badge
          color="red"
          radius="xl"
          variant="filled"
          className="bg-brand-red/90 text-white uppercase tracking-wide text-[10px]"
        >
          Admin
        </Badge>
        <Text
          size="sm"
          className={`hidden sm:inline ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {dict.sidebar.dashboard}
        </Text>
      </div>

      <Group gap={12} style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
        {/* Theme Toggle */}
        <ActionIcon
          variant="subtle"
          size="lg"
          radius="xl"
          onClick={toggleTheme}
          className={`${
            isDark ? "text-gray-300 hover:text-brand-yellow" : "text-gray-600 hover:text-brand-gold"
          } transition-colors`}
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>

        {/* Language Toggle */}
        <ActionIcon
          variant="subtle"
          size="lg"
          radius="xl"
          onClick={() => setLanguage(language === "en" ? "ur" : "en")}
          className={`${
            isDark ? "text-gray-300 hover:text-brand-yellow" : "text-gray-600 hover:text-brand-gold"
          } transition-colors flex items-center gap-1`}
          title={language === "en" ? "Urdu" : "English"}
        >
          <IconLanguage size={20} />
          <span className="text-xs font-bold uppercase">
            {language === "en" ? "UR" : "EN"}
          </span>
        </ActionIcon>

        {/* Help Logo */}
        <div
          className={`p-2 rounded-lg transition-all hidden sm:block ${
            isDark ? "glass hover:bg-white/10" : "hover:bg-black/10"
          } cursor-pointer`}
        >
          <Image
            src="/assets/images/helpLogo.png"
            alt="help"
            width={24}
            height={24}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Profile Dropdown */}
        <Menu
          shadow="xl"
          width={240}
          radius={12}
          position="bottom-end"
          opened={isDropdownOpen}
          onChange={setIsDropdownOpen}
          classNames={{
            dropdown: `${
              isDark ? "glass-dark border border-white/10" : "bg-white border border-black/10"
            }`,
          }}
        >
          <Menu.Target>
            <Avatar
              radius="xl"
              size="md"
              className={`cursor-pointer ring-2 transition-all ${
                isDark
                  ? "ring-brand-red/40 hover:ring-brand-red/60 bg-brand-red/20 text-white"
                  : "ring-brand-red/30 hover:ring-brand-red/50 bg-brand-red/10 text-black"
              }`}
              onClick={() => setIsDropdownOpen((o) => !o)}
            >
              {adminName.charAt(0).toUpperCase()}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <div
              className={`flex items-center gap-3 p-4 border-b ${
                isDark ? "border-white/10" : "border-black/10"
              }`}
              style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
            >
              <Avatar
                radius="xl"
                size="lg"
                className={`ring-2 ${
                  isDark
                    ? "ring-brand-red/40 bg-brand-red/20 text-white"
                    : "ring-brand-red/30 bg-brand-red/10 text-black"
                }`}
              >
                {adminName.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div
                  className={`font-bold text-sm ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {adminName}
                </div>
                <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {adminEmail}
                </div>
                <Badge
                  size="xs"
                  variant="outline"
                  color="green"
                  className="mt-1"
                >
                  {dict.common.loading.charAt(0).toUpperCase()}
                </Badge>
              </div>
            </div>

            <Menu.Item
              onClick={() => router.push("/admin/profile")}
              className={`transition-all my-1 ${
                isDark
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-700 hover:text-black hover:bg-black/5"
              }`}
              leftSection={
                <Image
                  src="/assets/images/myAccount.png"
                  alt="my account"
                  className="opacity-80"
                  width={18}
                  height={18}
                />
              }
              style={{ fontWeight: 500, padding: "12px 16px" }}
            >
              {dict.sidebar.profile}
            </Menu.Item>
            <Menu.Item
              onClick={handleSignOut}
              className={`transition-all my-1 ${
                isDark
                  ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  : "text-red-600 hover:text-red-500 hover:bg-red-600/10"
              }`}
              leftSection={
                <Image
                  src="/assets/images/signout.png"
                  alt="signout"
                  className="opacity-80"
                  width={18}
                  height={18}
                />
              }
              style={{ fontWeight: 500, padding: "12px 16px" }}
            >
              {dict.sidebar.logout}
            </Menu.Item>
          </Menu.Dropdown>        </Menu>
      </Group>
    </div>
  );
};

export default memo(AdminHeader);