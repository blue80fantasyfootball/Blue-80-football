import { ClipboardList, Radio, Search, Trophy, Users } from 'lucide-react';
import { MAX_LEAGUE_TEAMS, SALARY_CAP } from '../data/nflSlate';
import type { TabId } from '../types/fantasy';

interface SidebarNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentWeek: number;
  teamCount: number;
  remainingCap: number;
}

const NAV_ITEMS: { id: TabId; label: string; icon: typeof ClipboardList }[] = [
  { id: 'lineup', label: 'Weekly Lineup', icon: ClipboardList },
  { id: 'matchup', label: 'H2H GameCast', icon: Radio },
  { id: 'waivers', label: 'Player Market', icon: Search },
  { id: 'signup', label: 'Team Sign-Up', icon: Users },
  { id: 'standings', label: 'Standings', icon: Trophy },
];

export function SidebarNav({
  activeTab,
  onSelectTab,
  currentWeek,
  teamCount,
  remainingCap,
}: SidebarNavProps) {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30">
      <div className="h-16 px-6 flex items-center border-b border-slate-200">
        <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          Blue Eighty
        </span>
      </div>

      <nav aria-label="Primary Navigation" className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </span>
              {item.id === 'signup' && (
                <span
                  className={`font-mono tabular-nums text-xs ${
                    isActive ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {teamCount}/{MAX_LEAGUE_TEAMS}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-5 border-t border-slate-200 space-y-3 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Active Slate</span>
          <span className="font-semibold text-slate-900 tabular-nums">Week {currentWeek}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">League Cap</span>
          <span className="font-mono tabular-nums font-semibold text-slate-900">
            ${SALARY_CAP.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Cap Remaining</span>
          <span
            className={`font-mono tabular-nums font-semibold ${
              remainingCap < 0 ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            ${remainingCap.toLocaleString()}
          </span>
        </div>
        <div className="pt-2 border-t border-slate-100 text-slate-500">
          Q1 Injury Shield™ · Supabase Synced
        </div>
      </div>
    </aside>
  );
}
