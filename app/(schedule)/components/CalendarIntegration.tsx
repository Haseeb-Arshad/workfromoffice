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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-lg rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200/50 relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-white/60 to-gray-50/60 shadow-sm">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">
                Calendar Integration
              </h2>
              <p className="text-gray-600/70 text-sm">Connect with Google Calendar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="mb-8">
          {isConnected ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Connected to Google Calendar</p>
                <p className="text-green-700/70 text-sm">Your events are being synced automatically</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-gray-100 to-slate-100 border border-gray-200/50">
              <AlertCircle className="w-6 h-6 text-gray-500" />
              <div>
                <p className="font-semibold text-gray-800">Not Connected</p>
                <p className="text-gray-700/70 text-sm">Connect to see your Google Calendar events</p>
              </div>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Features
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Sync events from your Google Calendar
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              View all events in one beautiful interface
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Create new events directly from WorkBase
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              Receive gentle notifications for upcoming events
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isConnecting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                "Connect Google Calendar"
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-semibold transition-all duration-200"
          >
            Close
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 p-4 rounded-2xl bg-white/50 border border-gray-200/30">
          <p className="text-xs text-gray-600/80 leading-relaxed">
            🔒 Your privacy is important to us. We only access calendar events to display them in WorkBase. 
            Your calendar data is never stored on our servers or shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};