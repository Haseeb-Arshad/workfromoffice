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

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-in fade-in-0 duration-200">
      <div className="bg-gradient-to-br from-white/95 to-blue-50/90 backdrop-blur-lg rounded-3xl border-2 border-white/30 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
              <Plus className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent">
                Add New Event
              </h2>
              <p className="text-sm text-primary/60">Schedule your upcoming meeting or event</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors"
          >
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <Calendar className="size-4" />
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter event title..."
              className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-primary placeholder-primary/50"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add event description..."
              rows={3}
              className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-primary placeholder-primary/50 resize-none"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <Clock className="size-4" />
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <Clock className="size-4" />
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-primary"
                required
              />
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">Event Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(["meeting", "presentation", "workshop", "break", "call", "deadline"] as EventType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("type", type)}
                  className={`p-3 rounded-2xl border-2 transition-all font-medium capitalize ${
                    formData.type === type
                      ? `bg-gradient-to-br ${getTypeColor(type)} text-white border-transparent shadow-lg`
                      : "bg-white/40 border-white/30 text-primary hover:bg-white/60"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">Meeting Format</label>
            <div className="grid grid-cols-3 gap-3">
              {(["virtual", "in-person", "hybrid"] as MeetingType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("meetingType", type)}
                  className={`p-3 rounded-2xl border-2 transition-all font-medium capitalize ${
                    formData.meetingType === type
                      ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-transparent shadow-lg"
                      : "bg-white/40 border-white/30 text-primary hover:bg-white/60"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <MapPin className="size-4" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Meeting room, Zoom link, or address..."
              className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-primary placeholder-primary/50"
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <Users className="size-4" />
              Attendees
            </label>
            <input
              type="text"
              value={formData.attendees}
              onChange={(e) => handleChange("attendees", e.target.value)}
              placeholder="Enter names separated by commas..."
              className="w-full p-4 bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-primary placeholder-primary/50"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary flex items-center gap-2">
              <AlertCircle className="size-4" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["low", "medium", "high"] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleChange("priority", priority)}
                  className={`p-3 rounded-2xl border-2 transition-all font-medium capitalize flex items-center justify-center gap-2 ${
                    formData.priority === priority
                      ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-transparent shadow-lg"
                      : "bg-white/40 border-white/30 text-primary hover:bg-white/60"
                  }`}
                >
                  <span>{getPriorityEmoji(priority)}</span>
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3 p-4 bg-white/40 rounded-2xl border-2 border-white/30">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) => handleChange("isRecurring", e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="recurring" className="text-sm font-semibold text-primary flex items-center gap-2">
              <Repeat className="size-4" />
              Recurring Event
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-4 bg-white/60 hover:bg-white/80 border-2 border-white/30 rounded-2xl font-semibold text-primary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 p-4 bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
};
