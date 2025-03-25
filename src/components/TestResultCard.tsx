
import { cn } from '@/lib/utils';
import { TestResult } from '@/utils/testTypes';
import { formatDate } from '@/utils/mockData';
import StatusIndicator from './StatusIndicator';

interface TestResultCardProps {
  result: TestResult;
  className?: string;
}

const TestResultCard = ({ result, className }: TestResultCardProps) => {
  const getStatusMapping = (status: string) => {
    switch (status) {
      case 'success': return 'approved';
      case 'failed': return 'declined';
      case 'timeout': return 'error';
      default: return 'processing';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'timeout':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className={cn(
      "glass-card p-4 transition-all-300 hover:shadow-glass-hover group",
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m9 10 3 3 3-3"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium">
              {result.testName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {result.id}
            </p>
          </div>
        </div>
        <StatusIndicator status={getStatusMapping(result.status) as any} />
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <span className="text-muted-foreground text-xs">Response Time</span>
          <span className="text-right font-medium">{result.responseTime}ms</span>
          
          <span className="text-muted-foreground text-xs">Response Code</span>
          <span className="text-right font-mono text-xs">{result.responseCode}</span>
          
          <span className="text-muted-foreground text-xs">Protocol</span>
          <span className="text-right text-xs">{result.protocol}</span>
          
          <span className="text-muted-foreground text-xs">Format</span>
          <span className="text-right text-xs">{result.messageFormat}</span>
        </div>
        
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDate(result.timestamp)}
            </span>
            <div className={cn("rounded-full px-2 py-0.5 text-xs", getStatusColor(result.status))}>
              {result.responseMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultCard;
