export interface AppMetadata {
    id: string;
    name: string;
    src: string;
    hidden?: boolean;
}

export const appMetadata: Record<string, AppMetadata> = {
    timer: {
        id: "timer",
        name: "Timer",
        src: "/icons/clock.png",
    },
    todoList: {
        id: "todoList",
        name: "To-Do List",
        src: "/icons/board.png",
    },
    ambience: {
        id: "ambience",
        name: "Ambience",
        src: "/icons/ambience.png",
    },
    musicPlayer: {
        id: "musicPlayer",
        name: "Music Player",
        src: "/icons/music.png",
    },
    notepad: {
        id: "notepad",
        name: "Notepad",
        src: "/icons/notepad.png",
    },
    bookmark: {
        id: "bookmark",
        name: "Bookmark",
        src: "/icons/bookmark.png",
    },
    settings: {
        id: "settings",
        name: "Settings",
        src: "/icons/settings.png",
    },
    changelog: {
        id: "changelog",
        name: "Changelog",
        src: "/icons/default.png",
        hidden: true,
    },
    sessionLog: {
        id: "sessionLog",
        name: "Session Log",
        src: "/icons/default.png",
        hidden: true,
    },
    announcements: {
        id: "announcements",
        name: "Announcements",
        src: "/icons/announcement.png",
    },
    schedule: {
        id: "schedule",
        name: "My Day",
        src: "/icons/myday.png",
    },
    aiAssistant: {
        id: "aiAssistant",
        name: "AI Assistant",
        src: "/icons/default.png",
    },
    stickyNotes: {
        id: "stickyNotes",
        name: "Sticky Notes",
        src: "/icons/notepad.png",
    },
};
