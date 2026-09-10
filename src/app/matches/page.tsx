'use client';

import { useState, useEffect } from 'react';
import { Radio, Calendar, Trophy, Filter, Clock } from 'lucide-react';
import MatchCard from '@/components/matches/MatchCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { getLiveMatches, getUpcomingMatches, getRecentResults } from '@/lib/data/matches';
import { Match } from '@/types';

function freshnessLabel(updatedAt?: string): string {
  if (!updatedAt) return '';
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just updated';
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

export default function MatchesPage() {
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState<Match[]>([]);
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [results, setResults] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'results'>('live');

  useEffect(() => {
    async function loadData() {
      try {
        const [liveData, upcomingData, resultsData] = await Promise.all([
          getLiveMatches(),
          getUpcomingMatches(),
          getRecentResults(),
        ]);
        setLive(liveData);
        setUpcoming(upcomingData);
        setResults(resultsData);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="card" count={6} />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'live' as const, label: 'Live', count: live.length, icon: Radio },
    { id: 'upcoming' as const, label: 'Upcoming', count: upcoming.length, icon: Calendar },
    { id: 'results' as const, label: 'Results', count: results.length, icon: Trophy },
  ];

  const displayedMatches = activeTab === 'live' ? live : activeTab === 'upcoming' ? upcoming : results;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Match Centre</h1>
          <p className="text-slate-400">Live scores, fixtures, and results from around the world</p>
        </div>

        <div className="mb-8">
          <div className="flex rounded-xl bg-slate-900 p-1.5 border border-white/10 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'live' && live.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm text-red-400 font-medium">
                {live.length} match{live.length !== 1 ? 'es' : ''} currently live
              </span>
              <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {freshnessLabel(live[0]?.lastUpdated)}
              </span>
            </div>
          </div>
        )}

        {displayedMatches.length === 0 ? (
          <EmptyState
            type="matches"
            message={activeTab === 'live' ? 'No live matches at the moment' : `No ${activeTab} matches`}
            reason={activeTab === 'live'
              ? 'No fixtures are currently in progress.'
              : activeTab === 'upcoming'
                ? 'The free football data plan only covers past seasons, so no upcoming fixtures are available right now.'
                : 'The free football data plan only covers past seasons, so no recent results are available right now.'}
          />
        ) : activeTab === 'live' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedMatches.map((match) => (
              <MatchCard key={match.id} match={match} variant="live" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
