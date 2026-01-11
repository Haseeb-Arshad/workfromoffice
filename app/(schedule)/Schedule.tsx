"use client";

import React, { useState, useEffect } from "react";
// import { useAtom } from "jotai";
// import { eventsAtom } from "@/application/atoms/scheduleAtom"; // Removed duplicate
import { EventCard } from "./components/EventCard";
import { EventForm } from "./components/EventForm";
// Import mockCalendarEvents for now, Google Calendar service will be server-side
const mockCalendarEvents = [
  {
    id: '1',
    summary: 'Morning Standup',
    description: 'Daily team sync meeting',
    start: {
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      timeZone: 'America/New_York',
    },
    location: 'Conference Room A',
    colorId: '2',
    status: 'confirmed',
  },
  {
    id: '2',
    summary: 'Project Review',
    description: 'Quarterly project review with stakeholders',
    start: {
      dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      timeZone: 'America/New_York',
    },
    location: 'Virtual Meeting',
    colorId: '4',
    status: 'confirmed',
  },
];
import { Plus, Calendar, Clock, Settings } from "lucide-react";
import { CalendarIntegration } from "./components/CalendarIntegration";
import { Button } from "@/presentation/components/ui/button";

import { getEvents } from "@/application/services/schedule";
import { checkGoogleConnected, fetchGoogleCalendarEvents } from "@/application/services/googleCalendar";
import { ScheduleEvent } from "@/application/atoms/scheduleAtom"; // Keep types for now if compatible, or map

