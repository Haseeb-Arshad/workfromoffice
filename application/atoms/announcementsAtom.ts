import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author?: string;
  priority?: "low" | "medium" | "high";
}

// Atom for storing announcements with localStorage persistence
export const announcementsAtom = atomWithStorage<Announcement[]>(
  "wfcos-announcements",
  [
    {
      id: "welcome-sarah",
      title: "Welcome, Sarah!",
      description: "We are thrilled to welcome Sarah Jenkins to the engineering team! Her desk is on the 4th floor, so be sure to stop by and say hello.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      author: "HR Team",
      priority: "medium"
    },
    {
      id: "q3-meeting",
      title: "Q3 All-Hands Meeting This Friday",
      description: "Join us this Friday at 2:00 PM in the main conference room for our quarterly all-hands meeting. We'll be discussing Q3 results, upcoming projects, and team updates. Light refreshments will be provided.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      author: "Management Team",
      priority: "high"
    },
    {
      id: "new-coffee-machine",
      title: "New Coffee Machine Installed",
      description: "We've installed a new premium coffee machine on the 3rd floor break room. Enjoy freshly ground coffee, espresso, and various specialty drinks. Instructions are posted next to the machine.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      author: "Facilities Team",
      priority: "low"
    }
  ]
);

// Atom for adding new announcements
export const addAnnouncementAtom = atom(
  null,
  (get, set, newAnnouncement: Omit<Announcement, "id" | "createdAt">) => {
    const announcements = get(announcementsAtom);
    const announcement: Announcement = {
      ...newAnnouncement,
      id: `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    set(announcementsAtom, [announcement, ...announcements]);
  }
);

// Atom for removing announcements
export const removeAnnouncementAtom = atom(
  null,
  (get, set, id: string) => {
    const announcements = get(announcementsAtom);
    set(announcementsAtom, announcements.filter(a => a.id !== id));
  }
);
