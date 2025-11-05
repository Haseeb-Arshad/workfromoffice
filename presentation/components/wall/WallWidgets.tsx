"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  showCalendarWidgetAtom,
  showClockWidgetAtom,
} from "@/application/atoms/uiPreferencesAtom";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthMatrix(date: Date): { weeks: (number | null)[][]; month: number; year: number } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();
  const cells: (number | null)[] = Array(startDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { weeks, month, year };
}

export const WallWidgets: React.FC = () => {
  const showCalendar = useAtomValue(showCalendarWidgetAtom);
  const showClock = useAtomValue(showClockWidgetAtom);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const matrix = useMemo(() => buildMonthMatrix(now), [now]);
  const today = now.getDate();

  if (!showCalendar && !showClock) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {showClock && (
        <div className="pointer-events-auto fixed right-4 top-4 rounded-xl border border-primary/15 bg-white/80 p-3 backdrop-blur shadow-[0_10px_30px_rgba(47,32,16,0.18)]">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4 text-secondary" />
            <div className="text-sm font-semibold tabular-nums">
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          </div>
          <div className="mt-1 text-[11px] text-primary/60">
            {now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="pointer-events-auto fixed left-4 top-4 w-64 rounded-xl border border-primary/15 bg-white/80 p-3 backdrop-blur shadow-[0_10px_30px_rgba(47,32,16,0.18)]">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <CalendarIcon className="h-4 w-4 text-secondary" />
            <div className="text-sm font-semibold">
              {now.toLocaleString([], { month: "long", year: "numeric" })}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[10px] text-primary/60">
            {dayNames.map((d) => (
              <div key={d} className="text-center font-semibold uppercase tracking-widest">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1 text-xs">
            {matrix.weeks.map((week, i) => (
              <React.Fragment key={i}>
                {week.map((d, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`flex h-7 items-center justify-center rounded-md border ${
                      d === null
                        ? "border-transparent"
                        : d === today
                          ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                          : "border-primary/10 bg-white text-primary"
                    }`}
                  >
                    {d ?? ""}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WallWidgets;


