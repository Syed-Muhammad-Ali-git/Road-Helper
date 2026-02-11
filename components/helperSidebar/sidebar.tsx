"use client";

import React, { memo, useMemo } from "react";
import SharedSidebar from "@/components/SharedSidebar";
import { LayoutDashboard, List, Wallet, Briefcase } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

interface SideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HelperSideBar = ({ open, setOpen }: SideBarProps) => {
  const { dict } = useLanguage();

  const helperItems = useMemo(
    () => [
      {
        text: dict.sidebar.dashboard,
        icon: LayoutDashboard,
        path: "/helper/dashboard",
      },
      {
        text: dict.sidebar.requests,
        icon: List,
        path: "/helper/requests",
      },
      {
        text: dict.sidebar.earnings,
        icon: Wallet,
        path: "/helper/earnings",
      },
      {
        text: dict.sidebar.active_jobs,
        icon: Briefcase,
        path: "/helper/active-job",
      },
    ],
    [dict],
  );

  return (
    <SharedSidebar
      open={open}
      setOpen={setOpen}
      menuItems={helperItems}
      logoSrc="/assets/images/logo.png"
      title={dict.sidebar.help}
    />
  );
};

export default memo(HelperSideBar);
