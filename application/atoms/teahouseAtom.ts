import { atom } from 'jotai';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'available' | 'busy' | 'away';
  lastSeen?: Date;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  unreadCount: number;
  lastMessage?: Message;
  members: string[];
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
  channelId?: string;
  isDirectMessage?: boolean;
  recipientId?: string;
}

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface TeahouseState {
  currentUser: User | null;
  users: User[];
  channels: Channel[];
  messages: Message[];
  selectedContact: string | null;
  selectedChannel: string | null;
  isTyping: { [userId: string]: boolean };
  onlineUsers: string[];
}

// Initial state
const initialState: TeahouseState = {
  currentUser: {
    id: 'current-user',
    name: 'You',
    avatar: '/avatars/you.jpg',
    status: 'available'
  },
  users: [
    { id: '1', name: 'Mei Kusakabe', avatar: '/avatars/sarah.jpg', status: 'available' },
    { id: '2', name: 'Totoro', avatar: '/avatars/alex.jpg', status: 'busy' },
    { id: '3', name: 'Chihiro', avatar: '/avatars/mike.jpg', status: 'available' },
    { id: '4', name: 'Howl', avatar: '/avatars/sarah.jpg', status: 'away' },
    { id: '5', name: 'Sophie', avatar: '/avatars/alex.jpg', status: 'available' },
    { id: '6', name: 'Kiki', avatar: '/avatars/mike.jpg', status: 'available' },
    { id: '7', name: 'Ponyo', avatar: '/avatars/sarah.jpg', status: 'busy' },
  ],
  channels: [
    { 
      id: 'general', 
      name: 'general', 
      description: 'General chat for everyone',
      unreadCount: 0,
      members: ['1', '2', '3', '4', '5', '6', '7', 'current-user']
    },
    { 
      id: 'project-phoenix', 
      name: 'project-phoenix', 
      description: 'Phoenix project discussions',
      unreadCount: 3,
      members: ['1', '3', '5', 'current-user']
    },
    { 
      id: 'design-team', 
      name: 'design-team', 
      description: 'Design team collaboration',
      unreadCount: 1,
      members: ['2', '4', '6', 'current-user']
    },
    { 
      id: 'random', 
      name: 'random', 
      description: 'Random conversations and fun',
      unreadCount: 0,
      members: ['1', '2', '3', '4', '5', '6', '7', 'current-user']
    },
  ],
  messages: [
    // Channel messages
    {
      id: '1',
      userId: '1',
      userName: 'Mei Kusakabe',
      content: 'Good morning everyone! ☀️ Ready to start our magical day of work?',
      timestamp: new Date(Date.now() - 3600000),
      reactions: [{ emoji: '🌸', users: ['2', '3'] }],
      channelId: 'general'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Totoro',
      content: 'The forest spirits are blessing our productivity today! 🌿',
      timestamp: new Date(Date.now() - 1800000),
      reactions: [{ emoji: '⭐', users: ['1', '4'] }],
      channelId: 'general'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Chihiro',
      content: 'I just finished the user interface designs for the spirit world portal!',
      timestamp: new Date(Date.now() - 900000),
      reactions: [],
      channelId: 'general'
    },
    {
      id: '4',
      userId: '5',
      userName: 'Sophie',
      content: 'Phoenix project update: Magic authentication system is working perfectly! ✨',
      timestamp: new Date(Date.now() - 2700000),
      reactions: [{ emoji: '🎋', users: ['1', '3'] }],
      channelId: 'project-phoenix'
    },
    {
      id: '5',
      userId: '6',
      userName: 'Kiki',
      content: 'New color palette looks amazing! The forest greens really capture that Ghibli feel 🌿',
      timestamp: new Date(Date.now() - 1200000),
      reactions: [{ emoji: '🌺', users: ['2', '4'] }],
      channelId: 'design-team'
    },
    // Direct messages
    {
      id: 'dm1',
      userId: '1',
      userName: 'Mei Kusakabe',
      content: 'Hey! How are you doing today? 😊',
      timestamp: new Date(Date.now() - 2400000),
      reactions: [],
      isDirectMessage: true,
      recipientId: 'current-user'
    },
    {
      id: 'dm2',
      userId: 'current-user',
      userName: 'You',
      content: 'Hi Mei! I\'m doing great, thanks for asking!',
      timestamp: new Date(Date.now() - 2340000),
      reactions: [],
      isDirectMessage: true,
      recipientId: '1'
    },
    {
      id: 'dm3',
      userId: '2',
      userName: 'Totoro',
      content: 'Would you like to go for a forest walk later? 🌲',
      timestamp: new Date(Date.now() - 1500000),
      reactions: [],
      isDirectMessage: true,
      recipientId: 'current-user'
    },
    {
      id: 'dm4',
      userId: '3',
      userName: 'Chihiro',
      content: 'I need your feedback on the new design mockups when you have a moment!',
      timestamp: new Date(Date.now() - 600000),
      reactions: [],
      isDirectMessage: true,
      recipientId: 'current-user'
    },
    {
      id: 'dm5',
      userId: 'current-user',
      userName: 'You',
      content: 'Sure, I\'ll take a look at them right after this meeting!',
      timestamp: new Date(Date.now() - 300000),
      reactions: [],
      isDirectMessage: true,
      recipientId: '3'
    }
  ],
  selectedContact: null,
  selectedChannel: 'general',
  isTyping: {},
  onlineUsers: ['1', '2', '3', '5', '6', 'current-user']
};

