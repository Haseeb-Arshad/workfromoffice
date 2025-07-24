"use client";

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { eventsAtom } from "@/application/atoms/scheduleAtom";
import { EventCard } from "./components/EventCard";
import { EventForm } from "./components/EventForm";
import { Plus, Calendar, Clock } from "lucide-react";

const Schedule = () => {
  const [events] = useAtom(eventsAtom);
  const [showForm, setShowForm] = useState(false);
  const [isFormAnimating, setIsFormAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-white/60 to-gray-50/60 shadow-sm">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">My Day</h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-sm text-primary/60">
                <div className="p-1 rounded-full bg-white/50">
                  <Calendar className="size-3" />
                </div>
                <span className="font-medium">{formatDate(today)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary/60">
                <div className="p-1 rounded-full bg-white/50">
                  <Clock className="size-3" />
                </div>
                <span className="font-medium">{formatCurrentTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            if (!showForm && !isFormAnimating) {
              setIsFormAnimating(true);
              // Small delay to prevent flicker
              setTimeout(() => {
                setShowForm(true);
                setIsFormAnimating(false);
              }, 50);
            } else if (showForm) {
              setShowForm(false);
            }
          }}
          disabled={isFormAnimating}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Plus className="size-5" />
          Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <EventForm onClose={() => {
          setShowForm(false);
          setIsFormAnimating(false);
        }} />
      )}

      {/* Daily Overview */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-white/80 to-gray-50/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary mb-2">
                Good {getTimeOfDay()}! ☀️
              </h2>
              <p className="text-primary/70">
                You have <span className="font-bold text-primary">{upcomingEvents.length}</span> upcoming events today
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{todayEvents.length}</div>
              <div className="text-sm text-primary/60">Total Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200/50 scrollbar-track-transparent">
        {todayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gradient-to-br from-white/80 to-gray-50/40 backdrop-blur-sm rounded-3xl p-16 shadow-lg border border-gray-200/50 max-w-md">
              <div className="text-muted-foreground mb-8">
                <div className="p-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200/60 mx-auto mb-8 w-fit">
                  <Calendar className="w-20 h-20 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Free Day! 🌅
              </h3>
              <p className="text-primary/60 text-lg leading-relaxed">
                No events scheduled for today. Perfect time to focus on deep work or plan ahead!
              </p>
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-300 animate-pulse" style={{animationDelay: '0.2s'}} />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse" style={{animationDelay: '0.4s'}} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <div className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-150 rounded-full border border-gray-200/50">
                    <span className="text-sm font-bold text-primary">
                      ⏰ Upcoming Events
                    </span>
                  </div>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>
                
                <div className="space-y-4">
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
              <div>
                <div className="flex items-center gap-3 mb-6 mt-8">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <div className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200/50 rounded-full border border-gray-200/50">
                    <span className="text-sm font-bold text-primary/70">
                      ✅ Completed Events
                    </span>
                  </div>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>
                
                <div className="space-y-4">
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
            <div className="flex justify-center pt-8">
              <div className="bg-gradient-to-r from-gray-100/70 to-gray-200/70 backdrop-blur-sm rounded-2xl px-8 py-4 border border-gray-200/50">
                <p className="text-center text-primary/70 font-medium">
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
