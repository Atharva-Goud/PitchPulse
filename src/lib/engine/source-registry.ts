import { Source } from '@/lib/schemas/enhanced';
import publicationsData from '@/config/publications.json';
import clubsData from '@/config/official-clubs.json';
import journalistsData from '@/config/journalists.json';
import leaguesData from '@/config/official-leagues.json';

export class SourceRegistry {
  private sources: Map<string, Source> = new Map();
  private sourcesByType: Map<string, Source[]> = new Map();
  
  constructor() {
    this.loadSources();
  }
  
  private loadSources() {
    const allSourceArrays = [
      publicationsData.publications,
      clubsData.clubs,
      journalistsData.journalists,
      leaguesData.sources,
    ];
    
    for (const sourceArray of allSourceArrays) {
      for (const source of sourceArray) {
        if (source.enabled) {
          this.sources.set(source.id, source as Source);
          
          const type = source.type;
          if (!this.sourcesByType.has(type)) {
            this.sourcesByType.set(type, []);
          }
          this.sourcesByType.get(type)!.push(source as Source);
        }
      }
    }
  }
  
  getSource(id: string): Source | undefined {
    return this.sources.get(id);
  }
  
  getSourcesByType(type: string): Source[] {
    return this.sourcesByType.get(type) || [];
  }
  
  getOfficialSources(): Source[] {
    return this.getSourcesByType('official');
  }
  
  getJournalists(): Source[] {
    return this.getSourcesByType('journalist');
  }
  
  getPublications(): Source[] {
    return this.getSourcesByType('publication');
  }
  
  getAllSources(): Source[] {
    return Array.from(this.sources.values());
  }
  
  hasSource(id: string): boolean {
    return this.sources.has(id);
  }
  
  isVerified(id: string): boolean {
    const source = this.sources.get(id);
    return source?.verified ?? false;
  }
  
  getCredibilityScore(id: string): number {
    const source = this.sources.get(id);
    return source?.credibilityScore ?? 0;
  }
  
  getPriority(id: string): number {
    const source = this.sources.get(id);
    return source?.priority ?? 4;
  }
  
  getSourcesForDataType(dataType: string): Source[] {
    return this.getAllSources().filter(s => s.dataTypes.includes(dataType));
  }
  
  getHighCredibilitySources(threshold: number = 85): Source[] {
    return this.getAllSources().filter(s => s.credibilityScore >= threshold);
  }
}

let registryInstance: SourceRegistry | null = null;

export function getSourceRegistry(): SourceRegistry {
  if (!registryInstance) {
    registryInstance = new SourceRegistry();
  }
  return registryInstance;
}

export function resetRegistry(): void {
  registryInstance = null;
}