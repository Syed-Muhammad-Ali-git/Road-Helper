"use client";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useThemeStore } from "@/store/themeStore";
import "@mantine/notifications/styles.css";

const theme = createTheme({});

export function MantineProviders({ children }: { children: React.ReactNode }) {
  const colorScheme = useThemeStore((s) => s.theme);

  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <Notifications position="top-right" zIndex={9999} />
      {children}
    </MantineProvider>
  );
}
