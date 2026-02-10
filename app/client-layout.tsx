"use client";

/* ---------------- IMPORTS ---------------- */
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PathChecker from "./utils/pathChecker";
import { helperRoutes, customerRoutes, adminRoutes } from "./utils/routes";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------- INTERFACES ---------------- */
interface ClientLayoutProps {
  children: ReactNode;
}

/* ---------------- CONSTANTS ---------------- */
const drawerWidth = 280;

/* ---------------- COMPONENT ---------------- */
const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ----- MEDIA QUERY FOR DESKTOP VIEW -----
  // Using 900px breakpoint to match MUI default for 'md'
  const isDesktop = useMediaQuery("(min-width: 900px)");

  // ----- EFFECT TO SET DRAWER STATE BASED ON VIEWPORT -----
  useEffect(() => {
    setDrawerOpen(isDesktop);
  }, [isDesktop]);

  // ----- DETERMINE IF SIDEBAR SHOULD BE SHOWN -----
  const showSidebar =
    helperRoutes.includes(pathname) ||
    customerRoutes.includes(pathname) ||
    adminRoutes.includes(pathname) ||
    pathname.startsWith("/helper") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/journey/");

  const isAdmin = pathname?.includes("/admin");

  // ----- DYNAMIC STYLING FOR THE MAIN CONTENT -----
  const mainStyle: React.CSSProperties = {
    transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
    marginLeft: !showSidebar
      ? 0
      : !isDesktop
        ? 0 // Mobile: No margin, sidebar overlays
        : drawerOpen
          ? `${drawerWidth}px` // Desktop Open
          : "70px", // Desktop Collapsed
    paddingTop: showSidebar && !isAdmin ? "70px" : "0",
  };

  return (
    <>
      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* PATH CHECKER (Handles Sidebar/Header Rendering) */}
      <PathChecker
        pathName={pathname}
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />
      {/* MAIN CONTENT */}
      <main style={mainStyle}>{children}</main>
    </>
  );
};

export default ClientLayout;
