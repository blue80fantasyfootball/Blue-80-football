import { useState, type FormEvent } from 'react';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { MAX_LEAGUE_TEAMS } from '../data/nflSlate';
import type { LeagueTeam } from '../types/fantasy';

interface SignUpTabProps {
  registeredTeams: LeagueTeam[];
  onRegisterTeam: (owner: string, teamName: string, email: string) => Promise<{ ok: boolean; error?: string }>;
}

export function SignUpTab({ registeredTeams, onRegisterTeam }: SignUpTabProps) {
  const [owner, setOwner] = useState('');
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const slotsLeft = Math.max(MAX_LEAGUE_TEAMS - registeredTeams.length, 0);
  const isLeagueFull = registeredTeams.length >= MAX_LEAGUE_TEAMS;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (isLeagueFull) {
      setFormError('League is currently full (12/12 teams registered).');
      return;
    }

    const cleanOwner = owner.trim();
    const cleanTeam = teamName.trim();
    const cleanEmail = email.trim();

    if (!cleanOwner || !cleanTeam || !cleanEmail) {
      setFormError('Please fill in all required registration fields.');
      return;
    }

    if (registeredTeams.some((t) => t.team.toLowerCase() === cleanTeam.toLowerCase())) {
      setFormError('That team name is already taken. Please choose another.');
      return;
    }

    setIsSubmitting(true);
    const result = await onRegisterTeam(cleanOwner, cleanTeam, cleanEmail);
    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? 'Unable to register team. Please try again.');
      return;
    }

    setOwner('');
    setTeamName('');
    setEmail('');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Registration Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Blue Eighty League Sign-Up</h2>
          <p className="text-xs text-slate-500 mt-1">
            Claim your franchise spot in this 12-team weekly salary cap league.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reg-owner"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Manager Name
            </label>
            <input
              id="reg-owner"
              type="text"
              required
              disabled={isLeagueFull || isSubmitting}
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. Jonathan Davalos"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="reg-team"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Team Name
            </label>
            <input
              id="reg-team"
              type="text"
              required
              disabled={isLeagueFull || isSubmitting}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Blue Eighty Legends"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              disabled={isLeagueFull || isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-60"
            />
          </div>

          {formError && (
            <p role="alert" className="text-xs font-medium text-red-600">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLeagueFull || isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {isLeagueFull
                ? 'League Full (12/12)'
                : isSubmitting
                  ? 'Registering Team...'
                  : `Register Team (${slotsLeft} Slots Remaining)`}
            </span>
          </button>
        </form>
      </section>

      {/* Registered Roster List */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden lg:col-span-2">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Registered League Roster</h3>
          <span className="text-xs font-mono tabular-nums font-semibold text-slate-600">
            {registeredTeams.length} / {MAX_LEAGUE_TEAMS} Claimed
          </span>
        </div>

        {registeredTeams.length === 0 ? (
          <div className="py-14 px-6 text-center text-sm text-slate-500">
            No teams registered yet. Submit the form to claim the first league slot.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {registeredTeams.map((team, idx) => (
              <div
                key={`${team.team}-${idx}`}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-6 text-xs font-mono tabular-nums font-bold text-slate-400 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{team.team}</p>
                    <p className="text-xs text-slate-500 truncate">
                      Manager: {team.owner} · {team.email}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
