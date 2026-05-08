const AVATAR_COLORS = [
  'bg-primary',
  'bg-success',
  'bg-warning',
  'bg-danger',
  'bg-info',
];

/**
 * Derives a deterministic semantic background color class from a name string.
 */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * Extracts 1–2 character initials from a name string.
 * e.g. "John Doe" → "JD", "Alice" → "A"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
