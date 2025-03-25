
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatAmount, generateRandomTransaction, mockSystemStatus, mockConnections, mockTransactions, Transaction } from '@/utils/mockData';
import Navbar from '@/components/Navbar';
import TransactionCard from '@/components/TransactionCard';
import StatusIndicator from '@/components/StatusIndicator';
import ConnectionMonitor from '@/components/ConnectionMonitor';
import DataVisualizer from '@/components/DataVisualizer';
import { ActivitySquare, AlertCircle, ArrowRight, Cpu, Server } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions.slice(0, 3));
  const [stats, setStats] = useState({
    totalTransactions: 15687,
    successRate: 98.7,
    avgResponseTime: 187,
    activeConnections: 12
  });
  const [systemStatus] = useState(mockSystemStatus);
  const [connections] = useState(mockConnections.slice(0, 3));
  const [transactionChartData, setTransactionChartData] = useState([]);
  const [transactionTypeData, setTransactionTypeData] = useState([]);

  // Generate hourly transaction data for the chart
  useEffect(() => {
    const hours = [...Array(24).keys()].map(i => 
      new Date(new Date().setHours(i, 0, 0, 0)).getHours()
    );
    
    const hourlyData = hours.map(hour => {
      // Generate a value between 50 and 300 with a peak during business hours
      let value = Math.floor(Math.random() * 100) + 50;
      if (hour >= 9 && hour <= 17) {
        value += Math.floor(Math.random() * 200);
      }
      
      return {
        name: `${hour}:00`,
        value: value
      };
    });
    
    setTransactionChartData(hourlyData);
    
    // Generate transaction type distribution data
    const typeData = [
      { name: 'Purchase', value: 567 },
      { name: 'Withdrawal', value: 346 },
      { name: 'Balance', value: 209 },
      { name: 'Transfer', value: 178 },
      { name: 'Refund', value: 78 }
    ];
    
    setTransactionTypeData(typeData);
    
    // Simulate new transactions coming in
    const interval = setInterval(() => {
      const newTransaction = generateRandomTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 2)]);
      
      // Update stats slightly
      setStats(prev => ({
        ...prev,
        totalTransactions: prev.totalTransactions + 1,
        successRate: Math.max(95, Math.min(99.9, prev.successRate + (Math.random() * 0.2 - 0.1))),
        avgResponseTime: Math.max(150, Math.min(250, prev.avgResponseTime + (Math.random() * 10 - 5))),
        activeConnections: Math.max(8, Math.min(20, Math.floor(prev.activeConnections + (Math.random() * 2 - 1))))
      }));
      
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const getSystemHealth = () => {
    const onlineCount = systemStatus.filter(s => s.status === 'online').length;
    const totalCount = systemStatus.length;
    const percentage = (onlineCount / totalCount) * 100;
    
    if (percentage === 100) return { text: 'Excellent', color: 'text-success' };
    if (percentage >= 90) return { text: 'Good', color: 'text-success' };
    if (percentage >= 70) return { text: 'Fair', color: 'warning' };
    return { text: 'Poor', color: 'text-destructive' };
  };
  
  const health = getSystemHealth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pl-[16rem] p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">SillyPostilion transaction processing system</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stats cards */}
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <h3 className="text-2xl font-semibold mt-1">
                    {stats.totalTransactions.toLocaleString()}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ActivitySquare className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
                <span className="ml-1">+5.2% from last week</span>
              </div>
            </div>
            
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <h3 className="text-2xl font-semibold mt-1">
                    {stats.successRate.toFixed(1)}%
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="m9 11 3 3L22 4"/>
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
                <span className="ml-1">+0.8% from yesterday</span>
              </div>
            </div>
            
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <h3 className="text-2xl font-semibold mt-1">
                    {Math.round(stats.avgResponseTime)} ms
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-destructive">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
                <span className="ml-1">+12ms from last hour</span>
              </div>
            </div>
            
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <h3 className={`text-2xl font-semibold mt-1 ${health.color}`}>
                    {health.text}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <Server className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-success mr-1.5"></span>
                <span>{systemStatus.filter(s => s.status === 'online').length}/{systemStatus.length} services online</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Transaction Volume</h2>
                  <div className="text-xs px-2 py-1 rounded-full bg-secondary/50">Last 24 hours</div>
                </div>
                <DataVisualizer 
                  title=""
                  type="area"
                  data={transactionChartData}
                  height={220}
                />
              </div>
              
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Connection Status</h2>
                  <button 
                    onClick={() => navigate('/status')}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-all-200"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {connections.map(connection => (
                    <ConnectionMonitor 
                      key={connection.id} 
                      connection={connection}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Transaction Types</h2>
                  <div className="text-xs px-2 py-1 rounded-full bg-secondary/50">This Week</div>
                </div>
                <DataVisualizer 
                  title=""
                  type="pie"
                  data={transactionTypeData}
                  height={220}
                />
              </div>
              
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Recent Transactions</h2>
                  <button 
                    onClick={() => navigate('/transactions')}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-all-200"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {transactions.map(transaction => (
                    <TransactionCard 
                      key={transaction.id} 
                      transaction={transaction}
                    />
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-5 border border-warning/20 bg-warning/5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">System Warning</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      MasterCard Network connection experiencing high error rates. The system has automatically rerouted traffic to the backup connection.
                    </p>
                    <button 
                      onClick={() => navigate('/status')}
                      className="text-xs text-primary hover:text-primary/80 mt-3 flex items-center gap-1 transition-all-200"
                    >
                      View details <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
