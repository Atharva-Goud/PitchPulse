/**
 * Centralized football logo mapping.
 *
 * Maps teams to the local logo files uploaded under public/assets/logos/,
 * organized by competition. Team identity is resolved with exact matching only,
 * and every returned path must exist in the generated manifest
 * (src/lib/data/logo-manifest.ts), so a team can never be shown another
 * club's logo and a missing file can never produce a broken image.
 *
 * Fallback chain in the UI (the TeamLogo components):
 *   1. Local logo file listed in the manifest
 *   2. API-provided logo
 *   3. Team initials badge
 *
 * ID provenance (no invented ids)
 * -------------------------------
 * Two id systems exist in this project:
 *   1. Canonical slug ids used by src/data/teams/teams.json
 *      e.g. "arsenal", "manchester-city".
 *   2. API-Football numeric ids. In match data these appear as
 *      "team-42" and inside logo URLs as
 *      https://media.api-sports.io/football/teams/42.png
 *
 * `apiId` below is only populated for teams whose numeric id was verified
 * against real data in this repository (extractApiId() derives the same number
 * from an incoming team at runtime). Verified names observed in that data are
 * listed in `aliases` so both "Newcastle" and "Newcastle United" resolve to the
 * same logo.
 */

import { LOGO_ASSETS, LOGO_ASSETS_BY_STEM, type LogoAsset } from '../data/logo-manifest';
export type { LogoAsset } from '../data/logo-manifest';
export { LOGO_ASSETS };

export type CompetitionKey =
  | 'premier-league'
  | 'championship'
  | 'bundesliga'
  | '2-bundesliga'
  | 'la-liga'
  | 'ligue-1'
  | 'serie-a'
  | 'world-cup-2026'
  | 'nations-league'
  | 'champions-league'
  | 'europa-league'
  | 'conference-league';

export type LogoTeamType = 'club' | 'national';

export interface LogoMappingEntry {
  /** Canonical team id. Matches src/data/teams/teams.json IDs where present. */
  id: string;
  /** Official team name. */
  name: string;
  /** 3-letter abbreviation, when known. */
  shortName?: string;
  /** Club country, or the country of a national team. */
  country: string;
  /** Competition folder the logo is filed under. */
  competition: CompetitionKey;
  type: LogoTeamType;
  /**
   * Verified API-Football numeric team id. Only set when confirmed against
   * real data in this repo. Never guessed.
   */
  apiId?: string;
  /**
   * Exact alternative names observed in real API data, e.g. "Newcastle" for
   * "Newcastle United". Matching is exact only (after accent/case normalization),
   * never partial or substring based.
   */
  aliases?: string[];
  /**
   * Filename stem of this team's uploaded logo under public/assets/logos/,
   * when it differs from the canonical `id` (e.g. id 'bayern-munich' ->
   * file 'bayern-munchen'). Because resolution goes through the generated
   * manifest, a value here that does not match a real file is simply ignored —
   * it can never point at another club's logo.
   */
  logoFile?: string;
}

/** Base path for all local logos. */
export const LOGOS_BASE = '/assets/logos';

/** Map a competition key to its public folder path. */
export const COMPETITION_PATHS: Record<CompetitionKey, string> = {
  'premier-league': `${LOGOS_BASE}/clubs/england/premier-league`,
  'championship': `${LOGOS_BASE}/clubs/england/championship`,
  'bundesliga': `${LOGOS_BASE}/clubs/germany/bundesliga`,
  '2-bundesliga': `${LOGOS_BASE}/clubs/germany/2-bundesliga`,
  'la-liga': `${LOGOS_BASE}/clubs/spain/la-liga`,
  'ligue-1': `${LOGOS_BASE}/clubs/france/ligue-1`,
  'serie-a': `${LOGOS_BASE}/clubs/italy/serie-a`,
  'world-cup-2026': `${LOGOS_BASE}/international/world-cup-2026`,
  'nations-league': `${LOGOS_BASE}/international/nations-league`,
  'champions-league': `${LOGOS_BASE}/uefa/champions-league`,
  'europa-league': `${LOGOS_BASE}/uefa/europa-league`,
  'conference-league': `${LOGOS_BASE}/uefa/conference-league`,
};

/** Folders are keyed by competition so new competitions slot in cleanly. */
export const ALL_COMPETITIONS: CompetitionKey[] = Object.keys(COMPETITION_PATHS) as CompetitionKey[];

/**
 * Normalize a string into a comparable filename stem:
 * lowercase, accents stripped, non-alphanumerics collapsed to hyphens.
 */
