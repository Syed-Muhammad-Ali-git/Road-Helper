"use client";

import React, { memo } from "react";
import SharedSidebar from "@/components/SharedSidebar";
import { LayoutDashboard, History, HelpCircle } from "lucide-react";

interface SideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const customerItems = [
  { text: "Dashboard", icon: LayoutDashboard, path: "/customer/dashboard" },
  { text: "History", icon: History, path: "/customer/history" },
  { text: "Help", icon: HelpCircle, path: "/customer/request-help" },
  { text: "My Requests", icon: HelpCircle, path: "/customer/request-status" },
];

const CustomerSideBar = ({ open, setOpen }: SideBarProps) => {
  return (
    <SharedSidebar
      open={open}
      setOpen={setOpen}
      menuItems={customerItems}
      logoSrc="/assets/images/logo.png"
      title="Customer"
    />
  );
};

export default memo(CustomerSideBar);
