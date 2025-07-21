import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface TeamMember {
  name: string;
  avatar: string;
  department?: string;
}

export interface Kudos {
  id: string;
  recipient: TeamMember;
  giver: TeamMember;
  message: string;
  createdAt: string;
  reactions: {
    hearts: number;
    claps: number;
    smiles: number;
    fires: number;
  };
  userReactions?: {
    heart?: boolean;
    clap?: boolean;
    smile?: boolean;
    fire?: boolean;
  };
}

// Sample team members
const sampleMembers: TeamMember[] = [
  { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg", department: "Engineering" },
  { name: "Mike Chen", avatar: "/avatars/mike.jpg", department: "Design" },
  { name: "Alex Rivera", avatar: "/avatars/alex.jpg", department: "Marketing" },
  { name: "Emily Davis", avatar: "/avatars/sarah.jpg", department: "HR" },
  { name: "David Wilson", avatar: "/avatars/mike.jpg", department: "Sales" },
  { name: "Lisa Thompson", avatar: "/avatars/alex.jpg", department: "Engineering" }
];

// Atom for storing kudos with localStorage persistence
export const kudosAtom = atomWithStorage<Kudos[]>(
  "wfcos-kudos",
  [
    {
      id: "kudos-1",
      recipient: sampleMembers[0],
      giver: sampleMembers[1],
      message: "A huge thanks to Sarah for staying late to help me with the presentation slides. You're a lifesaver! Your attention to detail and creative input made all the difference. 🙌",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      reactions: { hearts: 12, claps: 8, smiles: 15, fires: 5 },
      userReactions: { heart: true, clap: false, smile: true, fire: false }
    },
    {
      id: "kudos-2",
      recipient: sampleMembers[2],
      giver: sampleMembers[3],
      message: "Alex absolutely crushed the marketing campaign launch! The engagement numbers are through the roof thanks to your brilliant strategy and execution. 🚀✨",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      reactions: { hearts: 20, claps: 25, smiles: 18, fires: 12 },
      userReactions: { heart: false, clap: true, smile: false, fire: true }
    },
    {
      id: "kudos-3",
      recipient: sampleMembers[1],
      giver: sampleMembers[0],
      message: "Mike's design work on the new user interface is absolutely stunning! Users are loving the new experience and it shows in our satisfaction scores. 🎨💯",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      reactions: { hearts: 16, claps: 14, smiles: 22, fires: 8 },
      userReactions: { heart: true, clap: true, smile: false, fire: false }
    },
    {
      id: "kudos-4",
      recipient: sampleMembers[4],
      giver: sampleMembers[5],
      message: "David went above and beyond to help close that big client deal. Your persistence and dedication really paid off for the whole team! 💪🏆",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      reactions: { hearts: 9, claps: 11, smiles: 13, fires: 7 },
      userReactions: { heart: false, clap: false, smile: true, fire: true }
    },
    {
      id: "kudos-5",
      recipient: sampleMembers[3],
      giver: sampleMembers[2],
      message: "Emily organized the most amazing team building event! Everyone had such a great time and it really brought us all closer together. Thank you! 🎉💝",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      reactions: { hearts: 24, claps: 19, smiles: 31, fires: 6 },
      userReactions: { heart: true, clap: false, smile: true, fire: false }
    }
  ]
);

// Sample team members for the form dropdown
export const teamMembersAtom = atom<TeamMember[]>(sampleMembers);

// Atom for adding new kudos
export const addKudosAtom = atom(
  null,
  (get, set, newKudos: Omit<Kudos, "id" | "createdAt" | "reactions" | "userReactions">) => {
    const kudosList = get(kudosAtom);
    const kudos: Kudos = {
      ...newKudos,
      id: `kudos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      reactions: { hearts: 0, claps: 0, smiles: 0, fires: 0 },
      userReactions: { heart: false, clap: false, smile: false, fire: false }
    };
    set(kudosAtom, [kudos, ...kudosList]);
  }
);

// Atom for updating reactions
export const updateKudosReactionAtom = atom(
  null,
  (get, set, { id, reactionType }: { id: string; reactionType: keyof Kudos["reactions"] }) => {
    const kudosList = get(kudosAtom);
    const updatedList = kudosList.map(kudos => {
      if (kudos.id === id) {
        const userReactionKey = reactionType === "hearts" ? "heart" : 
                               reactionType === "claps" ? "clap" :
                               reactionType === "smiles" ? "smile" : "fire";
        
        const wasReacted = kudos.userReactions?.[userReactionKey] || false;
        const newCount = wasReacted ? 
          Math.max(0, kudos.reactions[reactionType] - 1) : 
          kudos.reactions[reactionType] + 1;
        
        return {
          ...kudos,
          reactions: {
            ...kudos.reactions,
            [reactionType]: newCount
          },
          userReactions: {
            ...kudos.userReactions,
            [userReactionKey]: !wasReacted
          }
        };
      }
      return kudos;
    });
    set(kudosAtom, updatedList);
  }
);
