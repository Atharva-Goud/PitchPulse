'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Trophy, Radio, Filter, X } from 'lucide-react';
import Link from 'next/link';
import FootballMatchCard from '@/components/football/FootballMatchCard';
import { getCompetitionConfig, getAllCompetitions, type CompetitionConfig } from '@/lib/football/competitions';
import { getUpcomingMatchList, getRecentMatchList, type CompetitionKey } from '@/lib/football/matches';
import { format } from 'date-fns';
import type { NormalizedMatch } from '@/lib/football/types';
import { EmptyState, LoadingState, SectionHeader } from '@/components/ui';

type DateFilter = 'all' | 'today' | 'tomorrow' | 'week';

export default function FootballFixturesPage() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<NormalizedMatch[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionConfig[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionKey | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<DateFilter>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [comps, data] = await Promise.all([
          Promise.resolve(getAllCompetitions()),
          selectedCompetition === 'all'
            ? getUpcomingMatchList(undefined, 30)
            : getUpcomingMatchList(selectedCompetition, 30),
        ]);
        setCompetitions(comps);
        setMatches(data);
      } catch (error) {
        console.error('Error loading fixtures:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCompetition]);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (selectedDate !== 'all') {
        const matchDate = new Date(match.kickoff);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate === 'today') {
          return matchDate.toDateString() === today.toDateString();
        }
        if (selectedDate === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return matchDate.toDateString() === tomorrow.toDateString();
        }
        if (selectedDate === 'week') {
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return matchDate >= today && matchDate <= weekEnd;
        }
      }
      return true;
    });
  }, [matches, selectedDate]);

  const groupedMatches = useMemo(() => {
    const groups: Record<string, Record<string, NormalizedMatch[]>> = {};

    filteredMatches.forEach((match) => {
      const compName = match.league.name;
      const matchDate = format(new Date(match.kickoff), 'yyyy-MM-dd');

      if (!groups[compName]) groups[compName] = {};
      if (!groups[compName][matchDate]) groups[compName][matchDate] = [];
      groups[compName][matchDate].push(match);
    });

    Object.values(groups).forEach((dates) => {
      Object.values(dates).forEach((matches) => {
        matches.sort(
          (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
        );
      });
    });

    return groups;
  }, [filteredMatches]);

  const hasFilters = selectedCompetition !== 'all' || selectedDate !== 'all';

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="table" count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Fixtures</h1>
          <p className="text-slate-400">Upcoming football fixtures powered by API-Football</p>
        </div>

        <div className="mb-8 flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Competition</label>
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value as CompetitionKey | 'all')}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Competitions</option>
              {competitions.map((comp) => (
                <option key={comp.key} value={comp.key}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Date Range</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value as DateFilter)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This Week</option>
            </select>
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setSelectedCompetition('all');
                setSelectedDate('all');
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors h-fit lg:h-[47px]"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        {Object.keys(groupedMatches).length === 0 ? (
          <EmptyState
            type="matches"
            message="No fixtures match your filters"
            reason="Standings and fixtures are sourced live from the football data API. Try 'All Dates' or a different competition."
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMatches).map(([compName, dates]) => {
              const sortedDates = Object.keys(dates).sort(
                (a, b) => new Date(a).getTime() - new Date(b).getTime()
              );
              return (
                <section key={compName}>
                  <div className="mb-4 p-3 rounded-lg bg-slate-900/50 border border-white/10">
                    <h3 className="font-semibold text-white capitalize">{compName}</h3>
                  </div>
                  {sortedDates.map((dateKey) => {
                    const dateObj = new Date(dateKey);
                    const dateLabel = format(dateObj, 'EEEE, MMMM d').toUpperCase();
                    return (
                      <div key={dateKey} className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-0.5 flex-1 bg-white/10" />
                          <span className="px-3 py-1 text-sm font-semibold text-white bg-slate-800 rounded-lg tracking-wide">
                            {dateLabel}
                          </span>
                          <div className="h-0.5 flex-1 bg-white/10" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {dates[dateKey].map((match) => (
                            <FootballMatchCard
                              key={match.id}
                              match={match}
                              variant="default"
                              hideFooter
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}