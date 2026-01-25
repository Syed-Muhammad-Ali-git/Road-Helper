/* ---------------- IMPORTS ---------------- */
import React from "react";
import { protectedRoutes } from "./routes";
import HelperSideBar from "../components/helperSidebar/sidebar";
import HelperHeader from "../components/helperHeader/header";

/* ---------------- INTERFACES ---------------- */
interface PathCheckerProps {
  pathName: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

/* ---------------- COMPONENT ---------------- */
const PathChecker = ({ pathName, open, setOpen }: PathCheckerProps) => {
  // ----- CHECK IF THE CURRENT PATH IS A PROTECTED ROUTE -----
  const show = protectedRoutes.includes(pathName);
  // ----- RENDER NOTHING IF THE ROUTE IS NOT PROTECTED -----
  if (!show) return null;

  // ----- RENDER HEADER AND SIDEBAR FOR PROTECTED ROUTES -----
  return (
    <>
      <HelperHeader sidebarOpen={open} />
      <HelperSideBar open={open} setOpen={setOpen} />
    </>
  );
};

export default PathChecker;
