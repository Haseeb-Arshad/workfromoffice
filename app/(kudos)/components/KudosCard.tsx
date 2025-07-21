import React from "react";
import { Clock } from "lucide-react";
import { Kudos } from "@/application/atoms/kudosAtom";
import { useAtom } from "jotai";
import { updateKudosReactionAtom } from "@/application/atoms/kudosAtom";

interface KudosCardProps {
  kudos: Kudos;
}

export const KudosCard: React.FC<KudosCardProps> = ({ kudos }) => {
  const [, updateReaction] = useAtom(updateKudosReactionAtom);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const handleReaction = (reactionType: keyof Kudos["reactions"]) => {
    updateReaction({ id: kudos.id, reactionType });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-rose-200/60 bg-gradient-to-br from-white/90 via-rose-50/40 to-pink-50/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] group">
      {/* Decorative accent elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/15 to-rose-200/15 rounded-full translate-y-12 -translate-x-12" />
      
      {/* Main content */}
      <div className="relative p-6">
        {/* Header with recipient */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-white shadow-sm flex items-center justify-center">
              <img
                src={kudos.recipient.avatar}
                alt={kudos.recipient.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-sm font-bold text-rose-600">${getInitials(kudos.recipient.name)}</span>`;
                  }
                }}
              />
            </div>
            {/* Celebration sparkle */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full flex items-center justify-center text-xs animate-pulse">
              ✨
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-primary">
                To: {kudos.recipient.name}
              </h3>
              {kudos.recipient.department && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100/80 text-rose-700">
                  {kudos.recipient.department}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-primary/60">
              <span className="font-medium">From: {kudos.giver.name}</span>
              <div className="w-1 h-1 rounded-full bg-rose-300" />
              <div className="flex items-center gap-1">
                <div className="p-1 rounded-full bg-rose-100/50">
                  <Clock className="size-3" />
                </div>
                <span>{formatRelativeTime(kudos.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kudos message */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-white/60 to-rose-50/40 backdrop-blur-sm rounded-xl p-4 border border-rose-200/40 shadow-sm">
            <p className="text-primary/90 leading-relaxed font-medium">
              {kudos.message}
            </p>
          </div>
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Heart */}
            <button
              onClick={() => handleReaction("hearts")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 hover:scale-110 ${
                kudos.userReactions?.heart
                  ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-600 shadow-sm"
                  : "bg-white/60 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-primary/70"
              }`}
            >
              <span className="text-sm">❤️</span>
              <span className="text-sm font-semibold">{kudos.reactions.hearts}</span>
            </button>

            {/* Clap */}
            <button
              onClick={() => handleReaction("claps")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 hover:scale-110 ${
                kudos.userReactions?.clap
                  ? "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-600 shadow-sm"
                  : "bg-white/60 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 text-primary/70"
              }`}
            >
              <span className="text-sm">👏</span>
              <span className="text-sm font-semibold">{kudos.reactions.claps}</span>
            </button>

            {/* Smile */}
            <button
              onClick={() => handleReaction("smiles")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 hover:scale-110 ${
                kudos.userReactions?.smile
                  ? "bg-gradient-to-r from-yellow-100 to-lime-100 text-yellow-600 shadow-sm"
                  : "bg-white/60 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-lime-50 text-primary/70"
              }`}
            >
              <span className="text-sm">😊</span>
              <span className="text-sm font-semibold">{kudos.reactions.smiles}</span>
            </button>

            {/* Fire */}
            <button
              onClick={() => handleReaction("fires")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 hover:scale-110 ${
                kudos.userReactions?.fire
                  ? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 shadow-sm"
                  : "bg-white/60 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 text-primary/70"
              }`}
            >
              <span className="text-sm">🔥</span>
              <span className="text-sm font-semibold">{kudos.reactions.fires}</span>
            </button>
          </div>

          {/* Giver avatar */}
          <div className="flex items-center gap-2 text-xs text-primary/50">
            <span>👋</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 border border-white shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src={kudos.giver.avatar}
                alt={kudos.giver.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-xs font-bold text-rose-600">${getInitials(kudos.giver.name).slice(0, 1)}</span>`;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
