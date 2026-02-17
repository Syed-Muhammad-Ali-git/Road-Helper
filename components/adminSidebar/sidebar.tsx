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
        text: "Analytics",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
      { text: "All Users", icon: Users, path: "/admin/users" },
      {
        text: "Deployments",
        icon: Receipt,
        path: "/admin/requests",
      },
      { text: "System Pulse", icon: Activity, path: "/admin/status" },
      {
        text: "Config",
        icon: Settings,
        path: "/admin/settings",
      },
    ],
    [],
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
