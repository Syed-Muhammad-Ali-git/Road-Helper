"use client";

import React, { memo, useMemo } from "react";
import SharedSidebar from "@/components/SharedSidebar";
import { LayoutDashboard, History, HelpCircle } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

interface SideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CustomerSideBar = ({ open, setOpen }: SideBarProps) => {
  const { dict } = useLanguage();

  const customerItems = useMemo(
    () => [
      {
        text: dict.sidebar.dashboard,
        icon: LayoutDashboard,
        path: "/customer/dashboard",
      },
      {
        text: dict.sidebar.history,
        icon: History,
        path: "/customer/history",
      },
      {
        text: dict.sidebar.help,
        icon: HelpCircle,
        path: "/customer/request-help",
      },
      {
        text: dict.sidebar.my_requests,
        icon: HelpCircle,
        path: "/customer/request-status",
      },
    ],
    [dict],
  );

  return (
    <SharedSidebar
      open={open}
      setOpen={setOpen}
      menuItems={customerItems}
      logoSrc="/assets/images/logo.png"
      title={dict.sidebar.dashboard}
    />
  );
};

export default memo(CustomerSideBar);
