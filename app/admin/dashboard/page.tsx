"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Box } from "@mantine/core";

// Tabs
import OverviewTab from "./tabs/Overview";
import UsersTab from "./tabs/Users";
import RequestsTab from "./tabs/Requests";
import StatusTab from "./tabs/Status";
import SettingsTab from "./tabs/Settings";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const renderTab = () => {
    switch (tab) {
      case "users":
        return <UsersTab />;
      case "requests":
        return <RequestsTab />;
      case "status":
        return <StatusTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <Box className="p-4 md:p-8 min-h-screen font-satoshi bg-brand-black text-white">
      {renderTab()}
    </Box>
  );
}