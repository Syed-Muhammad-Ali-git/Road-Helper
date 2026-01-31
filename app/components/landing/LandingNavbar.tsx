"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Group, Container, Box } from "@mantine/core";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import logoIcon from "../../assets/images/logo.png";
import { IconChevronRight } from "@tabler/icons-react";

export function LandingNavbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-dark py-4 border-b border-white/10"
          : "bg-transparent py-6"
      }`}
    >
      <Container size="xl" className="flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg shadow-red-500/20 transition-transform group-hover:scale-105">
            <Image
              src={logoIcon}
              alt="Road Helper Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-satoshi font-bold text-xl text-white tracking-tight group-hover:text-brand-red transition-colors">
            Road Helper
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <Group visibleFrom="sm" gap="xl" className="hidden md:flex">
          <button
            onClick={() => scrollToSection("features")}
            className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            <span className="relative z-10">Features</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 hover:w-full"></span>
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            <span className="relative z-10">How it Works</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 hover:w-full"></span>
          </button>
          <Link
            href="/about"
            className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors no-underline"
          >
            <span className="relative z-10">About</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 hover:w-full"></span>
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
              className="bg-brand-red hover:bg-brand-dark-red text-white transition-all shadow-lg shadow-red-900/20 hover:shadow-red-600/40 hover:scale-105 active:scale-95"
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
}