export function toFindableStem(value: string | null | undefined): string {
  return (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Normalize a string for exact comparison: lowercase, accents stripped. */
export function normalizeKey(value: string | null | undefined): string {
  return (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Build the exact public path for a mapping entry. */
export function logoPathFor(entry: LogoMappingEntry): string {
  return `${COMPETITION_PATHS[entry.competition]}/${entry.id}.svg`;
}

/**
 * Team logo mappings.
 *
 * `id` is both the canonical lookup key and the SVG filename stem.
 * `apiId` is only present where the numeric API-Football id was verified
 * against real data in this repository.
 *
 * Teams without a verified apiId still resolve by canonical id (teams.json) and
 * by name/alias, which covers the team pages and transfer data paths.
 */
export const LOGO_MAPPINGS: LogoMappingEntry[] = [
  // -------------------------------------------------------
  // England · Premier League
  // apiIds verified from src/data/matches/*.json (team-42, teams/42.png, ...)
  // -------------------------------------------------------
  { id: 'arsenal', name: 'Arsenal', shortName: 'ARS', country: 'England', competition: 'premier-league', type: 'club', apiId: '42' },
  { id: 'aston-villa', name: 'Aston Villa', shortName: 'AVL', country: 'England', competition: 'premier-league', type: 'club', apiId: '66' },
  { id: 'bournemouth', name: 'AFC Bournemouth', shortName: 'BOU', country: 'England', competition: 'premier-league', type: 'club', apiId: '35', aliases: ['Bournemouth'] },
  { id: 'brentford', name: 'Brentford', shortName: 'BRE', country: 'England', competition: 'premier-league', type: 'club', apiId: '55' },
  { id: 'brighton', name: 'Brighton & Hove Albion', shortName: 'BHA', country: 'England', competition: 'premier-league', type: 'club', apiId: '51', aliases: ['Brighton'] },
  { id: 'chelsea', name: 'Chelsea', shortName: 'CHE', country: 'England', competition: 'premier-league', type: 'club', apiId: '49' },
  { id: 'crystal-palace', name: 'Crystal Palace', shortName: 'CRY', country: 'England', competition: 'premier-league', type: 'club', apiId: '52' },
  { id: 'everton', name: 'Everton', shortName: 'EVE', country: 'England', competition: 'premier-league', type: 'club', apiId: '45' },
  { id: 'fulham', name: 'Fulham', shortName: 'FUL', country: 'England', competition: 'premier-league', type: 'club', apiId: '36' },
  { id: 'leicester', name: 'Leicester City', shortName: 'LEI', country: 'England', competition: 'premier-league', type: 'club', apiId: '46', aliases: ['Leicester'] },
  { id: 'liverpool', name: 'Liverpool', shortName: 'LIV', country: 'England', competition: 'premier-league', type: 'club', apiId: '40' },
  { id: 'manchester-city', name: 'Manchester City', shortName: 'MCI', country: 'England', competition: 'premier-league', type: 'club', apiId: '50' },
  { id: 'manchester-united', name: 'Manchester United', shortName: 'MUN', country: 'England', competition: 'premier-league', type: 'club', apiId: '33' },
  { id: 'newcastle', name: 'Newcastle United', shortName: 'NEW', country: 'England', competition: 'premier-league', type: 'club', apiId: '34', aliases: ['Newcastle'] },
  { id: 'nottingham-forest', name: 'Nottingham Forest', shortName: 'NFO', country: 'England', competition: 'premier-league', type: 'club', apiId: '65' },
  { id: 'southampton', name: 'Southampton', shortName: 'SOU', country: 'England', competition: 'premier-league', type: 'club', apiId: '41' },
  { id: 'tottenham', name: 'Tottenham Hotspur', shortName: 'TOT', country: 'England', competition: 'premier-league', type: 'club', apiId: '47', aliases: ['Tottenham'] },
  { id: 'west-ham', name: 'West Ham United', shortName: 'WHU', country: 'England', competition: 'premier-league', type: 'club', apiId: '48' },
  { id: 'wolves', name: 'Wolverhampton Wanderers', shortName: 'WOL', country: 'England', competition: 'premier-league', type: 'club', apiId: '39', aliases: ['Wolves'] },

  // -------------------------------------------------------
  // England · Championship
  // No verified apiIds in current data; resolve by canonical id/name.
  // -------------------------------------------------------
  { id: 'blackburn', name: 'Blackburn Rovers', shortName: 'BLB', country: 'England', competition: 'championship', type: 'club' },
  { id: 'bristol-city', name: 'Bristol City', shortName: 'BRC', country: 'England', competition: 'championship', type: 'club' },
  { id: 'cardiff', name: 'Cardiff City', shortName: 'CAR', country: 'England', competition: 'championship', type: 'club' },
  { id: 'coventry', name: 'Coventry City', shortName: 'COV', country: 'England', competition: 'championship', type: 'club' },
  { id: 'derby-county', name: 'Derby County', shortName: 'DER', country: 'England', competition: 'championship', type: 'club' },
  { id: 'hull-city', name: 'Hull City', shortName: 'HUL', country: 'England', competition: 'championship', type: 'club' },
  { id: 'ipswich', name: 'Ipswich Town', shortName: 'IPS', country: 'England', competition: 'premier-league', type: 'club', apiId: '57', aliases: ['Ipswich'] },
  { id: 'leeds', name: 'Leeds United', shortName: 'LEE', country: 'England', competition: 'championship', type: 'club', aliases: ['Leeds'] },
  { id: 'middlesbrough', name: 'Middlesbrough', shortName: 'MID', country: 'England', competition: 'championship', type: 'club' },
  { id: 'millwall', name: 'Millwall', shortName: 'MIL', country: 'England', competition: 'championship', type: 'club' },
  { id: 'norwich', name: 'Norwich City', shortName: 'NOR', country: 'England', competition: 'championship', type: 'club' },
  { id: 'plymouth', name: 'Plymouth Argyle', shortName: 'PLY', country: 'England', competition: 'championship', type: 'club' },
  { id: 'preston', name: 'Preston North End', shortName: 'PNE', country: 'England', competition: 'championship', type: 'club' },
  { id: 'qpr', name: 'Queens Park Rangers', shortName: 'QPR', country: 'England', competition: 'championship', type: 'club' },
  { id: 'sheffield-united', name: 'Sheffield United', shortName: 'SHU', country: 'England', competition: 'championship', type: 'club', aliases: ['Sheff Utd'] },
  { id: 'sheffield-wednesday', name: 'Sheffield Wednesday', shortName: 'SHW', country: 'England', competition: 'championship', type: 'club', aliases: ['Sheff Wed'] },
  { id: 'stoke-city', name: 'Stoke City', shortName: 'STK', country: 'England', competition: 'championship', type: 'club' },
  { id: 'sunderland', name: 'Sunderland', shortName: 'SUN', country: 'England', competition: 'championship', type: 'club' },
  { id: 'swansea', name: 'Swansea City', shortName: 'SWA', country: 'England', competition: 'championship', type: 'club' },
  { id: 'watford', name: 'Watford', shortName: 'WAT', country: 'England', competition: 'championship', type: 'club' },
  { id: 'west-brom', name: 'West Bromwich Albion', shortName: 'WBA', country: 'England', competition: 'championship', type: 'club' },

  // -------------------------------------------------------
  // Germany · Bundesliga
  // Verified: 180 Heidenheim
  // -------------------------------------------------------
  { id: 'bayern-munich', logoFile: 'bayern-munchen', name: 'Bayern Munich', shortName: 'BAY', country: 'Germany', competition: 'bundesliga', type: 'club' },
  { id: 'borussia-dortmund', name: 'Borussia Dortmund', shortName: 'BVB', country: 'Germany', competition: 'bundesliga', type: 'club' },
  { id: 'rb-leipzig', name: 'RB Leipzig', shortName: 'RBL', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Leipzig'] },
  { id: 'bayer-leverkusen', name: 'Bayer Leverkusen', shortName: 'LEV', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Leverkusen'] },
  { id: 'eintracht-frankfurt', name: 'Eintracht Frankfurt', shortName: 'SGE', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Frankfurt'] },
  { id: 'vfb-stuttgart', name: 'VfB Stuttgart', shortName: 'STU', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Stuttgart'] },
  { id: 'sc-freiburg', name: 'SC Freiburg', shortName: 'FRE', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Freiburg'] },
  { id: 'werder-bremen', name: 'Werder Bremen', shortName: 'BRE', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Bremen'] },
  { id: 'borussia-monchengladbach', name: 'Borussia Mönchengladbach', shortName: 'BMG', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Gladbach'] },
  { id: 'union-berlin', name: 'Union Berlin', shortName: 'UNB', country: 'Germany', competition: 'bundesliga', type: 'club' },
  { id: 'hoffenheim', name: 'TSG Hoffenheim', shortName: 'HOF', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Hoffenheim'] },
  { id: 'mainz', name: 'Mainz 05', shortName: 'MAI', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Mainz'] },
  { id: 'augsburg', name: 'FC Augsburg', shortName: 'AUG', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Augsburg'] },
  { id: 'koln', name: '1. FC Köln', shortName: 'KOE', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Köln', 'Cologne'] },
  { id: 'heidenheim', logoFile: 'fc-heidenheim', name: '1. FC Heidenheim', shortName: 'HEI', country: 'Germany', competition: 'bundesliga', type: 'club', apiId: '180' },
  { id: 'bochum', name: 'VfL Bochum', shortName: 'BOC', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['Bochum'] },
  { id: 'st-pauli', name: 'FC St. Pauli', shortName: 'STP', country: 'Germany', competition: 'bundesliga', type: 'club', aliases: ['St. Pauli', 'St Pauli'] },

  // -------------------------------------------------------
  // Germany · 2. Bundesliga
  // Verified: 1660 SV Elversberg
  // -------------------------------------------------------
  { id: 'hamburg', name: 'Hamburger SV', shortName: 'HSV', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Hamburg'] },
  { id: 'hertha-berlin', name: 'Hertha BSC', shortName: 'BSC', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Hertha'] },
  { id: 'schalke', name: 'Schalke 04', shortName: 'S04', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Schalke'] },
  { id: 'fortuna-dusseldorf', name: 'Fortuna Düsseldorf', shortName: 'F95', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Fortuna Dusseldorf', 'Düsseldorf'] },
  { id: 'hannover', name: 'Hannover 96', shortName: 'H96', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Hannover'] },
  { id: 'nurnberg', logoFile: 'fc-nurnberg', name: '1. FC Nürnberg', shortName: 'FCN', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Nurnberg', 'Nürnberg'] },
  { id: 'kaiserslautern', logoFile: 'fc-kaiserslautern', name: '1. FC Kaiserslautern', shortName: 'FCK', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Kaiserslautern'] },
  { id: 'karlsruhe', logoFile: 'karlsruher', name: 'Karlsruher SC', shortName: 'KSC', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Karlsruhe'] },
  { id: 'darmstadt', name: 'SV Darmstadt 98', shortName: 'DAR', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Darmstadt'] },
  // Verified in current data as a Bundesliga club (promoted for 2025-26).
  { id: 'elversberg', name: 'SV Elversberg', shortName: 'SVE', country: 'Germany', competition: 'bundesliga', type: 'club', apiId: '1660', aliases: ['Elversberg'] },
  { id: 'paderborn', name: 'SC Paderborn 07', shortName: 'SCP', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Paderborn'] },
  { id: 'greuther-furth', logoFile: 'spvgg-greuther-furth', name: 'Greuther Fürth', shortName: 'SGF', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Greuther Fuerth', 'Greuther Furth'] },
  { id: 'braunschweig', name: 'Eintracht Braunschweig', shortName: 'EBS', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Braunschweig'] },
  { id: 'magdeburg', name: '1. FC Magdeburg', shortName: 'FCM', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Magdeburg'] },
  { id: 'ulm', name: 'SSV Ulm', shortName: 'ULM', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Ulm'] },
  { id: 'regensburg', name: 'Jahn Regensburg', shortName: 'REG', country: 'Germany', competition: '2-bundesliga', type: 'club', aliases: ['Regensburg'] },

  // -------------------------------------------------------
  // Spain · La Liga
  // apiIds verified from src/data/matches/*.json
  // -------------------------------------------------------
  { id: 'real-madrid', name: 'Real Madrid', shortName: 'RMA', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '541' },
  { id: 'barcelona', name: 'Barcelona', shortName: 'BAR', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '529' },
  { id: 'atletico-madrid', name: 'Atlético Madrid', shortName: 'ATM', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '530', aliases: ['Atletico Madrid', 'Atlético'] },
  { id: 'athletic-bilbao', name: 'Athletic Club', shortName: 'ATH', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '531', aliases: ['Athletic Bilbao', 'Athletic Club de Bilbao'] },
  { id: 'real-sociedad', name: 'Real Sociedad', shortName: 'RSO', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '548', aliases: ['Sociedad'] },
  { id: 'villarreal', name: 'Villarreal', shortName: 'VIL', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '533' },
  { id: 'real-betis', name: 'Real Betis', shortName: 'BET', country: 'Spain', competition: 'la-liga', type: 'club', aliases: ['Betis'] },
  { id: 'sevilla', name: 'Sevilla', shortName: 'SEV', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '536' },
  { id: 'valencia', name: 'Valencia', shortName: 'VAL', country: 'Spain', competition: 'la-liga', type: 'club' },
  { id: 'getafe', name: 'Getafe', shortName: 'GET', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '546' },
  { id: 'celta-vigo', name: 'Celta Vigo', shortName: 'CEL', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '538', aliases: ['Celta'] },
  { id: 'osasuna', name: 'Osasuna', shortName: 'OSA', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '727' },
  { id: 'alaves', name: 'Alavés', shortName: 'ALA', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '542', aliases: ['Alaves'] },
  { id: 'mallorca', name: 'Mallorca', shortName: 'MAL', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '798' },
  { id: 'girona', name: 'Girona', shortName: 'GIR', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '547' },
  { id: 'rayo-vallecano', name: 'Rayo Vallecano', shortName: 'RAY', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '728', aliases: ['Rayo'] },
  { id: 'las-palmas', name: 'Las Palmas', shortName: 'LPA', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '534', aliases: ['UD Las Palmas'] },
  { id: 'espanyol', name: 'Espanyol', shortName: 'ESP', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '540' },
  { id: 'leganes', name: 'Leganés', shortName: 'LEG', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '537', aliases: ['Leganes'] },
  { id: 'valladolid', name: 'Real Valladolid', shortName: 'VLL', country: 'Spain', competition: 'la-liga', type: 'club', apiId: '720', aliases: ['Valladolid'] },
  { id: 'granada', name: 'Granada', shortName: 'GRA', country: 'Spain', competition: 'la-liga', type: 'club' },
  { id: 'cadiz', name: 'Cádiz', shortName: 'CAD', country: 'Spain', competition: 'la-liga', type: 'club', aliases: ['Cadiz'] },

  // -------------------------------------------------------
  // France · Ligue 1
  // -------------------------------------------------------
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Paris Saint Germain'] },
  { id: 'monaco', name: 'AS Monaco', shortName: 'MON', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Monaco'] },
  { id: 'marseille', name: 'Olympique Marseille', shortName: 'OM', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Marseille'] },
  { id: 'lyon', name: 'Olympique Lyon', shortName: 'OL', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Lyon'] },
  { id: 'rennes', name: 'Stade Rennais', shortName: 'REN', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Rennes'] },
  { id: 'lens', name: 'RC Lens', shortName: 'RCL', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Lens'] },
  { id: 'lille', name: 'Lille', shortName: 'LIL', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Lille OSC'] },
  { id: 'nice', name: 'OGC Nice', shortName: 'NCE', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Nice'] },
  { id: 'reims', name: 'Stade Reims', shortName: 'REI', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Reims'] },
  { id: 'lorient', name: 'FC Lorient', shortName: 'LOR', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Lorient'] },
  { id: 'strasbourg', logoFile: 'rc-strasbourg-alsace', name: 'RC Strasbourg', shortName: 'STR', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Strasbourg'] },
  { id: 'nantes', name: 'FC Nantes', shortName: 'NAN', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Nantes'] },
  { id: 'montpellier', name: 'Montpellier HSC', shortName: 'MHSC', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Montpellier', 'Montpellier Hérault SC'] },
  { id: 'toulouse', name: 'Toulouse FC', shortName: 'TFC', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Toulouse'] },
  { id: 'brest', name: 'Stade Brestois', shortName: 'BRS', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Brest'] },
  { id: 'le-havre', name: 'Le Havre AC', shortName: 'HAC', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Le Havre'] },
  { id: 'angers', name: 'Angers SCO', shortName: 'ANG', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Angers'] },
  { id: 'saint-etienne', name: 'AS Saint-Étienne', shortName: 'ASSE', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Saint-Etienne', 'Saint Etienne'] },
  { id: 'auxerre', name: 'AJ Auxerre', shortName: 'AJA', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Auxerre'] },
  { id: 'metz', name: 'FC Metz', shortName: 'MET', country: 'France', competition: 'ligue-1', type: 'club', aliases: ['Metz'] },

  // -------------------------------------------------------
  // Italy · Serie A
  // -------------------------------------------------------
  { id: 'inter-milan', name: 'Inter Milan', shortName: 'INT', country: 'Italy', competition: 'serie-a', type: 'club', aliases: ['Inter', 'Internazionale'] },
  { id: 'ac-milan', name: 'AC Milan', shortName: 'MIL', country: 'Italy', competition: 'serie-a', type: 'club', aliases: ['Milan'] },
  { id: 'juventus', name: 'Juventus', shortName: 'JUV', country: 'Italy', competition: 'serie-a', type: 'club', aliases: ['Juve'] },
  { id: 'napoli', name: 'Napoli', shortName: 'NAP', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'atalanta', name: 'Atalanta', shortName: 'ATA', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'roma', name: 'AS Roma', shortName: 'ROM', country: 'Italy', competition: 'serie-a', type: 'club', aliases: ['Roma'] },
  { id: 'lazio', name: 'Lazio', shortName: 'LAZ', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'fiorentina', name: 'Fiorentina', shortName: 'FIO', country: 'Italy', competition: 'serie-a', type: 'club', aliases: ['ACF Fiorentina'] },
  { id: 'bologna', name: 'Bologna', shortName: 'BOL', country: 'Italy', competition: 'serie-a', type: 'club', aliases: ['Bologna FC'] },
  { id: 'torino', name: 'Torino', shortName: 'TOR', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'udinese', name: 'Udinese', shortName: 'UDI', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'sassuolo', name: 'Sassuolo', shortName: 'SAS', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'hellas-verona', name: 'Hellas Verona', shortName: 'VER', country: 'Italy', competition: 'serie-a', type: 'club', aliases: ['Verona'] },
  { id: 'empoli', name: 'Empoli', shortName: 'EMP', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'cagliari', name: 'Cagliari', shortName: 'CAG', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'lecce', name: 'Lecce', shortName: 'LEC', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'genoa', name: 'Genoa', shortName: 'GEN', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'monza', name: 'Monza', shortName: 'MON', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'parma', name: 'Parma', shortName: 'PAR', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'venezia', name: 'Venezia', shortName: 'VEN', country: 'Italy', competition: 'serie-a', type: 'club' },
  { id: 'como', logoFile: 'como-1907', name: 'Como', shortName: 'COM', country: 'Italy', competition: 'serie-a', type: 'club' },

  // -------------------------------------------------------
  // International · FIFA World Cup 2026 (national teams)
  // -------------------------------------------------------
  { id: 'england', logoFile: 'england-national-team', name: 'England', shortName: 'ENG', country: 'England', competition: 'world-cup-2026', type: 'national' },
  { id: 'spain', logoFile: 'spain-national-team', name: 'Spain', shortName: 'ESP', country: 'Spain', competition: 'world-cup-2026', type: 'national' },
  { id: 'germany', logoFile: 'germany-national-team', name: 'Germany', shortName: 'GER', country: 'Germany', competition: 'world-cup-2026', type: 'national' },
  { id: 'france', logoFile: 'france-national-team', name: 'France', shortName: 'FRA', country: 'France', competition: 'world-cup-2026', type: 'national' },
  { id: 'italy', logoFile: 'italy-national-team', name: 'Italy', shortName: 'ITA', country: 'Italy', competition: 'world-cup-2026', type: 'national' },
  { id: 'netherlands', logoFile: 'dutch-national-team', name: 'Netherlands', shortName: 'NED', country: 'Netherlands', competition: 'world-cup-2026', type: 'national', aliases: ['Holland'] },
  { id: 'portugal', logoFile: 'portuguese-football-federation', name: 'Portugal', shortName: 'POR', country: 'Portugal', competition: 'world-cup-2026', type: 'national' },
  { id: 'brazil', logoFile: 'brazil-national-team', name: 'Brazil', shortName: 'BRA', country: 'Brazil', competition: 'world-cup-2026', type: 'national' },
  { id: 'argentina', logoFile: 'argentina-national-team', name: 'Argentina', shortName: 'ARG', country: 'Argentina', competition: 'world-cup-2026', type: 'national' },
  { id: 'uruguay', logoFile: 'uruguay-national-team', name: 'Uruguay', shortName: 'URU', country: 'Uruguay', competition: 'world-cup-2026', type: 'national' },
  { id: 'mexico', logoFile: 'mexico-national-team', name: 'Mexico', shortName: 'MEX', country: 'Mexico', competition: 'world-cup-2026', type: 'national' },
  { id: 'usa', logoFile: 'usa-national-team', name: 'United States', shortName: 'USA', country: 'United States', competition: 'world-cup-2026', type: 'national', aliases: ['USA', 'US'] },
  { id: 'canada', logoFile: 'canada-national-team', name: 'Canada', shortName: 'CAN', country: 'Canada', competition: 'world-cup-2026', type: 'national' },
  { id: 'japan', logoFile: 'japan-national-team', name: 'Japan', shortName: 'JPN', country: 'Japan', competition: 'world-cup-2026', type: 'national' },
  { id: 'south-korea', logoFile: 'south-korea-national-team', name: 'South Korea', shortName: 'KOR', country: 'South Korea', competition: 'world-cup-2026', type: 'national', aliases: ['Korea Republic', 'Korea'] },
  { id: 'australia', logoFile: 'australia-national-team', name: 'Australia', shortName: 'AUS', country: 'Australia', competition: 'world-cup-2026', type: 'national' },
  { id: 'saudi-arabia', logoFile: 'saudi-arabia-national-team', name: 'Saudi Arabia', shortName: 'KSA', country: 'Saudi Arabia', competition: 'world-cup-2026', type: 'national' },
  { id: 'iran', logoFile: 'iran-national-team', name: 'Iran', shortName: 'IRN', country: 'Iran', competition: 'world-cup-2026', type: 'national', aliases: ['IR Iran'] },
  { id: 'qatar', logoFile: 'qatar-national-team', name: 'Qatar', shortName: 'QAT', country: 'Qatar', competition: 'world-cup-2026', type: 'national' },
  { id: 'morocco', logoFile: 'morocco-national-team', name: 'Morocco', shortName: 'MAR', country: 'Morocco', competition: 'world-cup-2026', type: 'national' },
  { id: 'senegal', logoFile: 'senegal-national-team', name: 'Senegal', shortName: 'SEN', country: 'Senegal', competition: 'world-cup-2026', type: 'national' },
  { id: 'tunisia', logoFile: 'tunisia-national-team', name: 'Tunisia', shortName: 'TUN', country: 'Tunisia', competition: 'world-cup-2026', type: 'national' },
  { id: 'cameroon', name: 'Cameroon', shortName: 'CMR', country: 'Cameroon', competition: 'world-cup-2026', type: 'national' },
  { id: 'ghana', logoFile: 'ghana-national-team', name: 'Ghana', shortName: 'GHA', country: 'Ghana', competition: 'world-cup-2026', type: 'national' },
  { id: 'belgium', logoFile: 'belgium-national-team', name: 'Belgium', shortName: 'BEL', country: 'Belgium', competition: 'world-cup-2026', type: 'national' },
  { id: 'croatia', logoFile: 'croatia-national-team', name: 'Croatia', shortName: 'CRO', country: 'Croatia', competition: 'world-cup-2026', type: 'national' },
  { id: 'serbia', logoFile: 'serbia-national-team', name: 'Serbia', shortName: 'SRB', country: 'Serbia', competition: 'world-cup-2026', type: 'national' },
  { id: 'switzerland', logoFile: 'switzerland-national-team', name: 'Switzerland', shortName: 'SUI', country: 'Switzerland', competition: 'world-cup-2026', type: 'national' },
  { id: 'denmark', logoFile: 'denmark-national-team', name: 'Denmark', shortName: 'DEN', country: 'Denmark', competition: 'world-cup-2026', type: 'national' },
  { id: 'poland', logoFile: 'poland-national-team', name: 'Poland', shortName: 'POL', country: 'Poland', competition: 'world-cup-2026', type: 'national' },
  { id: 'wales', logoFile: 'wales-national-team', name: 'Wales', shortName: 'WAL', country: 'Wales', competition: 'world-cup-2026', type: 'national' },
  { id: 'ecuador', logoFile: 'ecuador-national-team', name: 'Ecuador', shortName: 'ECU', country: 'Ecuador', competition: 'world-cup-2026', type: 'national' },
  { id: 'costa-rica', name: 'Costa Rica', shortName: 'CRC', country: 'Costa Rica', competition: 'world-cup-2026', type: 'national' },
  { id: 'colombia', logoFile: 'colombia-national-team', name: 'Colombia', shortName: 'COL', country: 'Colombia', competition: 'world-cup-2026', type: 'national' },
  { id: 'paraguay', logoFile: 'paraguay-national-team', name: 'Paraguay', shortName: 'PAR', country: 'Paraguay', competition: 'world-cup-2026', type: 'national' },
  { id: 'peru', name: 'Peru', shortName: 'PER', country: 'Peru', competition: 'world-cup-2026', type: 'national' },
  { id: 'chile', name: 'Chile', shortName: 'CHI', country: 'Chile', competition: 'world-cup-2026', type: 'national' },

  // -------------------------------------------------------
  // International · UEFA Nations League
  // -------------------------------------------------------
  { id: 'austria', logoFile: 'austria-national-team', name: 'Austria', shortName: 'AUT', country: 'Austria', competition: 'nations-league', type: 'national' },
  { id: 'czechia', logoFile: 'czech-republic-national-team', name: 'Czechia', shortName: 'CZE', country: 'Czechia', competition: 'nations-league', type: 'national', aliases: ['Czech Republic'] },
  { id: 'hungary', logoFile: 'hungary-national-team', name: 'Hungary', shortName: 'HUN', country: 'Hungary', competition: 'nations-league', type: 'national' },
  { id: 'slovakia', logoFile: 'slovakia-national-team', name: 'Slovakia', shortName: 'SVK', country: 'Slovakia', competition: 'nations-league', type: 'national' },
  { id: 'slovenia', logoFile: 'slovenia-national-team', name: 'Slovenia', shortName: 'SVN', country: 'Slovenia', competition: 'nations-league', type: 'national' },
  { id: 'albania', logoFile: 'albania-national-team', name: 'Albania', shortName: 'ALB', country: 'Albania', competition: 'nations-league', type: 'national' },
  { id: 'bosnia', logoFile: 'bosnia-and-herzegovina-national-team', name: 'Bosnia and Herzegovina', shortName: 'BIH', country: 'Bosnia and Herzegovina', competition: 'nations-league', type: 'national', aliases: ['Bosnia'] },
  { id: 'romania', logoFile: 'romania-national-team', name: 'Romania', shortName: 'ROU', country: 'Romania', competition: 'nations-league', type: 'national' },
  { id: 'ukraine', logoFile: 'ukraine-national-team', name: 'Ukraine', shortName: 'UKR', country: 'Ukraine', competition: 'nations-league', type: 'national' },
  { id: 'turkey', logoFile: 'turkey-national-team', name: 'Türkiye', shortName: 'TUR', country: 'Türkiye', competition: 'nations-league', type: 'national', aliases: ['Turkiye', 'Turkey'] },
  { id: 'greece', logoFile: 'greece-national-team', name: 'Greece', shortName: 'GRE', country: 'Greece', competition: 'nations-league', type: 'national' },
  { id: 'norway', logoFile: 'norway-national-team', name: 'Norway', shortName: 'NOR', country: 'Norway', competition: 'nations-league', type: 'national' },
  { id: 'sweden', logoFile: 'sweden-national-team', name: 'Sweden', shortName: 'SWE', country: 'Sweden', competition: 'nations-league', type: 'national' },
  { id: 'scotland', logoFile: 'scotland-national-team', name: 'Scotland', shortName: 'SCO', country: 'Scotland', competition: 'nations-league', type: 'national' },
  { id: 'republic-of-ireland', logoFile: 'republic-of-ireland-national-team', name: 'Republic of Ireland', shortName: 'IRL', country: 'Ireland', competition: 'nations-league', type: 'national', aliases: ['Ireland'] },
  { id: 'northern-ireland', logoFile: 'northern-ireland-national-team', name: 'Northern Ireland', shortName: 'NIR', country: 'Northern Ireland', competition: 'nations-league', type: 'national' },
  { id: 'iceland', logoFile: 'iceland-national-team', name: 'Iceland', shortName: 'ISL', country: 'Iceland', competition: 'nations-league', type: 'national' },
  { id: 'finland', logoFile: 'finland-national-team', name: 'Finland', shortName: 'FIN', country: 'Finland', competition: 'nations-league', type: 'national' },

  // ------------------------------------------------------------------
  // Additional uploaded assets not covered by the core rosters above.
  // `logoFile` records the exact uploaded filename, so each entry is
  // explicitly tied to its own file — nothing is guessed.
  // ------------------------------------------------------------------

  // Championship (additional clubs)
  { id: 'burnley', name: 'Burnley', shortName: 'BUR', country: 'England', competition: 'championship', type: 'club', logoFile: 'burnley' },
  { id: 'birmingham', name: 'Birmingham City', shortName: 'BIR', country: 'England', competition: 'championship', type: 'club', logoFile: 'birmingham' },
  { id: 'bolton', name: 'Bolton Wanderers', shortName: 'BOL', country: 'England', competition: 'championship', type: 'club', logoFile: 'bolton' },
  { id: 'charlton', name: 'Charlton Athletic', shortName: 'CHA', country: 'England', competition: 'championship', type: 'club', logoFile: 'charlton' },
  { id: 'lincoln-city', name: 'Lincoln City', shortName: 'LIN', country: 'England', competition: 'championship', type: 'club', logoFile: 'lincoln-city' },
  { id: 'portsmouth', name: 'Portsmouth', shortName: 'POR', country: 'England', competition: 'championship', type: 'club', logoFile: 'portsmouth' },
  { id: 'wrexham', name: 'Wrexham', shortName: 'WRE', country: 'England', competition: 'championship', type: 'club', logoFile: 'wrexham' },

  // Ligue 1 (additional clubs)
  { id: 'le-mans', name: 'Le Mans FC', shortName: 'LMF', country: 'France', competition: 'ligue-1', type: 'club', logoFile: 'le-mans' },
  { id: 'paris-fc', name: 'Paris FC', shortName: 'PFC', country: 'France', competition: 'ligue-1', type: 'club', logoFile: 'paris-fc' },
  { id: 'troyes', name: 'ESTAC Troyes', shortName: 'TRO', country: 'France', competition: 'ligue-1', type: 'club', logoFile: 'troyes' },

  // 2. Bundesliga (additional clubs)
  { id: 'arminia-bielefeld', name: 'Arminia Bielefeld', shortName: 'DSC', country: 'Germany', competition: '2-bundesliga', type: 'club', logoFile: 'arminia-bielefeld' },
  { id: 'dynamo-dresden', name: 'Dynamo Dresden', shortName: 'SGD', country: 'Germany', competition: '2-bundesliga', type: 'club', logoFile: 'dynamo-dresden' },
  { id: 'energie-cottbus', name: 'Energie Cottbus', shortName: 'FCE', country: 'Germany', competition: '2-bundesliga', type: 'club', logoFile: 'energie-cottbus' },
  { id: 'holstein-kiel', name: 'Holstein Kiel', shortName: 'KSV', country: 'Germany', competition: '2-bundesliga', type: 'club', logoFile: 'holstein-kiel' },
  { id: 'osnabruck', name: 'VfL Osnabrück', shortName: 'OSN', country: 'Germany', competition: '2-bundesliga', type: 'club', logoFile: 'osnabruck' },
  { id: 'wolfsburg', name: 'VfL Wolfsburg', shortName: 'WOB', country: 'Germany', competition: '2-bundesliga', type: 'club', logoFile: 'wolfsburg' },

  // Serie A (additional clubs)
  { id: 'frosinone', name: 'Frosinone', shortName: 'FRO', country: 'Italy', competition: 'serie-a', type: 'club', logoFile: 'frosinone' },

  // La Liga (additional clubs)
  { id: 'deportivo-la-coruna', name: 'Deportivo La Coruña', shortName: 'DEP', country: 'Spain', competition: 'la-liga', type: 'club', logoFile: 'deportivo-la-coruna' },
  { id: 'deportivo', name: 'Deportivo La Coruña', shortName: 'DEP', country: 'Spain', competition: 'la-liga', type: 'club', logoFile: 'deportivo' },
  { id: 'elche', name: 'Elche CF', shortName: 'ELC', country: 'Spain', competition: 'la-liga', type: 'club', logoFile: 'elche' },
  { id: 'levante', name: 'Levante UD', shortName: 'LEV', country: 'Spain', competition: 'la-liga', type: 'club', logoFile: 'levante' },
  { id: 'malaga', name: 'Málaga CF', shortName: 'MLG', country: 'Spain', competition: 'la-liga', type: 'club', logoFile: 'malaga' },
  { id: 'racing', name: 'Racing Santander', shortName: 'RAC', country: 'Spain', competition: 'la-liga', type: 'club', logoFile: 'racing' },

  // World Cup 2026 (additional qualified nations)
  { id: 'algeria', logoFile: 'algeria-national-team', name: 'Algeria', shortName: 'ALG', country: 'Algeria', competition: 'world-cup-2026', type: 'national' },
  { id: 'cabo-verde', logoFile: 'cabo-verde-national-team', name: 'Cabo Verde', shortName: 'CPV', country: 'Cabo Verde', competition: 'world-cup-2026', type: 'national' },
  { id: 'congo-dr', logoFile: 'congo-dr-national-team', name: 'DR Congo', shortName: 'COD', country: 'DR Congo', competition: 'world-cup-2026', type: 'national' },
  { id: 'cote-d-ivoire', logoFile: 'cote-d-ivoire-national-team', name: 'Côte d\'Ivoire', shortName: 'CIV', country: 'Côte d\'Ivoire', competition: 'world-cup-2026', type: 'national' },
  { id: 'curacao', logoFile: 'curacao-national-team', name: 'Curaçao', shortName: 'CUW', country: 'Curaçao', competition: 'world-cup-2026', type: 'national' },
  { id: 'egypt', logoFile: 'egypt-national-team', name: 'Egypt', shortName: 'EGY', country: 'Egypt', competition: 'world-cup-2026', type: 'national' },
  { id: 'haiti', logoFile: 'haiti-national-team', name: 'Haiti', shortName: 'HAI', country: 'Haiti', competition: 'world-cup-2026', type: 'national' },
  { id: 'iraq', logoFile: 'iraq-national-team', name: 'Iraq', shortName: 'IRQ', country: 'Iraq', competition: 'world-cup-2026', type: 'national' },
  { id: 'jordan', logoFile: 'jordan-national-team', name: 'Jordan', shortName: 'JOR', country: 'Jordan', competition: 'world-cup-2026', type: 'national' },
  { id: 'new-zealand', logoFile: 'new-zealand-national-team', name: 'New Zealand', shortName: 'NZL', country: 'New Zealand', competition: 'world-cup-2026', type: 'national' },
  { id: 'panama', logoFile: 'panama-national-team', name: 'Panama', shortName: 'PAN', country: 'Panama', competition: 'world-cup-2026', type: 'national' },
  { id: 'south-africa', logoFile: 'south-africa-national-team', name: 'South Africa', shortName: 'RSA', country: 'South Africa', competition: 'world-cup-2026', type: 'national' },
  { id: 'uzbekistan', logoFile: 'uzbekistan-national-team', name: 'Uzbekistan', shortName: 'UZB', country: 'Uzbekistan', competition: 'world-cup-2026', type: 'national' },

  // Nations League (additional members)
  { id: 'andorra', logoFile: 'andorra-national-team', name: 'Andorra', shortName: 'AND', country: 'Andorra', competition: 'nations-league', type: 'national' },
  { id: 'armenia', logoFile: 'armenia-national-team', name: 'Armenia', shortName: 'ARM', country: 'Armenia', competition: 'nations-league', type: 'national' },
  { id: 'azerbaijan', logoFile: 'azerbaijan-national-team', name: 'Azerbaijan', shortName: 'AZE', country: 'Azerbaijan', competition: 'nations-league', type: 'national' },
  { id: 'belarus', logoFile: 'belarus-national-team', name: 'Belarus', shortName: 'BLR', country: 'Belarus', competition: 'nations-league', type: 'national' },
  { id: 'bulgaria', logoFile: 'bulgaria-national-team', name: 'Bulgaria', shortName: 'BUL', country: 'Bulgaria', competition: 'nations-league', type: 'national' },
  { id: 'cyprus', logoFile: 'cyprus-national-team', name: 'Cyprus', shortName: 'CYP', country: 'Cyprus', competition: 'nations-league', type: 'national' },
  { id: 'estonia', logoFile: 'estonia-national-team', name: 'Estonia', shortName: 'EST', country: 'Estonia', competition: 'nations-league', type: 'national' },
  { id: 'faroe-islands', logoFile: 'faroe-islands-national-team', name: 'Faroe Islands', shortName: 'FRO', country: 'Faroe Islands', competition: 'nations-league', type: 'national' },
  { id: 'georgia', logoFile: 'georgia-national-team', name: 'Georgia', shortName: 'GEO', country: 'Georgia', competition: 'nations-league', type: 'national' },
  { id: 'gibraltar', logoFile: 'gibraltar-national-team', name: 'Gibraltar', shortName: 'GIB', country: 'Gibraltar', competition: 'nations-league', type: 'national' },
  { id: 'israel', logoFile: 'israel-national-team', name: 'Israel', shortName: 'ISR', country: 'Israel', competition: 'nations-league', type: 'national' },
  { id: 'kazakhstan', logoFile: 'kazakhstan-national-team', name: 'Kazakhstan', shortName: 'KAZ', country: 'Kazakhstan', competition: 'nations-league', type: 'national' },
  { id: 'kosovo', logoFile: 'kosovo-national-team', name: 'Kosovo', shortName: 'KVX', country: 'Kosovo', competition: 'nations-league', type: 'national' },
  { id: 'latvia', logoFile: 'latvia-national-team', name: 'Latvia', shortName: 'LVA', country: 'Latvia', competition: 'nations-league', type: 'national' },
  { id: 'liechtenstein', logoFile: 'liechtenstein-national-team', name: 'Liechtenstein', shortName: 'LIE', country: 'Liechtenstein', competition: 'nations-league', type: 'national' },
  { id: 'lithuania', logoFile: 'lithuania-national-team', name: 'Lithuania', shortName: 'LTU', country: 'Lithuania', competition: 'nations-league', type: 'national' },
  { id: 'luxembourg', logoFile: 'luxembourg-national-team', name: 'Luxembourg', shortName: 'LUX', country: 'Luxembourg', competition: 'nations-league', type: 'national' },
  { id: 'malta', logoFile: 'malta-national-team', name: 'Malta', shortName: 'MLT', country: 'Malta', competition: 'nations-league', type: 'national' },
  { id: 'moldova', logoFile: 'moldova-national-team', name: 'Moldova', shortName: 'MDA', country: 'Moldova', competition: 'nations-league', type: 'national' },
  { id: 'montenegro', logoFile: 'montenegro-national-team', name: 'Montenegro', shortName: 'MNE', country: 'Montenegro', competition: 'nations-league', type: 'national' },
  { id: 'north-macedonia', logoFile: 'north-macedonia-national-team', name: 'North Macedonia', shortName: 'MKD', country: 'North Macedonia', competition: 'nations-league', type: 'national' },
  { id: 'san-marino', logoFile: 'san-marino-national-team', name: 'San Marino', shortName: 'SMR', country: 'San Marino', competition: 'nations-league', type: 'national' },

  // ------------------------------------------------------------------
  // UEFA competition participants
  //
  // These clubs were uploaded under uefa/* folders. A club's crest does not
  // change between competitions, so `id` equals the uploaded filename stem and
  // resolution is exact: a file only maps when the stem matches a real asset.
  // ------------------------------------------------------------------

  // UEFA Champions League
  { id: 'psv', name: 'PSV Eindhoven', shortName: 'PSV', country: 'Netherlands', competition: 'champions-league', type: 'club' },
  { id: 'feyenoord', name: 'Feyenoord', shortName: 'FEY', country: 'Netherlands', competition: 'champions-league', type: 'club' },
  { id: 'fc-porto', name: 'FC Porto', shortName: 'POR', country: 'Portugal', competition: 'champions-league', type: 'club' },
  { id: 'sporting-cp', name: 'Sporting CP', shortName: 'SCP', country: 'Portugal', competition: 'champions-league', type: 'club' },
  { id: 'club-brugge', name: 'Club Brugge', shortName: 'CLU', country: 'Belgium', competition: 'champions-league', type: 'club' },
  { id: 'galatasaray', name: 'Galatasaray', shortName: 'GAL', country: 'Türkiye', competition: 'champions-league', type: 'club' },
  { id: 'fenerbahce', name: 'Fenerbahçe', shortName: 'FEN', country: 'Türkiye', competition: 'champions-league', type: 'club' },
  { id: 'shakhtar', name: 'Shakhtar Donetsk', shortName: 'SHK', country: 'Ukraine', competition: 'champions-league', type: 'club' },
  { id: 'slavia-praha', name: 'Slavia Praha', shortName: 'SLA', country: 'Czechia', competition: 'champions-league', type: 'club' },
  { id: 's-bratislava', name: 'Slovan Bratislava', shortName: 'SLO', country: 'Slovakia', competition: 'champions-league', type: 'club' },
  { id: 'bodo-glimt', name: 'Bodø/Glimt', shortName: 'BOD', country: 'Norway', competition: 'champions-league', type: 'club' },
  { id: 'viking', name: 'Viking FK', shortName: 'VIK', country: 'Norway', competition: 'champions-league', type: 'club' },
  { id: 'lask', name: 'LASK', shortName: 'LSK', country: 'Austria', competition: 'champions-league', type: 'club' },
  { id: 'aek-athens', name: 'AEK Athens', shortName: 'AEK', country: 'Greece', competition: 'champions-league', type: 'club' },
  { id: 'sabah', name: 'Sabah FK', shortName: 'SAB', country: 'Azerbaijan', competition: 'champions-league', type: 'club' },

  // UEFA Europa League
  { id: 'benfica', name: 'Benfica', shortName: 'BEN', country: 'Portugal', competition: 'europa-league', type: 'club' },
  { id: 'celtic', name: 'Celtic', shortName: 'CEL', country: 'Scotland', competition: 'europa-league', type: 'club' },
  { id: 'anderlecht', name: 'RSC Anderlecht', shortName: 'AND', country: 'Belgium', competition: 'europa-league', type: 'club' },
  { id: 'besiktas', name: 'Beşiktaş', shortName: 'BES', country: 'Türkiye', competition: 'europa-league', type: 'club' },
  { id: 'olympiacos', name: 'Olympiacos', shortName: 'OLY', country: 'Greece', competition: 'europa-league', type: 'club' },
  { id: 'panathinaikos', name: 'Panathinaikos', shortName: 'PAO', country: 'Greece', competition: 'europa-league', type: 'club' },
  { id: 'dinamo-zagreb', name: 'Dinamo Zagreb', shortName: 'DIN', country: 'Croatia', competition: 'europa-league', type: 'club' },
  { id: 'salzburg', name: 'RB Salzburg', shortName: 'RBS', country: 'Austria', competition: 'europa-league', type: 'club' },
  { id: 'sturm-graz', name: 'Sturm Graz', shortName: 'STU', country: 'Austria', competition: 'europa-league', type: 'club' },
  { id: 'ferencvaros', name: 'Ferencváros', shortName: 'FER', country: 'Hungary', competition: 'europa-league', type: 'club' },
  { id: 'sparta-praha', name: 'Sparta Praha', shortName: 'SPA', country: 'Czechia', competition: 'europa-league', type: 'club' },
  { id: 'viktoria-plzen', name: 'Viktoria Plzeň', shortName: 'PLZ', country: 'Czechia', competition: 'europa-league', type: 'club' },
  { id: 'celje', name: 'NK Celje', shortName: 'CEL', country: 'Slovenia', competition: 'europa-league', type: 'club' },
  { id: 'az-alkmaar', name: 'AZ Alkmaar', shortName: 'AZ', country: 'Netherlands', competition: 'europa-league', type: 'club' },
  { id: 'twente', name: 'FC Twente', shortName: 'TWE', country: 'Netherlands', competition: 'europa-league', type: 'club' },
  { id: 'nec-nijmegen', name: 'NEC Nijmegen', shortName: 'NEC', country: 'Netherlands', competition: 'europa-league', type: 'club' },
  { id: 'lillestrom', name: 'Lillestrøm SK', shortName: 'LSK', country: 'Norway', competition: 'europa-league', type: 'club' },
  { id: 'lech-poznan', name: 'Lech Poznań', shortName: 'LPO', country: 'Poland', competition: 'europa-league', type: 'club' },
  { id: 'jagiellonia', name: 'Jagiellonia Białystok', shortName: 'JAG', country: 'Poland', competition: 'europa-league', type: 'club' },
  { id: 'crvena-zvezda', name: 'Crvena zvezda', shortName: 'CRV', country: 'Serbia', competition: 'europa-league', type: 'club', aliases: ['Red Star Belgrade'] },
  { id: 'hapoel-beer-sheva', name: 'Hapoel Be\'er Sheva', shortName: 'HBS', country: 'Israel', competition: 'europa-league', type: 'club' },
  { id: 'omonoia', name: 'Omonia Nicosia', shortName: 'OMO', country: 'Cyprus', competition: 'europa-league', type: 'club' },
  { id: 'levski', name: 'Levski Sofia', shortName: 'LEV', country: 'Bulgaria', competition: 'europa-league', type: 'club' },
  { id: 'ararat-armenia', name: 'Ararat-Armenia', shortName: 'ARA', country: 'Armenia', competition: 'europa-league', type: 'club' },
  { id: 'torreense', name: 'Torreense', shortName: 'TOR', country: 'Portugal', competition: 'europa-league', type: 'club' },
  { id: 'union-saint-gilloise', name: 'Union Saint-Gilloise', shortName: 'USG', country: 'Belgium', competition: 'europa-league', type: 'club' },
  { id: 'ofi', name: 'OFI Crete', shortName: 'OFI', country: 'Greece', competition: 'europa-league', type: 'club' },

  // UEFA Conference League
  { id: 'ajax', name: 'Ajax', shortName: 'AJA', country: 'Netherlands', competition: 'conference-league', type: 'club' },
  { id: 'copenhagen', name: 'FC Copenhagen', shortName: 'FCK', country: 'Denmark', competition: 'conference-league', type: 'club' },
  { id: 'midtjylland', name: 'FC Midtjylland', shortName: 'FCM', country: 'Denmark', competition: 'conference-league', type: 'club' },
  { id: 'agf', name: 'AGF Aarhus', shortName: 'AGF', country: 'Denmark', competition: 'conference-league', type: 'club' },
  { id: 'nordsjaelland', name: 'FC Nordsjælland', shortName: 'NOR', country: 'Denmark', competition: 'conference-league', type: 'club' },
  { id: 'brann', name: 'SK Brann', shortName: 'BRA', country: 'Norway', competition: 'conference-league', type: 'club' },
  { id: 'sc-braga', name: 'SC Braga', shortName: 'BRA', country: 'Portugal', competition: 'conference-league', type: 'club' },
  { id: 'gent', name: 'KAA Gent', shortName: 'GNT', country: 'Belgium', competition: 'conference-league', type: 'club' },
  { id: 'trabzonspor', name: 'Trabzonspor', shortName: 'TRA', country: 'Türkiye', competition: 'conference-league', type: 'club' },
  { id: 'hearts', name: 'Heart of Midlothian', shortName: 'HOM', country: 'Scotland', competition: 'conference-league', type: 'club' },
  { id: 'hajduk-split', name: 'Hajduk Split', shortName: 'HAJ', country: 'Croatia', competition: 'conference-league', type: 'club' },
  { id: 'cska-sofia', name: 'CSKA Sofia', shortName: 'CSK', country: 'Bulgaria', competition: 'conference-league', type: 'club' },
  { id: 'lugano', name: 'FC Lugano', shortName: 'LUG', country: 'Switzerland', competition: 'conference-league', type: 'club' },
  { id: 'thun', name: 'FC Thun', shortName: 'THU', country: 'Switzerland', competition: 'conference-league', type: 'club' },
  { id: 'jablonec', name: 'FK Jablonec', shortName: 'JAB', country: 'Czechia', competition: 'conference-league', type: 'club' },
  { id: 'kairat', name: 'FC Kairat', shortName: 'KAI', country: 'Kazakhstan', competition: 'conference-league', type: 'club' },
  { id: 'riga', name: 'Riga FC', shortName: 'RIG', country: 'Latvia', competition: 'conference-league', type: 'club' },
  { id: 'kauno-zalgiris', name: 'Kauno Žalgiris', shortName: 'KZA', country: 'Lithuania', competition: 'conference-league', type: 'club' },
  { id: 'iberia', name: 'FC Iberia 1999', shortName: 'IBE', country: 'Georgia', competition: 'conference-league', type: 'club' },
  { id: 'egnatia', name: 'KF Egnatia', shortName: 'EGN', country: 'Albania', competition: 'conference-league', type: 'club' },
  { id: 'borac', name: 'FK Borac', shortName: 'BOR', country: 'Bosnia and Herzegovina', competition: 'conference-league', type: 'club' },
  { id: 'u-craiova', name: 'Universitatea Craiova', shortName: 'UCV', country: 'Romania', competition: 'conference-league', type: 'club' },
  { id: 'pafos', name: 'Pafos FC', shortName: 'PAF', country: 'Cyprus', competition: 'conference-league', type: 'club' },
  { id: 'kups', name: 'KuPS', shortName: 'KUP', country: 'Finland', competition: 'conference-league', type: 'club' },
  { id: 'mjallby', name: 'Mjällby AIF', shortName: 'MJA', country: 'Sweden', competition: 'conference-league', type: 'club' },
  { id: 'sint-truidense', name: 'Sint-Truidense VV', shortName: 'STV', country: 'Belgium', competition: 'conference-league', type: 'club' },
  { id: 'inter-escaldes', name: 'Inter Club d\'Escaldes', shortName: 'INT', country: 'Andorra', competition: 'conference-league', type: 'club' },
  { id: 'lincoln-red-imps', name: 'Lincoln Red Imps', shortName: 'LRI', country: 'Gibraltar', competition: 'conference-league', type: 'club' },
];

/**
 * Exact-match indexes. No partial/substring matching is ever performed, so a
 * team can never resolve to another club's logo.
 */
const byId = new Map<string, LogoMappingEntry>();
const byApiId = new Map<string, LogoMappingEntry>();
const byNameOrAlias = new Map<string, LogoMappingEntry>();
const byPath = new Map<string, LogoMappingEntry>();

function index(map: Map<string, LogoMappingEntry>, key: string | undefined, entry: LogoMappingEntry): void {
  const k = normalizeKey(key);
  if (k && !map.has(k)) map.set(k, entry);
}

function buildIndexes(): void {
  for (const entry of LOGO_MAPPINGS) {
    index(byId, entry.id, entry);
    index(byApiId, entry.apiId, entry);
    index(byNameOrAlias, entry.name, entry);
    for (const alias of entry.aliases || []) index(byNameOrAlias, alias, entry);
    index(byPath, logoPathFor(entry), entry);
  }
}

buildIndexes();

/** Team-like shape accepted by the resolver. */
export interface LogoTeamLike {
  /** Canonical slug ("arsenal") or API form ("team-42" / "42"). */
  id?: string | null;
  name?: string | null;
  shortName?: string | null;
  logo?: string | null;
}

/**
 * Extract the verified numeric API-Football team id from whatever the data
 * layer gives us. Real data uses two shapes:
 *   "team-42"
 *   https://media.api-sports.io/football/teams/42.png
 *
 * This derives the number instead of hard-coding it, so ids stay accurate even
 * for teams without a mapping entry yet.
 */
export function extractApiId(team: LogoTeamLike | null | undefined): string | null {
  if (!team) return null;

  const fromId = typeof team.id === 'string' ? team.id.trim() : '';
  const teamPrefix = /^team-(\d+)$/i.exec(fromId);
  if (teamPrefix) return teamPrefix[1];
  if (/^\d+$/.test(fromId)) return fromId;

  const fromLogo = typeof team.logo === 'string' ? team.logo : '';
  const logoMatch = /\/teams\/(\d+)\.(?:png|svg|jpe?g|webp)/i.exec(fromLogo);
  if (logoMatch) return logoMatch[1];

  return null;
}

/** Resolve the mapping entry for a team, or null when untracked. */
export function findLogoEntry(team: LogoTeamLike | null | undefined): LogoMappingEntry | null {
  if (!team) return null;

  // 1. Canonical id, e.g. "arsenal" or "team-42" (numeric part used as key).
  if (team.id) {
    const id = normalizeKey(team.id);
    const byCanonical = byId.get(id);
    if (byCanonical) return byCanonical;

    const numeric = extractApiId(team);
    if (numeric) {
      const byNumeric = byApiId.get(numeric);
      if (byNumeric) return byNumeric;
    }
  }

  // 2. Numeric id derived from the logo URL, e.g. .../teams/42.png
  if (team.logo) {
    const numeric = extractApiId({ logo: team.logo });
    if (numeric) {
      const byNumeric = byApiId.get(numeric);
      if (byNumeric) return byNumeric;
    }
  }

  // 3. Exact name or verified alias
  if (team.name) {
    const byName = byNameOrAlias.get(normalizeKey(team.name));
    if (byName) return byName;
  }

  return null;
}

/**
 * Resolve the local logo asset for a mapping entry.
 *
 * Candidate stems, in order:
 *   1. entry.logoFile   (explicit override for filenames that differ from the id)
 *   2. entry.id
 *   3. entry.name
 *   4. entry.aliases and entry.shortName
 *
 * Every candidate must match a stem in the generated manifest, so this can only
 * ever return a file that actually exists. Not found -> null, never a guess.
 */
function findAssetForEntry(entry: LogoMappingEntry): LogoAsset | null {
  const stems = [
    entry.logoFile,
    entry.id,
    entry.name,
    ...(entry.aliases || []),
    entry.shortName,
  ];

  for (const candidate of stems) {
    const stem = toFindableStem(candidate);
    if (stem && LOGO_ASSETS_BY_STEM[stem]) return LOGO_ASSETS_BY_STEM[stem];
  }
  return null;
}

/** Resolve the local logo asset for a team-like object, or null. */
export function findLogoAsset(team: LogoTeamLike | null | undefined): LogoAsset | null {
  const entry = findLogoEntry(team);
  if (entry) {
    const asset = findAssetForEntry(entry);
    if (asset) return asset;
  }

  // Final fallback: exact filename match. Uploaded filenames are team slugs in
  // kebab-case, so a team whose canonical id/name/shortName is *exactly* one of
  // those slugs gets the matching file. This is a full-string match only —
  // never partial — so it cannot attach one club's logo to another.
  if (team) {
    for (const key of [team.id, team.name, team.shortName]) {
      const stem = toFindableStem(key);
      if (stem && LOGO_ASSETS_BY_STEM[stem]) return LOGO_ASSETS_BY_STEM[stem];
    }
  }

  return null;
}

/**
 * Resolve a team's exact local logo path.
 *
 * Returns null when the team has no local logo file. The UI then falls back to
 * the API logo and finally to initials, so this is always safe to return null.
 */
export function resolveLocalLogoPath(team: LogoTeamLike | null | undefined): string | null {
  const asset = findLogoAsset(team);
  return asset ? asset.path : null;
}

/** All registered teams with their exact local paths. */
export function getAllLogoMappings(): LogoMappingEntry[] {
  return LOGO_MAPPINGS;
}

/** Teams registered under a specific competition. */
export function getLogosByCompetition(competition: CompetitionKey): LogoMappingEntry[] {
  return LOGO_MAPPINGS.filter(e => e.competition === competition);
}

/** Total number of registered team mappings. */
export function getRegisteredLogoCount(): number {
  return LOGO_MAPPINGS.length;
}

/* -------------------------------------------------------------------------- */
/* Competition crests                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Competition (league/cup) crests live in the uefa/ and international/ folders
 * alongside team crests. Team crests do NOT change per competition — Arsenal's
 * crest is the same in the Premier League and the Champions League, and it is
 * filed under premier-league/, so club teams are never duplicated into the
 * UEFA folders.
 *
 * These ids are the ones already used by src/data/competitions/competitions.json.
 */
export interface CompetitionLogoMapping {
  /** Competition id as used in competitions.json. */
  id: string;
  /** Human-readable competition name. */
  name: string;
  /** Folder the crest is filed under. */
  competition: CompetitionKey;
  /** Verified alternative ids/names seen in data. */
  aliases?: string[];
}

export const COMPETITION_LOGO_MAPPINGS: CompetitionLogoMapping[] = [
  { id: 'champions-league', name: 'UEFA Champions League', competition: 'champions-league', aliases: ['UEFA Champions League', 'Champions League'] },
  { id: 'europa-league', name: 'UEFA Europa League', competition: 'europa-league', aliases: ['UEFA Europa League', 'Europa League'] },
  { id: 'conference-league', name: 'UEFA Conference League', competition: 'conference-league', aliases: ['UEFA Conference League', 'Conference League'] },
  { id: 'nations-league', name: 'UEFA Nations League', competition: 'nations-league', aliases: ['UEFA Nations League', 'Nations League'] },
];

/** Build the exact public path for a competition crest (extension-agnostic). */
export function competitionLogoPathFor(entry: CompetitionLogoMapping): string {
  return `${COMPETITION_PATHS[entry.competition]}/${entry.id}.svg`;
}

const competitionIndex = new Map<string, CompetitionLogoMapping>();
function buildCompetitionIndex(): void {
  for (const entry of COMPETITION_LOGO_MAPPINGS) {
    const keys = [entry.id, entry.name, ...(entry.aliases || [])];
    for (const k of keys) {
      const n = normalizeKey(k);
      if (n && !competitionIndex.has(n)) competitionIndex.set(n, entry);
    }
  }
}
buildCompetitionIndex();

/**
 * Resolve a competition's local crest path, or null.
 *
 * Exact matching only, so a competition can never resolve to another
 * competition's crest. Returns null when unmapped; the caller then falls back
 * to the API logo and finally to a neutral icon.
 */
export function resolveCompetitionLogoPath(competition: {
  id?: string | null;
  name?: string | null;
  logo?: string | null;
} | null | undefined): string | null {
  if (!competition) return null;

  for (const key of [competition.id, competition.name]) {
    if (!key) continue;
    const hit = competitionIndex.get(normalizeKey(key));
    if (hit) return competitionLogoPathFor(hit);
  }
  return null;
}