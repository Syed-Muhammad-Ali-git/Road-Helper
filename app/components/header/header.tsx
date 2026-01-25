"use client";

/* ---------------- IMPORTS ---------------- */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Group, TextInput, Avatar, Menu } from "@mantine/core";
import Image from "next/image";
import searchLogo from "../../assets/images/searchLogo.png";
import helpLogo from "../../assets/images/helpLogo.png";
import signoutLogo from "../../assets/images/signout.png";
import myAccountLogo from "../../assets/images/myAccount.png";

/* ---------------- INTERFACES ---------------- */
interface HeaderProps {
  sidebarOpen?: boolean;
}

/* ---------------- COMPONENT ---------------- */
const Header: React.FC<HeaderProps> = ({ sidebarOpen = false }) => {
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
      className="h-16 fixed top-0 right-0 z-50 bg-white flex items-center justify-end px-4 transition-all duration-200"
      style={{
        left: sidebarOpen ? drawerWidth : collapsedWidth,
      }}
    >
      {/* ---------------- RIGHT CONTROLS ---------------- */}
      <Group gap={12}>
        {/* ---------------- HELP BUTTON ---------------- */}
        <Image
          src={helpLogo}
          alt="help"
          width={30}
          height={30}
          className="border border-[#EEF2F6] p-1.5 rounded-md cursor-pointer"
        />

        {/* ---------------- PROFILE DROPDOWN ---------------- */}
        <Menu
          shadow="md"
          width={200}
          radius={10}
          position="bottom-start"
          opened={isDropdownOpen}
          onChange={setIsDropdownOpen}
        >
          <Menu.Target>
            <Avatar
              src={profile || undefined}
              alt="profile"
              radius="xl"
              className="cursor-pointer"
              onClick={() => setIsDropdownOpen((o) => !o)}
            />
          </Menu.Target>

          <Menu.Dropdown>
            {/* ---------------- USER INFO ---------------- */}
            <div className="flex items-center gap-3 p-3">
              <Avatar
                src={profile || undefined}
                alt="profile"
                radius="xl"
                size="md"
              />
              <div>
                <div className="font-semibold text-sm">
                  {userName || "User"}
                </div>
                <div className="text-xs text-gray-500">
                  {userEmail || "email@example.com"}
                </div>
              </div>
            </div>

            {/* ---------------- MENU ITEMS ---------------- */}
            <div className="border border-[#EEF2F6]"></div>
            <Menu.Item
              onClick={() => router.push("/myAccount")}
              color="#697586"
              style={{ fontWeight: "400", padding: "10px" }}
            >
              <Image
                src={myAccountLogo}
                alt="my account"
                className="inline-block"
              />
              &nbsp; My Account
            </Menu.Item>
            <div className="border border-[#EEF2F6]"></div>
            <Menu.Item
              onClick={handleSignOut}
              color="#697586"
              style={{ fontWeight: "400", padding: "10px" }}
            >
              <Image src={signoutLogo} alt="signout" className="inline-block" />
              &nbsp; Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};

export default Header;
