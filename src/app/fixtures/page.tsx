'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Trophy, Filter, X } from 'lucide-react';
import Link from 'next/link';
import MatchCard from '@/components/matches/MatchCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { getAllMatches } from '@/lib/data/matches';
import { getAllCompetitions } from '@/lib/data/competitions';
import { getAllTeams } from '@/lib/data/teams';
import { Match, Competition, Team } from '@/types';
import { format } from 'date-fns';

export default function FixturesPage() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<'all' | 'today' | 'tomorrow' | 'week'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [matchesData, competitionsData, teamsData] = await Promise.all([
          getAllMatches(),
          getAllCompetitions(),
          getAllTeams(),
        ]);
        setMatches(matchesData);
        setCompetitions(competitionsData);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error loading fixtures:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (selectedCompetition !== 'all' && match.competition.id !== selectedCompetition) return false;
      if (selectedTeam !== 'all' && match.homeTeam.id !== selectedTeam && match.awayTeam.id !== selectedTeam) return false;
      
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
  }, [matches, selectedCompetition, selectedTeam, selectedDate]);

  const groupedMatches = useMemo(() => {
    const groups: Record<string, Record<string, Match[]>> = {};
    
    filteredMatches.forEach((match) => {
      const compName = match.competition.name;
      const matchDate = format(new Date(match.kickoff), 'EEEE, MMMM d, yyyy');
      
      if (!groups[compName]) groups[compName] = {};
      if (!groups[compName][matchDate]) groups[compName][matchDate] = [];
      groups[compName][matchDate].push(match);
    });
    
    return groups;
  }, [filteredMatches]);

  const hasFilters = selectedCompetition !== 'all' || selectedTeam !== 'all' || selectedDate !== 'all';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="table" count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Fixtures</h1>
          <p className="text-slate-400">Browse fixtures by competition, team, or date</p>
        </div>

        <div className="mb-8 flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Competition</label>
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Competitions</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Date Range</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value as 'all' | 'today' | 'tomorrow' | 'week')}
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
                setSelectedTeam('all');
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
            reason="The free football data plan only covers past seasons (2022-2024), so today/tomorrow/this-week filters may return nothing. Try 'All Dates'."
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMatches).map(([compName, dates]) => (
              <section key={compName}>
                <div className="mb-4 p-3 rounded-lg bg-slate-900/50 border border-white/10">
                  <h3 className="font-semibold text-white capitalize">{compName}</h3>
                </div>
                {Object.entries(dates).map(([date, compMatches]) => (
                  <div key={date} className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-0.5 flex-1 bg-white/10" />
                      <span className="px-3 py-1 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg">
                        {date}
                      </span>
                      <div className="h-0.5 flex-1 bg-white/10" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {compMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}