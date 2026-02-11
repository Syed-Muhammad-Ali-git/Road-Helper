"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { IconBrandGithub, IconBrandLinkedin, IconMail } from "@tabler/icons-react";
import { Group, Stack, Text, Divider } from "@mantine/core";

export const Footer: React.FC = () => {
  const { dict, isRTL } = useLanguage();

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="w-full bg-brand-charcoal border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="font-manrope font-black text-xl text-white mb-2">
              Road<span className="text-brand-red">Helper</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Your trusted companion on every journey.
            </p>
          </div>

          {/* Company */}
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <h4 className="font-semibold text-white mb-4">
              {dict.footer.company}
            </h4>
            <Stack gap={2}>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.about}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.careers}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.contact}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.blog}
              </Link>
            </Stack>
          </div>

          {/* Services */}
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <h4 className="font-semibold text-white mb-4">
              {dict.footer.services}
            </h4>
            <Stack gap={2}>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.towing}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.tire_change}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.fuel_delivery}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.battery_jump}
              </Link>
            </Stack>
          </div>

          {/* Legal */}
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <Stack gap={2}>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.privacy_policy}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.terms_of_service}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">
                {dict.footer.cookie_policy}
              </Link>
            </Stack>
          </div>
        </div>

        <Divider className="border-white/10" />

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Text size="sm" className="text-gray-400">
            © {currentYear} RoadHelper. {dict.footer.rights_reserved}
          </Text>

          {/* Social Links */}
          <Group gap={4}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-brand-red/20 rounded-lg transition-colors"
              title="GitHub"
            >
              <IconBrandGithub size={20} className="text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-brand-red/20 rounded-lg transition-colors"
              title="LinkedIn"
            >
              <IconBrandLinkedin size={20} className="text-white" />
            </a>
            <a
              href="mailto:support@roadhelper.com"
              className="p-2 bg-white/10 hover:bg-brand-red/20 rounded-lg transition-colors"
              title="Email"
            >
              <IconMail size={20} className="text-white" />
            </a>
          </Group>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
