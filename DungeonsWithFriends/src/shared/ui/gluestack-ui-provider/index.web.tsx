"use client";
import React from "react";
import { config } from "./config";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";

const STYLE_ELEMENT_ID = "gluestack-theme-vars";

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: "light" | "dark";
  children?: React.ReactNode;
}) {
  if (config[mode] && typeof document !== "undefined") {
    const element = document.documentElement;
    if (element) {
      const head = element.querySelector("head");
      // Deduplicate: reuse an existing style element instead of appending a new one every render
      let style = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = STYLE_ELEMENT_ID;
        if (head) head.appendChild(style);
      }
      const stringcssvars = Object.keys(config[mode]).reduce((acc, cur) => {
        acc += `${cur}:${config[mode][cur]};`;
        return acc;
      }, "");
      style.innerHTML = `:root {${stringcssvars}} `;
    }
  }
  return (
    <OverlayProvider>
      <ToastProvider>{props.children}</ToastProvider>
    </OverlayProvider>
  );
}
