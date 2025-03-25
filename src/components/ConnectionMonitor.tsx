
import { cn } from '@/lib/utils';
import { ConnectionStatus, formatDate } from '@/utils/mockData';
import StatusIndicator from './StatusIndicator';

interface ConnectionMonitorProps {
  connection: ConnectionStatus;
  className?: string;
}

const ConnectionMonitor = ({ connection, className }: ConnectionMonitorProps) => {
  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case 'TCP/IP':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
            <line x1="6" y1="10" x2="6" y2="14"/>
            <line x1="12" y1="10" x2="12" y2="14"/>
            <line x1="18" y1="10" x2="18" y2="14"/>
          </svg>
        );
      case 'HTTP':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        );
      case 'HTTPS':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        );
    }
  };

  const getDataFlowWidth = () => {
    const ratio = connection.messagesReceived / (connection.messagesSent + connection.messagesReceived);
    const percentage = Math.max(10, Math.min(90, ratio * 100));
    return { width: `${percentage}%` };
  };

  const calculateErrorRate = () => {
    if (connection.errorRate === 0) return "0%";
    return `${(connection.errorRate * 100).toFixed(2)}%`;
  };

  return (
    <div className={cn(
      "glass-card p-4 transition-all-300 hover:shadow-glass-hover",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
            {getProtocolIcon(connection.protocol)}
          </div>
          <div>
            <h3 className="text-sm font-medium">
              {connection.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {connection.protocol}
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
              <span className="font-mono">{connection.host}:{connection.port}</span>
            </p>
          </div>
        </div>
        <StatusIndicator status={connection.status as any} />
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-col">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Data Flow</span>
            <span className="font-mono">{connection.messagesReceived} / {connection.messagesSent}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={getDataFlowWidth()}></div>
              <div className="data-flow-line h-full w-full"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">Error Rate</span>
            <span className={cn(
              "font-medium",
              connection.errorRate > 0.5 ? "text-destructive" : 
              connection.errorRate > 0.1 ? "text-warning" : 
              "text-success"
            )}>
              {calculateErrorRate()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1">Last Active</span>
            <span className="font-medium">{formatDate(connection.lastActive).split(', ')[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionMonitor;
