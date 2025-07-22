import React from "react";
import { Clock, MapPin, Users, Video, Building, X, Repeat } from "lucide-react";
import { ScheduleEvent } from "@/application/atoms/scheduleAtom";
import { useAtom } from "jotai";
import { removeEventAtom } from "@/application/atoms/scheduleAtom";

interface EventCardProps {
  event: ScheduleEvent;
  isUpcoming: boolean;
  currentTime: Date;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isUpcoming, currentTime }) => {
  const [, removeEvent] = useAtom(removeEventAtom);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatTimeRange = () => {
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
  };

  const getEventTypeColor = () => {
    switch (event.type) {
      case "meeting":
        return {
          bg: "bg-gradient-to-br from-blue-50 to-indigo-100/60",
          border: "border-blue-200/60",
          accent: "bg-blue-500",
          icon: "text-blue-600"
        };
      case "presentation":
        return {
          bg: "bg-gradient-to-br from-purple-50 to-pink-100/60", 
          border: "border-purple-200/60",
          accent: "bg-purple-500",
          icon: "text-purple-600"
        };
      case "workshop":
        return {
          bg: "bg-gradient-to-br from-green-50 to-emerald-100/60",
          border: "border-green-200/60", 
          accent: "bg-green-500",
          icon: "text-green-600"
        };
      case "break":
        return {
          bg: "bg-gradient-to-br from-orange-50 to-amber-100/60",
          border: "border-orange-200/60",
          accent: "bg-orange-500",
          icon: "text-orange-600"
        };
      case "call":
        return {
          bg: "bg-gradient-to-br from-cyan-50 to-blue-100/60",
          border: "border-cyan-200/60",
          accent: "bg-cyan-500",
          icon: "text-cyan-600"
        };
      case "deadline":
        return {
          bg: "bg-gradient-to-br from-red-50 to-pink-100/60",
          border: "border-red-200/60",
          accent: "bg-red-500",
          icon: "text-red-600"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-50 to-slate-100/60",
          border: "border-gray-200/60",
          accent: "bg-gray-500",
          icon: "text-gray-600"
        };
    }
  };

  const getMeetingTypeIcon = () => {
    switch (event.meetingType) {
      case "virtual":
        return <Video className="size-4 text-indigo-600" />;
      case "in-person":
        return <Building className="size-4 text-green-600" />;
      case "hybrid":
        return (
          <div className="flex items-center gap-1">
            <Video className="size-3 text-indigo-600" />
            <Building className="size-3 text-green-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const getPriorityIndicator = () => {
    if (!event.priority) return null;
    
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500", 
      low: "bg-green-500"
    };

    return (
      <div className={`w-2 h-2 rounded-full ${colors[event.priority]} animate-pulse`} />
    );
  };

  const isCurrentEvent = () => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return currentTime >= start && currentTime <= end;
  };

  const colors = getEventTypeColor();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.bg} backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] group ${
        !isUpcoming ? 'opacity-70' : ''
      } ${isCurrentEvent() ? 'ring-2 ring-indigo-400 ring-opacity-50' : ''}`}
    >
      {/* Current event indicator */}
      {isCurrentEvent() && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 animate-pulse" />
      )}

      {/* Decorative accent bar */}
      <div className={`absolute left-0 top-0 w-1.5 h-full ${colors.accent} shadow-sm`} />
      
      {/* Main content */}
      <div className="relative p-5 pl-7">
        {/* Header with time and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-white/60 backdrop-blur-sm">
                <Clock className="size-4 text-indigo-600" />
              </div>
              <span className="text-lg font-bold text-primary">
                {formatTimeRange()}
              </span>
              {isCurrentEvent() && (
                <div className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-bold rounded-full animate-pulse">
                  LIVE
                </div>
              )}
            </div>
            {event.isRecurring && (
              <div className="p-1 rounded-full bg-white/60">
                <Repeat className="size-3 text-primary/60" />
              </div>
            )}
            {getPriorityIndicator()}
          </div>

          <button
            onClick={() => removeEvent(event.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100"
            title="Remove event"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Event title and type */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-primary leading-tight">
              {event.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.accent} text-white shadow-sm`}>
              {event.type.toUpperCase()}
            </span>
          </div>
          {event.description && (
            <p className="text-sm text-primary/80 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* Event details */}
        <div className="space-y-3">
          {/* Meeting type and location */}
          {(event.meetingType || event.location) && (
            <div className="flex items-center gap-4 flex-wrap">
              {event.meetingType && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full">
                  {getMeetingTypeIcon()}
                  <span className="text-xs font-semibold text-primary/70 capitalize">
                    {event.meetingType}
                  </span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full">
                  <MapPin className="size-4 text-gray-600" />
                  <span className="text-xs font-medium text-primary/70">
                    {event.location}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-white/60">
                <Users className="size-3 text-primary/60" />
              </div>
              <div className="flex flex-wrap gap-1">
                {event.attendees.slice(0, 3).map((attendee, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/40 backdrop-blur-sm rounded-full text-xs font-medium text-primary/70"
                  >
                    {attendee}
                  </span>
                ))}
                {event.attendees.length > 3 && (
                  <span className="px-2 py-1 bg-white/40 backdrop-blur-sm rounded-full text-xs font-medium text-primary/70">
                    +{event.attendees.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Decorative corner elements */}
      <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />
      <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-tr from-white/15 to-transparent rounded-full translate-y-6 -translate-x-6 opacity-50" />
    </div>
  );
};
