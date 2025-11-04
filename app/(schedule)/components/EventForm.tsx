import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Calendar, Clock, MapPin, Users, Repeat, AlertCircle } from "lucide-react";
import { useAtom } from "jotai";
import { addEventAtom, ScheduleEvent, EventType, MeetingType, Priority } from "@/application/atoms/scheduleAtom";
import { Button } from "@/presentation/components/ui/button";

interface EventFormProps {
  onClose: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ onClose }) => {
  const [, addEvent] = useAtom(addEventAtom);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    type: "meeting" as EventType,
    meetingType: "virtual" as MeetingType,
    location: "",
    attendees: "",
    priority: "medium" as Priority,
    isRecurring: false
  });

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert("Please fill in the required fields (Title, Start Time, End Time)");
      return;
    }

    const newEvent: Omit<ScheduleEvent, "id"> = {
      title: formData.title,
      description: formData.description || undefined,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      meetingType: formData.meetingType,
      location: formData.location || undefined,
      attendees: formData.attendees ? formData.attendees.split(",").map(a => a.trim()) : undefined,
      priority: formData.priority,
      isRecurring: formData.isRecurring
    };

    addEvent(newEvent);
    onClose();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityEmoji = (priority: Priority) => {
    const emojis = {
      high: "🔥",
      medium: "⚡",
      low: "🌱"
    };
    return emojis[priority];
  };

  const baseInputClasses =
    "relative w-full rounded-2xl border border-primary/15 bg-white/85 px-4 py-3.5 font-medium text-primary placeholder-primary/40 shadow-[0_12px_28px_rgba(47,32,16,0.1)] transition-all duration-200 focus:border-secondary/60 focus:bg-white focus:ring-2 focus:ring-secondary/25 outline-none";

  const buildSelectionButtonClass = (isActive: boolean) =>
    `relative overflow-hidden rounded-xl border px-3.5 py-3 text-sm font-semibold capitalize transition-all duration-200 ${isActive
      ? "border-secondary/80 bg-gradient-to-r from-secondary via-accent to-secondary/90 text-white shadow-[0_14px_36px_rgba(111,64,24,0.24)]"
      : "border-primary/15 bg-white/85 text-primary shadow-[0_10px_26px_rgba(47,32,16,0.08)] hover:bg-white"
    }`;

  if (!mounted) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-gradient-to-br from-primary/40 via-black/50 to-primary/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto animate-pop-in">
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/65 via-amber-100/70 to-orange-100/65 opacity-70 blur-lg" />
        {/* Main container */}
        <div className="relative overflow-hidden rounded-[26px] border border-primary/15 bg-white/90 shadow-[0_22px_60px_rgba(47,32,16,0.25)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-secondary/60 via-accent/70 to-secondary/60" />
          {/* Header */}
          <div className="relative border-b border-primary/10 p-6 pb-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/60 via-white/50 to-transparent blur-md opacity-70" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-white/85 shadow-[0_12px_30px_rgba(47,32,16,0.12)]">
                    <Plus className="size-5 text-secondary" />
                  </div>
                </div>
                <div>
                  <h2 className="mb-0.5 text-xl font-black tracking-tight text-primary">
                    Create New Event
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50">
                    Schedule your day with precision
                  </p>
                </div>
              </div>

              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="rounded-lg border border-primary/10 bg-white/80 p-2 transition-all duration-200 hover:bg-white hover:shadow-[0_12px_28px_rgba(47,32,16,0.12)]"
                aria-label="Close"
              >
                <X className="size-4 text-primary/60" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 px-8 pb-8 pt-6">
            {/* Title */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary/70">
                <Calendar className="size-4 text-secondary" />
                Event Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g., Team Standup Meeting..."
                  className={baseInputClasses}
                  required
                />
                <div className="pointer-events-none absolute inset-x-3 -bottom-2 h-4 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-lg" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-primary/70">Description</label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Add details about your event..."
                  rows={3}
                  className={`${baseInputClasses} resize-none`}
                />
                <div className="pointer-events-none absolute inset-x-3 -bottom-2 h-4 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-lg" />
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary/70">
                  <Clock className="size-4 text-secondary" />
                  Start Time *
                </label>
                <div className="relative group">
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    title="Start Time"
                    className={baseInputClasses}
                    required
                  />
                  <div className="pointer-events-none absolute inset-x-3 -bottom-2 h-4 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-lg transition-opacity duration-200 group-focus-within:opacity-100" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary/70">
                  <Clock className="size-4 text-secondary" />
                  End Time *
                </label>
                <div className="relative group">
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    title="End Time"
                    className={baseInputClasses}
                    required
                  />
                  <div className="pointer-events-none absolute inset-x-3 -bottom-2 h-4 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-lg transition-opacity duration-200 group-focus-within:opacity-100" />
                </div>
              </div>
            </div>

            {/* Event Type */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-primary/70">Event Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(["meeting", "presentation", "workshop", "break", "call", "deadline"] as EventType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("type", type)}
                    className={buildSelectionButtonClass(formData.type === type)}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Meeting Type */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-primary/70">Meeting Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(["virtual", "in-person", "hybrid"] as MeetingType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("meetingType", type)}
                    className={buildSelectionButtonClass(formData.meetingType === type)}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary/70">
                <MapPin className="size-4 text-secondary" />
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Meeting room, Zoom link, or address..."
                  className={baseInputClasses}
                />
                <div className="pointer-events-none absolute inset-x-3 -bottom-2 h-4 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-lg" />
              </div>
            </div>

            {/* Attendees */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary/70">
                <Users className="size-4 text-secondary" />
                Attendees
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.attendees}
                  onChange={(e) => handleChange("attendees", e.target.value)}
                  placeholder="Enter names separated by commas..."
                  className={baseInputClasses}
                />
                <div className="pointer-events-none absolute inset-x-3 -bottom-2 h-4 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-lg" />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary/70">
                <AlertCircle className="size-4 text-primary/60" />
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as Priority[]).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handleChange("priority", priority)}
                    className={`${buildSelectionButtonClass(formData.priority === priority)} flex items-center justify-center gap-2`}
                  >
                    <span className="text-base">{getPriorityEmoji(priority)}</span>
                    <span>{priority}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recurring */}
            <div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-primary/15 bg-white/85 p-4 shadow-[0_10px_26px_rgba(47,32,16,0.08)]">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => handleChange("isRecurring", e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded-lg border-2 border-primary/30 text-secondary transition-all focus:ring-2 focus:ring-secondary/30"
                />
                <label htmlFor="recurring" className="flex cursor-pointer items-center gap-2 text-sm font-bold text-primary">
                  <Repeat className="size-4 text-secondary" />
                  Recurring Event
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-primary/15 bg-white/85 px-4 py-3 font-semibold text-primary transition-all duration-200 hover:bg-white hover:shadow-[0_12px_28px_rgba(47,32,16,0.12)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="group relative flex-1 overflow-hidden rounded-xl border border-secondary/80 bg-gradient-to-r from-secondary via-accent to-secondary/95 px-4 py-3 font-semibold text-white shadow-[0_16px_40px_rgba(111,64,24,0.3)] transition-all duration-300 hover:shadow-[0_18px_48px_rgba(111,64,24,0.36)] focus:outline-none focus:ring-2 focus:ring-secondary/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-2">
                  <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90 group-active:scale-95" />
                  Create Event
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
