import React from "react";
import { BackgroundChanger } from "@/app/(settings)/(background)/background";
import { SoundChanger } from "@/app/(settings)/(sound)/sound";

export interface SettingsEntry {
    id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>;
    icon: string;
}

export const settingsRegistry: SettingsEntry[] = [
    {
        id: "background",
        name: "Background",
        component: BackgroundChanger,
        icon: "/icons/wallpaper.png",
    },
    {
        id: "sound",
        name: "Sound",
        component: SoundChanger,
        icon: "/icons/volume.png",
    },
];