// Atoms
export const teahouseStateAtom = atom<TeahouseState>(initialState);

// Derived atoms
export const currentUserAtom = atom(
  (get) => get(teahouseStateAtom).currentUser
);

export const usersAtom = atom(
  (get) => get(teahouseStateAtom).users,
  (get, set, newUsers: User[]) => {
    const state = get(teahouseStateAtom);
    set(teahouseStateAtom, { ...state, users: newUsers });
  }
);

export const channelsAtom = atom(
  (get) => get(teahouseStateAtom).channels,
  (get, set, newChannels: Channel[]) => {
    const state = get(teahouseStateAtom);
    set(teahouseStateAtom, { ...state, channels: newChannels });
  }
);

export const messagesAtom = atom(
  (get) => get(teahouseStateAtom).messages,
  (get, set, newMessages: Message[]) => {
    const state = get(teahouseStateAtom);
    set(teahouseStateAtom, { ...state, messages: newMessages });
  }
);

export const selectedContactAtom = atom(
  (get) => get(teahouseStateAtom).selectedContact,
  (get, set, contactId: string | null) => {
    const state = get(teahouseStateAtom);
    set(teahouseStateAtom, { 
      ...state, 
      selectedContact: contactId,
      selectedChannel: contactId ? null : (state.selectedChannel || 'general')
    });
  }
);

export const selectedChannelAtom = atom(
  (get) => get(teahouseStateAtom).selectedChannel,
  (get, set, channelId: string | null) => {
    const state = get(teahouseStateAtom);
    set(teahouseStateAtom, { 
      ...state, 
      selectedChannel: channelId,
      selectedContact: null
    });
  }
);

// Action atoms
export const addMessageAtom = atom(
  null,
  (get, set, message: Omit<Message, 'id' | 'timestamp'>) => {
    const state = get(teahouseStateAtom);
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    const updatedMessages = [...state.messages, newMessage];
    set(teahouseStateAtom, { ...state, messages: updatedMessages });
    
    // Update channel unread count if needed
    if (message.channelId && message.userId !== 'current-user') {
      const updatedChannels = state.channels.map(channel => 
        channel.id === message.channelId 
          ? { ...channel, unreadCount: channel.unreadCount + 1 }
          : channel
      );
      set(teahouseStateAtom, { ...state, channels: updatedChannels, messages: updatedMessages });
    }
  }
);

export const addReactionAtom = atom(
  null,
  (get, set, { messageId, emoji, userId }: { messageId: string; emoji: string; userId: string }) => {
    const state = get(teahouseStateAtom);
    const updatedMessages = state.messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(userId)) {
            existingReaction.users = existingReaction.users.filter(u => u !== userId);
            if (existingReaction.users.length === 0) {
              msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
            }
          } else {
            existingReaction.users.push(userId);
          }
        } else {
          msg.reactions.push({ emoji, users: [userId] });
        }
      }
      return msg;
    });
    
    set(teahouseStateAtom, { ...state, messages: updatedMessages });
  }
);

export const updateUserStatusAtom = atom(
  null,
  (get, set, { userId, status }: { userId: string; status: 'available' | 'busy' | 'away' }) => {
    const state = get(teahouseStateAtom);
    const updatedUsers = state.users.map(user => 
      user.id === userId ? { ...user, status } : user
    );
    
    set(teahouseStateAtom, { ...state, users: updatedUsers });
  }
);

// Filtered messages atoms
export const currentMessagesAtom = atom((get) => {
  const state = get(teahouseStateAtom);
  const { messages, selectedContact, selectedChannel } = state;
  
  if (selectedContact) {
    // Direct messages
    return messages.filter(msg => 
      (msg.isDirectMessage && 
        ((msg.userId === selectedContact && msg.recipientId === 'current-user') ||
         (msg.userId === 'current-user' && msg.recipientId === selectedContact)))
    );
  } else {
    // Channel messages
    return messages.filter(msg => msg.channelId === selectedChannel);
  }
});

export const onlineUsersAtom = atom(
  (get) => get(teahouseStateAtom).onlineUsers,
  (get, set, userIds: string[]) => {
    const state = get(teahouseStateAtom);
    set(teahouseStateAtom, { ...state, onlineUsers: userIds });
  }
);
