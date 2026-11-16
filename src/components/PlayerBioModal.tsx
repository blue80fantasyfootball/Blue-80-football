import { X } from 'lucide-react';
import type { Player } from '../types/fantasy';

interface PlayerBioModalProps {
  player: Player | null;
  onClose: () => void;
}

export function PlayerBioModal({ player, onClose }: PlayerBioModalProps) {
  if (!player) return null;

  const valuePer1k = player.salary > 0 ? (player.proj / (player.salary / 1000)).toFixed(2) : '0.00';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bio-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-mono font-semibold text-blue-600">
              {player.team} · {player.pos} Rank #{player.posRank}
            </p>
            <h3 id="bio-modal-title" className="text-lg font-extrabold text-slate-900 mt-0.5">
              {player.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close player profile"
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <dl className="divide-y divide-slate-100 text-sm">
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-slate-500">Matchup & Kickoff</dt>
            <dd className="font-semibold text-slate-900">{player.opponent}</dd>
          </div>
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-slate-500">Defensive Rating</dt>
            <dd
              className={`font-semibold ${
                player.matchupTier === 'Favorable'
                  ? 'text-emerald-700'
                  : player.matchupTier === 'Tough'
                    ? 'text-amber-700'
                    : 'text-slate-700'
              }`}
            >
              {player.matchupTier} (Rank {player.defRankMetric}/32)
            </dd>
          </div>
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-slate-500">Projected Points</dt>
            <dd className="font-mono tabular-nums font-bold text-blue-600">
              {(player.injuredQ1 ? 0 : player.proj + (player.liveBonus ?? 0)).toFixed(1)} pts
            </dd>
          </div>
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-slate-500">Salary Cap Tag</dt>
            <dd className="font-mono tabular-nums font-bold text-slate-900">
              ${player.salary.toLocaleString()}
            </dd>
          </div>
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-slate-500">Cap Efficiency</dt>
            <dd className="font-mono tabular-nums font-semibold text-slate-800">
              {valuePer1k} pts / $1k
            </dd>
          </div>
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-slate-500">Roster Status</dt>
            <dd
              className={`font-semibold ${
                player.injuredQ1 ? 'text-red-700' : 'text-emerald-700'
              }`}
            >
              {player.injuredQ1 ? 'Q1 Injury Shield Activated' : 'Healthy (Active)'}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}
