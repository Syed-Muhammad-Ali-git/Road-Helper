"use client";

import React, { useState, memo, useCallback } from "react";
import {
  IconChevronRight,
  IconSun,
  IconMoon,
  IconLanguage,
  IconArrowRight,
} from "@tabler/icons-react";
import {
  Container,
  Group,
  Button,
  ActionIcon,
  Image,
  Drawer,
  Stack,
  Divider,
  Title,
  Burger,
  Tooltip,
  Menu,
} from "@mantine/core";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAppTheme } from "@/app/context/ThemeContext";

const LandingNavbar = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [opened, setOpened] = useState(false);

  const pathname = usePathname();
  const { dict, language, setLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useAppTheme();

  const isDark = theme === "dark";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpened(false);
  }, []);

  const linkClass = `
    relative text-sm font-bold transition-colors
    ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"}
    after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0
    after:bg-brand-yellow after:transition-all after:duration-300
    hover:after:w-full
  `;

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${
            scrolled
              ? isDark
                ? "bg-black/90 backdrop-blur-xl py-3 shadow-lg"
                : "bg-white/90 backdrop-blur-xl py-3 shadow-lg"
              : "bg-transparent py-6"
          }
        `}
      >
        <Container
          size="xl"
          className={`flex items-center justify-between gap-4 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* LOGO */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 2 }}
              className="h-10 w-10 rounded-xl bg-white p-1 shadow-lg"
            >
              <Image
                src="/assets/images/logo.png"
                alt="Road Helper"
                className="object-contain"
              />
            </motion.div>
            <span
              className={`font-bold text-xl ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Road<span className="text-brand-yellow">Helper</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <Group visibleFrom="md" gap="xl">
            <button
              onClick={() => scrollToSection("features")}
              className={linkClass}
            >
              {dict.navbar.features}
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={linkClass}
            >
              {dict.navbar.how_it_works}
            </button>
            <Link href="/about" className={linkClass}>
              {dict.navbar.about}
            </Link>
          </Group>

          {/* RIGHT CONTROLS */}
          <Group>
            {/* MOBILE BURGER */}
            <Burger
              hiddenFrom="md"
              opened={opened}
              onClick={() => setOpened(true)}
              color={isDark ? "white" : "black"}
            />

            {/* THEME */}
            <Tooltip
              label={
                isDark
                  ? (dict?.tooltips?.theme_light ?? "Switch to light theme")
                  : (dict?.tooltips?.theme_dark ?? "Switch to dark theme")
              }
              withArrow
              position="bottom"
            >
              <ActionIcon onClick={toggleTheme} variant="subtle">
                {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Tooltip>

            {/* LANGUAGE */}
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <Tooltip
                  label={
                    dict?.tooltips?.language_toggle ??
                    "Change language (English / Urdu / Roman)"
                  }
                  withArrow
                  position="bottom"
                >
                  <ActionIcon variant="subtle">
                    <IconLanguage size={20} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => setLanguage("en")}
                  disabled={language === "en"}
                >
                  {dict.navbar.english}
                </Menu.Item>
                <Menu.Item
                  onClick={() => setLanguage("ur")}
                  disabled={language === "ur"}
                >
                  {dict.navbar.urdu}
                </Menu.Item>
                <Menu.Item
                  onClick={() => setLanguage("roman" as any)}
                  disabled={language === "roman"}
                >
                  {dict.navbar.roman}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {/* AUTH (DESKTOP ONLY) */}
            <Group visibleFrom="md">
              <Tooltip
                label={dict?.tooltips?.login ?? "Login to your account"}
                withArrow
                position="bottom"
              >
                <Link href="/login">
                  <Button variant="subtle">{dict.navbar.login}</Button>
                </Link>
              </Tooltip>

              <Tooltip
                label={dict?.tooltips?.register ?? "Create a new account"}
                withArrow
                position="bottom"
              >
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      className="bg-brand-yellow text-black font-bold transition-all duration-200"
                      rightSection={
                        <IconChevronRight
                          className={isRTL ? "rotate-180" : ""}
                        />
                      }
                    >
                      {dict.navbar.register}
                    </Button>
                  </motion.div>
                </Link>
              </Tooltip>
            </Group>
          </Group>
        </Container>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="100%"
        withCloseButton={false}
        padding="xl"
        className={isDark ? "bg-black text-white" : "bg-white"}
      >
        <Stack align="center" gap="lg">
          <Title order={3}>
            Road<span className="text-brand-yellow">Helper</span>
          </Title>

          <Divider w="100%" />

          <Button variant="subtle" onClick={() => scrollToSection("features")}>
            {dict.navbar.features}
          </Button>

          <Button
            variant="subtle"
            onClick={() => scrollToSection("how-it-works")}
          >
            {dict.navbar.how_it_works}
          </Button>

          <Link href="/about" onClick={() => setOpened(false)}>
            <Button variant="subtle">{dict.navbar.about}</Button>
          </Link>

          <Divider w="100%" />

          <Button
            onClick={toggleTheme}
            leftSection={isDark ? <IconSun /> : <IconMoon />}
          >
            {isDark ? dict.navbar.light_mode : dict.navbar.dark_mode}
          </Button>

          <Button onClick={() => setLanguage(language === "en" ? "ur" : "en")}>
            {language === "en" ? dict.navbar.urdu : dict.navbar.english}
          </Button>

          <Divider w="100%" />

          <Link href="/login" onClick={() => setOpened(false)}>
            <Button variant="outline" fullWidth>
              {dict.navbar.login}
            </Button>
          </Link>

          <Link href="/register" onClick={() => setOpened(false)}>
            <Button
              fullWidth
              className="bg-brand-yellow text-black font-bold"
              rightSection={<IconArrowRight />}
            >
              {dict.navbar.register}
            </Button>
          </Link>
        </Stack>
      </Drawer>
    </>
  );
};

export default memo(LandingNavbar);
