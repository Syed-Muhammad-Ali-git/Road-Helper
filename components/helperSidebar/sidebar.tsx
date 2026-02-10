"use client";

import React, { memo } from "react";
import SharedSidebar from "@/components/SharedSidebar";
import { LayoutDashboard, List, Wallet, User } from "lucide-react";

interface SideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const helperItems = [
  { text: "Dashboard", icon: LayoutDashboard, path: "/helper/dashboard" },
  { text: "Requests", icon: List, path: "/helper/requests" },
  { text: "Earnings", icon: Wallet, path: "/helper/earnings" },
  { text: "Job List", icon: User, path: "/helper/active-job" },
];

const HelperSideBar = ({ open, setOpen }: SideBarProps) => {
  return (
    <SharedSidebar
      open={open}
      setOpen={setOpen}
      menuItems={helperItems}
      logoSrc="/assets/images/logo.png"
      title="Helper"
    />
  );
};

export default memo(HelperSideBar);
