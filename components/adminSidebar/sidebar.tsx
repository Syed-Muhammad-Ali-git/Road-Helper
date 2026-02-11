"use client";

import React, { memo, useMemo } from "react";
import SharedSidebar from "@/components/SharedSidebar";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Activity,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

interface SideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AdminSideBar = ({ open, setOpen }: SideBarProps) => {
  const { dict } = useLanguage();

  const adminItems = useMemo(
    () => [
      {
        text: dict.sidebar.dashboard,
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
      { text: dict.sidebar.users, icon: Users, path: "/admin/users" },
      {
        text: dict.sidebar.requests,
        icon: Receipt,
        path: "/admin/requests",
      },
      { text: dict.sidebar.status, icon: Activity, path: "/admin/status" },
      {
        text: dict.sidebar.settings,
        icon: Settings,
        path: "/admin/settings",
      },
    ],
    [dict],
  );

  return (
    <SharedSidebar
      open={open}
      setOpen={setOpen}
      menuItems={adminItems}
      logoSrc="/assets/images/logo.png"
      title="RoadHelper"
    />
  );
};

export default memo(AdminSideBar);
