import { useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import type { Player, Position, RosterSlot } from '../types/fantasy';

interface MarketTabProps {
  playerPool: Player[];
  rosterSlots: RosterSlot[];
  onDraftFromMarket: (player: Player) => void;
  onOpenBioModal: (playerName: string) => void;
}

const POS_FILTERS: ('ALL' | Position)[] = ['ALL', 'QB', 'RB', 'WR', 'TE', 'DEF'];

export function MarketTab({
  playerPool,
  rosterSlots,
  onDraftFromMarket,
  onOpenBioModal,
}: MarketTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<'ALL' | Position>('ALL');

  const rosteredNames = new Set(
    rosterSlots.filter((s) => s.player !== null).map((s) => s.player!.name.toLowerCase())
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPlayers = playerPool.filter((p) => {
    const matchesSearch =
      normalizedQuery === '' ||
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.team.toLowerCase().includes(normalizedQuery) ||
      p.opponent.toLowerCase().includes(normalizedQuery);
    const matchesPos = posFilter === 'ALL' || p.pos === posFilter;
    return matchesSearch && matchesPos;
  });

  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player, team, or opponent..."
            aria-label="Search player pool"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by position"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto"
        >
          {POS_FILTERS.map((pos) => {
            const isActive = posFilter === pos;
            return (
              <button
                key={pos}
                type="button"
                onClick={() => setPosFilter(pos)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pos === 'ALL' ? 'All' : pos}
              </button>
            );
          })}
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="py-14 px-6 text-center space-y-3">
          <p className="text-sm font-medium text-slate-600">
            No players match your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setPosFilter('ALL');
            }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-4">Player · Matchup & Kickoff</th>
                <th className="py-3 px-4">Pos</th>
                <th className="py-3 px-4">Matchup</th>
                <th className="py-3 px-4 text-right">Salary</th>
                <th className="py-3 px-4 text-right">Projected</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPlayers.map((p) => {
                const isRostered = rosteredNames.has(p.name.toLowerCase());
                return (
                  <tr key={p.name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-6 font-mono tabular-nums text-xs font-semibold text-slate-500">
                      #{p.posRank}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onOpenBioModal(p.name)}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
                      >
                        {p.name}
                      </button>
                      <div className="text-xs text-slate-500">
                        {p.team} · {p.opponent}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">
                      {p.pos}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold ${
                          p.matchupTier === 'Favorable'
                            ? 'text-emerald-700'
                            : p.matchupTier === 'Tough'
                              ? 'text-amber-700'
                              : 'text-slate-600'
                        }`}
                      >
                        {p.matchupTier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                      ${p.salary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-blue-600">
                      {p.proj.toFixed(1)}
                    </td>
                    <td className="py-3 px-6 text-right">
                      {isRostered ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          Rostered
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDraftFromMarket(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Draft</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
