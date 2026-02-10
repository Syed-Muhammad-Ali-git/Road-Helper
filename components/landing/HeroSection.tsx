"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Container, Grid, Text, Title, Group } from "@mantine/core";
import { motion } from "framer-motion";
import {
  IconMapPin,
  IconPhoneCall,
  IconShieldCheck,
} from "@tabler/icons-react";

const HeroSectionComponent = () => {
  const stats = useMemo(
    () => [
      { icon: IconShieldCheck, label: "Verified Helpers", value: "500+" },
      { icon: IconMapPin, label: "Cities Coverage", value: "50+" },
    ],
    [],
  );

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 -z-10 pointer-events-none" />

      <Container size="xl">
        <Grid gutter={60} align="center">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-brand-charcoal mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-gray-300">
                  24/7 Emergency Support
                </span>
              </div>

              {/* Main Heading */}
              <Title className="font-satoshi text-5xl md:text-7xl font-extrabold leading-[1.1] text-white mb-6 tracking-tight">
                Stuck on the road? <br />
                <span className="text-gradient-red">
                  We&apos;ve got you covered.
                </span>
              </Title>

              <Text className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                The fastest way to get back on track. Flat tire, dead battery,
                or empty tank — help is just a tap away. Track your rescuer in
                real-time.
              </Text>

              {/* CTA Buttons */}
              <Group gap="md" className="mb-12">
                <Link href="/register?type=customer">
                  <Button
                    size="xl"
                    className="bg-linear-to-r from-brand-red to-brand-dark-red hover:from-brand-dark-red hover:to-brand-red transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/20 rounded-full px-8 h-14 text-white font-bold"
                    leftSection={<IconMapPin size={22} stroke={2} />}
                  >
                    Request Help Now
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="xl"
                    color="gray"
                    className="rounded-full px-8 h-14 border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white transition-all glass"
                    leftSection={<IconPhoneCall size={22} stroke={1.5} />}
                  >
                    Emergency Call
                  </Button>
                </Link>
              </Group>

              {/* Social Proof */}
              <div className="flex items-center gap-6 flex-wrap">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center">
                        <Icon size={20} className="text-brand-red" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </Grid.Col>

          {/* Right Image */}
          <Grid.Col span={{ base: 12, md: 6 }} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative z-10"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 aspect-4/3 group">
                <div className="absolute inset-0 bg-linear-to-br from-brand-charcoal to-brand-black z-0" />

                <Image
                  src="/assets/images/hero-illustration.png"
                  alt="Roadside Assistance App Interface"
                  fill
                  className="object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Elements */}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-6 left-0 right-6 glass-dark p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red">
                    <IconMapPin size={24} />
                  </div>
                  <div>
                    <Text className="font-bold text-white text-sm">
                      Tow Truck Arriving...
                    </Text>
                    <Text className="text-xs text-gray-400">
                      Estimated 5 mins • 1.2km away
                    </Text>
                  </div>
                  <Button
                    size="xs"
                    color="red"
                    radius="xl"
                    className="sm:ml-auto bg-brand-red hover:bg-brand-dark-red w-full sm:w-auto max-[450px]:mt-2"
                  >
                    Track
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-6 right-6 glass-dark p-3 rounded-xl flex items-center gap-3 border border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <IconShieldCheck size={18} />
                  </div>
                  <div>
                    <Text className="font-bold text-white text-xs">
                      Verified Helper
                    </Text>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Blobs */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-red/20 rounded-full blur-[80px] -z-10 animate-pulse" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px] -z-10 animate-pulse" />
            </motion.div>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  );
};

export const HeroSection = memo(HeroSectionComponent);
