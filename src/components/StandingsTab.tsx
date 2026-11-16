import { RefreshCw } from 'lucide-react';
import type { LeagueTeam, StandingEntry } from '../types/fantasy';

interface StandingsTabProps {
  standings: StandingEntry[];
  registeredTeams: LeagueTeam[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function StandingsTab({
  standings,
  registeredTeams,
  isLoading,
  onRefresh,
}: StandingsTabProps) {
  const rows: StandingEntry[] =
    standings.length > 0
      ? standings
      : registeredTeams.map((t) => ({
          team_name: t.team,
          manager_name: t.owner,
          wins: 0,
          losses: 0,
          points_for: 0,
        }));

  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Blue Eighty League Standings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly head-to-head records and total points scored across registered franchises.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 shrink-0 ${isLoading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <span>{isLoading ? 'Refreshing...' : 'Refresh Standings'}</span>
        </button>
      </div>

      {isLoading && rows.length === 0 ? (
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between animate-pulse">
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="py-14 px-6 text-center text-sm text-slate-500">
          No registered teams found in the league yet. Register a franchise in Team Sign-Up to
          populate standings.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-4">Team & Manager</th>
                <th className="py-3 px-4 text-center">Record (W-L)</th>
                <th className="py-3 px-6 text-right">Total Points For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.map((entry, idx) => (
                <tr key={`${entry.team_name}-${idx}`} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-mono tabular-nums font-bold text-blue-600">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{entry.team_name}</p>
                    <p className="text-xs text-slate-500">Manager: {entry.manager_name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums font-semibold text-slate-800">
                    {entry.wins} - {entry.losses}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono tabular-nums font-bold text-blue-600">
                    {Number(entry.points_for).toFixed(1)} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
