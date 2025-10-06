import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Calendar, Clock, MapPin, Users, Repeat, AlertCircle } from "lucide-react";
import { useAtom } from "jotai";
import { addEventAtom, ScheduleEvent, EventType, MeetingType, Priority } from "@/application/atoms/scheduleAtom";

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

  const getTypeColor = (type: EventType) => {
    const colors = {
      meeting: "from-blue-500 to-indigo-600",
      presentation: "from-purple-500 to-pink-600",
      workshop: "from-green-500 to-emerald-600", 
      break: "from-orange-500 to-amber-600",
      call: "from-cyan-500 to-blue-600",
      deadline: "from-red-500 to-pink-600"
    };
    return colors[type] || colors.meeting;
  };

  const getPriorityEmoji = (priority: Priority) => {
    const emojis = {
      high: "🔥",
      medium: "⚡", 
      low: "🌱"
    };
    return emojis[priority];
  };

  if (!mounted) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] p-4">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Main container */}
        <div className="relative bg-white rounded-xl border border-primary/10 shadow-md overflow-hidden">
          {/* Header */}
          <div className="relative p-5 pb-4 border-b border-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/80 border border-primary/10 flex items-center justify-center">
                  <Plus className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary tracking-tight mb-0.5">
                    Create New Event
                  </h2>
                  <p className="text-xs text-primary/60">Schedule your day with precision</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-md bg-white/80 border border-primary/10 hover:bg-white"
                aria-label="Close"
              >
                <X className="size-4 text-primary/60" />
              </button>
            </div>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 pb-7 space-y-5">
          {/* Title */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-primary/70 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="size-4 text-secondary" />
              Event Title *
            </label>
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Team Standup Meeting..."
                className="relative w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-primary/15 rounded-2xl focus:outline-none focus:border-secondary/50 focus:bg-white transition-all text-primary placeholder-primary/40 font-medium shadow-sm"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-primary/70 uppercase tracking-wider">Description</label>
            <div>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add details about your event..."
                rows={3}
                className="relative w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-primary/15 rounded-2xl focus:outline-none focus:border-secondary/50 focus:bg-white transition-all text-primary placeholder-primary/40 resize-none font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-xs font-black text-primary/70 uppercase tracking-wider flex items-center gap-2">
                <Clock className="size-4 text-secondary" />
                Start Time *
              </label>
              <div className="relative group">
              <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className="relative w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-primary/15 rounded-2xl focus:outline-none focus:border-secondary/50 focus:bg-white transition-all text-primary font-medium shadow-sm"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <label className="text-xs font-black text-primary/70 uppercase tracking-wider flex items-center gap-2">
                <Clock className="size-4 text-secondary" />
                End Time *
              </label>
              <div className="relative group">
              <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  className="relative w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-primary/15 rounded-2xl focus:outline-none focus:border-secondary/50 focus:bg-white transition-all text-primary font-medium shadow-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-primary/70 uppercase tracking-wider">Event Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(["meeting", "presentation", "workshop", "break", "call", "deadline"] as EventType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("type", type)}
                  className={`p-3 rounded-lg border text-sm font-semibold capitalize ${
                    formData.type === type
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-primary/15 text-primary hover:bg-white"
                  }`}
                >
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-primary/70 uppercase tracking-wider">Meeting Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(["virtual", "in-person", "hybrid"] as MeetingType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("meetingType", type)}
                  className={`p-3 rounded-lg border text-sm font-semibold capitalize ${
                    formData.meetingType === type
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-primary/15 text-primary hover:bg-white"
                  }`}
                >
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-primary/70 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="size-4 text-secondary" />
              Location
            </label>
            <div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Meeting room, Zoom link, or address..."
                className="relative w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-primary/15 rounded-2xl focus:outline-none focus:border-secondary/50 focus:bg-white transition-all text-primary placeholder-primary/40 font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-primary/70 uppercase tracking-wider flex items-center gap-2">
              <Users className="size-4 text-secondary" />
              Attendees
            </label>
            <div>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => handleChange("attendees", e.target.value)}
                placeholder="Enter names separated by commas..."
                className="relative w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-primary/15 rounded-2xl focus:outline-none focus:border-secondary/50 focus:bg-white transition-all text-primary placeholder-primary/40 font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-primary/70 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="size-4 text-primary/60" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleChange("priority", priority)}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-semibold capitalize ${
                    formData.priority === priority
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-primary/15 text-primary hover:bg-white"
                  }`}
                >
                  <span className="text-base">{getPriorityEmoji(priority)}</span>
                  <span>{priority}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recurring */}
          <div>
            <div className="relative flex items-center gap-3 p-4 bg-white/70 rounded-xl border border-primary/10">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.isRecurring}
                onChange={(e) => handleChange("isRecurring", e.target.checked)}
                className="w-5 h-5 text-secondary rounded-lg border-2 border-primary/30 focus:ring-2 focus:ring-secondary/30 transition-all cursor-pointer"
              />
              <label htmlFor="recurring" className="text-sm font-bold text-primary flex items-center gap-2 cursor-pointer">
                <Repeat className="size-4 text-secondary" />
                Recurring Event
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-primary/15 rounded-lg font-semibold text-primary hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold border border-primary"
            >
              <span className="flex items-center justify-center gap-2">
                <Plus className="size-4" />
                Create Event
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
