"use client";

import React, { useState } from "react";
import { X, Calendar, Settings, CheckCircle, AlertCircle } from "lucide-react";

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
    
    // Simulate connection process
    setTimeout(() => {
      onConnectionChange(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    onConnectionChange(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full">
        {/* Main container */}
        <div className="relative bg-white rounded-xl border border-primary/10 shadow-md overflow-hidden">
          {/* Header */}
          <div className="relative p-5 pb-4 border-b border-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/80 border border-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary tracking-tight mb-0.5">
                    Calendar Sync
                  </h2>
                  <p className="text-xs text-primary/60">Connect with Google Calendar</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md bg-white/80 border border-primary/10 hover:bg-white"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-primary/60" />
              </button>
            </div>
          </div>

        {/* Connection Status */}
        <div className="px-7 pb-6">
          {isConnected ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="p-2 rounded-md bg-green-100 border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800 text-sm">Connected Successfully</p>
                <p className="text-green-700/80 text-xs">Your events are syncing automatically</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-primary/10">
              <div className="p-2 rounded-md bg-primary/5 border border-primary/10">
                <AlertCircle className="w-5 h-5 text-primary/60" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary text-sm">Not Connected</p>
                <p className="text-primary/70 text-xs">Connect to sync your Google Calendar events</p>
              </div>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="px-7 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-primary/70" />
            <h3 className="font-bold text-primary text-xs uppercase tracking-wider">Features</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-primary/10">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-green-50 border border-green-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
              </div>
              <p className="text-sm text-primary/80">Sync events from your Google Calendar</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-primary/10">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              </div>
              <p className="text-sm text-primary/80">View all events in one unified interface</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-primary/10">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
              </div>
              <p className="text-sm text-primary/80">Create new events directly from WorkBase</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-primary/10">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
              </div>
              <p className="text-sm text-primary/80">Get notifications for upcoming events</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-7 pb-7 flex gap-2">
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <span>Connecting...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Connect Google Calendar
                </span>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-3 bg-white border border-primary/15 rounded-lg font-semibold text-primary"
          >
            Close
          </button>
        </div>

        {/* Privacy Note */}
        <div className="px-7 pb-7">
          <div className="p-4 rounded-lg bg-white border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-lg">🔒</div>
              <p className="text-xs text-primary/70">
                <span className="font-semibold text-primary">Your privacy matters.</span> We only access calendar events to display them in WorkBase. Your calendar data is never stored on our servers or shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};