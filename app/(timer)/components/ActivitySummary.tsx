import React from "react";
import { formatDurationFromMinutes } from "@/app/(session-log)/sessionLogUtils"; // Assuming this utility is needed and path is correct
import { ChartColumnIncreasing } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { appMetadata } from "@/infrastructure/config/appMetadata";
import { openWindowAtom } from "@/application/atoms/windowAtoms";
import { useSetAtom } from "jotai";
import { playSound } from "@/infrastructure/lib/utils";

interface ActivitySummaryProps {
  todaySessionCount: number;
  todayTotalMinutes: number;
  currentStreak: number;
  thisMonthSessionCount: number; // Placeholder data
  thisMonthTotalMinutes: number; // Placeholder data
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  todaySessionCount,
  todayTotalMinutes,
  currentStreak,
  thisMonthSessionCount,
  thisMonthTotalMinutes,
}) => {
  const openWindow = useSetAtom(openWindowAtom);

  const handleOpenSessionLog = () => {
    playSound("/sounds/click.mp3", "button-click");
    // Use metadata for basic info. Default size must be hardcoded or retrieved from a separate config if needed.
    // For now, hardcoding or using metadata if we add size there.
    // appRegistry.sessionLog had defaultSize: { width: 700, height: 500 }, minSize: { width: 450, height: 300 }

    const meta = appMetadata.sessionLog;
    if (meta) {
      openWindow({
        id: "sessionLog",
        appId: "sessionLog",
        title: meta.name,
        initialSize: { width: 700, height: 500 }, // Hardcoded to avoid circular dep on appRegistry
        minSize: { width: 450, height: 300 },
      });
    }
  };
  return (
    <div className="mb-4 px-2 py-4 w-full">
      <div className="flex gap-2 text-center text-xs justify-center max-w-md mx-auto">
        <div className="border px-6 py-2 rounded-md">
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider">
            Today
          </h4>
          <p className="text-2xl font-bold text-primary">{todaySessionCount}</p>
          <p className=" text-primary">sessions</p>
          <p className="text-xxs text-muted-foreground">
            {formatDurationFromMinutes(todayTotalMinutes)}
          </p>
        </div>
        <div className="border px-6 py-2 rounded">
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider">
            Streak
          </h4>
          <p className="text-2xl font-bold text-primary">{currentStreak}</p>
          <p className="text-sm text-primary">
            {currentStreak === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="border px-6 py-2 rounded-md">
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider">
            Month
          </h4>
          <p className="text-2xl font-bold text-primary">
            {thisMonthSessionCount}
          </p>
          <p className="text-sm text-primary">sessions</p>
          <p className="text-xxs text-muted-foreground">
            {formatDurationFromMinutes(thisMonthTotalMinutes)}
          </p>
        </div>
      </div>
      {/* Session Log Button */}
      <div className="mt-6 text-center">
        <Button
          variant="outline"
          className="w-full sm:w-auto bg-stone-100 hover:bg-background"
          onClick={handleOpenSessionLog}
        >
          <ChartColumnIncreasing className="mr-2 h-4 w-4" />
          Session Log
        </Button>
      </div>
    </div>
  );
};

export default ActivitySummary;
