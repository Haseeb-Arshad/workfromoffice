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
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-md border-b border-primary/10 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary/90 to-accent/90 flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">My Day</h1>
              <div className="flex items-center gap-2 text-xs text-primary/50">
                <span>{formatDate(today)}</span>
                <span>•</span>
                <span>{formatCurrentTime(currentTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowCalendarIntegration(!showCalendarIntegration)}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all shadow-sm ${
                isCalendarConnected 
                  ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100' 
                  : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              {isCalendarConnected ? 'Connected' : 'Calendar'}
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
              className="bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Event
            </button>
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
      <div className="p-4 pb-3">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-primary mb-1">
                Good {getTimeOfDay()}! ☀️
              </h2>
              <p className="text-sm text-primary/60">
                <span className="font-semibold text-primary">{upcomingEvents.length}</span> upcoming events
                {isCalendarConnected && googleEvents.length > 0 && (
                  <span className="text-secondary/60"> + {googleEvents.length} from Google</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">{todayEvents.length + googleEvents.length}</div>
              <div className="text-xs text-primary/50">total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {(todayEvents.length === 0 && googleEvents.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-10 border border-primary/10 max-w-sm">
              <div className="p-8 rounded-2xl bg-white/50 mx-auto mb-6 w-fit">
                <Calendar className="w-16 h-16 text-primary/40" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Free Day! 🌅
              </h3>
              <p className="text-sm text-primary/60 leading-relaxed">
                No events scheduled. Perfect time for deep work!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-primary/10" />
                  <div className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full border border-primary/10">
                    <span className="text-xs font-semibold text-primary">
                      ⏰ Upcoming
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-primary/10" />
                </div>
                
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <EventCard event={event} isUpcoming={true} currentTime={currentTime} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-primary/10" />
                  <div className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full border border-primary/10">
                    <span className="text-xs font-semibold text-primary/60">
                      ✅ Completed
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-primary/10" />
                </div>
                
                <div className="space-y-3">
                  {completedEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${(upcomingEvents.length + index) * 100}ms` }}
                    >
                      <EventCard event={event} isUpcoming={false} currentTime={currentTime} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer motivation */}
            <div className="flex justify-center pt-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl px-6 py-2.5 border border-primary/10">
                <p className="text-center text-xs text-primary/60 font-medium">
                  ✨ Make today amazing! ✨
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
export { Schedule };
