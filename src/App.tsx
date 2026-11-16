import { useCallback, useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { GameCastTab } from './components/GameCastTab';
import { LineupTab } from './components/LineupTab';
import { MarketTab } from './components/MarketTab';
import { PlayerBioModal } from './components/PlayerBioModal';
import { PlayerSwapModal } from './components/PlayerSwapModal';
import { SidebarNav } from './components/SidebarNav';
import { SignUpTab } from './components/SignUpTab';
import { StandingsTab } from './components/StandingsTab';
import { TopBar } from './components/TopBar';
import {
  buildOpponentLineup,
  buildPlayerPool,
  computeOptimalLineup,
  createEmptyRoster,
  getCurrentNFLWeek,
  MAX_LEAGUE_TEAMS,
  SALARY_CAP,
} from './data/nflSlate';
import {
  fetchStandingsFromSupabase,
  fetchTeamsFromSupabase,
  registerTeamInSupabase,
  supabaseClient,
} from './services/supabaseClient';
import type {
  LeagueTeam,
  PlayEvent,
  Player,
  RosterSlot,
  SlotId,
  StandingEntry,
  TabId,
  ToastMessage,
} from './types/fantasy';

export default function App() {
  const currentWeek = useMemo(() => getCurrentNFLWeek(), []);
  const playerPool = useMemo(() => buildPlayerPool(), []);
  const opponentLineup = useMemo(() => buildOpponentLineup(playerPool), [playerPool]);

  const [activeTab, setActiveTab] = useState<TabId>('lineup');
  const [rosterSlots, setRosterSlots] = useState<RosterSlot[]>(() =>
    computeOptimalLineup(playerPool)
  );
  const [registeredTeams, setRegisteredTeams] = useState<LeagueTeam[]>([]);
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [isStandingsLoading, setIsStandingsLoading] = useState<boolean>(true);

  const [playEvents, setPlayEvents] = useState<PlayEvent[]>([]);
  const [opponentLiveBonus, setOpponentLiveBonus] = useState<number>(0);

  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [bioPlayerName, setBioPlayerName] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((type: ToastMessage['type'], text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, type, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const loadStandings = useCallback(async () => {
    setIsStandingsLoading(true);
    const result = await fetchStandingsFromSupabase();
    if (result.fromDatabase && result.standings.length > 0) {
      setStandings(result.standings);
    } else {
      setStandings([]);
    }
    setIsStandingsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSupabase() {
      const teams = await fetchTeamsFromSupabase();
      if (isMounted) {
        setRegisteredTeams(teams);
      }
      await loadStandings();
    }

    hydrateSupabase();

    const channel = supabaseClient
      .channel('public:league_teams')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'league_teams' },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const incoming: LeagueTeam = {
            id: row.id as string | number | undefined,
            owner: String(row.owner ?? ''),
            team: String(row.team_name ?? ''),
            email: String(row.email ?? ''),
          };
          setRegisteredTeams((prev) => {
            const exists = prev.some(
              (t) => t.team.toLowerCase() === incoming.team.toLowerCase()
            );
            return exists ? prev : [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabaseClient.removeChannel(channel);
    };
  }, [loadStandings]);

  const totalSpent = useMemo(
    () =>
      rosterSlots.reduce((sum, slot) => {
        if (!slot.player || slot.player.injuredQ1) return sum;
        return sum + slot.player.salary;
      }, 0),
    [rosterSlots]
  );

  const remainingCap = SALARY_CAP - totalSpent;
  const hasQ1Injury = rosterSlots.some((slot) => Boolean(slot.player?.injuredQ1));

  function handleTriggerQ1Injury() {
    const rb1Index = rosterSlots.findIndex((s) => s.id === 'RB1' && s.player !== null);
    const targetIdx =
      rb1Index >= 0 ? rb1Index : rosterSlots.findIndex((s) => s.player !== null);

    if (targetIdx < 0) {
      pushToast('warning', 'Add at least one starter to simulate a Q1 injury.');
      return;
    }

    const injuredName = rosterSlots[targetIdx].player!.name;

    setRosterSlots((prev) =>
      prev.map((slot, idx) =>
        idx === targetIdx && slot.player
          ? { ...slot, player: { ...slot.player, injuredQ1: true } }
          : slot
      )
    );
    setActiveTab('lineup');
    pushToast(
      'warning',
      `Q1 Injury Shield activated for ${injuredName}. Cap refunded; swap a replacement.`
    );
  }

  function handleClearQ1Injury() {
    setRosterSlots((prev) =>
      prev.map((slot) =>
        slot.player?.injuredQ1
          ? { ...slot, player: { ...slot.player, injuredQ1: false } }
          : slot
      )
    );
    pushToast('info', 'Q1 Injury Shield cleared.');
  }

  function handleAutoFill() {
    const optimal = computeOptimalLineup(playerPool);
    setRosterSlots(optimal);
    pushToast('success', 'Optimal 9-starter lineup filled within the $60,000 cap.');
  }

  function handleResetLineup() {
    setRosterSlots(createEmptyRoster());
    pushToast('info', 'Starting lineup cleared.');
  }

  function handleOpenSwapModal(_slotId: SlotId, slotIndex: number) {
    setSwapTargetIndex(slotIndex);
  }

  function handleConfirmSwap(player: Player, slotIndex: number) {
    const duplicate = rosterSlots.some(
      (s, idx) => idx !== slotIndex && s.player?.name.toLowerCase() === player.name.toLowerCase()
    );
    if (duplicate) {
      pushToast('error', `${player.name} is already active in another roster spot.`);
      return;
    }

    const nextSlots = rosterSlots.map((slot, idx) =>
      idx === slotIndex ? { ...slot, player: { ...player, injuredQ1: false } } : slot
    );
    const nextSpent = nextSlots.reduce((sum, s) => {
      if (!s.player || s.player.injuredQ1) return sum;
      return sum + s.player.salary;
    }, 0);

    setRosterSlots(nextSlots);
    setSwapTargetIndex(null);

    if (nextSpent > SALARY_CAP) {
      pushToast(
        'warning',
        `Drafted ${player.name}. Lineup is $${(nextSpent - SALARY_CAP).toLocaleString()} over the $60,000 cap.`
      );
    } else {
      pushToast('success', `Drafted ${player.name} into ${nextSlots[slotIndex].shortLabel}.`);
    }
  }

  function handleDraftFromMarket(player: Player) {
    const emptyEligibleIdx = rosterSlots.findIndex(
      (s) => s.player === null && s.eligiblePositions.includes(player.pos)
    );
    if (emptyEligibleIdx >= 0) {
      handleConfirmSwap(player, emptyEligibleIdx);
      return;
    }

    const firstEligibleIdx = rosterSlots.findIndex((s) =>
      s.eligiblePositions.includes(player.pos)
    );
    if (firstEligibleIdx >= 0) {
      setActiveTab('lineup');
      setSwapTargetIndex(firstEligibleIdx);
      pushToast(
        'info',
        `All ${player.pos} slots are filled. Choose a slot replacement for ${player.name}.`
      );
    }
  }

  async function handleRegisterTeam(
    owner: string,
    teamName: string,
    email: string
  ): Promise<{ ok: boolean; error?: string }> {
    if (registeredTeams.length >= MAX_LEAGUE_TEAMS) {
      return { ok: false, error: 'League is currently full (12/12 teams registered).' };
    }

    const res = await registerTeamInSupabase(owner, teamName, email);
    if (!res.ok) {
      return res;
    }

    setRegisteredTeams((prev) => {
      const exists = prev.some((t) => t.team.toLowerCase() === teamName.toLowerCase());
      return exists ? prev : [...prev, { owner, team: teamName, email }];
    });
    pushToast('success', `Team "${teamName}" locked in for Blue Eighty.`);
    return { ok: true };
  }

  function handleSimulateLivePlay() {
    const healthyStarters = rosterSlots
      .map((s, idx) => ({ slot: s, idx }))
      .filter((item) => item.slot.player !== null && !item.slot.player.injuredQ1);

    const isUserPlay = healthyStarters.length > 0 && Math.random() < 0.68;
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const quarter = quarters[Math.min(Math.floor(playEvents.length / 2), 3)];

    if (isUserPlay) {
      const chosen = healthyStarters[Math.floor(Math.random() * healthyStarters.length)];
      const p = chosen.slot.player!;

      let delta = 2.4;
      let description = `${p.name} (${p.team}) gains 18 yards for a First Down.`;

      if (p.pos === 'QB') {
        delta = 6.2;
        description = `${p.name} (${p.team}) fires a 29-yard touchdown pass in the red zone.`;
      } else if (p.pos === 'RB') {
        delta = 6.8;
        description = `${p.name} (${p.team}) breaks loose for a 14-yard rushing touchdown.`;
      } else if (p.pos === 'WR' || p.pos === 'TE') {
        delta = 5.4;
        description = `${p.name} (${p.team}) hauls in a 24-yard contested grab inside the 10.`;
      } else if (p.pos === 'DEF') {
        delta = 3.0;
        description = `${p.name} forces a strip-sack and recovers the fumble.`;
      }

      setRosterSlots((prev) =>
        prev.map((slot, idx) =>
          idx === chosen.idx && slot.player
            ? {
                ...slot,
                player: {
                  ...slot.player,
                  liveBonus: parseFloat(((slot.player.liveBonus ?? 0) + delta).toFixed(1)),
                },
              }
            : slot
        )
      );

      setPlayEvents((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          quarter,
          text: description,
          pointsDelta: delta,
          side: 'user',
          playerName: p.name,
        },
        ...prev,
      ]);
    } else {
      const oppValues = Object.values(opponentLineup);
      const oppStarter = oppValues[Math.floor(Math.random() * oppValues.length)];
      const delta = 3.6;

      setOpponentLiveBonus((prev) => parseFloat((prev + delta).toFixed(1)));
      setPlayEvents((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          quarter,
          text: `${oppStarter.name} (${oppStarter.team}) converts a 21-yard red-zone gain for Apex Gridiron Club.`,
          pointsDelta: delta,
          side: 'opponent',
          playerName: oppStarter.name,
        },
        ...prev,
      ]);
    }
  }

  const bioPlayer = useMemo(() => {
    if (!bioPlayerName) return null;
    const fromRoster = rosterSlots.find(
      (s) => s.player?.name.toLowerCase() === bioPlayerName.toLowerCase()
    )?.player;
    if (fromRoster) return fromRoster;
    return playerPool.find((p) => p.name.toLowerCase() === bioPlayerName.toLowerCase()) ?? null;
  }, [bioPlayerName, playerPool, rosterSlots]);

  const swapSlot = swapTargetIndex !== null ? rosterSlots[swapTargetIndex] : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row">
      <SidebarNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentWeek={currentWeek}
        teamCount={registeredTeams.length}
        remainingCap={remainingCap}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentWeek={currentWeek}
          teamCount={registeredTeams.length}
          hasQ1Injury={hasQ1Injury}
          onTriggerQ1Injury={handleTriggerQ1Injury}
          onClearQ1Injury={handleClearQ1Injury}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'lineup' && (
            <LineupTab
              rosterSlots={rosterSlots}
              onOpenSwapModal={handleOpenSwapModal}
              onOpenBioModal={setBioPlayerName}
              onAutoFill={handleAutoFill}
              onResetLineup={handleResetLineup}
            />
          )}

          {activeTab === 'matchup' && (
            <GameCastTab
              currentWeek={currentWeek}
              rosterSlots={rosterSlots}
              opponentLineup={opponentLineup}
              opponentLiveBonus={opponentLiveBonus}
              playEvents={playEvents}
              onSimulateLivePlay={handleSimulateLivePlay}
              onOpenBioModal={setBioPlayerName}
            />
          )}

          {activeTab === 'waivers' && (
            <MarketTab
              playerPool={playerPool}
              rosterSlots={rosterSlots}
              onDraftFromMarket={handleDraftFromMarket}
              onOpenBioModal={setBioPlayerName}
            />
          )}

          {activeTab === 'signup' && (
            <SignUpTab
              registeredTeams={registeredTeams}
              onRegisterTeam={handleRegisterTeam}
            />
          )}

          {activeTab === 'standings' && (
            <StandingsTab
              standings={standings}
              registeredTeams={registeredTeams}
              isLoading={isStandingsLoading}
              onRefresh={loadStandings}
            />
          )}
        </main>
      </div>

      {/* Non-blocking Toast Notifications */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`bg-white border rounded-lg px-4 py-3 shadow-lg flex items-start justify-between gap-3 text-xs font-medium ${
                toast.type === 'error'
                  ? 'border-red-300 text-red-800'
                  : toast.type === 'warning'
                    ? 'border-amber-300 text-amber-900'
                    : toast.type === 'success'
                      ? 'border-emerald-300 text-emerald-900'
                      : 'border-slate-200 text-slate-800'
              }`}
            >
              <span>{toast.text}</span>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-slate-600 shrink-0"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {swapSlot && swapTargetIndex !== null && (
        <PlayerSwapModal
          slot={swapSlot}
          slotIndex={swapTargetIndex}
          rosterSlots={rosterSlots}
          playerPool={playerPool}
          onClose={() => setSwapTargetIndex(null)}
          onConfirmSwap={handleConfirmSwap}
          onOpenBioModal={setBioPlayerName}
        />
      )}

      {bioPlayer && (
        <PlayerBioModal player={bioPlayer} onClose={() => setBioPlayerName(null)} />
      )}
    </div>
  );
}
