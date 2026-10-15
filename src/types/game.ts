export type GameId = 'tower-stack' | 'brick-breaker' | 'neon-2048';

export type GameState = 'BRIEFING' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameMetadata {
  id: GameId;
  title: string;
  shortTitle: string;
  tagline: string;
  category: string;
  image: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  accentColor: string;
  accentBorder: string;
  accentText: string;
  description: string;
  objective: string;
  rules: string[];
  controls: {
    key: string;
    action: string;
  }[];
  powerups?: {
    name: string;
    description: string;
    icon: string;
    color: string;
  }[];
  proTips: string[];
  achievements: {
    id: string;
    name: string;
    description: string;
    requiredScore: number;
    icon: string;
  }[];
}

export interface PlayerScores {
  'tower-stack': number;
  'brick-breaker': number;
  'neon-2048': number;
}
