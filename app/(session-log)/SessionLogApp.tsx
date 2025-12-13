"use client";

import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { sessionsAtom } from "@/application/atoms/sessionAtoms";
import { SessionLogHeader } from "./components/SessionLogHeader";
import { ChartsSection } from "./components/ChartsSection";
import { TableSection } from "./components/TableSection";
import { getSessions } from "@/application/services/sessions";
import { Session } from "@/application/types/session.types";

const SessionLogApp = () => {
  const setSessions = useSetAtom(sessionsAtom);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const serverSessions = await getSessions();
        // Map server sessions to application type if needed (currently they match closely)
        // Service returns { id, date, duration, taskId, startTime, endTime }
        // Atom expects Session[]
        // Need to cast or validate types.
        // Assuming services/sessions.ts Session type matches app structure.
        setSessions(serverSessions as Session[]);
      } catch (e) {
        console.error("Failed to fetch sessions", e);
      }
    };
    fetchSessions();
  }, [setSessions]);

  return (
    <div className="p-4 h-full flex flex-col text-sm overflow-y-auto">
      <div>
        <SessionLogHeader />
      </div>

      {/* Chart Section */}
      <ChartsSection />
      {/* Table or No Sessions Message */}
      <TableSection />
    </div>
  );
};

export default SessionLogApp;
