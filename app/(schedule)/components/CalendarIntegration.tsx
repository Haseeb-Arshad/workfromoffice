"use client";

import React, { useState } from "react";
import { X, Calendar, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { getGoogleAuthUrl } from "@/application/services/googleCalendar";

interface CalendarIntegrationProps {
  onClose: () => void;
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  onClose,
  isConnected,
  onConnectionChange,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error("Failed to get auth url", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onConnectionChange(false);
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-gradient-to-br from-primary/40 via-black/55 to-primary/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg animate-pop-in">
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/65 via-amber-100/70 to-orange-100/65 opacity-70 blur-xl" />
        {/* Main container */}
        <div className="relative overflow-hidden rounded-[26px] border border-primary/15 bg-white/92 shadow-[0_22px_60px_rgba(47,32,16,0.25)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-secondary/60 via-accent/70 to-secondary/60" />
          {/* Header */}
          <div className="relative border-b border-primary/10 p-6 pb-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/60 via-white/50 to-transparent blur-md opacity-70" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-white/85 shadow-[0_12px_30px_rgba(47,32,16,0.12)]">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 text-xl font-black tracking-tight text-primary">
                    Calendar Sync
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/55">
                    Connect with Google Calendar
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="rounded-lg border border-primary/10 bg-white/85 p-2 transition-all duration-200 hover:bg-white hover:shadow-[0_12px_28px_rgba(47,32,16,0.12)]"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-primary/60" />
              </Button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="px-7 pb-6 pt-6">
            {isConnected ? (
              <div className="relative overflow-hidden rounded-2xl border border-emerald-300/80 bg-gradient-to-r from-emerald-400/85 via-emerald-300/80 to-emerald-400/85 p-4 text-white shadow-[0_16px_36px_rgba(16,185,129,0.25)]">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-white/40 bg-white/20 p-2">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Connected Successfully</p>
                    <p className="text-xs text-white/80">Your events are syncing automatically</p>
                  </div>
                  <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                    Live Sync
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white/85 p-4 shadow-[0_12px_30px_rgba(47,32,16,0.12)]">
                <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/15" />
                <div className="relative flex items-start gap-3">
                  <div className="rounded-xl border border-primary/10 bg-primary/5 p-2">
                    <AlertCircle className="h-5 w-5 text-primary/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">Not Connected</p>
                    <p className="text-xs text-primary/70">
                      Connect to sync your Google Calendar events
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="px-7 pb-6">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary/70" />
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary/70">
                Features
              </h3>
            </div>
            <div className="grid gap-2">
              {[
                {
                  color: "from-emerald-200/70 to-emerald-100/60",
                  text: "Sync events from your Google Calendar",
                },
                {
                  color: "from-blue-200/70 to-blue-100/60",
                  text: "View all events in one unified interface",
                },
                {
                  color: "from-purple-200/70 to-purple-100/60",
                  text: "Create new events directly from WorkBase",
                },
                {
                  color: "from-orange-200/70 to-orange-100/60",
                  text: "Get notifications for upcoming events",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-2xl border border-primary/10 bg-white/85 p-3 shadow-[0_12px_28px_rgba(47,32,16,0.08)]`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-40`} />
                  <div className="relative flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/10 bg-white/70">
                      <div className="h-2 w-2 rounded-full bg-primary/40" />
                    </div>
                    <p className="text-sm text-primary/80">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 px-7 pb-7">
            {isConnected ? (
              <Button
                onClick={handleDisconnect}
                className="group relative flex-1 overflow-hidden rounded-xl border border-red-400/70 bg-gradient-to-r from-red-500/90 via-red-400/90 to-red-500/90 px-4 py-3 font-semibold text-white shadow-[0_16px_40px_rgba(248,113,113,0.28)] transition-all duration-300 hover:shadow-[0_18px_48px_rgba(248,113,113,0.35)] focus:outline-none focus:ring-2 focus:ring-red-400/40"
              >
                <span className="relative">Disconnect</span>
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="group relative flex-1 overflow-hidden rounded-xl border border-secondary/80 bg-gradient-to-r from-secondary via-accent to-secondary/95 px-4 py-3 font-semibold text-white shadow-[0_16px_40px_rgba(111,64,24,0.3)] transition-all duration-300 hover:shadow-[0_18px_48px_rgba(111,64,24,0.36)] focus:outline-none focus:ring-2 focus:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {isConnecting ? (
                  <span className="relative text-sm tracking-wide">Connecting...</span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Connect Google Calendar
                  </span>
                )}
              </Button>
            )}
            <Button
              onClick={onClose}
              className="rounded-xl border border-primary/15 bg-white/85 px-4 py-3 font-semibold text-primary transition-all duration-200 hover:bg-white hover:shadow-[0_12px_28px_rgba(47,32,16,0.12)]"
            >
              Close
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="px-7 pb-7">
            <div className="rounded-2xl border border-primary/15 bg-white/85 p-4 shadow-[0_10px_26px_rgba(47,32,16,0.1)]">
              <div className="flex items-start gap-3">
                <div className="text-lg">🔒</div>
                <p className="text-xs text-primary/70">
                  <span className="font-semibold text-primary">Your privacy matters.</span> We only
                  access calendar events to display them in WorkBase. Your calendar data is never
                  stored on our servers or shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
