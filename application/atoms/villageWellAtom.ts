import { atom } from 'jotai';
import { currentUserAtom, usersAtom } from './teahouseAtom';

// Re-export for convenience
export { currentUserAtom, usersAtom };

export interface VillageWellPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  category: string;
  reactions: Reaction[];
  comments: Comment[];
  timestamp: Date;
}

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface VillageWellState {
  posts: VillageWellPost[];
}

// Initial state
const initialState: VillageWellState = {
  posts: [
    {
      id: '1',
      userId: '1',
      userName: 'Mei Kusakabe',
      content: "I started growing a bonsai tree! Any tips? 🌲 It's my first time trying this hobby and I'm excited but also nervous!",
      category: 'hobbies',
      reactions: [{ emoji: '🌸', users: ['2', '3'] }, { emoji: '👏', users: ['4', '5'] }],
      comments: [
        {
          id: 'comment1',
          userId: '3',
          userName: 'Chihiro',
          content: "Wow, that's amazing! Regular trimming helps keep the shape. Also, don't overwater! 🌿",
          timestamp: new Date(Date.now() - 600000)
        },
        {
          id: 'comment2',
          userId: '2',
          userName: 'Totoro',
          content: "Forest spirits approve! 🌳 Patience is key with bonsai.",
          timestamp: new Date(Date.now() - 300000)
        }
      ],
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      userId: '3',
      userName: 'Chihiro',
      content: "Question for everyone: If you could have any superpower for just one day, what would it be and why? 🦸‍♀️",
      category: 'questions',
      reactions: [{ emoji: '🤔', users: ['1', '4', '6'] }, { emoji: '✨', users: ['2'] }],
      comments: [
        {
          id: 'comment3',
          userId: '5',
          userName: 'Sophie',
          content: "Time manipulation! I'd love to slow down time during perfect moments 🕐",
          timestamp: new Date(Date.now() - 1200000)
        },
        {
          id: 'comment4',
          userId: '6',
          userName: 'Kiki',
          content: "Flying! Actually, I already fly on my broomstick, so maybe teleportation? 🧙‍♀️",
          timestamp: new Date(Date.now() - 900000)
        }
      ],
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '3',
      userId: '2',
      userName: 'Totoro',
      content: "Made some delicious acorn cookies today! 🌰 Forest recipe passed down through generations of spirits. Anyone want the recipe?",
      category: 'food',
      reactions: [{ emoji: '🤤', users: ['1', '3', '5', '7'] }, { emoji: '🍪', users: ['4', '6'] }],
      comments: [
        {
          id: 'comment5',
          userId: '7',
          userName: 'Ponyo',
          content: "Yes please! I love trying new recipes! 🐟",
          timestamp: new Date(Date.now() - 450000)
        }
      ],
      timestamp: new Date(Date.now() - 2400000)
    },
    {
      id: '4',
      userId: '6',
      userName: 'Kiki',
      content: "Just delivered my first package using eco-friendly transport! 🧙‍♀️✨ Small steps toward a greener world.",
      category: 'achievements',
      reactions: [{ emoji: '🎉', users: ['1', '2', '3', '4', '5'] }, { emoji: '🌱', users: ['7'] }],
      comments: [],
      timestamp: new Date(Date.now() - 4200000)
    },
    {
      id: '5',
      userId: '5',
      userName: 'Sophie',
      content: "My hair is having a GREAT day today! 💁‍♀️ Sometimes it's the little things that make you smile.",
      category: 'general',
      reactions: [{ emoji: '💯', users: ['4'] }, { emoji: '😊', users: ['1', '6'] }],
      comments: [
        {
          id: 'comment6',
          userId: '4',
          userName: 'Howl',
          content: "Hair goals! ✨ What's your secret?",
          timestamp: new Date(Date.now() - 180000)
        }
      ],
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: '6',
      userId: '7',
      userName: 'Ponyo',
      content: "Swimming in the harbor today and saw the most beautiful schools of fish! 🐠🌊 Nature never ceases to amaze me.",
      category: 'general',
      reactions: [{ emoji: '🌊', users: ['2', '3'] }, { emoji: '🐟', users: ['1', '5'] }],
      comments: [],
      timestamp: new Date(Date.now() - 900000)
    }
  ]
};

// Atoms
export const villageWellPostsAtom = atom(initialState.posts);

// Action atoms
export const addVillageWellPostAtom = atom(null, (get, set, newPost: Omit<VillageWellPost, 'id' | 'timestamp'>) => {
  const posts = get(villageWellPostsAtom);
  const newPostWithIdAndTimestamp: VillageWellPost = {
    ...newPost,
    id: Date.now().toString(),
    timestamp: new Date()
  };
  set(villageWellPostsAtom, [...posts, newPostWithIdAndTimestamp]);
});

export const addVillageWellReactionAtom = atom(null, (get, set, { postId, emoji, userId }: { postId: string; emoji: string; userId: string }) => {
  const posts = get(villageWellPostsAtom);
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      const existingReaction = post.reactions.find(r => r.emoji === emoji);
      if (existingReaction) {
        if (existingReaction.users.includes(userId)) {
          existingReaction.users = existingReaction.users.filter(u => u !== userId);
          if (existingReaction.users.length === 0) {
            post.reactions = post.reactions.filter(r => r.emoji !== emoji);
          }
        } else {
          existingReaction.users.push(userId);
        }
      } else {
        post.reactions.push({ emoji, users: [userId] });
      }
    }
    return post;
  });
  set(villageWellPostsAtom, updatedPosts);
});

export const addVillageWellCommentAtom = atom(null, (get, set, { postId, userId, userName, content }: { postId: string; userId: string; userName: string; content: string }) => {
  const posts = get(villageWellPostsAtom);
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      post.comments.push({
        id: Date.now().toString(),
        userId,
        userName,
        content,
        timestamp: new Date()
      });
    }
    return post;
  });
  set(villageWellPostsAtom, updatedPosts);
});
