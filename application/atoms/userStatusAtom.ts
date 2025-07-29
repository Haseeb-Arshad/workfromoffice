import { atom } from "jotai";
import {
  loadFeatureState,
  saveFeatureState,
} from "../../infrastructure/utils/storage";

const FEATURE_KEY = "userStatus";

// Define the possible status types
export type UserStatus = "work" | "break" | "away";

// Define the status configuration
export interface StatusConfig {
  label: string;
  icon: string;
}

export const statusConfigs: Record<UserStatus, StatusConfig> = {
  work: { label: "Work", icon: "Building2" },
  break: { label: "Break", icon: "Coffee" },
  away: { label: "Away", icon: "User" },
};

// Initialize from localStorage if available, or with default
function getInitialStatus(): UserStatus {
  const savedStatus = loadFeatureState<UserStatus>(FEATURE_KEY);
  if (savedStatus && Object.keys(statusConfigs).includes(savedStatus)) {
    return savedStatus;
  }
  return "work"; // Default to work status
}

// Create the base atom with proper initialization
const baseUserStatusAtom = atom<UserStatus>(getInitialStatus());

// Create a derived atom that saves to localStorage on change
export const userStatusAtom = atom(
  (get) => get(baseUserStatusAtom),
  (get, set, newStatus: UserStatus) => {
    set(baseUserStatusAtom, newStatus);
    saveFeatureState(FEATURE_KEY, newStatus);
  }
);

// Derived atom to get current status config
export const currentStatusConfigAtom = atom((get) => {
  const currentStatus = get(userStatusAtom);
  return statusConfigs[currentStatus];
});
