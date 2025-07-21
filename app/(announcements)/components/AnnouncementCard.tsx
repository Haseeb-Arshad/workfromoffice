import React from "react";
import { Clock, User, AlertCircle, Info, CheckCircle, X } from "lucide-react";
import { Announcement } from "@/application/atoms/announcementsAtom";
import { useAtom } from "jotai";
import { removeAnnouncementAtom } from "@/application/atoms/announcementsAtom";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
}) => {
  const [, removeAnnouncement] = useAtom(removeAnnouncementAtom);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getPriorityIcon = () => {
    switch (announcement.priority) {
      case "high":
        return <AlertCircle className="size-4 text-red-500" />;
      case "medium":
        return <Info className="size-4 text-amber-500" />;
      case "low":
        return <CheckCircle className="size-4 text-green-500" />;
      default:
        return <Info className="size-4 text-blue-500" />;
    }
  };

  const getPriorityBorder = () => {
    switch (announcement.priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-amber-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getPriorityBorder()} hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getPriorityIcon()}
          <h3 className="text-lg font-bold text-primary line-clamp-2">
            {announcement.title}
          </h3>
        </div>
        <button
          onClick={() => removeAnnouncement(announcement.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
          title="Remove announcement"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="text-sm text-foreground mb-4 leading-relaxed">
        {announcement.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>Posted: {formatRelativeTime(announcement.createdAt)}</span>
          </div>
          {announcement.author && (
            <div className="flex items-center gap-1">
              <User className="size-3" />
              <span>{announcement.author}</span>
            </div>
          )}
        </div>
        {announcement.priority && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              announcement.priority === "high"
                ? "bg-red-100 text-red-700"
                : announcement.priority === "medium"
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {announcement.priority.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
