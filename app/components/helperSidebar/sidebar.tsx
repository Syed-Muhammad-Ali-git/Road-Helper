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
  backgroundColor: "#3A3E46",
  color: "#F8FAFC",
  overflow: "hidden",
  borderRight: "none",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#3A3E46",
  color: "#F8FAFC",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  overflow: "hidden",
  borderRight: "none",
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
      path: "/",
    },
    {
      text: "Organization",
      icon: <Image src={organizationLogo} alt="" />,
      path: "/organization",
    },
  ];

  const otherMenuItems: SidebarItem[] = [
    {
      text: "Audit",
      icon: <Image src={auditLogo} alt="" />,
      path: "/audit",
    },
    {
      text: "Settings",
      icon: <Image src={settingsLogo} alt="" />,
      path: "/settings",
    },
  ];

  const renderMenu = (items: SidebarItem[]) =>
    items.map((item) => {
      let isActive = pathname === item.path;
      if (item.text === "Organization") {
        isActive = pathname.startsWith("/organization");
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
              backgroundColor: isActive ? "#FF8A3D" : "transparent",
              "&:hover": {
                backgroundColor: isActive ? "#FF8A3D" : "#2F333A",
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
                color: isActive ? "#000" : "#F8FAFC",
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
              <Avatar src="/logo.png" />
              <Stack>
                <Typography sx={{ color: "#EEF2F6", ml: -8 }}>
                  CoreStock
                </Typography>
                <Typography fontSize="10px" sx={{ ml: -8 }}>
                  by Blockwork IT
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
