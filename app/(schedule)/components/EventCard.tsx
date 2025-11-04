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

  const getEventTypeStyles = () => {
    const palette: Record<ScheduleEvent["type"], {
      gradient: string;
      chip: string;
    }> = {
      meeting: {
        gradient: "from-amber-200/70 via-orange-100/60 to-white/60",
        chip: "bg-orange-200/60 text-[#8F4C24]",
      },
      presentation: {
        gradient: "from-rose-200/65 via-rose-100/55 to-white/60",
        chip: "bg-rose-200/60 text-[#9F3E42]",
      },
      workshop: {
        gradient: "from-emerald-200/65 via-emerald-100/55 to-white/60",
        chip: "bg-emerald-200/60 text-[#1B7A52]",
      },
      break: {
        gradient: "from-orange-200/70 via-amber-100/60 to-white/60",
        chip: "bg-amber-200/60 text-[#A04E1F]",
      },
      call: {
        gradient: "from-sky-200/65 via-sky-100/55 to-white/60",
        chip: "bg-sky-200/60 text-[#0E6C8E]",
      },
      deadline: {
        gradient: "from-red-200/65 via-rose-100/55 to-white/60",
        chip: "bg-red-200/60 text-[#9E1C30]",
      },
    };

    return palette[event.type] ?? palette.meeting;
  };

  const getMeetingTypeIcon = () => {
    switch (event.meetingType) {
      case "virtual":
        return <Video className="size-4 text-primary/60" />;
      case "in-person":
        return <Building className="size-4 text-primary/60" />;
      case "hybrid":
        return (
          <div className="flex items-center gap-1">
            <Video className="size-3 text-primary/60" />
            <Building className="size-3 text-primary/60" />
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
      <div className={`w-2 h-2 rounded-full ${colors[event.priority]}`} />
    );
  };

  const isCurrentEvent = () => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return currentTime >= start && currentTime <= end;
  };

  const styles = getEventTypeStyles();

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-primary/12 bg-white/85 p-4 shadow-[0_12px_32px_rgba(47,32,16,0.1)] backdrop-blur-xl transition-all duration-300 ${
        !isUpcoming ? "opacity-75" : "opacity-95"
      } hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(47,32,16,0.18)]`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-40`} />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-secondary/50 via-secondary/20 to-transparent" />
      {isCurrentEvent() && (
        <div className="pointer-events-none absolute inset-x-4 top-0 h-1 rounded-full bg-secondary/50 shadow-[0_6px_18px_rgba(111,64,24,0.35)]" />
      )}

      <div className="relative z-[1] space-y-3">
        {/* Header with time and actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-primary">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <Clock className="h-3.5 w-3.5 text-primary/60" />
              <span>{formatTimeRange()}</span>
            </div>
            {isCurrentEvent() && (
              <span className="rounded-full bg-secondary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white shadow-[0_8px_20px_rgba(111,64,24,0.35)]">
                Live
              </span>
            )}
            {event.isRecurring && <Repeat className="h-3 w-3 text-primary/40" />}
            {getPriorityIndicator()}
          </div>

          <button
            onClick={() => removeEvent(event.id)}
            className="rounded-lg border border-transparent p-1.5 text-primary/30 opacity-0 transition-all duration-200 hover:border-red-200/80 hover:bg-white/70 hover:text-red-500 focus-visible:border-red-200/80 focus-visible:text-red-500 group-hover:opacity-100"
            title="Remove event"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Event title and type */}
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-snug text-primary">{event.title}</h3>
            <span
              className={`rounded-full border border-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${styles.chip}`}
            >
              {event.type}
            </span>
          </div>
          {event.description && (
            <p className="text-xs leading-relaxed text-primary/70">{event.description}</p>
          )}
        </div>

        {/* Event details */}
        <div className="space-y-2.5">
          {(event.meetingType || event.location) && (
            <div className="flex flex-wrap items-center gap-2">
              {event.meetingType && (
                <div className="flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/70 px-3 py-1 text-[11px] font-semibold text-primary/70">
                  {getMeetingTypeIcon()}
                  <span className="capitalize">{event.meetingType}</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/70 px-3 py-1 text-[11px] font-semibold text-primary/70">
                  <MapPin className="h-3 w-3 text-primary/50" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-1.5 text-primary/60">
              <Users className="h-3 w-3 text-primary/50" />
              <div className="flex flex-wrap gap-1">
                {event.attendees.slice(0, 3).map((attendee, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-primary/10 bg-white/75 px-2 py-0.5 text-[10px] font-semibold text-primary/70"
                  >
                    {attendee}
                  </span>
                ))}
                {event.attendees.length > 3 && (
                  <span className="rounded-full border border-primary/10 bg-white/75 px-2 py-0.5 text-[10px] font-semibold text-primary/70">
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