const Schedule = () => {
  // const [events] = useAtom(eventsAtom); // Removed atom source of truth
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isFormAnimating, setIsFormAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<typeof mockCalendarEvents>([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  const fetchEvents = async () => {
    const serverEvents = await getEvents();
    // Map server events to ScheduleEvent type expected by UI
    // ScheduleEvent expects: id, title, description, startTime (ISO), endTime (ISO), type etc.
    // Server returned: id, summary, description, start.dateTime...
    const mappedEvents: ScheduleEvent[] = serverEvents.map(e => ({
      id: e.id,
      title: e.summary,
      description: e.description,
      startTime: e.start.dateTime,
      endTime: e.end.dateTime,
      type: "meeting", // Default or stored in DB property? we didn't store 'type' in DB schema explicitly besides calendar_events fields. 
      // Schema had: color_id, location. We can map color_id to type if we want or add type column to schema. 
      // For now default to 'meeting'
      meetingType: "virtual",
      priority: "medium"
    }));
    setEvents(mappedEvents);

    // Also fetch Google events if connected
    const isConnected = await checkGoogleConnected();
    setIsCalendarConnected(isConnected);

    if (isConnected) {
      try {
        const gEvents = await fetchGoogleCalendarEvents();
        // Map google events to UI format
        const mappedGEvents: any[] = gEvents.map((e: any) => ({
          id: e.id,
          summary: e.summary,
          description: e.description,
          start: { dateTime: e.start.dateTime || e.start.date, timeZone: e.start.timeZone },
          end: { dateTime: e.end.dateTime || e.end.date, timeZone: e.end.timeZone },
          location: e.location,
          colorId: 'google',
          status: e.status
        }));
        setGoogleEvents(mappedGEvents);
      } catch (e) {
        console.error("Failed to fetch google events", e);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load Google Calendar events
  useEffect(() => {
    // Logic moved to fetchEvents to centralize async calls and check connection on load
  }, [isCalendarConnected]);

  const today = new Date();
  const todayString = today.toDateString();

  // Filter events for today only
  const todayEvents = events
    .filter(event => {
      const eventDate = new Date(event.startTime).toDateString();
      return eventDate === todayString;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  const upcomingEvents = todayEvents.filter(event =>
    new Date(event.endTime) > currentTime
  );

  const completedEvents = todayEvents.filter(event =>
    new Date(event.endTime) <= currentTime
  );

  return (
    <div className="flex flex-col h-full p-4 bg-stone-50">
      {/* Header */}
      <div className="border-b border-primary/10">
        <div className="py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left section - Title and date */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 bg-white">
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary">My Day</h1>
                <div className="flex items-center gap-2 text-xs text-primary/60">
                  <span>{formatDate(today)}</span>
                  <span className="h-1 w-1 rounded-full bg-primary/20" />
                  <span className="tabular-nums">{formatCurrentTime(currentTime)}</span>
                </div>
              </div>
            </div>

            {/* Right section - Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCalendarIntegration(!showCalendarIntegration)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium ${isCalendarConnected
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-white text-secondary border-primary/15 hover:bg-white"
                  }`}
              >
                <Settings className={`w-4 h-4 ${isCalendarConnected ? "text-white" : "text-secondary"}`} />
                <span>{isCalendarConnected ? "Connected" : "Connect"}</span>
              </Button>

              <Button
                onClick={() => {
                  if (!showForm && !isFormAnimating) {
                    setIsFormAnimating(true);
                    setTimeout(() => {
                      setShowForm(true);
                      setIsFormAnimating(false);
                    }, 50);
                  } else if (showForm) {
                    setShowForm(false);
                  }
                }}
                disabled={isFormAnimating}
                className="rounded-md bg-secondary hover:bg-accent px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Event</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Integration Panel */}
      {showCalendarIntegration && (
        <CalendarIntegration
          onClose={() => setShowCalendarIntegration(false)}
          isConnected={isCalendarConnected}
          onConnectionChange={setIsCalendarConnected}
        />
      )}

      {/* Add Event Form */}
      {showForm && (
        <EventForm
          onClose={() => {
            setShowForm(false);
            setIsFormAnimating(false);
          }}
          onEventCreated={fetchEvents}
        />
      )}

      {/* Daily Overview */}
      <div className="px-4 py-4">
        <div className="rounded-lg border border-primary/10 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left section */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/10 bg-white">
                <div className="text-2xl">☀️</div>
              </div>
              <div>
                <h2 className="text-base font-bold text-primary">
                  Good {getTimeOfDay()}!
                </h2>
                <div className="mt-1 flex items-center gap-2 text-xs text-primary/70">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white px-2 py-0.5 text-primary">
                    <Clock className="h-3 w-3" />
                    {upcomingEvents.length}
                  </span>
                  <span className="uppercase tracking-wider">Upcoming</span>
                </div>
              </div>
            </div>

            {/* Right section - Stats */}
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/10 bg-white">
                <span className="text-lg font-bold text-primary">
                  {todayEvents.length + googleEvents.length}
                </span>
              </div>
              <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-primary/50">
                Total Events
              </div>
            </div>
          </div>
          {todayEvents.length > 0 && (
            <div className="mt-4 border-t border-primary/10 pt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/60">
                  Daily Progress
                </span>
                <span className="text-xs text-primary/80">
                  {completedEvents.length}/{todayEvents.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-secondary transition-all"
                  style={{ width: `${(completedEvents.length / todayEvents.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {(todayEvents.length === 0 && googleEvents.length === 0) ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <div className="max-w-sm">
              <div className="rounded-lg border border-primary/10 bg-white p-6">
                <div className="mx-auto mb-4 w-fit">
                  <div className="flex items-center justify-center rounded-xl border border-primary/10 bg-white p-4">
                    <Calendar className="h-10 w-10 text-primary/50" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-primary">Free Day! 🌅</h3>
                <p className="text-sm leading-relaxed text-primary/65">
                  No events scheduled today. Lean into deep focus or take a well-deserved break.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded-full border border-primary/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
                    Upcoming
                  </span>
                  <div className="h-px flex-1 bg-primary/10" />
                </div>

                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className=""
                    >
                      <EventCard event={event} isUpcoming={true} currentTime={currentTime} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded-full border border-primary/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary/60">
                    Completed
                  </span>
                  <div className="h-px flex-1 bg-primary/10" />
                </div>

                <div className="space-y-3">
                  {completedEvents.map((event) => (
                    <div
                      key={event.id}
                      className=""
                    >
                      <EventCard event={event} isUpcoming={false} currentTime={currentTime} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
export { Schedule };
