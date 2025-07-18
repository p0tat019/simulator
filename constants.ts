import { Agent, Personality, TeamStats } from './types';

export const INITIAL_TEAM: Agent[] = [
  {
    name: "Alex",
    personality: Personality.Leader,
    avatarUrl: "https://i.pravatar.cc/150?u=alex"
  },
  {
    name: "Ben",
    personality: Personality.Analyst,
    avatarUrl: "https://i.pravatar.cc/150?u=ben"
  },
  {
    name: "Carla",
    personality: Personality.Creative,
    avatarUrl: "https://i.pravatar.cc/150?u=carla"
  },
  {
    name: "Diana",
    personality: Personality.Collaborator,
    avatarUrl: "https://i.pravatar.cc/150?u=diana"
  }
];

export const PERSONALITY_DESCRIPTIONS: Record<Personality, string> = {
  [Personality.Leader]: "Decisive and action-oriented, but can sometimes overlook details.",
  [Personality.Analyst]: "Meticulous and data-driven, but may suffer from analysis paralysis.",
  [Personality.Creative]: "Innovative and full of ideas, but can be disorganized.",
  [Personality.Collaborator]: "A great team player who fosters harmony, but may avoid conflict."
};

export const INITIAL_STATS: TeamStats = {
  morale: 70,
  productivity: 70,
  cooperation: 70,
};

export const MAX_TURNS = 5;
