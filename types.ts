export enum Personality {
  Leader = "Leader",
  Analyst = "Analyst",
  Creative = "Creative",
  Collaborator = "Collaborator",
}

export interface Agent {
  name: string;
  personality: Personality;
  avatarUrl: string;
}

export interface TeamStats {
  morale: number;
  productivity: number;
  cooperation: number;
}

export interface Choice {
  id: number;
  text: string;
}

export interface Scenario {
  title: string;
  description: string;
  agentInFocus: string;
  choices: Choice[];
}

export type GameStatus = "start_screen" | "in_progress" | "show_feedback" | "end_screen";

export type Language = 'en' | 'ko';
export type Difficulty = 'easy' | 'normal' | 'hard';


export interface GameState {
  status: GameStatus;
  team: Agent[];
  stats: TeamStats;
  currentScenario: Scenario | null;
  turn: number;
  feedback: {
    message: string;
    statChanges: {
        morale: number;
        productivity: number;
        cooperation: number;
    }
  } | null;
  language: Language;
  difficulty: Difficulty;
}

// Types for Gemini API responses
export interface GeminiStatChanges {
  morale: number;
  productivity: number;
  cooperation: number;
}

export interface GeminiNextScenario {
  title: string;
  description: string;
  agentInFocus: string;
  choices: Choice[];
}

export interface GeminiTurnResponse {
  feedback: string;
  agentResponse: string;
  statChanges: GeminiStatChanges;
  nextScenario: GeminiNextScenario;
  isFinalScenario: boolean;
}
