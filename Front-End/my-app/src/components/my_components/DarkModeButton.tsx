"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
interface DarkButton {
  DarkMode: boolean;
  SetDarkMode: (val: boolean) => void;
}
const DarkModeButton = ({ SetDarkMode, DarkMode }: DarkButton) => {
  return (
    <div className="flex justify-end items-center gap-4 mr-16">
      <Switch
        checked={DarkMode}
        onCheckedChange={SetDarkMode}
        className="data-[state=checked]:bg-blue-950 data-[state=unchecked]:bg-gray-300 transition-all duration-300"
      />
      <label
        htmlFor="airplane-mode"
        className={`font-Ubuntu transition-all duration-300 ${
          DarkMode ? "text-white" : "text-black"
        }`}
      >
        Dark Mode
      </label>
    </div>
  );
};

export default DarkModeButton;
