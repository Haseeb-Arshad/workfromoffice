"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Separator } from '@/presentation/components/ui/separator';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import {
  usersAtom,
  channelsAtom,
  currentMessagesAtom,
  selectedContactAtom,
  selectedChannelAtom,
  currentUserAtom,
  addMessageAtom,
  addReactionAtom,
} from '@/application/atoms/teahouseAtom';

const Teahouse: React.FC = () => {
  // State Management with Atoms
  const users = useAtomValue(usersAtom);
  const channels = useAtomValue(channelsAtom);
  const messages = useAtomValue(currentMessagesAtom);
  const [selectedContact, setSelectedContact] = useAtom(selectedContactAtom);
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const addMessage = useSetAtom(addMessageAtom);
  const addReaction = useSetAtom(addReactionAtom);

  // Local State
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Emojis
  const ghibliEmojis = ['🌸', '⭐', '🍃', '☀️', '🌙', '🌿', '✨', '🎋', '🌺', '🦋'];

  // Helper function for status icons
  const getStatusIcon = (status: string) => {
    return status === 'available' ? '☀️' : status === 'busy' ? '🕐' : '🌙';
  };

  // Handle sending a message
  const sendMessage = () => {
    if (messageInput.trim() && currentUser) {
      addMessage({
        userId: currentUser.id,
        userName: currentUser.name,
        content: messageInput,
        reactions: [],
        channelId: selectedContact ? undefined : selectedChannel ?? undefined,
        isDirectMessage: !!selectedContact,
        recipientId: selectedContact || undefined,
      });
      setMessageInput('');
    }
  };

  // Handle adding a reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (currentUser) {
      addReaction({ messageId, emoji, userId: currentUser.id });
    }
  };

  // Add debug logging for state changes
  useEffect(() => {
    console.log('Selected contact changed:', selectedContact);
    console.log('Selected channel changed:', selectedChannel);
  }, [selectedContact, selectedChannel]);

  // Disable auto-scroll to prevent layout disruption
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     setTimeout(() => {
  //       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //     }, 100);
  //   }
  // }, [messages]);

  return (
    <div className="h-full w-full flex bg-gradient-to-br from-emerald-50 to-amber-50 rounded-lg overflow-hidden shadow-2xl border-4 border-amber-200">
      {/* Sidebar - Fixed Width, Independent Layout */}
      <div className="w-64 min-w-[16rem] max-w-[16rem] bg-gradient-to-b from-emerald-100 to-green-200 border-r-4 border-amber-200 shrink-0">
        {/* Sidebar Header - Fixed Height */}
        <div className="h-20 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 border-b-2 border-amber-200 shrink-0">
          <h1 className="text-lg font-bold text-emerald-800 flex items-center gap-2 leading-tight">
            🫖 The Teahouse
          </h1>
          <p className="text-xs text-emerald-600 italic leading-tight">A warm place to gather</p>
        </div>

        {/* Sidebar Body - Calculated Height */}
        <div className="h-[calc(100%-5rem)] flex flex-col">
          {/* Tea Companions Section - Fixed Height */}
          <div className="h-48 shrink-0 flex flex-col">
            <div className="h-10 px-3 pt-3 pb-1 shrink-0">
              <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                🌸 Tea Companions
              </h3>
            </div>
            <div className="flex-1 px-3 pb-2 min-h-0">
              <div className="h-full overflow-auto">
                <div className="space-y-1 pr-1">
                  {users.map(user => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                        selectedContact === user.id
                          ? 'bg-amber-200 shadow-sm'
                          : 'hover:bg-amber-100'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Selecting contact:', user.id, user.name);
                        setSelectedContact(user.id);
                        setSelectedChannel(null); // Clear channel selection when selecting contact
                      }}
                    >
                      <div className="relative shrink-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                          {user.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 text-xs leading-none">
                          {getStatusIcon(user.status)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-emerald-800 truncate">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Separator - Fixed Height */}
          <div className="h-6 flex items-center px-3 shrink-0">
            <Separator className="bg-amber-200" />
          </div>

          {/* Tea Circles Section - Takes Remaining Space */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="h-10 px-3 pt-1 pb-1 shrink-0">
              <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                🎋 Tea Circles
              </h3>
            </div>
            <div className="flex-1 px-3 pb-3 min-h-0">
              <div className="h-full overflow-auto">
                <div className="space-y-1 pr-1">
                  {channels.map(channel => (
                    <div
                      key={channel.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                        selectedChannel === channel.id && !selectedContact
                          ? 'bg-amber-200 shadow-sm'
                          : 'hover:bg-amber-100'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Selecting channel:', channel.id, channel.name);
                        setSelectedChannel(channel.id);
                        setSelectedContact(null); // Clear contact selection when selecting channel
                      }}
                    >
                      <span className="text-emerald-600 shrink-0 text-sm">#</span>
                      <span className="text-sm text-emerald-800 flex-1 truncate">
                        {channel.name}
                      </span>
                      {channel.unreadCount > 0 && (
                        <span className="bg-red-400 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center shrink-0 leading-none">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 border-b-2 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                {selectedContact ? (
                  <>
                    💬 {users.find(u => u.id === selectedContact)?.name}
                  </>
                ) : (
                  <>
                    # {channels.find(c => c.id === selectedChannel)?.name}
                  </>
                )}
              </h2>
              <p className="text-sm text-emerald-600 italic">
                {selectedContact ? 'Direct message' : 'Team collaboration space'}
              </p>
            </div>
            {selectedContact && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  users.find(u => u.id === selectedContact)?.status === 'available' ? 'bg-green-400' :
                  users.find(u => u.id === selectedContact)?.status === 'busy' ? 'bg-red-400' :
                  'bg-gray-400'
                }`}></div>
                <span className="text-sm text-emerald-600 capitalize">
                  {users.find(u => u.id === selectedContact)?.status || 'offline'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className="group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-sm font-bold text-purple-700 shadow-md">
                      {message.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-emerald-800">
                          {message.userName}
                        </span>
                        <span className="text-xs text-emerald-600">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border border-amber-200">
                        <p className="text-emerald-900">{message.content}</p>
                      </div>
                      {/* Reactions */}
                      {message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <button
                              key={idx}
                              className="bg-amber-100 hover:bg-amber-200 rounded-full px-2 py-1 text-xs flex items-center gap-1 transition-colors duration-200"
                              onClick={() => handleAddReaction(message.id, reaction.emoji)}
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-emerald-700">
                                {reaction.users.length}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Quick reaction buttons (visible on hover) */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                        <div className="flex gap-1">
                          {ghibliEmojis.slice(0, 4).map(emoji => (
                            <button
                              key={emoji}
                              className="text-lg hover:scale-125 transition-transform duration-200 p-1"
                              onClick={() => handleAddReaction(message.id, emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input - Always Visible */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 border-t-2 border-amber-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Share your thoughts like morning mist..."
                className="pr-20 rounded-full border-2 border-amber-200 bg-white/80 backdrop-blur-sm focus:border-emerald-300 focus:ring-emerald-200 text-emerald-900 placeholder:text-emerald-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-amber-200 rounded-full"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4 text-emerald-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-amber-200 rounded-full"
                >
                  <Paperclip className="h-4 w-4 text-emerald-600" />
                </Button>
              </div>
            </div>
            <Button
              onClick={sendMessage}
              className="rounded-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white shadow-lg border-2 border-emerald-300"
              disabled={!messageInput.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-4 shadow-2xl">
              <div className="grid grid-cols-5 gap-2">
                {ghibliEmojis.map(emoji => (
                  <button
                    key={emoji}
                    className="text-2xl hover:scale-125 transition-transform duration-200 p-2 hover:bg-amber-100 rounded-lg"
                    onClick={() => {
                      setMessageInput(messageInput + emoji);
                      setShowEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teahouse;
