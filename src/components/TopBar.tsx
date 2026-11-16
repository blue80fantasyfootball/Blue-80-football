import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { MAX_LEAGUE_TEAMS } from '../data/nflSlate';
import type { TabId } from '../types/fantasy';

interface TopBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentWeek: number;
  teamCount: number;
  hasQ1Injury: boolean;
  onTriggerQ1Injury: () => void;
  onClearQ1Injury: () => void;
}

const TAB_TITLES: Record<TabId, string> = {
  lineup: 'Weekly Lineup',
  matchup: 'H2H GameCast',
  waivers: 'Player Market',
  signup: 'Team Sign-Up',
  standings: 'Standings',
};

const MOBILE_TABS: { id: TabId; label: string }[] = [
  { id: 'lineup', label: 'Lineup' },
  { id: 'matchup', label: 'GameCast' },
  { id: 'waivers', label: 'Market' },
  { id: 'signup', label: 'Sign-Up' },
  { id: 'standings', label: 'Standings' },
];

export function TopBar({
  activeTab,
  onSelectTab,
  currentWeek,
  teamCount,
  hasQ1Injury,
  onTriggerQ1Injury,
  onClearQ1Injury,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="lg:hidden font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Blue Eighty
          </span>
          <span className="lg:hidden text-slate-300" aria-hidden="true">
            /
          </span>
          <span className="hidden lg:inline text-slate-500 whitespace-nowrap shrink-0">
            Week {currentWeek} Slate
          </span>
          <span className="hidden lg:inline text-slate-300" aria-hidden="true">
            /
          </span>
          <h1 className="font-semibold text-slate-900 truncate">
            {TAB_TITLES[activeTab]}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hasQ1Injury ? (
            <button
              type="button"
              onClick={onClearQ1Injury}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Clear Q1 Shield</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onTriggerQ1Injury}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Simulate Q1 Injury</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation strip */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden border-t border-slate-100 px-4 py-1.5 flex items-center gap-1 overflow-x-auto"
      >
        {MOBILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.id === 'signup' ? `${tab.label} (${teamCount}/${MAX_LEAGUE_TEAMS})` : tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
