"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { Button } from "@/presentation/components/ui/button";
import { Settings2, Calendar, Clock } from "lucide-react";
import {
  showCalendarWidgetAtom,
  showClockWidgetAtom,
} from "@/application/atoms/uiPreferencesAtom";

export const WallControls: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useAtom(showCalendarWidgetAtom);
  const [showClock, setShowClock] = useAtom(showClockWidgetAtom);

  return (
    <div className="pointer-events-none fixed right-4 bottom-20 z-20">
      {/* panel */}
      {open && (
        <div className="pointer-events-auto mb-2 w-64 rounded-xl border border-primary/15 bg-white/90 p-3 shadow-[0_10px_30px_rgba(47,32,16,0.18)] backdrop-blur">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/60">Wall Widgets</div>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center justify-between rounded-md border border-primary/10 bg-white px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-primary"><Clock className="h-4 w-4 text-secondary" /> Show Clock</span>
              <input
                type="checkbox"
                checked={showClock}
                onChange={(e) => setShowClock(e.target.checked)}
                className="h-4 w-4 rounded border-primary/30 text-secondary focus:ring-secondary/30"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-md border border-primary/10 bg-white px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-primary"><Calendar className="h-4 w-4 text-secondary" /> Show Calendar</span>
              <input
                type="checkbox"
                checked={showCalendar}
                onChange={(e) => setShowCalendar(e.target.checked)}
                className="h-4 w-4 rounded border-primary/30 text-secondary focus:ring-secondary/30"
              />
            </label>
          </div>
        </div>
      )}

      {/* toggle button */}
      <div className="pointer-events-auto">
        <Button
          size="icon"
          className="rounded-full bg-secondary text-white shadow-md hover:bg-accent"
          onClick={() => setOpen((s) => !s)}
          aria-label="Wall controls"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default WallControls;


