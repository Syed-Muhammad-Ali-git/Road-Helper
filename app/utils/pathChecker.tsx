/* ---------------- IMPORTS ---------------- */
import React, { memo, useMemo } from "react";
import {
  protectedRoutes,
  customerRoutes,
  helperRoutes,
  adminRoutes,
  publicRoutes,
} from "./routes";
import HelperSideBar from "@/components/helperSidebar/sidebar";
import HelperHeader from "@/components/helperHeader/header";
import CustomerSideBar from "@/components/customerSidebar/sidebar";
import CustomerHeader from "@/components/customerHeader/header";
import AdminSideBar from "@/components/adminSidebar/sidebar";
import AdminHeader from "@/components/adminHeader/header";
import { getCookie } from "cookies-next";

/* ---------------- INTERFACES ---------------- */
interface PathCheckerProps {
  pathName: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

/* ---------------- COMPONENT ---------------- */
const PathChecker = ({ pathName, open, setOpen }: PathCheckerProps) => {
  // ----- CHECK IF THE CURRENT PATH IS A PROTECTED ROUTE -----
  const show = useMemo(() => {
    if (publicRoutes.includes(pathName)) return false;
    if (protectedRoutes.includes(pathName)) return true;
    // Dynamic and nested routes
    if (pathName.startsWith("/customer")) return true;
    if (pathName.startsWith("/helper")) return true;
    if (pathName.startsWith("/admin")) return true;
    if (pathName.startsWith("/journey/")) return true;
    return false;
  }, [pathName]);

  // ----- DETERMINE ROUTE TYPE -----
  const isCustomerRoute = useMemo(
    () => customerRoutes.includes(pathName) || pathName.startsWith("/customer"),
    [pathName],
  );
  const isHelperRoute = useMemo(
    () => helperRoutes.includes(pathName) || pathName.startsWith("/helper"),
    [pathName],
  );
  const isAdminRoute = useMemo(
    () => adminRoutes.includes(pathName) || pathName.startsWith("/admin"),
    [pathName],
  );
  const isJourneyRoute = useMemo(() => pathName.startsWith("/journey/"), [pathName]);

  // ----- RENDER NOTHING IF THE ROUTE IS NOT PROTECTED -----
  if (!show) return null;

  // ----- RENDER HEADER AND SIDEBAR BASED ON ROUTE TYPE -----
  if (isJourneyRoute) {
    const role = (getCookie("role") as string | undefined) ?? "";
    if (role === "admin") {
      return <AdminHeader sidebarOpen={open} setSidebarOpen={setOpen} />;
    }
    if (role === "helper") {
      return <HelperHeader sidebarOpen={open} setSidebarOpen={setOpen} />;
    }
    return <CustomerHeader sidebarOpen={open} setSidebarOpen={setOpen} />;
  }
  if (isCustomerRoute) {
    return (
      <>
        <CustomerHeader sidebarOpen={open} setSidebarOpen={setOpen} />
        <CustomerSideBar open={open} setOpen={setOpen} />
      </>
    );
  } else if (isHelperRoute) {
    return (
      <>
        <HelperHeader sidebarOpen={open} setSidebarOpen={setOpen} />
        <HelperSideBar open={open} setOpen={setOpen} />
      </>
    );
  } else if (isAdminRoute) {
    return (
      <>
        <AdminHeader sidebarOpen={open} setSidebarOpen={setOpen} />
        <AdminSideBar open={open} setOpen={setOpen} />
      </>
    );
  }

  // ----- FALLBACK (SHOULD NOT REACH HERE) -----
  return null;
};

export default memo(PathChecker);
