import type { MatchupTier, Player, Position, RosterSlot, SlotId } from '../types/fantasy';

export const SALARY_CAP = 60000;
export const MAX_LEAGUE_TEAMS = 12;

export function getCurrentNFLWeek(): number {
  const seasonStartDate = new Date('2026-09-10T00:00:00');
  const now = new Date();
  if (now < seasonStartDate) return 1;
  const diffTime = now.getTime() - seasonStartDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const calculatedWeek = Math.floor(diffDays / 7) + 1;
  return Math.min(Math.max(calculatedWeek, 1), 18);
}

interface DefRatings {
  vsQB: number;
  vsRB: number;
  vsWR: number;
  vsTE: number;
}

export const defensiveMatchupRatings: Record<string, DefRatings> = {
  KC: { vsQB: 14, vsRB: 18, vsWR: 12, vsTE: 20 },
  BUF: { vsQB: 22, vsRB: 15, vsWR: 25, vsTE: 18 },
  BAL: { vsQB: 8, vsRB: 5, vsWR: 10, vsTE: 6 },
  PHI: { vsQB: 25, vsRB: 28, vsWR: 22, vsTE: 24 },
  CIN: { vsQB: 28, vsRB: 26, vsWR: 29, vsTE: 25 },
  MIA: { vsQB: 18, vsRB: 22, vsWR: 15, vsTE: 19 },
  ATL: { vsQB: 16, vsRB: 12, vsWR: 18, vsTE: 14 },
  DAL: { vsQB: 20, vsRB: 24, vsWR: 21, vsTE: 22 },
  MIN: { vsQB: 6, vsRB: 4, vsWR: 8, vsTE: 5 },
  DET: { vsQB: 12, vsRB: 10, vsWR: 14, vsTE: 11 },
  LAR: { vsQB: 15, vsRB: 14, vsWR: 16, vsTE: 17 },
  SF: { vsQB: 7, vsRB: 6, vsWR: 9, vsTE: 8 },
  NYJ: { vsQB: 5, vsRB: 8, vsWR: 6, vsTE: 7 },
  HOU: { vsQB: 9, vsRB: 11, vsWR: 7, vsTE: 10 },
  TB: { vsQB: 24, vsRB: 19, vsWR: 26, vsTE: 21 },
  WAS: { vsQB: 26, vsRB: 25, vsWR: 28, vsTE: 26 },
  ARI: { vsQB: 23, vsRB: 21, vsWR: 24, vsTE: 23 },
  GB: { vsQB: 13, vsRB: 16, vsWR: 15, vsTE: 12 },
  SEA: { vsQB: 19, vsRB: 20, vsWR: 19, vsTE: 21 },
  LV: { vsQB: 27, vsRB: 29, vsWR: 25, vsTE: 26 },
  DEN: { vsQB: 10, vsRB: 9, vsWR: 11, vsTE: 9 },
  IND: { vsQB: 21, vsRB: 23, vsWR: 20, vsTE: 22 },
  PIT: { vsQB: 11, vsRB: 7, vsWR: 13, vsTE: 12 },
  CLE: { vsQB: 4, vsRB: 13, vsWR: 5, vsTE: 13 },
  NE: { vsQB: 17, vsRB: 17, vsWR: 17, vsTE: 16 },
  NYG: { vsQB: 22, vsRB: 25, vsWR: 23, vsTE: 24 },
  TEN: { vsQB: 21, vsRB: 20, vsWR: 22, vsTE: 19 },
  JAX: { vsQB: 29, vsRB: 27, vsWR: 30, vsTE: 28 },
  NO: { vsQB: 18, vsRB: 15, vsWR: 19, vsTE: 17 },
  LAC: { vsQB: 9, vsRB: 10, vsWR: 10, vsTE: 11 },
  CAR: { vsQB: 30, vsRB: 31, vsWR: 31, vsTE: 29 },
  CHI: { vsQB: 16, vsRB: 14, vsWR: 17, vsTE: 15 },
};

interface ScheduleMatch {
  opp: string;
  isHome: boolean;
  time: string;
}

