"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { kudosAtom } from "@/application/atoms/kudosAtom";
import { KudosCard } from "./components/KudosCard";
import { KudosForm } from "./components/KudosForm";
import { Plus, Sparkles, Users } from "lucide-react";

const Kudos = () => {
  const [kudosList] = useAtom(kudosAtom);
  const [showForm, setShowForm] = useState(false);

  const sortedKudos = [...kudosList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalKudos = kudosList.length;
  const uniqueRecipients = new Set(kudosList.map(k => k.recipient.name)).size;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-rose-50 via-pink-50/30 to-orange-50/20 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 shadow-sm">
            <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V16L7.5 20.5L8.5 21.5L12 18L15.5 21.5L16.5 20.5L13 16V11C14.1 11 15 10.1 15 9H21Z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              Kudos & High Fives
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-primary/60">
                <Sparkles className="size-4 text-rose-500" />
                <span className="font-medium">{totalKudos} kudos given</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-primary/60">
                <Users className="size-4 text-pink-500" />
                <span className="font-medium">{uniqueRecipients} team members celebrated</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Plus className="size-5" />
          Give Kudos
        </button>
      </div>

      {/* Give Kudos Form */}
      {showForm && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <KudosForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Wall of Fame */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200/50 scrollbar-track-transparent">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
            <div className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full border border-rose-200/50">
              <span className="text-sm font-bold text-primary bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                🎉 Wall of Fame 🎉
              </span>
            </div>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
          </div>
        </div>

        {sortedKudos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gradient-to-br from-white/80 to-rose-50/40 backdrop-blur-sm rounded-3xl p-16 shadow-lg border border-rose-200/50 max-w-md">
              <div className="text-muted-foreground mb-8">
                <div className="p-6 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 mx-auto mb-8 w-fit">
                  <svg className="w-20 h-20 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Start Celebrating! 🎊
              </h3>
              <p className="text-primary/60 text-lg leading-relaxed">
                Be the first to give kudos and celebrate your amazing teammates! 
                Every high-five makes the workplace brighter.
              </p>
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-300 to-pink-300 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-300 to-rose-300 animate-pulse" style={{animationDelay: '0.2s'}} />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-300 to-pink-300 animate-pulse" style={{animationDelay: '0.4s'}} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {sortedKudos.map((kudos, index) => (
              <div
                key={kudos.id}
                className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <KudosCard kudos={kudos} />
              </div>
            ))}
            
            {/* Footer celebration */}
            <div className="flex justify-center pt-8">
              <div className="bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-sm rounded-2xl px-8 py-4 border border-rose-200/50">
                <p className="text-center text-primary/70 font-medium">
                  🌟 Keep spreading the positivity! 🌟
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kudos;
