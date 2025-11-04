"use client";

import React from "react";
import { useAtomValue } from "jotai";
import { stickyNotesAtom } from "@/application/atoms/stickyNotesAtom";

export const StickyNotesWidget: React.FC = () => {
  const notes = useAtomValue(stickyNotesAtom);
  const latest = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const colorBg = (c: string) => ({
    yellow: "bg-yellow-200",
    pink: "bg-pink-200",
    green: "bg-green-200",
    blue: "bg-blue-200",
    purple: "bg-purple-200",
    orange: "bg-orange-200",
  } as Record<string, string>)[c] || "bg-yellow-200";

  return (
    <div className="rounded-md border border-primary/10 bg-white p-3">
      <div className="mb-2 text-xs font-semibold text-primary/70 uppercase tracking-widest">
        Sticky Notes
      </div>
      {latest.length === 0 ? (
        <div className="text-xs text-primary/50">No notes yet.</div>
      ) : (
        <div className="space-y-2">
          {latest.map((n) => (
            <div key={n.id} className="flex items-start gap-2">
              <div className={`h-4 w-4 rounded-sm ${colorBg(n.color)}`} />
              <div className="min-w-0">
                <div className="text-xs font-medium text-primary truncate">{n.title}</div>
                {n.content && (
                  <div className="text-[11px] text-primary/70 line-clamp-2">{n.content}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StickyNotesWidget;


