// ─── Enums ────────────────────────────────────────────────────────────────────

export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type Equipment =
  | 'BODYWEIGHT_ONLY'
  | 'BAR_ONLY'
  | 'BAR_AND_RINGS'
  | 'FULL';

export type MessageRole = 'user' | 'assistant';

// ─── User ─────────────────────────────────────────────────────────────────────

export interface CreateUserRequest {
  name: string;
  level: Level;
  goals: string[];
  weekly_frequency: number;
  equipment: Equipment;
  injuries?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  level: Level;
  goals: string[];
  weekly_frequency: number;
  equipment: Equipment;
  injuries?: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface MessageResponse {
  id: number;
  role: MessageRole;
  content: string;
  created_at: string;
}

// ─── Onboarding (state local du wizard) ───────────────────────────────────────

export interface OnboardingStep {
  step: number;
  title: string;
  subtitle: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { step: 1, title: 'Qui es-tu ?',          subtitle: 'Nom et niveau actuel'         },
  { step: 2, title: 'Tes objectifs',         subtitle: 'Ce vers quoi tu vises'        },
  { step: 3, title: 'Ta disponibilité',      subtitle: 'Combien de jours par semaine' },
  { step: 4, title: 'Ton matériel',          subtitle: 'Ce que tu as à disposition'   },
  { step: 5, title: 'Santé & restrictions',  subtitle: 'Facultatif mais important'    },
];

// ─── Goals disponibles ────────────────────────────────────────────────────────

export interface Goal {
  key: string;
  label: string;
  emoji: string;
}

export const AVAILABLE_GOALS: Goal[] = [
  { key: 'muscle_up',         label: 'Muscle-up',          emoji: '🔄' },
  { key: 'handstand',         label: 'Handstand',          emoji: '🤸' },
  { key: 'front_lever',       label: 'Front Lever',        emoji: '🏋️' },
  { key: 'planche',           label: 'Planche',            emoji: '⚡' },
  { key: 'pull_up_strength',  label: 'Force traction',     emoji: '💪' },
  { key: 'push_strength',     label: 'Force poussée',      emoji: '🚀' },
  { key: 'lose_weight',       label: 'Perte de poids',     emoji: '🔥' },
  { key: 'general_fitness',   label: 'Forme générale',     emoji: '🌟' },
];
