"use client";

import Link from "next/link";
import { Title, Text, Button, Container } from "@mantine/core";
import { motion } from "framer-motion";
import { IconArrowLeft } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black relative overflow-hidden font-satoshi">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Text className="text-[12rem] md:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-brand-charcoal to-brand-black leading-none select-none">
            404
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
        >
          <Title className="text-white text-3xl md:text-5xl font-bold mb-4 font-manrope">
            Page Not Found
          </Title>
          <Text className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Text>
          <Link href="/">
            <Button
              size="lg"
              className="bg-brand-red hover:bg-brand-dark-red text-white rounded-full px-8 transition-transform hover:scale-105 active:scale-95"
              leftSection={<IconArrowLeft size={20} />}
            >
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </Container>
    </div>
  );
}
