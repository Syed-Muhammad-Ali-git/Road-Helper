"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Container, Grid, Text, Title, Group } from "@mantine/core";
import { motion } from "framer-motion";
import { IconMapPin, IconPhoneCall } from "@tabler/icons-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-red-50 to-transparent opacity-50 -z-10 pointer-events-none" />

      <Container size="xl">
        <Grid gutter={60} align="center">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-brand-red text-xs font-bold uppercase tracking-wide mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                </span>
                24/7 Emergency Support
              </div>

              <Title className="font-manrope text-5xl md:text-7xl font-bold leading-[1.1] text-brand-black mb-6 tracking-tight">
                Stuck on the road? <br />
                <span className="text-transparent bg-clip-text bg-primary-gradient">
                  We’re here to help.
                </span>
              </Title>

              <Text className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
                The fastest way to get back on track. Flat tire, dead battery,
                or empty tank — help is just a tap away. Track your rescuer in
                real-time.
              </Text>

              <Group gap="md">
                <Link href="/customer/dashboard">
                  <Button
                    size="xl"
                    className="bg-primary-gradient hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20 rounded-full px-8 h-14"
                    leftSection={<IconMapPin size={22} stroke={2} />}
                  >
                    Request Help Now
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="default"
                    size="xl"
                    className="rounded-full px-8 h-14 border-gray-200 text-brand-black hover:bg-gray-50 hover:border-gray-300 transition-all"
                    leftSection={<IconPhoneCall size={22} stroke={1.5} />}
                  >
                    Emergency Call
                  </Button>
                </Link>
              </Group>

              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative shadow-sm"
                    >
                      <Image
                        src={`https://i.pravatar.cc/150?img=${i + 10}`}
                        alt="user"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 leading-snug">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-brand-black">
                    Trusted by 2,000+ drivers
                  </span>
                </div>
              </div>
            </motion.div>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 bg-white border border-gray-100/50 aspect-4/3">
                <Image
                  src="/assets/images/hero-illustration.png"
                  alt="Roadside Assistance"
                  fill
                  priority
                  className="object-cover"
                />

                {/* Floating UI Card Animation */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <IconMapPin size={24} />
                    </div>
                    <div>
                      <Text className="font-bold text-brand-black text-sm">
                        Help is on the way
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Tow Truck • 5 mins away
                      </Text>
                    </div>
                    <div className="ml-auto">
                      <Button size="xs" color="black" radius="xl">
                        Track
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decor elements */}
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-red/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  );
}
