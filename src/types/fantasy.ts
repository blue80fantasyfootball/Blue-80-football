export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'DEF';

export type SlotId = 'QB' | 'RB1' | 'RB2' | 'WR1' | 'WR2' | 'WR3' | 'TE' | 'FLEX' | 'DEF';

export type TabId = 'lineup' | 'matchup' | 'waivers' | 'signup' | 'standings';

export type MatchupTier = 'Favorable' | 'Neutral' | 'Tough';

export interface Player {
  name: string;
  pos: Position;
  team: string;
  baseProj: number;
  proj: number;
  salary: number;
  posRank: number;
  opponent: string;
  oppCode: string;
  matchupTier: MatchupTier;
  defRankMetric: number;
  injuredQ1?: boolean;
  liveBonus?: number;
}

export interface RosterSlot {
  id: SlotId;
  label: string;
  shortLabel: string;
  eligiblePositions: Position[];
  player: Player | null;
}

export interface LeagueTeam {
  id?: string | number;
  owner: string;
  team: string;
  email: string;
  createdAt?: string;
}

export interface StandingEntry {
  id?: string | number;
  team_name: string;
  manager_name: string;
  wins: number;
  losses: number;
  points_for: number;
}

export interface PlayEvent {
  id: string;
  quarter: string;
  text: string;
  pointsDelta: number;
  side: 'user' | 'opponent';
  playerName: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  text: string;
}
