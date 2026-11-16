import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { SALARY_CAP } from '../data/nflSlate';
import type { Player, RosterSlot } from '../types/fantasy';

interface PlayerSwapModalProps {
  slot: RosterSlot | null;
  slotIndex: number;
  rosterSlots: RosterSlot[];
  playerPool: Player[];
  onClose: () => void;
  onConfirmSwap: (player: Player, slotIndex: number) => void;
  onOpenBioModal: (playerName: string) => void;
}

export function PlayerSwapModal({
  slot,
  slotIndex,
  rosterSlots,
  playerPool,
  onClose,
  onConfirmSwap,
  onOpenBioModal,
}: PlayerSwapModalProps) {
  const [query, setQuery] = useState('');

  if (!slot) return null;

  // Calculate current cap spent excluding the target slot (and excluding Q1-injured slots)
  const spentExcludingTarget = rosterSlots.reduce((sum, s, idx) => {
    if (idx === slotIndex || !s.player || s.player.injuredQ1) return sum;
    return sum + s.player.salary;
  }, 0);

  const availableBudgetForSlot = SALARY_CAP - spentExcludingTarget;
  const normalizedQuery = query.trim().toLowerCase();

  const rosteredElsewhere = new Set(
    rosterSlots
      .filter((s, idx) => idx !== slotIndex && s.player !== null)
      .map((s) => s.player!.name.toLowerCase())
  );

  const eligiblePlayers = playerPool.filter((p) => {
    const matchesPos = slot.eligiblePositions.includes(p.pos);
    const matchesQuery =
      normalizedQuery === '' ||
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.team.toLowerCase().includes(normalizedQuery);
    return matchesPos && matchesQuery;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h3 id="swap-modal-title" className="text-base font-bold text-slate-900">
              Select Player · {slot.label} ({slot.shortLabel})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
              Available Cap Budget for Slot: ${availableBudgetForSlot.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close player selection modal"
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search eligible ${slot.eligiblePositions.join('/')} players...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-y-auto divide-y divide-slate-100">
          {eligiblePlayers.length === 0 ? (
            <div className="py-10 px-6 text-center text-sm text-slate-500">
              No eligible players match your search.
            </div>
          ) : (
            eligiblePlayers.map((p) => {
              const isDuplicate = rosteredElsewhere.has(p.name.toLowerCase());
              const exceedsCap = p.salary > availableBudgetForSlot;

              return (
                <div
                  key={p.name}
                  className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 text-xs font-mono tabular-nums font-bold text-slate-400 shrink-0">
                      #{p.posRank}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenBioModal(p.name)}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                        >
                          {p.name}
                        </button>
                        <span className="text-xs text-slate-500">
                          {p.pos} · {p.team} {p.opponent}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        <span
                          className={
                            p.matchupTier === 'Favorable'
                              ? 'text-emerald-700 font-sans font-semibold'
                              : p.matchupTier === 'Tough'
                                ? 'text-amber-700 font-sans font-semibold'
                                : 'text-slate-600 font-sans font-semibold'
                          }
                        >
                          {p.matchupTier}
                        </span>{' '}
                        ·{' '}
                        <strong className={exceedsCap ? 'text-red-600' : 'text-slate-800'}>
                          ${p.salary.toLocaleString()}
                        </strong>{' '}
                        · {p.proj.toFixed(1)} pts
                        {exceedsCap && (
                          <span className="text-red-600 font-sans font-medium ml-1.5">
                            (+$
                            {(p.salary - availableBudgetForSlot).toLocaleString()} over cap)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isDuplicate}
                    onClick={() => onConfirmSwap(p, slotIndex)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      isDuplicate
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isDuplicate ? 'Rostered' : 'Draft'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
