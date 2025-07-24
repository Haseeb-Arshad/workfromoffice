"use client";

import React from "react";
import { useAtom } from "jotai";
import { announcementsAtom } from "@/application/atoms/announcementsAtom";
import { AnnouncementCard } from "./components/AnnouncementCard";
import { AnnouncementForm } from "./components/AnnouncementForm";
import { Plus } from "lucide-react";
import { useState } from "react";

const Announcements = () => {
  const [announcements] = useAtom(announcementsAtom);
  const [showForm, setShowForm] = useState(false);

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-yellow-50 via-orange-50/30 to-red-50/20 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">What&apos;s New</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="size-4" />
          New Announcement
        </button>
      </div>

      {/* Add New Announcement Form */}
      {showForm && (
        <div className="mb-6">
          <AnnouncementForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto">
        {sortedAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="text-muted-foreground mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.705 9.168-4.458A1.85 1.85 0 0120 3.166v6.668a1.85 1.85 0 01-2 1.624C16.457 10.753 13.932 12 9.832 12H7a4.001 4.001 0 01-1.564 6.683z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                No Announcements Yet
              </h3>
              <p className="text-muted-foreground">
                Company announcements will appear here when they&apos;re posted.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
