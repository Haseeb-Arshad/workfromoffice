import { Size } from "@/application/types/window";
import React from "react";
import { Timer } from "@/app/(timer)/Timer";
import { BackgroundChanger } from "@/app/(settings)/(background)/background";
import { SoundChanger } from "@/app/(settings)/(sound)/sound";
import { MusicPlayer } from "@/app/(music-player)/MusicPlayer";
import TodoList from "@/app/(to-do-list)/todoList";
import { AmbiencePlayer } from "@/app/(ambience)/ambiencePlayer";
import Notepad from "@/app/(notepad)/Notepad";
import { ChangelogWindow } from "@/presentation/components/shared/taskbar/ChangelogWindow";
import Bookmark from "@/app/(bookmark)/Bookmark";
import { SettingsPanel } from "@/app/(settings)/SettingsPanel";
import SessionLogApp from "@/app/(session-log)/SessionLogApp";
import Announcements from "@/app/(announcements)/Announcements";
import { Kudos } from "@/app/(kudos)/Kudos";
import { Schedule } from "@/app/(schedule)/Schedule";
import { ResourceCenter } from "@/app/(resource-center)/ResourceCenter";
import { HRPortal } from "@/app/(resource-center)/components/HRPortal";
import { ITHelpdesk } from "@/app/(resource-center)/components/ITHelpdesk";
import { CompanyWiki } from "@/app/(resource-center)/components/CompanyWiki";
import { DesignSystem } from "@/app/(resource-center)/components/DesignSystem";
import Teahouse from "@/app/(teahouse)/Teahouse";
import VillageWell from "@/app/(village-well)/VillageWell";
import TravelersDirectory from "@/app/(travelers-directory)/TravelersDirectory";

interface AppRegistryEntry {
  name: string; // The display name of the app
  src: string; // Path to the app icon
  defaultSize: Size;
  minSize?: Size;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  hidden?: boolean; // Flag to hide app from desktop icons
}

// Settings module specific entries
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

export const appRegistry: Record<string, AppRegistryEntry> = {
  // Using appId as the key (e.g., 'pomodoro'), and name for display

  timer: {
    name: "Timer",
    src: "/icons/clock.png",
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 400, height: 350 },
    component: Timer,
  },

  todoList: {
    name: "To-Do List",
    src: "/icons/board.png",
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 320, height: 400 },
    component: TodoList,
  },

  ambience: {
    name: "Ambience",
    src: "/icons/ambience.png",
    defaultSize: { width: 375, height: 190 },
    minSize: { width: 375, height: 190 },
    component: AmbiencePlayer,
  },
  musicPlayer: {
    name: "Music Player",
    src: "/icons/music.png",
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 320, height: 400 },
    component: MusicPlayer,
  },
  notepad: {
    name: "Notepad",
    src: "/icons/notepad.png",
    defaultSize: { width: 600, height: 600 },
    minSize: { width: 320, height: 400 },
    component: Notepad,
  },
  bookmark: {
    name: "Bookmark",
    src: "/icons/bookmark.png", // We'll need to ensure this icon exists
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 320, height: 400 },
    component: Bookmark,
  },
  settings: {
    name: "Settings",
    src: "/icons/settings.png",
    defaultSize: { width: 500, height: 550 },
    minSize: { width: 300, height: 300 },
    component: SettingsPanel,
  },
  changelog: {
    name: "Changelog",
    src: "/icons/default.png",
    defaultSize: { width: 500, height: 400 },
    minSize: { width: 300, height: 200 },
    component: ChangelogWindow,
    hidden: true, // Hide from desktop icons
  },
  sessionLog: {
    name: "Session Log",
    src: "/icons/default.png",
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 450, height: 300 },
    component: SessionLogApp,
    hidden: true,
  },
  announcements: {
    name: "Announcements",
    src: "/icons/announcement.png",
    defaultSize: { width: 550, height: 650 },
    minSize: { width: 400, height: 450 },
    component: Announcements,
  },
  kudos: {
    name: "Team Kudos",
    src: "/icons/kudos-star.png",
    defaultSize: { width: 600, height: 700 },
    minSize: { width: 450, height: 500 },
    component: Kudos,
  },
  schedule: {
    name: "My Day",
    src: "/icons/myday.png",
    defaultSize: { width: 480, height: 600 },
    minSize: { width: 400, height: 500 },
    component: Schedule,
  },
  resourceCenter: {
    name: "Resources",
    src: "/icons/book.png",
    defaultSize: { width: 800, height: 700 },
    minSize: { width: 600, height: 500 },
    component: ResourceCenter,
  },
  hrPortal: {
    name: "HR Portal",
    src: "/icons/hr-portal.png",
    defaultSize: { width: 900, height: 700 },
    minSize: { width: 600, height: 500 },
    component: HRPortal,
    hidden: true,
  },
  itHelpdesk: {
    name: "IT Helpdesk",
    src: "/icons/it-helpdesk.png",
    defaultSize: { width: 900, height: 700 },
    minSize: { width: 600, height: 500 },
    component: ITHelpdesk,
    hidden: true,
  },
  companyWiki: {
    name: "Company Wiki",
    src: "/icons/company-wiki.png",
    defaultSize: { width: 900, height: 700 },
    minSize: { width: 600, height: 500 },
    component: CompanyWiki,
    hidden: true,
  },
  designSystem: {
    name: "Design System",
    src: "/icons/design-system.png",
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 600, height: 500 },
    component: DesignSystem,
    hidden: true,
  },
  teahouse: {
    name: "The Teahouse",
    src: "/icons/coffee.png",
    defaultSize: { width: 800, height: 700 },
    minSize: { width: 700, height: 600 },
    component: Teahouse,
  },
  villageWell: {
    name: "The Village Well",
    src: "/icons/cafe.png",
    defaultSize: { width: 900, height: 750 },
    minSize: { width: 800, height: 650 },
    component: VillageWell,
  },
  travelersDirectory: {
    name: "The Fellowship",
    src: "/icons/fellowship.png",
    defaultSize: { width: 1000, height: 800 },
    minSize: { width: 800, height: 600 },
    component: TravelersDirectory,
  },
};

// Add other apps here using a unique key (appId);
