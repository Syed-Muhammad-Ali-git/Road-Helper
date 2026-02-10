"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Group, Container } from "@mantine/core";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useCallback, memo } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

const LandingNavbarComponent = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-xl py-3 shadow-lg shadow-brand-red/5"
          : "bg-transparent py-6"
      }`}
    >
      <Container size="xl" className="flex items-center justify-between">
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
          <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg shadow-red-500/20 transition-transform group-hover:scale-110 bg-white p-1">
            <Image
              src="/assets/images/logo.png"
              alt="Road Helper Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-satoshi font-bold text-xl text-white tracking-tight group-hover:text-brand-red transition-colors">
            Road<span className="text-brand-red">Helper</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <Group visibleFrom="sm" gap="xl" className="hidden md:flex">
          <button
            onClick={() => scrollToSection("features")}
            className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none group"
          >
            <span className="relative z-10">Features</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-red to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none group"
          >
            <span className="relative z-10">How it Works</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-red to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <Link
            href="/about"
            className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors no-underline group"
          >
            <span className="relative z-10">About</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-red to-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </Group>

        {/* AUTH BUTTONS */}
        <Group>
          <Link href="/login">
            <Button
              variant="subtle"
              className="font-manrope text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              radius="xl"
            >
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button
              className="bg-gradient-to-r from-brand-red to-brand-dark-red hover:from-brand-dark-red hover:to-brand-red text-white transition-all shadow-lg shadow-red-900/20 hover:shadow-red-600/40 hover:scale-105 active:scale-95"
              radius="xl"
              size="sm"
              rightSection={<IconChevronRight size={16} />}
            >
              Get Started
            </Button>
          </Link>
        </Group>
      </Container>
    </motion.nav>
  );
};

export const LandingNavbar = memo(LandingNavbarComponent);
