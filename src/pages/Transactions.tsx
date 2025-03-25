
import { useState, useEffect } from 'react';
import { mockTransactions, Transaction, generateRandomTransaction, formatDate, formatAmount } from '@/utils/mockData';
import Navbar from '@/components/Navbar';
import TransactionCard from '@/components/TransactionCard';
import StatusIndicator from '@/components/StatusIndicator';
import { Cpu, Filter, Search } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    // Add a new transaction every 20 seconds
    const interval = setInterval(() => {
      const newTransaction = generateRandomTransaction();
      setTransactions(prev => [newTransaction, ...prev]);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply filters
    setIsLoading(true);
    
    setTimeout(() => {
      let results = transactions;
      
      if (searchTerm) {
        results = results.filter(
          txn => 
            txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.cardNumber.includes(searchTerm)
        );
      }
      
      if (statusFilter) {
        results = results.filter(txn => txn.status === statusFilter);
      }
      
      if (typeFilter) {
        results = results.filter(txn => txn.type === typeFilter);
      }
      
      setFilteredTransactions(results);
      setIsLoading(false);
    }, 300); // Small delay to show loading state
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  const handleTypeFilterChange = (type: string | null) => {
    setTypeFilter(type === typeFilter ? null : type);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setTypeFilter(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pl-[16rem] p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and filter transaction records</p>
          </header>
          
          <div className="glass-card p-5 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background/50 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-input bg-background/50 text-muted-foreground hover:text-foreground transition-all-200"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                </div>
                
                <div className="flex border border-input rounded-md overflow-hidden">
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-secondary text-foreground' : 'bg-transparent text-muted-foreground'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="2" x2="22" y1="8" y2="8"/>
                      <line x1="2" x2="22" y1="16" y2="16"/>
                      <rect width="20" height="20" x="2" y="2" rx="2"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'bg-transparent text-muted-foreground'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="7" height="7" x="3" y="3" rx="1"/>
                      <rect width="7" height="7" x="14" y="3" rx="1"/>
                      <rect width="7" height="7" x="14" y="14" rx="1"/>
                      <rect width="7" height="7" x="3" y="14" rx="1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Status filters */}
              <div className="flex gap-2">
                {(['approved', 'declined', 'processing', 'error'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`px-2 py-1 text-xs rounded-full transition-all-200 flex items-center gap-1 ${
                      statusFilter === status 
                        ? 'bg-secondary text-foreground' 
                        : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <StatusIndicator status={status} showLabel={false} />
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </button>
                ))}
              </div>
              
              {/* Type filters */}
              <div className="flex gap-2">
                {(['purchase', 'withdrawal', 'balance', 'transfer', 'refund'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeFilterChange(type)}
                    className={`px-2 py-1 text-xs rounded-full transition-all-200 ${
                      typeFilter === type 
                        ? 'bg-secondary text-foreground' 
                        : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Clear filters button - only show if any filter is active */}
              {(searchTerm || statusFilter || typeFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all-200 ml-auto"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center my-12">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading transactions...</span>
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {!isLoading && filteredTransactions.length === 0 && (
            <div className="glass-card p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                We couldn't find any transactions matching your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:text-primary/80 transition-all-200"
              >
                Clear filters and try again
              </button>
            </div>
          )}
          
          {/* Grid view */}
          {!isLoading && filteredTransactions.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTransactions.map(transaction => (
                <TransactionCard 
                  key={transaction.id} 
                  transaction={transaction}
                />
              ))}
            </div>
          )}
          
          {/* Table view */}
          {!isLoading && filteredTransactions.length > 0 && viewMode === 'table' && (
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date & Time</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Source</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Card</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr 
                      key={transaction.id}
                      className={`border-b border-border hover:bg-secondary/30 transition-colors ${
                        index % 2 === 0 ? 'bg-secondary/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-sm font-mono">{transaction.id}</td>
                      <td className="py-3 px-4 text-sm">{formatDate(transaction.timestamp)}</td>
                      <td className="py-3 px-4 text-sm capitalize">{transaction.type}</td>
                      <td className="py-3 px-4 text-sm font-medium">{formatAmount(transaction.amount)}</td>
                      <td className="py-3 px-4">
                        <StatusIndicator status={transaction.status as any} />
                      </td>
                      <td className="py-3 px-4 text-sm">{transaction.source}</td>
                      <td className="py-3 px-4 text-sm font-mono">{transaction.cardNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
