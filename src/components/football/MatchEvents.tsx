'use client';

import { useMemo, useState } from 'react';
import {
  Goal,
  Square,
  Square as YellowCard,
  Square as RedCard,
  User,
  UserMinus,
  Shield,
  Flag,
  Info,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export type MatchEventType = 'goal' | 'goal_own' | 'yellow' | 'red' | 'substitution' | 'penalty' | 'var' | 'other';

export interface MatchEvent {
  id?: string;
  minute: number | null;
  displayMinute: string;
  type: string;
  team: 'home' | 'away' | null;
  player: string | null;
  assist: string | null;
}

interface MatchEventsProps {
  events: MatchEvent[];
  homeTeam?: string;
  awayTeam?: string;
  liveMode?: boolean;
}

function classifyEvent(type: string, team: 'home' | 'away' | null): MatchEventType {
  const t = (type || '').toLowerCase();
  if (t.includes('own goal') || t.includes('own-goal')) return 'goal_own';
  if (t.includes('goal')) return 'goal';
  if (t.includes('red card') || t.includes('redcard')) return 'red';
  if (t.includes('yellow card') || t.includes('yellowcard')) return 'yellow';
  if (t.includes('penalty')) return 'penalty';
  if (t.includes('var')) return 'var';
  if (t.includes('substitution') || t.includes('sub')) return 'substitution';
  return 'other';
}

function EventIcon({ type }: { type: MatchEventType }) {
  const cls = 'h-4 w-4 flex-shrink-0';
  switch (type) {
    case 'goal':
      return <Goal className={cls} style={{ color: '#22c55e' }} />;
    case 'goal_own':
      return <Goal className={cls} style={{ color: '#f97316' }} />;
    case 'yellow':
      return <YellowCard className={cls} style={{ color: '#eab308' }} />;
    case 'red':
      return <RedCard className={cls} style={{ color: '#ef4444' }} />;
    case 'penalty':
      return <Flag className={cls} style={{ color: '#a855f7' }} />;
    case 'var':
      return <Shield className={cls} style={{ color: '#3b82f6' }} />;
    case 'substitution':
      return <UserMinus className={cls} style={{ color: '#60a5fa' }} />;
    default:
      return <Info className={cls} style={{ color: '#94a3b8' }} />;
  }
}

function eventLabel(type: MatchEventType, rawType: string): string {
  if (rawType && rawType.trim()) return rawType;
  switch (type) {
    case 'goal': return 'Goal';
    case 'goal_own': return 'Own Goal';
    case 'yellow': return 'Yellow Card';
    case 'red': return 'Red Card';
    case 'penalty': return 'Penalty';
    case 'var': return 'VAR Review';
    case 'substitution': return 'Substitution';
    default: return 'Event';
  }
}

export default function MatchEvents({ events, homeTeam, awayTeam, liveMode = false }: MatchEventsProps) {
  const [sortAsc, setSortAsc] = useState(!liveMode); // Default: chronological for finished, reverse for live

  const sorted = useMemo(() => {
    return [...events]
      .map((e) => ({
        ...e,
        _type: classifyEvent(e.type, e.team),
        _minute: e.minute ?? 0,
      }))
      .sort((a, b) => (sortAsc ? 1 : -1) * (a._minute - b._minute || a.type.localeCompare(b.type)));
  }, [events, sortAsc]);

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Match Events</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Info className="h-8 w-8 text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">No match events available.</p>
          <p className="text-xs text-slate-500 mt-1">Event data is not available for this fixture.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Match Events</h3>
          <p className="text-xs text-slate-400 mt-0.5">Key moments from the match</p>
        </div>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
          aria-label={sortAsc ? 'Sort newest first' : 'Sort oldest first'}
        >
          {sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          <span className="hidden sm:inline">{sortAsc ? 'Oldest first' : 'Newest first'}</span>
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {sorted.map((event, index) => {
          const isHome = event.team === 'home';
          const isAway = event.team === 'away';
          const teamName = isHome ? homeTeam : isAway ? awayTeam : null;
          return (
            <div
              key={event.id || `${index}-${event._minute}`}
              className="flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center w-12 flex-shrink-0">
                <span className="text-sm font-semibold text-white tabular-nums">
                  {event.displayMinute || (event._minute != null ? `${event._minute}'` : "—")}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center w-8 flex-shrink-0">
                <EventIcon type={event._type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">
                    {eventLabel(event._type, event.type)}
                  </span>
                  {teamName && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isHome
                          ? 'bg-blue-500/10 text-blue-300'
                          : isAway
                          ? 'bg-orange-500/10 text-orange-300'
                          : 'bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {teamName}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {event.player ? (
                    <>
                      <User className="inline h-3 w-3 mr-1" />
                      {event.player}
                      {event.assist && <span className="text-slate-500"> · assist {event.assist}</span>}
                    </>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}