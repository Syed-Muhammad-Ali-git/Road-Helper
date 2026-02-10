"use client";

import React, { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import { Group, Avatar, Menu, Text, Badge, ActionIcon } from "@mantine/core";
import Image from "next/image";
import { IconMenu2 } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { clearAuthStorage } from "@/lib/auth-utils";
import { auth } from "@/lib/firebase/config";
import { getUserByUid } from "@/lib/services/userService";

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

  const handleSignOut = () => {
    clearAuthStorage();
    router.push("/admin/login");
  };

  const handleToggle = () => {
    if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const headerLeft = isMobile ? 0 : sidebarOpen ? drawerWidth : collapsedWidth;

  return (
    <div
      className="h-16 fixed top-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 border-b border-white/10 transition-all duration-200 ease-in-out bg-[#0a0a0a]/98 backdrop-blur-xl"
      style={{
        left: headerLeft,
        width: isMobile ? "100%" : `calc(100% - ${headerLeft}px)`,
      }}
    >
      <div className="flex items-center gap-3">
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleToggle}
          className="text-gray-400 hover:text-white"
        >
          <IconMenu2 size={20} />
        </ActionIcon>

        <Badge
          color="red"
          radius="xl"
          variant="filled"
          className="bg-brand-red/90 text-white uppercase tracking-wide text-[10px]"
        >
          Admin Panel
        </Badge>
        <Text size="sm" className="text-gray-400 hidden sm:inline">
          Monitor users, helpers & requests
        </Text>
      </div>

      <Group gap={12}>
        <div className="p-2 rounded-lg glass hover:bg-white/10 cursor-pointer transition-all hidden sm:block">
          <Image
            src="/assets/images/helpLogo.png"
            alt="help"
            width={24}
            height={24}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

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
              radius="xl"
              size="md"
              className="cursor-pointer ring-2 ring-brand-red/40 hover:ring-brand-red/60 transition-all bg-brand-red/20 text-white"
              onClick={() => setIsDropdownOpen((o) => !o)}
            >
              {adminName.charAt(0).toUpperCase()}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Avatar
                radius="xl"
                size="lg"
                className="ring-2 ring-brand-red/40 bg-brand-red/20 text-white"
              >
                {adminName.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div className="font-bold text-sm text-white">{adminName}</div>
                <div className="text-xs text-gray-400">{adminEmail}</div>
                <Badge
                  size="xs"
                  variant="outline"
                  color="green"
                  className="mt-1"
                >
                  Online
                </Badge>
              </div>
            </div>

            <Menu.Item
              onClick={() => router.push("/admin/profile")}
              className="text-gray-300 hover:text-white hover:bg-white/5 transition-all my-1"
              leftSection={
                <Image
                  src="/assets/images/myAccount.png"
                  alt="my account"
                  className="inline-block opacity-80"
                  width={18}
                  height={18}
                />
              }
              style={{ fontWeight: 500, padding: "12px 16px" }}
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
                  className="inline-block opacity-80"
                  width={18}
                  height={18}
                />
              }
              style={{ fontWeight: 500, padding: "12px 16px" }}
            >
              Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};

export default memo(AdminHeader);
