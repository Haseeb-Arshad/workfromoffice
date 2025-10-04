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
          bg: "bg-blue-50/60",
          border: "border-blue-200/50",
          accent: "bg-blue-500",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-700"
        };
      case "presentation":
        return {
          bg: "bg-purple-50/60", 
          border: "border-purple-200/50",
          accent: "bg-purple-500",
          icon: "text-purple-600",
          badge: "bg-purple-100 text-purple-700"
        };
      case "workshop":
        return {
          bg: "bg-green-50/60",
          border: "border-green-200/50", 
          accent: "bg-green-500",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-700"
        };
      case "break":
        return {
          bg: "bg-orange-50/60",
          border: "border-orange-200/50",
          accent: "bg-orange-500",
          icon: "text-orange-600",
          badge: "bg-orange-100 text-orange-700"
        };
      case "call":
        return {
          bg: "bg-cyan-50/60",
          border: "border-cyan-200/50",
          accent: "bg-cyan-500",
          icon: "text-cyan-600",
          badge: "bg-cyan-100 text-cyan-700"
        };
      case "deadline":
        return {
          bg: "bg-red-50/60",
          border: "border-red-200/50",
          accent: "bg-red-500",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-700"
        };
      default:
        return {
          bg: "bg-white/70",
          border: "border-primary/10",
          accent: "bg-gray-500",
          icon: "text-gray-600",
          badge: "bg-gray-100 text-gray-700"
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
      className={`relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm hover:shadow-md transition-all duration-200 group ${
        !isUpcoming ? 'opacity-60' : ''
      } ${isCurrentEvent() ? 'ring-2 ring-secondary/40' : ''}`}
    >
      {/* Current event indicator */}
      {isCurrentEvent() && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary to-accent" />
      )}

      {/* Decorative accent bar */}
      <div className={`absolute left-0 top-0 w-1 h-full ${colors.accent}`} />
      
      {/* Main content */}
      <div className="relative p-3 pl-4">
        {/* Header with time and actions */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary/60" />
              <span className="text-sm font-semibold text-primary">
                {formatTimeRange()}
              </span>
            </div>
            {isCurrentEvent() && (
              <div className="px-2 py-0.5 bg-gradient-to-r from-secondary to-accent text-white text-[10px] font-bold rounded-full">
                LIVE
              </div>
            )}
            {event.isRecurring && (
              <Repeat className="w-3 h-3 text-primary/40" />
            )}
            {getPriorityIndicator()}
          </div>

          <button
            onClick={() => removeEvent(event.id)}
            className="text-primary/30 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/50 opacity-0 group-hover:opacity-100"
            title="Remove event"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Event title and type */}
        <div className="mb-2.5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-primary leading-snug">
              {event.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${colors.badge}`}>
              {event.type.toUpperCase()}
            </span>
          </div>
          {event.description && (
            <p className="text-xs text-primary/70 leading-relaxed line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        {/* Event details */}
        <div className="space-y-2">
          {/* Meeting type and location */}
          {(event.meetingType || event.location) && (
            <div className="flex items-center gap-2 flex-wrap">
              {event.meetingType && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/50 backdrop-blur-sm rounded-md">
                  {getMeetingTypeIcon()}
                  <span className="text-[10px] font-medium text-primary/70 capitalize">
                    {event.meetingType}
                  </span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/50 backdrop-blur-sm rounded-md">
                  <MapPin className="w-3 h-3 text-primary/60" />
                  <span className="text-[10px] font-medium text-primary/70">
                    {event.location}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-primary/50" />
              <div className="flex flex-wrap gap-1">
                {event.attendees.slice(0, 3).map((attendee, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 bg-white/40 backdrop-blur-sm rounded text-[10px] font-medium text-primary/70"
                  >
                    {attendee}
                  </span>
                ))}
                {event.attendees.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-white/40 backdrop-blur-sm rounded text-[10px] font-medium text-primary/70">
                    +{event.attendees.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
