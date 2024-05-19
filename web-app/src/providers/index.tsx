// app/providers.tsx
"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { RecoilRoot } from "recoil";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <RecoilRoot>
      <NextUIProvider>
        <ThemeProvider {...props}>{children}</ThemeProvider>
      </NextUIProvider>
    </RecoilRoot>
  );
}
