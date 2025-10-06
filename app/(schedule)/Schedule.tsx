"use client";

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { eventsAtom } from "@/application/atoms/scheduleAtom";
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

const Schedule = () => {
  const [events] = useAtom(eventsAtom);
  const [showForm, setShowForm] = useState(false);
  const [isFormAnimating, setIsFormAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<typeof mockCalendarEvents>([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load Google Calendar events (mock for now)
  useEffect(() => {
    // For demo purposes, use mock data
    // In production, this would check authentication and fetch real events
    if (isCalendarConnected) {
      setGoogleEvents(mockCalendarEvents);
    }
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
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <div className="relative bg-white/70 backdrop-blur-xl border-b border-primary/10 shadow-sm">
        <div className="px-5 py-3">
          <div className="flex justify-between items-center">
            {/* Left section - Title and date */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/70 border border-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary tracking-tight">My Day</h1>
                <div className="flex items-center gap-2 text-[11px] text-primary/60 font-medium">
                  <span>{formatDate(today)}</span>
                  <span className="w-1 h-1 rounded-full bg-primary/20" />
                  <span className="tabular-nums">{formatCurrentTime(currentTime)}</span>
                </div>
              </div>
            </div>
            
            {/* Right section - Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCalendarIntegration(!showCalendarIntegration)}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold border transition-colors ${
                  isCalendarConnected 
                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                    : 'bg-white/80 text-secondary border-primary/15 hover:bg-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{isCalendarConnected ? 'Connected' : 'Connect'}</span>
              </button>
              
              <button
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
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold border border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
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
        <EventForm onClose={() => {
          setShowForm(false);
          setIsFormAnimating(false);
        }} />
      )}

      {/* Daily Overview */}
      <div className="relative px-5 py-4">
        <div className="relative">
          {/* Main card */}
          <div className="relative bg-white/80 backdrop-blur-md rounded-xl p-4 border border-primary/10 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Left section */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/70 border border-primary/10 flex items-center justify-center">
                  <div className="text-xl">☀️</div>
                </div>
                <div>
                  <h2 className="text-base font-bold text-primary tracking-tight">
                    Good {getTimeOfDay()}!
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-primary/70">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/70 border border-primary/10 rounded-md text-primary">
                      <Clock className="w-3 h-3" />
                      {upcomingEvents.length}
                    </span>
                    <span>upcoming</span>
                  </div>
                </div>
              </div>
              
              {/* Right section - Stats */}
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-white/70 border border-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {todayEvents.length + googleEvents.length}
                  </span>
                </div>
                <div className="text-[10px] text-primary/50 font-semibold uppercase tracking-wider mt-1.5">Total Events</div>
              </div>
            </div>
            
            {/* Progress indicator */}
            {todayEvents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-primary/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-primary/60">Daily Progress</span>
                  <span className="text-xs font-semibold text-primary/80">
                    {completedEvents.length}/{todayEvents.length}
                  </span>
                </div>
                <div className="h-1.5 bg-primary/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(completedEvents.length / todayEvents.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative flex-1 overflow-y-auto px-5 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {(todayEvents.length === 0 && googleEvents.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="max-w-sm">
              {/* Main card */}
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-primary/10 shadow-sm">
                {/* Icon container */}
                <div className="mx-auto mb-4 w-fit">
                  <div className="p-6 rounded-xl bg-white/70 border border-primary/10">
                    <Calendar className="w-14 h-14 text-primary/50" />
                  </div>
                </div>
                
                {/* Text content */}
                <h3 className="text-lg font-bold text-primary mb-2 tracking-tight">
                  Free Day! 🌅
                </h3>
                <p className="text-sm text-primary/60 leading-relaxed">
                  No events scheduled today. Perfect time for deep work and focus.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-primary/70">Upcoming</div>
                  <div className="h-px flex-1 ml-3 bg-primary/10" />
                </div>
                
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} isUpcoming={true} currentTime={currentTime} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-primary/70">Completed</div>
                  <div className="h-px flex-1 ml-3 bg-primary/10" />
                </div>
                
                <div className="space-y-3">
                  {completedEvents.map((event) => (
                    <EventCard key={event.id} event={event} isUpcoming={false} currentTime={currentTime} />
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
