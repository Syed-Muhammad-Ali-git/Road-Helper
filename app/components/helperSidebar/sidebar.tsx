/* ---------------- IMPORTS ---------------- */
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar } from "@mantine/core";
import { Stack } from "@mui/material";
import organizationLogo from "../../assets/images/organization.png";
import logoutLogo from "../../assets/images/log-out.png";
import auditLogo from "../../assets/images/audit.png";
import dashboardLogo from "../../assets/images/dashboard.png";
import settingsLogo from "../../assets/images/settings.png";
import Image from "next/image";
import type { SideBarProps, SidebarItem } from "../../types";

/* ---------------- STYLES ---------------- */
const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: "#1C1C1C",
  color: "#FFFFFF",
  overflow: "hidden",
  borderRight: "1px solid #333",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#1C1C1C",
  color: "#FFFFFF",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  overflow: "hidden",
  borderRight: "1px solid #333",
});

const DrawerHeader = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 12px",
  height: 64,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",

  "& .MuiDrawer-paper": {
    height: "100vh",
    overflow: "hidden",
  },

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

/* ---------------- COMPONENT ---------------- */
const HelperSideBar = ({ open, setOpen }: SideBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const mainMenuItems: SidebarItem[] = [
    {
      text: "Dashboard",
      icon: <Image src={dashboardLogo} alt="" />,
      path: "/helper/dashboard",
    },
    {
      text: "Requests",
      icon: <Image src={organizationLogo} alt="" />,
      path: "/helper/requests",
    },
  ];

  const otherMenuItems: SidebarItem[] = [
    {
      text: "Active Job",
      icon: <Image src={auditLogo} alt="" />,
      path: "/helper/active-job",
    },
    {
      text: "Earnings",
      icon: <Image src={auditLogo} alt="" />,
      path: "/helper/earnings",
    },
    {
      text: "Profile",
      icon: <Image src={settingsLogo} alt="" />,
      path: "/helper/profile",
    },
  ];

  

  const renderMenu = (items: SidebarItem[]) =>
    items.map((item) => {
      let isActive = pathname === item.path;
      if (item.text === "Dashboard") {
        isActive = pathname.startsWith("/helper/dashboard");
      } else if (item.text === "Dashboard") {
        isActive = pathname === "/" || pathname.startsWith("/myAccount");
      }
      return (
        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => router.push(item.path)}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              mx: 1,
              borderRadius: "12px",
              backgroundColor: isActive ? "#D72626" : "transparent",
              "&:hover": {
                backgroundColor: isActive ? "#D72626" : "#2C2E33",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                filter: isActive ? "brightness(0)" : "brightness(0) invert(1)",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                opacity: open ? 1 : 0,
                color: isActive ? "#FFFFFF" : "#F8FAFC",
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open}>
        {/* Header */}
        <DrawerHeader>
          {open && (
            <>
              <Avatar src="/logo.png" w={60} mt={5} />
              <Stack sx={{ ml: -3 }}>
                <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  Road Helper
                </Typography>
                <Typography fontSize="10px" sx={{ color: "#9CA3AF" }}>
                  Helping You On The Go
                </Typography>
              </Stack>
            </>
          )}
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ color: "black", backgroundColor: "white" }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <Typography
          sx={{
            fontSize: 12,
            color: "#9CA3AF",
            ml: open ? 2 : 0,
            mt: 3,
            opacity: open ? 1 : 0,
          }}
        >
          Main Menu
        </Typography>
        <List sx={{ mt: 1 }}>{renderMenu(mainMenuItems)}</List>

        <Typography
          sx={{
            fontSize: 12,
            color: "#9CA3AF",
            ml: open ? 2 : 0,
            opacity: open ? 1 : 0,
          }}
        >
          Others
        </Typography>
        <List>{renderMenu(otherMenuItems)}</List>

        <Box sx={{ flexGrow: 1 }} />

        {/* LOGOUT */}
        <List sx={{ pb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                mx: 1,
                borderRadius: "12px",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto" }}>
                <Image src={logoutLogo} alt="logout" />
              </ListItemIcon>
              <ListItemText
                primary="Log Out"
                sx={{ opacity: open ? 1 : 0, color: "#F8FAFC" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default HelperSideBar;
