import { describe, it, expect } from 'vitest';
import { LOGO_MAPPINGS } from '../../utils/logo-mapping';

describe('logo mapping', () => {
  it('has unique canonical IDs', () => {
    const ids = LOGO_MAPPINGS.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('has unique logoFile values when specified', () => {
    const logoFiles = LOGO_MAPPINGS.filter((m) => m.logoFile).map((m) => m.logoFile);
    const uniqueFiles = new Set(logoFiles);
    expect(logoFiles.length).toBe(uniqueFiles.size);
  });

  it('every entry has required fields', () => {
    for (const entry of LOGO_MAPPINGS) {
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
      expect(typeof entry.name).toBe('string');
      expect(entry.name.length).toBeGreaterThan(0);
      expect(typeof entry.competition).toBe('string');
      expect(['club', 'national']).toContain(entry.type);
      if (entry.apiId) {
        expect(typeof entry.apiId).toBe('string');
      }
    }
  });

  it('competition values are valid', () => {
    const validCompetitions = [
      'premier-league', 'championship', 'bundesliga', '2-bundesliga',
      'la-liga', 'ligue-1', 'serie-a', 'world-cup-2026', 'nations-league',
      'champions-league', 'europa-league', 'conference-league',
    ];
    for (const entry of LOGO_MAPPINGS) {
      expect(validCompetitions).toContain(entry.competition);
    }
  });

  it('apiIds are unique when present', () => {
    const apiIds = LOGO_MAPPINGS.filter((m) => m.apiId).map((m) => m.apiId);
    const uniqueApiIds = new Set(apiIds);
    expect(apiIds.length).toBe(uniqueApiIds.size);
  });
});
