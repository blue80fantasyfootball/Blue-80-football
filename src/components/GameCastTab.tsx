import { Play, Radio } from 'lucide-react';
import type { PlayEvent, RosterSlot, SlotId } from '../types/fantasy';

interface GameCastTabProps {
  currentWeek: number;
  rosterSlots: RosterSlot[];
  opponentLineup: Record<SlotId, { name: string; team: string; proj: number }>;
  opponentLiveBonus: number;
  playEvents: PlayEvent[];
  onSimulateLivePlay: () => void;
  onOpenBioModal: (playerName: string) => void;
}

export function GameCastTab({
  currentWeek,
  rosterSlots,
  opponentLineup,
  opponentLiveBonus,
  playEvents,
  onSimulateLivePlay,
  onOpenBioModal,
}: GameCastTabProps) {
  const userScore = rosterSlots.reduce((sum, s) => {
    if (!s.player || s.player.injuredQ1) return sum;
    return sum + s.player.proj + (s.player.liveBonus ?? 0);
  }, 0);

  const oppBaseTotal = Object.values(opponentLineup).reduce((sum, p) => sum + p.proj, 0);
  const oppScore = oppBaseTotal + opponentLiveBonus;

  const totalCombined = userScore + oppScore;
  const userWinProb =
    totalCombined > 0
      ? Math.min(Math.max(Math.round((userScore / totalCombined) * 100), 5), 95)
      : 50;
  const oppWinProb = 100 - userWinProb;

  return (
    <div className="space-y-6">
      {/* Matchup Header & Scoreboard */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-blue-600">
              Week {currentWeek} Head-to-Head Matchup
            </p>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 text-balance">
              Blue Eighty Legends vs. Apex Gridiron Club
            </h2>
          </div>
          <button
            type="button"
            onClick={onSimulateLivePlay}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Play className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Simulate Live Play</span>
          </button>
        </div>

        {/* 3-Column Scoreboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center py-2">
          <div>
            <p className="text-xs font-medium text-slate-500">Your Blue Eighty Score</p>
            <p className="text-4xl font-extrabold font-mono tabular-nums text-blue-600 mt-1">
              {userScore.toFixed(1)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="font-mono tabular-nums">You ({userWinProb}%)</span>
              <span className="text-slate-400">Win Probability</span>
              <span className="font-mono tabular-nums">Opponent ({oppWinProb}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${userWinProb}%` }}
              />
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-medium text-slate-500">Apex Gridiron Club</p>
            <p className="text-4xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
              {oppScore.toFixed(1)}
            </p>
          </div>
        </div>

        {/* RedZone Play Feed */}
        <div className="pt-5 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Radio className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
            <span>RedZone Play-by-Play Feed</span>
          </div>

          {playEvents.length === 0 ? (
            <p className="text-sm text-slate-500">
              Schedule feed and defensive matchup ratings active for Week {currentWeek}. Click
              Simulate Live Play to advance scoring.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {playEvents.slice(0, 5).map((ev) => (
                <div
                  key={ev.id}
                  className="px-4 py-2.5 flex items-center justify-between gap-4 text-sm bg-white"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-semibold text-slate-400 mr-2">
                      {ev.quarter}
                    </span>
                    <span className="text-slate-800">{ev.text}</span>
                  </div>
                  <span
                    className={`font-mono tabular-nums text-xs font-bold shrink-0 ${
                      ev.side === 'user' ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    {ev.side === 'user' ? 'YOU' : 'OPP'} +{ev.pointsDelta.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Positional Head-to-Head Comparison */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Positional Matchup Breakdown</h3>
          <span className="text-xs text-slate-500">9 Starters vs. Opponent</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 px-6">Your Starter</th>
                <th className="py-3 px-4 text-right">Pts</th>
                <th className="py-3 px-4 text-center">Slot</th>
                <th className="py-3 px-4 text-left">Pts</th>
                <th className="py-3 px-6 text-right">Opponent Starter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rosterSlots.map((slot) => {
                const userPlayer = slot.player;
                const oppPlayer = opponentLineup[slot.id];
                const userPts = userPlayer
                  ? userPlayer.injuredQ1
                    ? 0
                    : userPlayer.proj + (userPlayer.liveBonus ?? 0)
                  : 0;

                return (
                  <tr key={slot.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-6">
                      {userPlayer ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => onOpenBioModal(userPlayer.name)}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
                          >
                            {userPlayer.name}
                          </button>
                          <div className="text-xs text-slate-500">
                            {userPlayer.team} · {userPlayer.opponent}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Empty</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-blue-600">
                      {userPts.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs font-bold text-slate-500">
                      {slot.shortLabel}
                    </td>
                    <td className="py-3 px-4 text-left font-mono tabular-nums font-bold text-slate-700">
                      {oppPlayer.proj.toFixed(1)}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenBioModal(oppPlayer.name)}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {oppPlayer.name}
                      </button>
                      <div className="text-xs text-slate-500">{oppPlayer.team}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
