import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
  href?: string;
  actionLabel?: string;
}

export default function SectionHeader({
  title,
  description,
  action,
  href,
  actionLabel = 'View all',
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-section text-white">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {action}
        {href && (
          <Link
            href={href}
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}