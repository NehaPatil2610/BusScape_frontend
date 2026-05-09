

type Color = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';

interface Props {
  children: React.ReactNode;
  color?: Color;
}

export function Badge({ children, color = 'gray' }: Props) {
  return <span className={`admin-badge admin-badge-${color}`}>{children}</span>;
}

export function statusColor(status: string): Color {
  switch (status) {
    case 'upcoming': return 'blue';
    case 'completed': return 'green';
    case 'cancelled': return 'red';
    case 'approved': return 'green';
    case 'rejected': return 'red';
    case 'pending': return 'yellow';
    default: return 'gray';
  }
}
