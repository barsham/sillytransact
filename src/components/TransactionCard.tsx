
import { cn } from '@/lib/utils';
import { Transaction } from '@/utils/mockData';
import { formatDate, formatAmount, getStatusColorClass } from '@/utils/mockData';
import StatusIndicator from './StatusIndicator';

interface TransactionCardProps {
  transaction: Transaction;
  className?: string;
}

const TransactionCard = ({ transaction, className }: TransactionCardProps) => {
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
        );
      case 'withdrawal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <rect x="2" y="8" width="20" height="12" rx="2"/>
            <path d="M6 2v6"/>
            <path d="M18 2v6"/>
            <path d="M12 14v-4"/>
            <path d="m15 12-3-2-3 2"/>
          </svg>
        );
      case 'balance':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" x2="12" y1="8" y2="12"/>
            <line x1="12" x2="12" y1="16" y2="16"/>
          </svg>
        );
      case 'transfer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M17 3v5"/>
            <path d="m12 17 5-5-5-5"/>
            <path d="M7 21v-5"/>
            <path d="m12 7-5 5 5 5"/>
          </svg>
        );
      case 'refund':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <path d="M5 13l4 4L5 21"/>
            <path d="M5 17h10a4 4 0 1 0 0-8H6"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" x2="12" y1="8" y2="16"/>
            <line x1="8" x2="16" y1="12" y2="12"/>
          </svg>
        );
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
            {getTransactionTypeIcon(transaction.type)}
          </div>
          <div>
            <h3 className="text-sm font-medium capitalize">
              {transaction.type}
            </h3>
            <p className="text-xs text-muted-foreground">
              {transaction.id}
            </p>
          </div>
        </div>
        <StatusIndicator status={transaction.status as any} />
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <span className="text-muted-foreground text-xs">Amount</span>
          <span className="text-right font-medium">{formatAmount(transaction.amount)}</span>
          
          <span className="text-muted-foreground text-xs">Card</span>
          <span className="text-right font-mono text-xs">{transaction.cardNumber}</span>
          
          <span className="text-muted-foreground text-xs">Response</span>
          <span className="text-right font-mono text-xs">{transaction.responseCode}</span>
          
          <span className="text-muted-foreground text-xs">Time</span>
          <span className="text-right text-xs">{transaction.processingTime}ms</span>
        </div>
        
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDate(transaction.timestamp)}
            </span>
            <div className="rounded-full bg-secondary/50 px-2 py-0.5 text-xs">
              {transaction.source.split('#')[0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
