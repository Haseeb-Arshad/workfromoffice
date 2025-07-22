import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type EventType = "meeting" | "presentation" | "call" | "workshop" | "break" | "deadline";
export type MeetingType = "virtual" | "in-person" | "hybrid";
export type Priority = "low" | "medium" | "high";

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: EventType;
  meetingType?: MeetingType;
  location?: string;
  attendees?: string[];
  isRecurring?: boolean;
  priority?: "low" | "medium" | "high";
}

// Helper function to create today's date at specific time
const todayAt = (hour: number, minute: number = 0) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

// Helper function to create events for different times
const createTodayEvent = (startHour: number, startMinute: number, duration: number): { start: string; end: string } => {
  const start = new Date();
  start.setHours(startHour, startMinute, 0, 0);
  const end = new Date(start.getTime() + duration * 60 * 1000);
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

// Atom for storing schedule events with localStorage persistence
export const eventsAtom = atomWithStorage<ScheduleEvent[]>(
  "wfcos-schedule",
  [
    {
      id: "event-1",
      title: "Project Phoenix Stand-up",
      description: "Daily team synchronization meeting to discuss progress and blockers",
      startTime: createTodayEvent(10, 0, 30).start,
      endTime: createTodayEvent(10, 0, 30).end,
      type: "meeting",
      meetingType: "virtual",
      attendees: ["Sarah Johnson", "Mike Chen", "Alex Rivera"],
      isRecurring: true,
      priority: "high"
    },
    {
      id: "event-2", 
      title: "Client Presentation - Q3 Results",
      description: "Quarterly business review presentation for Acme Corp",
      startTime: createTodayEvent(14, 0, 60).start,
      endTime: createTodayEvent(14, 0, 60).end,
      type: "presentation",
      meetingType: "in-person",
      location: "Conference Room A",
      attendees: ["David Wilson", "Lisa Thompson", "Emily Davis"],
      priority: "high"
    },
    {
      id: "event-3",
      title: "Coffee Chat with Marketing Team",
      description: "Informal discussion about upcoming campaigns",
      startTime: createTodayEvent(15, 30, 30).start,
      endTime: createTodayEvent(15, 30, 30).end,
      type: "break",
      meetingType: "in-person",
      location: "Kitchen Area",
      attendees: ["Alex Rivera", "Marketing Team"],
      priority: "low"
    },
    {
      id: "event-4",
      title: "Design Review - Mobile App",
      description: "Review latest UI/UX designs for the mobile application",
      startTime: createTodayEvent(16, 0, 45).start,
      endTime: createTodayEvent(16, 0, 45).end,
      type: "meeting",
      meetingType: "hybrid",
      location: "Design Studio / Zoom",
      attendees: ["Mike Chen", "Sarah Johnson", "UX Team"],
      priority: "medium"
    },
    {
      id: "event-5",
      title: "Sprint Planning Session",
      description: "Plan tasks and goals for the upcoming 2-week sprint",
      startTime: createTodayEvent(9, 0, 90).start,
      endTime: createTodayEvent(9, 0, 90).end,
      type: "workshop",
      meetingType: "virtual",
      attendees: ["Full Development Team"],
      isRecurring: true,
      priority: "high"
    },
    // Add a past event to show completed section
    {
      id: "event-6",
      title: "Morning Standup",
      description: "Quick team alignment for the day",
      startTime: createTodayEvent(8, 30, 15).start,
      endTime: createTodayEvent(8, 30, 15).end,
      type: "meeting",
      meetingType: "virtual",
      attendees: ["Engineering Team"],
      isRecurring: true,
      priority: "medium"
    }
  ]
);

// Atom for adding new events
export const addEventAtom = atom(
  null,
  (get, set, newEvent: Omit<ScheduleEvent, "id">) => {
    const events = get(eventsAtom);
    const event: ScheduleEvent = {
      ...newEvent,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set(eventsAtom, [...events, event]);
  }
);

// Atom for removing events
export const removeEventAtom = atom(
  null,
  (get, set, id: string) => {
    const events = get(eventsAtom);
    set(eventsAtom, events.filter(e => e.id !== id));
  }
);

// Atom for updating events
export const updateEventAtom = atom(
  null,
  (get, set, updatedEvent: ScheduleEvent) => {
    const events = get(eventsAtom);
    set(eventsAtom, events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  }
);
