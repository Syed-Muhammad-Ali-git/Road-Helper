"use client";

/* ---------------- IMPORTS ---------------- */
import React, { useState, useEffect, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Group, Avatar, Menu, ActionIcon, Badge, Text } from "@mantine/core";
import Image from "next/image";
import { IconMenu2 } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { clearAuthStorage } from "@/lib/auth-utils";
import { auth } from "@/lib/firebase/config";
import { getUserByUid } from "@/lib/services/userService";
import { getCookie } from "cookies-next";

/* ---------------- INTERFACES ---------------- */
interface HeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

/* ---------------- COMPONENT ---------------- */
const CustomerHeader: React.FC<HeaderProps> = ({
  sidebarOpen = false,
  setSidebarOpen,
}) => {
  const router = useRouter();
  const [profile, setProfile] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Responsive check
  const isMobile = useMediaQuery("(max-width: 900px)");

  // ---------------- LOAD USER DATA FROM LOCAL STORAGE ----------------
  useEffect(() => {
    let alive = true;
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u || !alive) return;
      setProfile(u.photoURL ?? null);
      const p = await getUserByUid(u.uid);
      if (!alive) return;
      setUserName(p?.displayName ?? u.displayName ?? "User");
      setUserEmail(p?.email ?? u.email ?? "");
    });
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  const drawerWidth = 280;
  const collapsedWidth = 70;

  // ---------------- SIGN OUT FUNCTION ----------------
  const handleSignOut = useCallback(() => {
    clearAuthStorage();
    router.push("/login");
  }, [router]);

  const handleToggle = useCallback(() => {
    if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen);
    }
  }, [setSidebarOpen, sidebarOpen]);

  const headerLeft = isMobile ? 0 : sidebarOpen ? drawerWidth : collapsedWidth;

  return (
    <div
      className="h-16 fixed top-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 border-b border-white/10 transition-all duration-200 ease-in-out bg-[#0a0a0a]/98 backdrop-blur-xl"
      style={{
        left: headerLeft,
        width: isMobile ? "100%" : `calc(100% - ${headerLeft}px)`,
      }}
    >
      {/* ---------------- LEFT CONTROLS ---------------- */}
      <div className="flex items-center gap-3">
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleToggle}
          className="text-gray-400 hover:text-white cursor-pointer"
        >
          <IconMenu2 size={20} />
        </ActionIcon>

        <Badge
          color="blue"
          radius="xl"
          variant="filled"
          className="bg-blue-600 text-white uppercase tracking-wide text-[10px]"
        >
          Customer Dashboard
        </Badge>
        <Text size="sm" className="text-gray-400 hidden sm:inline">
          Request help & track rescuers
        </Text>
      </div>

      {/* ---------------- RIGHT CONTROLS ---------------- */}
      <Group gap={12}>
        {/* ---------------- HELP BUTTON ---------------- */}
        <div className="p-2 rounded-lg glass hover:bg-white/10 cursor-pointer transition-all hidden sm:block">
          <Image
            src="/assets/images/helpLogo.png"
            alt="help"
            width={24}
            height={24}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* ---------------- PROFILE DROPDOWN ---------------- */}
        <Menu
          shadow="xl"
          width={240}
          radius={12}
          position="bottom-end"
          opened={isDropdownOpen}
          onChange={setIsDropdownOpen}
          classNames={{
            dropdown: "glass-dark border border-white/10",
          }}
        >
          <Menu.Target>
            <Avatar
              src={profile || undefined}
              alt="profile"
              radius="xl"
              size="md"
              className="cursor-pointer ring-2 ring-blue-500/40 hover:ring-blue-500/60 transition-all bg-blue-600/20 text-white"
              onClick={() => setIsDropdownOpen((o) => !o)}
            >
              {!profile && userName.charAt(0).toUpperCase()}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            {/* ---------------- USER INFO ---------------- */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Avatar
                src={profile || undefined}
                alt="profile"
                radius="xl"
                size="lg"
                className="ring-2 ring-blue-500/40 bg-blue-600/20 text-white"
              >
                {!profile && userName.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div className="font-bold text-sm text-white">
                  {userName || "User"}
                </div>
                <div className="text-xs text-gray-400">
                  {userEmail || "email@example.com"}
                </div>
                <Badge
                  size="xs"
                  variant="outline"
                  color="blue"
                  className="mt-1"
                >
                  {(getCookie("role") as string | undefined)?.toUpperCase?.() ?? "CUSTOMER"}
                </Badge>
              </div>
            </div>

            {/* ---------------- MENU ITEMS ---------------- */}
            <Menu.Item
              onClick={() => router.push("/customer/profile")}
              className="text-gray-300 hover:text-white hover:bg-white/5 transition-all my-1"
              leftSection={
                <Image
                  src="/assets/images/myAccount.png"
                  alt="my account"
                  className="opacity-80"
                  width={18}
                  height={18}
                />
              }
              style={{ fontWeight: "500", padding: "12px 16px" }}
            >
              My Profile
            </Menu.Item>
            <Menu.Item
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all my-1"
              leftSection={
                <Image
                  src="/assets/images/signout.png"
                  alt="signout"
                  className="opacity-80"
                  width={18}
                  height={18}
                />
              }
              style={{ fontWeight: "500", padding: "12px 16px" }}
            >
              Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};

export default memo(CustomerHeader);