export const weeklySchedule: Record<string, ScheduleMatch> = {
  IND: { opp: 'HOU', isHome: false, time: 'Thu 8:15 PM' },
  HOU: { opp: 'IND', isHome: true, time: 'Thu 8:15 PM' },
  MIA: { opp: 'BUF', isHome: false, time: 'Sun 1:00 PM' },
  BUF: { opp: 'MIA', isHome: true, time: 'Sun 1:00 PM' },
  BAL: { opp: 'CAR', isHome: false, time: 'Sun 1:00 PM' },
  CAR: { opp: 'BAL', isHome: true, time: 'Sun 1:00 PM' },
  NO: { opp: 'CHI', isHome: false, time: 'Sun 1:00 PM' },
  CHI: { opp: 'NO', isHome: true, time: 'Sun 1:00 PM' },
  TEN: { opp: 'DAL', isHome: false, time: 'Sun 1:00 PM' },
  DAL: { opp: 'TEN', isHome: true, time: 'Sun 1:00 PM' },
  TB: { opp: 'DET', isHome: false, time: 'Sun 1:00 PM' },
  DET: { opp: 'TB', isHome: true, time: 'Sun 1:00 PM' },
  ARI: { opp: 'KC', isHome: false, time: 'Sun 1:00 PM' },
  KC: { opp: 'ARI', isHome: true, time: 'Sun 1:00 PM' },
  PIT: { opp: 'PHI', isHome: false, time: 'Sun 1:00 PM' },
  PHI: { opp: 'PIT', isHome: true, time: 'Sun 1:00 PM' },
  NYJ: { opp: 'LAC', isHome: false, time: 'Sun 4:05 PM' },
  LAC: { opp: 'NYJ', isHome: true, time: 'Sun 4:05 PM' },
  JAX: { opp: 'NYG', isHome: false, time: 'Sun 4:25 PM' },
  NYG: { opp: 'JAX', isHome: true, time: 'Sun 4:25 PM' },
  LV: { opp: 'DEN', isHome: false, time: 'Sun 4:25 PM' },
  DEN: { opp: 'LV', isHome: true, time: 'Sun 4:25 PM' },
  MIN: { opp: 'SF', isHome: false, time: 'Sun 8:20 PM' },
  SF: { opp: 'MIN', isHome: true, time: 'Sun 8:20 PM' },
  CIN: { opp: 'WAS', isHome: false, time: 'Mon 8:15 PM' },
  WAS: { opp: 'CIN', isHome: true, time: 'Mon 8:15 PM' },
  NE: { opp: 'ATL', isHome: true, time: 'Sun 1:00 PM' },
  ATL: { opp: 'NE', isHome: false, time: 'Sun 1:00 PM' },
  SEA: { opp: 'LAR', isHome: true, time: 'Sun 4:05 PM' },
  LAR: { opp: 'SEA', isHome: false, time: 'Sun 4:05 PM' },
  GB: { opp: 'DET', isHome: true, time: 'Sun 1:00 PM' },
  CLE: { opp: 'CIN', isHome: true, time: 'Sun 1:00 PM' },
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function convertPointsToSalary(
  position: Position,
  projectedPoints: number,
  playerName: string
): number {
  const uniqueOffset = (hashCode(playerName) % 8) * 10;

  if (position === 'DEF') {
    const defBase = 2400 + projectedPoints * 260 + uniqueOffset;
    return Math.min(Math.max(Math.round(defBase / 10) * 10, 2800), 5500);
  }

  let floor = 3500;
  let perPointRate = 220;

  if (position === 'QB') {
    floor = 4000;
    perPointRate = 195;
  } else if (position === 'RB') {
    floor = 3600;
    perPointRate = 245;
  } else if (position === 'WR') {
    floor = 3500;
    perPointRate = 240;
  } else if (position === 'TE') {
    floor = 3300;
    perPointRate = 250;
  }

  const rawSalary = floor + projectedPoints * perPointRate + uniqueOffset;
  const finalSalary = Math.round(rawSalary / 10) * 10;

  return Math.min(Math.max(finalSalary, 3200), 9200);
}

interface RawPlayer {
  name: string;
  pos: Position;
  team: string;
  baseProj: number;
  posRank: number;
}

const RAW_SKILL_DATABASE: RawPlayer[] = [
  // Quarterbacks
  { name: 'Josh Allen', pos: 'QB', team: 'BUF', baseProj: 22.4, posRank: 1 },
  { name: 'Lamar Jackson', pos: 'QB', team: 'BAL', baseProj: 21.1, posRank: 2 },
  { name: 'Patrick Mahomes', pos: 'QB', team: 'KC', baseProj: 20.8, posRank: 3 },
  { name: 'Jalen Hurts', pos: 'QB', team: 'PHI', baseProj: 20.4, posRank: 4 },
  { name: 'Joe Burrow', pos: 'QB', team: 'CIN', baseProj: 19.7, posRank: 5 },
  { name: 'Jayden Daniels', pos: 'QB', team: 'WAS', baseProj: 19.2, posRank: 6 },
  { name: 'Jared Goff', pos: 'QB', team: 'DET', baseProj: 17.9, posRank: 7 },
  { name: 'C.J. Stroud', pos: 'QB', team: 'HOU', baseProj: 17.4, posRank: 8 },
  { name: 'Baker Mayfield', pos: 'QB', team: 'TB', baseProj: 16.9, posRank: 9 },
  { name: 'Jordan Love', pos: 'QB', team: 'GB', baseProj: 16.5, posRank: 10 },
  { name: 'Justin Herbert', pos: 'QB', team: 'LAC', baseProj: 15.8, posRank: 11 },
  { name: 'Bo Nix', pos: 'QB', team: 'DEN', baseProj: 15.1, posRank: 12 },

  // Running Backs
  { name: 'Christian McCaffrey', pos: 'RB', team: 'SF', baseProj: 19.4, posRank: 1 },
  { name: 'Bijan Robinson', pos: 'RB', team: 'ATL', baseProj: 18.2, posRank: 2 },
  { name: 'Saquon Barkley', pos: 'RB', team: 'PHI', baseProj: 17.8, posRank: 3 },
  { name: 'Jahmyr Gibbs', pos: 'RB', team: 'DET', baseProj: 17.3, posRank: 4 },
  { name: 'Derrick Henry', pos: 'RB', team: 'BAL', baseProj: 16.9, posRank: 5 },
  { name: 'Kyren Williams', pos: 'RB', team: 'LAR', baseProj: 16.2, posRank: 6 },
  { name: 'Jonathan Taylor', pos: 'RB', team: 'IND', baseProj: 15.7, posRank: 7 },
  { name: 'De’Von Achane', pos: 'RB', team: 'MIA', baseProj: 15.4, posRank: 8 },
  { name: 'Breece Hall', pos: 'RB', team: 'NYJ', baseProj: 14.9, posRank: 9 },
  { name: 'Josh Jacobs', pos: 'RB', team: 'GB', baseProj: 14.3, posRank: 10 },
  { name: 'James Cook', pos: 'RB', team: 'BUF', baseProj: 13.8, posRank: 11 },
  { name: 'Kenneth Walker III', pos: 'RB', team: 'SEA', baseProj: 13.4, posRank: 12 },
  { name: 'Alvin Kamara', pos: 'RB', team: 'NO', baseProj: 12.9, posRank: 13 },
  { name: 'Chase Brown', pos: 'RB', team: 'CIN', baseProj: 12.4, posRank: 14 },
  { name: 'Chuba Hubbard', pos: 'RB', team: 'CAR', baseProj: 11.6, posRank: 15 },
  { name: 'Rhamondre Stevenson', pos: 'RB', team: 'NE', baseProj: 10.9, posRank: 16 },

  // Wide Receivers
  { name: 'CeeDee Lamb', pos: 'WR', team: 'DAL', baseProj: 19.5, posRank: 1 },
  { name: 'Ja’Marr Chase', pos: 'WR', team: 'CIN', baseProj: 19.0, posRank: 2 },
  { name: 'Justin Jefferson', pos: 'WR', team: 'MIN', baseProj: 18.4, posRank: 3 },
  { name: 'Amon-Ra St. Brown', pos: 'WR', team: 'DET', baseProj: 17.6, posRank: 4 },
  { name: 'Tyreek Hill', pos: 'WR', team: 'MIA', baseProj: 16.8, posRank: 5 },
  { name: 'A.J. Brown', pos: 'WR', team: 'PHI', baseProj: 16.4, posRank: 6 },
  { name: 'Nico Collins', pos: 'WR', team: 'HOU', baseProj: 15.9, posRank: 7 },
  { name: 'Puka Nacua', pos: 'WR', team: 'LAR', baseProj: 15.5, posRank: 8 },
  { name: 'Malik Nabers', pos: 'WR', team: 'NYG', baseProj: 14.8, posRank: 9 },
  { name: 'Drake London', pos: 'WR', team: 'ATL', baseProj: 14.3, posRank: 10 },
  { name: 'Garrett Wilson', pos: 'WR', team: 'NYJ', baseProj: 13.9, posRank: 11 },
  { name: 'Terry McLaurin', pos: 'WR', team: 'WAS', baseProj: 13.4, posRank: 12 },
  { name: 'Jaxon Smith-Njigba', pos: 'WR', team: 'SEA', baseProj: 12.9, posRank: 13 },
  { name: 'Tee Higgins', pos: 'WR', team: 'CIN', baseProj: 12.5, posRank: 14 },
  { name: 'Brian Thomas Jr.', pos: 'WR', team: 'JAX', baseProj: 12.1, posRank: 15 },
  { name: 'Ladd McConkey', pos: 'WR', team: 'LAC', baseProj: 11.7, posRank: 16 },
  { name: 'Zay Flowers', pos: 'WR', team: 'BAL', baseProj: 11.2, posRank: 17 },
  { name: 'DJ Moore', pos: 'WR', team: 'CHI', baseProj: 10.7, posRank: 18 },

  // Tight Ends
  { name: 'Brock Bowers', pos: 'TE', team: 'LV', baseProj: 13.5, posRank: 1 },
  { name: 'Travis Kelce', pos: 'TE', team: 'KC', baseProj: 12.8, posRank: 2 },
  { name: 'Trey McBride', pos: 'TE', team: 'ARI', baseProj: 12.4, posRank: 3 },
  { name: 'George Kittle', pos: 'TE', team: 'SF', baseProj: 12.0, posRank: 4 },
  { name: 'Sam LaPorta', pos: 'TE', team: 'DET', baseProj: 10.6, posRank: 5 },
  { name: 'David Njoku', pos: 'TE', team: 'CLE', baseProj: 9.8, posRank: 6 },
  { name: 'Mark Andrews', pos: 'TE', team: 'BAL', baseProj: 9.4, posRank: 7 },
  { name: 'Jake Ferguson', pos: 'TE', team: 'DAL', baseProj: 8.9, posRank: 8 },
  { name: 'Evan Engram', pos: 'TE', team: 'JAX', baseProj: 8.5, posRank: 9 },
  { name: 'Cole Kmet', pos: 'TE', team: 'CHI', baseProj: 7.9, posRank: 10 },
];

export function buildPlayerPool(): Player[] {
  const allRaw: RawPlayer[] = [...RAW_SKILL_DATABASE];

  const teamCodes = Object.keys(weeklySchedule);
  teamCodes.forEach((teamCode, index) => {
    const rank = index + 1;
    allRaw.push({
      name: `${teamCode} Defense`,
      pos: 'DEF',
      team: teamCode,
      baseProj: parseFloat((8.5 - index * 0.15).toFixed(1)),
      posRank: rank,
    });
  });

  return allRaw.map((p) => {
    const match = weeklySchedule[p.team];
    const oppCode = match?.opp ?? 'OPP';
    const oppTag = match
      ? `${match.isHome ? 'vs' : '@'} ${match.opp} (${match.time})`
      : 'vs OPP (Sun 1:00 PM)';

    const defRanks =
      oppCode && defensiveMatchupRatings[oppCode]
        ? defensiveMatchupRatings[oppCode]
        : { vsQB: 16, vsRB: 16, vsWR: 16, vsTE: 16 };

    const defRankMetric =
      p.pos === 'QB'
        ? defRanks.vsQB
        : p.pos === 'RB'
          ? defRanks.vsRB
          : p.pos === 'WR'
            ? defRanks.vsWR
            : p.pos === 'TE'
              ? defRanks.vsTE
              : 16;

    const matchupTier: MatchupTier =
      defRankMetric >= 22 ? 'Favorable' : defRankMetric <= 10 ? 'Tough' : 'Neutral';

    const salary = convertPointsToSalary(p.pos, p.baseProj, p.name);

    return {
      ...p,
      proj: p.baseProj,
      salary,
      opponent: oppTag,
      oppCode,
      matchupTier,
      defRankMetric,
    };
  });
}

export const INITIAL_ROSTER_TEMPLATE: Omit<RosterSlot, 'player'>[] = [
  { id: 'QB', label: 'Quarterback', shortLabel: 'QB', eligiblePositions: ['QB'] },
  { id: 'RB1', label: 'Running Back 1', shortLabel: 'RB1', eligiblePositions: ['RB'] },
  { id: 'RB2', label: 'Running Back 2', shortLabel: 'RB2', eligiblePositions: ['RB'] },
  { id: 'WR1', label: 'Wide Receiver 1', shortLabel: 'WR1', eligiblePositions: ['WR'] },
  { id: 'WR2', label: 'Wide Receiver 2', shortLabel: 'WR2', eligiblePositions: ['WR'] },
  { id: 'WR3', label: 'Wide Receiver 3', shortLabel: 'WR3', eligiblePositions: ['WR'] },
  { id: 'TE', label: 'Tight End', shortLabel: 'TE', eligiblePositions: ['TE'] },
  { id: 'FLEX', label: 'Flex (RB/WR/TE)', shortLabel: 'FLEX', eligiblePositions: ['RB', 'WR', 'TE'] },
  { id: 'DEF', label: 'Defense / ST', shortLabel: 'DEF', eligiblePositions: ['DEF'] },
];

export function createEmptyRoster(): RosterSlot[] {
  return INITIAL_ROSTER_TEMPLATE.map((slot) => ({ ...slot, player: null }));
}

export function computeOptimalLineup(pool: Player[]): RosterSlot[] {
  const qbs = pool.filter((p) => p.pos === 'QB').sort((a, b) => b.proj / b.salary - a.proj / a.salary);
  const rbs = pool.filter((p) => p.pos === 'RB').sort((a, b) => b.proj / b.salary - a.proj / a.salary);
  const wrs = pool.filter((p) => p.pos === 'WR').sort((a, b) => b.proj / b.salary - a.proj / a.salary);
  const tes = pool.filter((p) => p.pos === 'TE').sort((a, b) => b.proj / b.salary - a.proj / a.salary);
  const defs = pool.filter((p) => p.pos === 'DEF').sort((a, b) => b.proj / b.salary - a.proj / a.salary);

  const draftedNames = new Set<string>();

  function pickBalanced(candidates: Player[]): Player | null {
    // Prefer strong mid-to-high value players first, ensuring unique selection
    for (const p of candidates) {
      if (!draftedNames.has(p.name)) {
        draftedNames.add(p.name);
        return { ...p };
      }
    }
    return null;
  }

  const slotPools: Record<SlotId, Player[]> = {
    QB: qbs,
    RB1: rbs,
    RB2: rbs,
    WR1: wrs,
    WR2: wrs,
    WR3: wrs,
    TE: tes,
    FLEX: [...rbs, ...wrs, ...tes].sort((a, b) => b.proj / b.salary - a.proj / a.salary),
    DEF: defs,
  };

  const slots: RosterSlot[] = INITIAL_ROSTER_TEMPLATE.map((tpl) => ({
    ...tpl,
    player: pickBalanced(slotPools[tpl.id]),
  }));

  let totalSalary = slots.reduce((sum, s) => sum + (s.player ? s.player.salary : 0), 0);

  let guard = 0;
  while (totalSalary > SALARY_CAP && guard < 400) {
    guard++;
    const filled = slots
      .filter((s) => s.player !== null)
      .sort((a, b) => (b.player?.salary ?? 0) - (a.player?.salary ?? 0));

    let downgraded = false;
    for (const targetSlot of filled) {
      if (!targetSlot.player) continue;
      const eligiblePool = slotPools[targetSlot.id];
      const cheaper = eligiblePool
        .filter((p) => p.salary < targetSlot.player!.salary && !draftedNames.has(p.name))
        .sort((a, b) => b.proj - a.proj)[0];

      if (cheaper) {
        draftedNames.delete(targetSlot.player.name);
        draftedNames.add(cheaper.name);
        targetSlot.player = { ...cheaper };
        downgraded = true;
        break;
      }
    }

    if (!downgraded) break;
    totalSalary = slots.reduce((sum, s) => sum + (s.player ? s.player.salary : 0), 0);
  }

  return slots;
}

export function buildOpponentLineup(pool: Player[]): Record<SlotId, { name: string; team: string; proj: number }> {
  const pick = (pos: Position, idx: number) => {
    const list = pool.filter((p) => p.pos === pos);
    const chosen = list[Math.min(idx, list.length - 1)];
    return { name: chosen.name, team: chosen.team, proj: chosen.baseProj };
  };

  return {
    QB: pick('QB', 3),
    RB1: pick('RB', 4),
    RB2: pick('RB', 7),
    WR1: pick('WR', 3),
    WR2: pick('WR', 6),
    WR3: pick('WR', 10),
    TE: pick('TE', 2),
    FLEX: pick('WR', 8),
    DEF: pick('DEF', 5),
  };
}
