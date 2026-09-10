'use client';

import { Search, FileText, User, Trophy } from 'lucide-react';

interface Props {
  type?: 'news' | 'transfers' | 'matches' | 'teams' | 'search';
  message?: string;
  reason?: string;
  action?: React.ReactNode;
}

const typeConfig = {
  news: { icon: FileText, title: 'No news articles found', description: 'Check back later for the latest football updates.' },
  transfers: { icon: User, title: 'No transfers found', description: 'No transfer activity matches your criteria.' },
  matches: { icon: Trophy, title: 'No matches found', description: 'No matches scheduled for the selected filters.' },
  teams: { icon: Trophy, title: 'No teams found', description: 'Try adjusting your search or filters.' },
  search: { icon: Search, title: 'No results found', description: 'Try a different search term.' },
};

export default function EmptyState({ type = 'news', message, reason, action }: Props) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-slate-500">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{message || config.title}</h3>
      <p className="text-slate-400 max-w-sm mb-6">{reason || config.description}</p>
      {action}
    </div>
  );
}