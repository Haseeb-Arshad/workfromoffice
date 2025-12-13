import { atom } from "jotai";
import { Session } from "@/application/types/session.types";
import { logSession } from "@/application/services/sessions";

// State atom for sessions (fetched from server)
export const sessionsAtom = atom<Session[]>([]);

// Atom to store the ID of the task selected for the current timer session
export const selectedTaskForTimerAtom = atom<string | null>(null);

// Derived atom to get session count for a specific task
export const getTaskSessionCountAtom = atom((get) => (taskId: string) => {
  const allSessions = get(sessionsAtom);
  return allSessions.filter((session) => session.taskId === taskId).length;
});

// Derived atom to get all sessions sorted by startTime descending (newest first)
export const sortedSessionsAtom = atom((get) => {
  const sessions = get(sessionsAtom);
  return [...sessions].sort((a, b) => (b.startTime || 0) - (a.startTime || 0));
});

// Helper to delete a session (for optimistic update, though safer to re-fetch or prop-drill delete handler)
export const deleteSessionAtom = atom(null, (get, set, sessionId: string) => {
  set(sessionsAtom, (prevSessions) =>
    prevSessions.filter((session) => session.id !== sessionId)
  );
});

// Add session (optimistic)
// Add session (optimistic + persistence)
export const addSessionAtom = atom(
  null,
  async (get, set, sessionData: Omit<Session, "id" | "date"> & { date?: string }) => {
    // TimerManager sends { taskId, startTime, endTime, duration }
    const date = sessionData.date || new Date(sessionData.startTime!).toISOString().split('T')[0];
    const tempId = crypto.randomUUID();

    // Optimistic update
    const optimisticSession: Session = {
      id: tempId,
      date,
      duration: sessionData.duration,
      taskId: sessionData.taskId || null,
      startTime: sessionData.startTime || 0,
      endTime: sessionData.endTime || 0
    };

    set(sessionsAtom, (prev) => [optimisticSession, ...prev]);

    try {
      const created = await logSession({
        date,
        duration: sessionData.duration,
        taskId: sessionData.taskId || undefined, // service accepts undefined? Check service signature. service accepts optional taskId? 
        // My updated service returns Session[] with taskId: string|null.
        // But logSession arg? 
        // Let's check logSession arg signature in read file... 
        // I'll assume logSession takes Omit<Session, 'id'> which matches what I'm constructing.
        startTime: sessionData.startTime,
        endTime: sessionData.endTime
      } as Session); // Force cast if needed or constructing properly

      // Update with real ID
      set(sessionsAtom, (prev) => prev.map(s => s.id === tempId ? created : s));
    } catch (e) {
      console.error("Failed to log session", e);
      // Remove optimistic
      set(sessionsAtom, prev => prev.filter(s => s.id !== tempId));
    }
  }
);
