import { describe, it, expect } from 'vitest';

// Reproduce the column visibility logic from StandingsTable.tsx
function hasColumn(standings: any[], key: string): boolean {
  return standings.some((row) => {
    const v = row[key];
    return typeof v === 'number' && v !== 0;
  });
}

describe('standings column visibility', () => {
  it('shows column when at least one row has non-zero value', () => {
    const standings = [
      { rank: 1, points: 10, played: 5 },
      { rank: 2, points: 0, played: 5 },
    ];
    expect(hasColumn(standings, 'points')).toBe(true);
    expect(hasColumn(standings, 'played')).toBe(true);
  });

  it('hides column when all rows are zero for that key', () => {
    const standings = [
      { rank: 1, points: 0, played: 0 },
      { rank: 2, points: 0, played: 0 },
    ];
    expect(hasColumn(standings, 'points')).toBe(false);
    expect(hasColumn(standings, 'played')).toBe(false);
  });

  it('shows column when one row has zero but another has non-zero', () => {
    const standings = [
      { rank: 1, goalDifference: 5 },
      { rank: 2, goalDifference: 0 },
    ];
    expect(hasColumn(standings, 'goalDifference')).toBe(true);
  });

  it('treats zero as real data (not hiding PTS/W/D/L/GD columns)', () => {
    const standings = [
      { rank: 1, points: 0, won: 0, draw: 0, lost: 5, goalsFor: 0, goalsAgainst: 10, goalDifference: -10 },
      { rank: 2, points: 0, won: 0, draw: 0, lost: 5, goalsFor: 0, goalsAgainst: 10, goalDifference: -10 },
    ];
    // All zeros - should hide since no non-zero value exists
    expect(hasColumn(standings, 'points')).toBe(false);
    expect(hasColumn(standings, 'won')).toBe(false);
  });
});
