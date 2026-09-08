import Link from 'next/link';

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
  actionLabel = 'View all' 
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {description && (
          <p className="text-sm text-slate-400 mt-1">{description}</p>
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
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}