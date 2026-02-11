"use client";

import React, { memo } from "react";
import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  RingProgress,
  Box,
  ThemeIcon,
  Timeline,
} from "@mantine/core";
import {
  IconServer,
  IconDatabase,
  IconWifi,
  IconCpu,
  IconActivity,
  IconShieldLock,
  IconCloudComputing,
  IconBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const systemMetrics = [
  {
    title: "Distributed Core",
    sub: "Load Balanced",
    val: 98,
    color: "emerald",
    icon: IconServer,
    details: ["Uptime: 14d 21h", "Latency: 24ms"],
  },
  {
    title: "Real-time DB",
    sub: "Clusters Active",
    val: 45,
    color: "blue",
    icon: IconDatabase,
    details: ["Conn: 1,204/5k", "Cache: Hit 99.2%"],
  },
  {
    title: "Neural Processing",
    sub: "Priority Queue",
    val: 65,
    color: "amber",
    icon: IconCpu,
    details: ["Thread: 4/12", "Cycles: 4.2GHz"],
  },
  {
    title: "Neural Network",
    sub: "Encrypted Fiber",
    val: 25,
    color: "violet",
    icon: IconWifi,
    details: ["BW: 1.2 GB/s", "Packet Loss: 0%"],
  },
];

const StatusPage = () => {
  return (
    <Box className="relative min-h-screen bg-[#0a0a0a] overflow-hidden p-4 md:p-8 font-satoshi text-white">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #333 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <motion.div
          animate={{ x: [-1000, 1000], opacity: [0, 1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-0 w-full h-[1px] bg-brand-red/50 shadow-[0_0_15px_#ef4444]"
        />
      </div>

      <motion.div
        variants={containerVariants as any}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto"
      >
        <header className="mb-12">
          <motion.div
            variants={itemVariants as any}
            className="flex items-center gap-2 mb-2"
          >
            <IconActivity size={16} className="text-brand-red" />
            <Text className="text-brand-red font-black uppercase tracking-[0.3em] text-[10px]">
              Bios-Level Monitoring
            </Text>
          </motion.div>
          <Title
            order={1}
            className="font-manrope font-black text-4xl md:text-5xl text-white tracking-tight"
          >
            System{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              Integrity
            </span>
          </Title>
          <Text className="text-gray-500 mt-2 font-bold uppercase tracking-tight text-xs">
            Real-time telemetry from core infrastructure components.
          </Text>
        </header>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={32} mb={45}>
          {systemMetrics.map((metric, idx) => (
            <motion.div key={idx} variants={itemVariants as any}>
              <Paper
                p={32}
                radius="32px"
                className="glass-dark border border-white/10 relative overflow-hidden group hover:border-brand-red/30 transition-all duration-500 shadow-2xl"
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-[0.02] group-hover:opacity-[0.08] transition-opacity",
                    `from-${metric.color}-600/20 to-transparent`,
                  )}
                />

                <Group justify="space-between" mb={24}>
                  <Group gap="lg">
                    <ThemeIcon
                      size={64}
                      radius="22px"
                      className={cn(
                        "bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-inner",
                        `text-${metric.color}-400`,
                      )}
                    >
                      <metric.icon size={32} />
                    </ThemeIcon>
                    <div>
                      <Text
                        fw={900}
                        className="text-white text-xl tracking-tight uppercase font-manrope"
                      >
                        {metric.title}
                      </Text>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full animate-pulse",
                            `bg-${metric.color}-400`,
                          )}
                        />
                        <Text
                          size="xs"
                          className={cn(
                            "font-black tracking-widest uppercase",
                            `text-${metric.color}-400`,
                          )}
                        >
                          {metric.sub}
                        </Text>
                      </div>
                    </div>
                  </Group>

                  <RingProgress
                    size={100}
                    thickness={8}
                    roundCaps
                    sections={[
                      {
                        value: metric.val,
                        color:
                          metric.color === "emerald" ? "teal" : metric.color,
                      },
                    ]}
                    label={
                      <Text
                        fw={900}
                        ta="center"
                        size="sm"
                        className="text-white font-manrope"
                      >
                        {metric.val}%
                      </Text>
                    }
                  />
                </Group>

                <SimpleGrid
                  cols={2}
                  spacing="md"
                  className="border-t border-white/5 pt-6 relative z-10"
                >
                  {metric.details.map((detail, i) => (
                    <div key={i} className="flex flex-col">
                      <Text className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
                        {detail.split(":")[0]}
                      </Text>
                      <Text className="text-white font-black text-md">
                        {detail.split(":")[1]}
                      </Text>
                    </div>
                  ))}
                </SimpleGrid>
              </Paper>
            </motion.div>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={32}>
          {/* Active Protocols */}
          <motion.div variants={itemVariants as any} className="lg:col-span-1">
            <Paper
              p={40}
              radius="32px"
              className="glass-dark border border-white/10 h-full shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 text-white/[0.02]">
                <IconShieldLock size={120} />
              </div>
              <Title
                order={3}
                className="text-white font-black mb-10 text-xl tracking-tight uppercase"
              >
                Security Protocols
              </Title>

              <Timeline
                bulletSize={32}
                lineWidth={2}
                active={2}
                color="brand-red"
                classNames={{
                  itemTitle: "text-white font-bold text-sm",
                  itemBullet: "bg-[#111] border-2 border-white/10",
                  itemContent: "text-gray-500 text-xs font-medium",
                }}
              >
                <Timeline.Item
                  bullet={<IconCloudComputing size={16} />}
                  title="Global Auth Proxy"
                >
                  Active - Encrypted with 256-bit AES protocol.
                </Timeline.Item>
                <Timeline.Item
                  bullet={<IconShieldLock size={16} />}
                  title="RBAC Enforcement"
                >
                  Enforced - Dynamic role monitoring active.
                </Timeline.Item>
                <Timeline.Item
                  bullet={<IconBolt size={16} />}
                  title="DDoS Mitigation"
                >
                  Active - Scalable traffic filtering active.
                </Timeline.Item>
              </Timeline>
            </Paper>
          </motion.div>

          {/* Live Analytics Stream */}
          <motion.div variants={itemVariants as any} className="lg:col-span-2">
            <Paper
              p={40}
              radius="32px"
              className="glass-dark border border-white/10 shadow-2xl"
            >
              <Group justify="space-between" mb={30}>
                <Title
                  order={3}
                  className="text-white font-black text-xl tracking-tight uppercase"
                >
                  Health Diagnostics
                </Title>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                  <IconActivity size={14} className="text-emerald-400" />
                  <Text className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                    All Systems Normal
                  </Text>
                </div>
              </Group>

              <div className="space-y-6">
                {[
                  {
                    label: "Memory Retention",
                    val: "84%",
                    color: "blue",
                    stat: "14.2 GB Used",
                  },
                  {
                    label: "Storage I/O",
                    val: "12%",
                    color: "emerald",
                    stat: "2.4k IOPS",
                  },
                  {
                    label: "Traffic Surge",
                    val: "6%",
                    color: "amber",
                    stat: "Low Load",
                  },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-3">
                    <Group justify="space-between">
                      <Text
                        size="xs"
                        fw={900}
                        className="text-gray-400 uppercase tracking-widest"
                      >
                        {row.label}
                      </Text>
                      <Text
                        size="xs"
                        fw={900}
                        className="text-white font-manrope"
                      >
                        {row.stat}
                      </Text>
                    </Group>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: row.val }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={cn(
                          "h-full rounded-full",
                          `bg-${row.color === "emerald" ? "teal" : row.color}-500 shadow-[0_0_10px_currentColor]`,
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Paper>
          </motion.div>
        </SimpleGrid>

        <div className="h-32" />
      </motion.div>
    </Box>
  );
};

export default memo(StatusPage);
