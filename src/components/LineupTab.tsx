import { ArrowLeftRight, Plus, RotateCcw, ShieldAlert, Wand2 } from 'lucide-react';
import { SALARY_CAP } from '../data/nflSlate';
import type { RosterSlot, SlotId } from '../types/fantasy';

interface LineupTabProps {
  rosterSlots: RosterSlot[];
  onOpenSwapModal: (slotId: SlotId, slotIndex: number) => void;
  onOpenBioModal: (playerName: string) => void;
  onAutoFill: () => void;
  onResetLineup: () => void;
}

export function LineupTab({
  rosterSlots,
  onOpenSwapModal,
  onOpenBioModal,
  onAutoFill,
  onResetLineup,
}: LineupTabProps) {
  let totalSpent = 0;
  let totalProj = 0;
  let emptySlots = 0;

  rosterSlots.forEach((slot) => {
    if (slot.player) {
      // Q1 Injury Shield refunds the injured player's salary cap and wipes Q1 points
      if (slot.player.injuredQ1) {
        totalSpent += 0;
        totalProj += 0;
      } else {
        totalSpent += slot.player.salary;
        totalProj += slot.player.proj + (slot.player.liveBonus ?? 0);
      }
    } else {
      emptySlots++;
    }
  });

  const remaining = SALARY_CAP - totalSpent;
  const avgRemaining = emptySlots > 0 ? Math.round(remaining / emptySlots) : 0;
  const efficiency = totalSpent > 0 ? (totalProj / (totalSpent / 1000)).toFixed(2) : '0.00';
  const capUtilizationPct = Math.min(Math.max((totalSpent / SALARY_CAP) * 100, 0), 100);
  const injuredSlotIndex = rosterSlots.findIndex((s) => s.player?.injuredQ1);
  const injuredSlot = injuredSlotIndex >= 0 ? rosterSlots[injuredSlotIndex] : null;

  return (
    <div className="space-y-6">
      {/* Salary Cap Vault & Projection Overview */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 text-balance">
              Salary Cap Vault & Lineup Projection
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              9 Active Starters · $60,000 Weekly Cap · Q1 Injury Shield™ Protection
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onAutoFill}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <Wand2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Auto-Fill Optimal</span>
            </button>
            <button
              type="button"
              onClick={onResetLineup}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Reset Lineup</span>
            </button>
          </div>
        </div>

        {/* 4-column metric strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-slate-500">Cap Remaining</p>
            <p
              className={`text-2xl font-extrabold font-mono tabular-nums mt-1 ${
                remaining < 0 ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              ${remaining.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Avg / Open Slot</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
              ${avgRemaining.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Projected Total</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-blue-600 mt-1">
              {totalProj.toFixed(1)} pts
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Cap Efficiency</p>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-emerald-700 mt-1">
              {efficiency} pts/$1k
            </p>
          </div>
        </div>

        {/* Cap utilization bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Cap Used:{' '}
              <strong className="font-mono tabular-nums text-slate-900">
                ${totalSpent.toLocaleString()}
              </strong>{' '}
              of $60,000
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {capUtilizationPct.toFixed(0)}% allocated
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                remaining < 0 ? 'bg-red-600' : 'bg-blue-600'
              }`}
              style={{ width: `${capUtilizationPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Q1 Injury Shield Alert Banner */}
      {injuredSlot && injuredSlot.player && (
        <section
          role="alert"
          className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Q1 Injury Shield™ Activated · {injuredSlot.player.name} ({injuredSlot.id})
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Sustained Q1 injury. ${injuredSlot.player.salary.toLocaleString()} salary cap refunded
                and Q1 points wiped to 0.0. Swap a healthy replacement immediately.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenSwapModal(injuredSlot.id, injuredSlotIndex)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Swap Replacement</span>
          </button>
        </section>
      )}

      {/* Active Starting Lineup */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Active Starting Lineup</h3>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {rosterSlots.filter((s) => s.player !== null).length} / 9 Filled
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {rosterSlots.map((slot, index) => {
            const p = slot.player;
            const isInjured = Boolean(p?.injuredQ1);
            const liveProj = p ? (isInjured ? 0 : p.proj + (p.liveBonus ?? 0)) : 0;

            return (
              <div
                key={slot.id}
                className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <span className="w-12 text-xs font-bold font-mono text-slate-500 shrink-0 pt-0.5 sm:pt-0">
                    {slot.shortLabel}
                  </span>

                  {p ? (
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <button
                          type="button"
                          onClick={() => onOpenBioModal(p.name)}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors text-left truncate"
                        >
                          {p.name}
                        </button>
                        <span className="text-xs text-slate-500">
                          {p.pos} · {p.team} {p.opponent}
                        </span>
                        <span aria-hidden="true" className="text-slate-300 text-xs">
                          ·
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            p.matchupTier === 'Favorable'
                              ? 'text-emerald-700'
                              : p.matchupTier === 'Tough'
                                ? 'text-amber-700'
                                : 'text-slate-600'
                          }`}
                        >
                          {p.matchupTier} Matchup
                        </span>
                        {isInjured && (
                          <>
                            <span aria-hidden="true" className="text-slate-300 text-xs">
                              ·
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              Q1 Injured (Cap Refunded)
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono tabular-nums">
                        <span>
                          Salary:{' '}
                          <strong className={isInjured ? 'line-through text-slate-400' : 'text-slate-800'}>
                            ${p.salary.toLocaleString()}
                          </strong>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span>
                          Proj:{' '}
                          <strong className={isInjured ? 'text-red-600' : 'text-blue-600'}>
                            {liveProj.toFixed(1)} pts
                          </strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">
                      Empty {slot.label} slot
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => onOpenSwapModal(slot.id, index)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      isInjured
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : p
                          ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-blue-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {p ? (
                      <>
                        <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{isInjured ? 'Q1 Swap' : 'Swap'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Add Player</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
