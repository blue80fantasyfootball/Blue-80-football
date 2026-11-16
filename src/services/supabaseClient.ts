import { createClient } from '@supabase/supabase-js';
import type { LeagueTeam, StandingEntry } from '../types/fantasy';

const SUPABASE_URL = 'https://uukjaephotywsotgehfa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AZ9pczk-WtriqGaI_ECGFQ_zqqg3hMG';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchTeamsFromSupabase(): Promise<LeagueTeam[]> {
  try {
    const { data, error } = await supabaseClient.from('league_teams').select('*');
    if (error || !data) {
      return [];
    }
    return data.map((row: Record<string, unknown>) => ({
      id: row.id as string | number | undefined,
      owner: String(row.owner ?? ''),
      team: String(row.team_name ?? ''),
      email: String(row.email ?? ''),
      createdAt: row.created_at ? String(row.created_at) : undefined,
    }));
  } catch {
    return [];
  }
}

export async function registerTeamInSupabase(
  owner: string,
  teamName: string,
  email: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabaseClient
      .from('league_teams')
      .insert([{ owner, team_name: teamName, email }]);

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unable to reach league registry.',
    };
  }
}

export async function fetchStandingsFromSupabase(): Promise<{
  standings: StandingEntry[];
  fromDatabase: boolean;
}> {
  try {
    const { data, error } = await supabaseClient
      .from('league_standings')
      .select('*')
      .order('wins', { ascending: false })
      .order('points_for', { ascending: false });

    if (error || !data) {
      return { standings: [], fromDatabase: false };
    }

    return {
      standings: data.map((row: Record<string, unknown>) => ({
        id: row.id as string | number | undefined,
        team_name: String(row.team_name ?? ''),
        manager_name: String(row.manager_name ?? ''),
        wins: Number(row.wins ?? 0),
        losses: Number(row.losses ?? 0),
        points_for: Number(row.points_for ?? 0),
      })),
      fromDatabase: true,
    };
  } catch {
    return { standings: [], fromDatabase: false };
  }
}
