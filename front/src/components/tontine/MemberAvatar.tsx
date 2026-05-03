interface MemberAvatarProps {
  nom: string;
  prenom: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B',
  '#EF4444', '#06B6D4', '#EC4899', '#84CC16',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function MemberAvatar({ nom, prenom, size = 'md', className = '' }: MemberAvatarProps) {
  const initials = `${prenom[0] ?? ''}${nom[0] ?? ''}`.toUpperCase();
  const bg = getColor(nom + prenom);
  const sizeClass = `avatar-${size}`;

  return (
    <div
      className={`member-avatar ${sizeClass} ${className}`}
      style={{ backgroundColor: bg }}
      title={`${prenom} ${nom}`}
      aria-label={`${prenom} ${nom}`}
    >
      {initials}
    </div>
  );
}
