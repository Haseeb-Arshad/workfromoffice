import React, { useState } from "react";
import { useAtom } from "jotai";
import { addKudosAtom, teamMembersAtom, TeamMember } from "@/application/atoms/kudosAtom";
import { X, Heart, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

interface KudosFormProps {
  onClose: () => void;
}

export const KudosForm: React.FC<KudosFormProps> = ({ onClose }) => {
  const [, addKudos] = useAtom(addKudosAtom);
  const [teamMembers] = useAtom(teamMembersAtom);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [selectedGiver, setSelectedGiver] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !selectedGiver || !message.trim()) return;

    const recipient = teamMembers.find(m => m.name === selectedRecipient);
    const giver = teamMembers.find(m => m.name === selectedGiver);

    if (!recipient || !giver) return;

    addKudos({
      recipient,
      giver,
      message: message.trim(),
    });

    // Reset form
    setSelectedRecipient("");
    setSelectedGiver("");
    setMessage("");
    onClose();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const selectedRecipientData = teamMembers.find(m => m.name === selectedRecipient);

  return (
    <div className="bg-gradient-to-br from-white/95 via-rose-50/40 to-pink-50/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-rose-200/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-rose-200/15 to-pink-200/15 rounded-full translate-y-10 -translate-x-10" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 shadow-sm">
              <Heart className="size-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">
                Give Kudos 🎉
              </h3>
              <p className="text-primary/60 font-medium">
                Celebrate your amazing teammate!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-all duration-200 p-2 rounded-full hover:bg-red-50 hover:scale-110"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient and Giver Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-primary">
                🎯 Who are you celebrating? *
              </label>
              <Select
                value={selectedRecipient}
                onValueChange={setSelectedRecipient}
              >
                <SelectTrigger className="h-14 border-2 border-rose-200/60 rounded-xl bg-white/70 backdrop-blur-sm text-left">
                  <SelectValue placeholder="Choose a teammate to celebrate" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border border-white shadow-sm flex items-center justify-center overflow-hidden">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-xs font-bold text-rose-600">${getInitials(member.name)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          {member.department && (
                            <div className="text-xs text-primary/60">{member.department}</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Preview of selected recipient */}
              {selectedRecipientData && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-rose-100/50 to-pink-100/50 rounded-xl border border-rose-200/40">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedRecipientData.avatar}
                      alt={selectedRecipientData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-sm font-bold text-rose-600">${getInitials(selectedRecipientData.name)}</span>`;
                        }
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-primary">✨ {selectedRecipientData.name}</div>
                    <div className="text-sm text-primary/60">Ready to be celebrated!</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-primary">
                👋 Who's giving the kudos? *
              </label>
              <Select
                value={selectedGiver}
                onValueChange={setSelectedGiver}
              >
                <SelectTrigger className="h-14 border-2 border-rose-200/60 rounded-xl bg-white/70 backdrop-blur-sm">
                  <SelectValue placeholder="That's you! Select yourself" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border border-white shadow-sm flex items-center justify-center overflow-hidden">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-xs font-bold text-rose-600">${getInitials(member.name)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          {member.department && (
                            <div className="text-xs text-primary/60">{member.department}</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-primary">
              💬 Your celebratory message *
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share what makes this person amazing! What did they do that deserves recognition? Be specific and heartfelt... 🌟"
                rows={5}
                className="w-full px-4 py-4 border-2 border-rose-200/60 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all duration-200 resize-vertical placeholder:text-primary/40 text-primary/90"
                required
              />
              <div className="absolute bottom-3 right-3 text-xs text-primary/40 bg-white/60 px-2 py-1 rounded-full">
                {message.length}/500
              </div>
            </div>
            
            {/* Message suggestions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMessage("Thank you for going above and beyond! Your dedication really makes a difference. 🌟")}
                className="text-xs px-3 py-1.5 bg-rose-100/60 hover:bg-rose-100 text-rose-700 rounded-full transition-colors border border-rose-200/40"
              >
                💪 Above & beyond
              </button>
              <button
                type="button"
                onClick={() => setMessage("Your positive attitude and teamwork spirit brightens everyone's day! 😊")}
                className="text-xs px-3 py-1.5 bg-pink-100/60 hover:bg-pink-100 text-pink-700 rounded-full transition-colors border border-pink-200/40"
              >
                ✨ Great attitude
              </button>
              <button
                type="button"
                onClick={() => setMessage("Thanks for always being so helpful and supportive to the team! 🤝")}
                className="text-xs px-3 py-1.5 bg-orange-100/60 hover:bg-orange-100 text-orange-700 rounded-full transition-colors border border-orange-200/40"
              >
                🤝 Team player
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-primary/70 bg-white/60 hover:bg-white/80 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-rose-200/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-500 rounded-xl transition-all duration-200 hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              disabled={!selectedRecipient || !selectedGiver || !message.trim()}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Send className="size-4" />
              Send Kudos 🎉
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
