"use client";

/* ---------------- IMPORTS ---------------- */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Group, Avatar, Menu } from "@mantine/core";
import Image from "next/image";
import helpLogo from "../../assets/images/helpLogo.png";
import signoutLogo from "../../assets/images/signout.png";
import myAccountLogo from "../../assets/images/myAccount.png";

/* ---------------- INTERFACES ---------------- */
interface HeaderProps {
  sidebarOpen?: boolean;
}

/* ---------------- COMPONENT ---------------- */
const CustomerHeader: React.FC<HeaderProps> = ({ sidebarOpen = false }) => {
  const router = useRouter();
  const [profile, setProfile] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ---------------- LOAD USER DATA FROM LOCAL STORAGE ----------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginDataRaw = localStorage.getItem("loginData");
      if (loginDataRaw) {
        const loginData = JSON.parse(loginDataRaw);
        if (loginData.profileImage) {
          setProfile(loginData.profileImage);
        }
        if (loginData.fullName) {
          setUserName(loginData.fullName);
        }
        if (loginData.email) {
          setUserEmail(loginData.email);
        }
      }
    }
  }, []);

  const drawerWidth = 260;
  const collapsedWidth = 65;

  // ---------------- SIGN OUT FUNCTION ----------------
  const handleSignOut = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div
      className="h-16 fixed top-0 right-0 z-50 glass-dark border-b border-white/10 flex items-center justify-end px-6 transition-all duration-200"
      style={{
        left: sidebarOpen ? drawerWidth : collapsedWidth,
      }}
    >
      {/* ---------------- RIGHT CONTROLS ---------------- */}
      <Group gap={12}>
        {/* ---------------- HELP BUTTON ---------------- */}
        <div className="p-2 rounded-lg glass hover:bg-white/10 cursor-pointer transition-all">
          <Image
            src={helpLogo}
            alt="help"
            width={24}
            height={24}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* ---------------- PROFILE DROPDOWN ---------------- */}
        <Menu
          shadow="xl"
          width={240}
          radius={12}
          position="bottom-end"
          opened={isDropdownOpen}
          onChange={setIsDropdownOpen}
          classNames={{
            dropdown: "glass-dark border border-white/10",
          }}
        >
          <Menu.Target>
            <Avatar
              src={profile || undefined}
              alt="profile"
              radius="xl"
              size="md"
              className="cursor-pointer ring-2 ring-brand-red/20 hover:ring-brand-red/40 transition-all"
              onClick={() => setIsDropdownOpen((o) => !o)}
            />
          </Menu.Target>

          <Menu.Dropdown>
            {/* ---------------- USER INFO ---------------- */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Avatar
                src={profile || undefined}
                alt="profile"
                radius="xl"
                size="lg"
                className="ring-2 ring-brand-red/30"
              />
              <div>
                <div className="font-bold text-sm text-white">
                  {userName || "User"}
                </div>
                <div className="text-xs text-gray-400">
                  {userEmail || "email@example.com"}
                </div>
              </div>
            </div>

            {/* ---------------- MENU ITEMS ---------------- */}
            <Menu.Item
              onClick={() => router.push("/customer/profile")}
              className="text-gray-300 hover:text-white hover:bg-white/5 transition-all my-1"
              style={{ fontWeight: "500", padding: "12px 16px" }}
            >
              <Image
                src={myAccountLogo}
                alt="my account"
                className="inline-block opacity-80"
                width={18}
                height={18}
              />
              &nbsp; My Profile
            </Menu.Item>
            <Menu.Item
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all my-1"
              style={{ fontWeight: "500", padding: "12px 16px" }}
            >
              <Image
                src={signoutLogo}
                alt="signout"
                className="inline-block opacity-80"
                width={18}
                height={18}
              />
              &nbsp; Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};

export default CustomerHeader;
