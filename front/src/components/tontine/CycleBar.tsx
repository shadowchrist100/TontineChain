interface CycleBarProps {
  total: number;
  current: number;
  beneficiaries?: string[];
}

export function CycleBar({ total, current, beneficiaries = [] }: CycleBarProps) {
  return (
    <div className="cycle-bar">
      {Array.from({ length: total }, (_, i) => {
        const idx = i + 1;
        const isPast = idx < current;
        const isCurrent = idx === current;
        const isFuture = idx > current;
        return (
          <div
            key={idx}
            className={`cycle-step ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}
            title={beneficiaries[i] ? `Tour ${idx} — ${beneficiaries[i]}` : `Tour ${idx}`}
          >
            <div className="cycle-dot">
              <span className="cycle-num">{idx}</span>
            </div>
            {beneficiaries[i] && (
              <span className="cycle-name">{beneficiaries[i]}</span>
            )}
          </div>
        );
      })}
      <div
        className="cycle-progress-line"
        style={{ width: `${Math.max(0, ((current - 1) / Math.max(1, total - 1)) * 100)}%` }}
      />
    </div>
  );
}
