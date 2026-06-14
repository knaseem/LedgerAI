'use client';

// ── Data Classification Badges ──────────────────────────────────
// Visual indicators for data sensitivity levels, deployed across
// AP/AR modules to demonstrate data governance maturity.

const classificationConfig = {
  confidential: {
    label: 'Confidential',
    abbrev: 'C',
    color: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error/20',
    description: 'PII, bank credentials, SSN',
  },
  internal: {
    label: 'Internal',
    abbrev: 'I',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    description: 'Invoice amounts, vendor names',
  },
  public: {
    label: 'Public',
    abbrev: 'P',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    description: 'Company name, public filings',
  },
} as const;

type Classification = keyof typeof classificationConfig;

interface DataClassificationBadgeProps {
  level: Classification;
  compact?: boolean;
}

export default function DataClassificationBadge({ level, compact = false }: DataClassificationBadgeProps) {
  const config = classificationConfig[level];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded text-[8px] font-bold ${config.bg} ${config.color} border ${config.border}`}
        title={`${config.label} — ${config.description}`}
      >
        {config.abbrev}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${config.bg} ${config.color} border ${config.border}`}
      title={config.description}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.color === 'text-error' ? 'bg-error' : config.color === 'text-warning' ? 'bg-warning' : 'bg-success'}`} />
      {config.label}
    </span>
  );
}

export { classificationConfig };
export type { Classification };
