'use client';

import { useState, useMemo } from 'react';
import { Radio, Calendar, Trophy, Clock } from 'lucide-react';
import MatchCard from '@/components/football/MatchCard';
import { EmptyState } from '@/components/ui';
import type { NormalizedMatch } from '@/lib/football/types';

interface MatchesPageClientProps {
  initialData: {
    live: NormalizedMatch[];
    upcoming: NormalizedMatch[];
    results: NormalizedMatch[];
  };
}

function freshnessLabel(): string {
  return 'just updated';
}

export default function MatchesPageClient({ initialData }: MatchesPageClientProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'results'>('live');
  const { live, upcoming, results } = initialData;

  // Group live matches by competition for better organization
  const groupedLive = useMemo(() => {
    const groups: Record<string, NormalizedMatch[]> = {};
    live.forEach((match) => {
      const compName = match.league.name;
      if (!groups[compName]) groups[compName] = [];
      groups[compName].push(match);
    });
    return groups;
  }, [live]);

  const tabs = [
    { id: 'live' as const, label: 'Live', count: live.length, icon: Radio },
    { id: 'upcoming' as const, label: 'Upcoming', count: upcoming.length, icon: Calendar },
    { id: 'results' as const, label: 'Results', count: results.length, icon: Trophy },
  ];

  const displayedMatches = activeTab === 'live' ? live : activeTab === 'upcoming' ? upcoming : results;

  return (
    <div className="container-page py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Match Centre</h1>
        <p className="text-[var(--text-secondary)]">Live scores, fixtures, and results from around the world</p>
      </div>

      {/* Tabs with live indicator */}
      <div className="mb-8">
        <div className="flex rounded-xl bg-[var(--surface-2)] p-1.5 border border-[var(--border-default)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isLiveTab = tab.id === 'live';
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-h-[48px] relative ${
                  isActive
                    ? isLiveTab
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500 text-white'
                    : isLiveTab
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-3)]'
                }`}
                aria-pressed={isActive}
              >
                {isLiveTab && (
                  <span className="relative flex h-2 w-2 ml-1" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive
                      ? isLiveTab
                        ? 'bg-red-500/30'
                        : 'bg-white/20'
                      : 'bg-[var(--surface-3)]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live matches banner */}
      {activeTab === 'live' && live.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm text-red-400 font-medium">
                {live.length} match{live.length !== 1 ? 'es' : ''} currently live
              </span>
            </div>
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Updated {freshnessLabel()}
            </span>
          </div>
        </div>
      )}

      {displayedMatches.length === 0 ? (
        <EmptyState
          type="matches"
          message={activeTab === 'live' ? 'No live matches at the moment' : `No ${activeTab} matches`}
          reason={activeTab === 'live'
            ? 'No fixtures are currently in progress. Check back shortly.'
            : activeTab === 'upcoming'
            ? 'No upcoming fixtures are available for the selected competitions yet. Check back shortly.'
            : 'No recent results are available for the selected competitions yet.'}
        />
      ) : (
        <div className="space-y-8">
          {activeTab === 'live' && Object.keys(groupedLive).length > 0 ? (
            // Live matches grouped by competition
            Object.entries(groupedLive).map(([compName, matches]) => (
              <section key={compName} className="animate-in">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-400" />
                  {compName}
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      variant="live"
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            // Upcoming/Results - simple grid
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  variant={activeTab === 'live' ? 'live' : 'default'}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}