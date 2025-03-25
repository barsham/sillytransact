
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'degraded' | 'maintenance' | 'connected' | 'disconnected' | 'error' | 'approved' | 'declined' | 'processing';
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator = ({ status, showLabel = true, className }: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'approved':
        return 'bg-success';
      case 'offline':
      case 'disconnected':
      case 'error':
      case 'declined':
        return 'bg-destructive';
      case 'degraded':
        return 'bg-yellow-500';
      case 'maintenance':
      case 'processing':
        return 'bg-warning';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusLabel = () => {
    // Capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "h-2.5 w-2.5 rounded-full animate-pulse-subtle", 
        getStatusColor()
      )} />
      {showLabel && (
        <span className="text-xs font-medium">{getStatusLabel()}</span>
      )}
    </div>
  );
};

export default StatusIndicator;
