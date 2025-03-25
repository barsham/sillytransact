
import { useState, useEffect } from 'react';
import { 
  mockSystemStatus, 
  mockConnections, 
  SystemStatus, 
  ConnectionStatus, 
  formatUptime, 
  formatDate 
} from '@/utils/mockData';
import Navbar from '@/components/Navbar';
import StatusIndicator from '@/components/StatusIndicator';
import ConnectionMonitor from '@/components/ConnectionMonitor';
import DataVisualizer from '@/components/DataVisualizer';
import { ArrowRight, ArrowUpDown, Clock, Cpu, LayoutGrid, RefreshCw } from 'lucide-react';

const Status = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>(mockSystemStatus);
  const [connections, setConnections] = useState<ConnectionStatus[]>(mockConnections);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [cpuChartData, setCpuChartData] = useState([]);
  const [memoryChartData, setMemoryChartData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'status',
    direction: 'asc' as 'asc' | 'desc'
  });

  useEffect(() => {
    // Generate CPU usage data for the chart (last 15 minutes with 1-minute intervals)
    const times = [...Array(15).keys()].map(i => 15 - i);
    
    const cpuData = times.map(minute => {
      const baseValue = systemStatus.reduce((acc, sys) => acc + sys.cpuUsage, 0) / systemStatus.length;
      // Add some random variation
      const variation = Math.random() * 10 - 5;
      return {
        name: `${minute}m`,
        value: Math.max(5, Math.min(95, baseValue + variation))
      };
    });
    
    setCpuChartData(cpuData);
    
    // Generate Memory usage data
    const memoryData = times.map(minute => {
      const baseValue = systemStatus.reduce((acc, sys) => acc + sys.memoryUsage, 0) / systemStatus.length;
      // Add some random variation
      const variation = Math.random() * 8 - 4;
      return {
        name: `${minute}m`,
        value: Math.max(10, Math.min(90, baseValue + variation))
      };
    });
    
    setMemoryChartData(memoryData);
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [systemStatus]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Update some random values to simulate changes
      const updatedSystemStatus = systemStatus.map(status => ({
        ...status,
        cpuUsage: Math.max(5, Math.min(95, status.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.max(10, Math.min(90, status.memoryUsage + (Math.random() * 8 - 4))),
        activeConnections: Math.max(0, Math.min(50, status.activeConnections + Math.floor(Math.random() * 5 - 2))),
        lastUpdated: new Date().toISOString()
      }));
      
      const updatedConnections = connections.map(conn => ({
        ...conn,
        messagesSent: conn.messagesSent + Math.floor(Math.random() * 50),
        messagesReceived: conn.messagesReceived + Math.floor(Math.random() * 45),
        errorRate: Math.max(0, Math.min(5, conn.errorRate + (Math.random() * 0.2 - 0.1))),
        lastActive: new Date().toISOString()
      }));
      
      setSystemStatus(updatedSystemStatus);
      setConnections(updatedConnections);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedSystemStatus = [...systemStatus].sort((a, b) => {
    if (sortConfig.key === 'status') {
      const statusOrder = { online: 1, degraded: 2, maintenance: 3, offline: 4 };
      const aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
      const bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
      
      return sortConfig.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortConfig.key === 'uptime') {
      return sortConfig.direction === 'asc'
        ? a.uptime - b.uptime
        : b.uptime - a.uptime;
    }
    
    if (sortConfig.key === 'cpuUsage') {
      return sortConfig.direction === 'asc'
        ? a.cpuUsage - b.cpuUsage
        : b.cpuUsage - a.cpuUsage;
    }
    
    if (sortConfig.key === 'memoryUsage') {
      return sortConfig.direction === 'asc'
        ? a.memoryUsage - b.memoryUsage
        : b.memoryUsage - a.memoryUsage;
    }
    
    return 0;
  });

  const getSystemStatusSummary = () => {
    const onlineCount = systemStatus.filter(s => s.status === 'online').length;
    const degradedCount = systemStatus.filter(s => s.status === 'degraded').length;
    const offlineCount = systemStatus.filter(s => s.status === 'offline').length;
    const maintenanceCount = systemStatus.filter(s => s.status === 'maintenance').length;
    
    let status = 'All systems operational';
    let statusColor = 'bg-success/10 text-success border-success/20';
    
    if (offlineCount > 0) {
      status = `${offlineCount} system${offlineCount > 1 ? 's' : ''} offline`;
      statusColor = 'bg-destructive/10 text-destructive border-destructive/20';
    } else if (degradedCount > 0) {
      status = `${degradedCount} system${degradedCount > 1 ? 's' : ''} degraded`;
      statusColor = 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    } else if (maintenanceCount > 0) {
      status = `${maintenanceCount} system${maintenanceCount > 1 ? 's' : ''} in maintenance`;
      statusColor = 'bg-warning/10 text-warning border-warning/20';
    }
    
    return { status, statusColor };
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      ) 
      : (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      );
  };

  const systemStatusSummary = getSystemStatusSummary();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pl-[16rem] p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">System Status</h1>
            <p className="text-muted-foreground">Monitor and manage system components</p>
          </header>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className={`text-sm px-4 py-2 rounded-md border ${systemStatusSummary.statusColor}`}>
              {systemStatusSummary.status}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {new Intl.DateTimeFormat('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                }).format(lastUpdated)}
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-input bg-primary/5 text-primary hover:bg-primary/10 transition-all-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Server Status</h2>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <LayoutGrid className="h-3 w-3" />
                      <span>{systemStatus.length} servers</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
                          <button 
                            onClick={() => handleSort('name')}
                            className="flex items-center gap-1"
                          >
                            Name {getSortIcon('name')}
                          </button>
                        </th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
                          <button 
                            onClick={() => handleSort('status')}
                            className="flex items-center gap-1"
                          >
                            Status {getSortIcon('status')}
                          </button>
                        </th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
                          <button 
                            onClick={() => handleSort('uptime')}
                            className="flex items-center gap-1"
                          >
                            Uptime {getSortIcon('uptime')}
                          </button>
                        </th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
                          <button 
                            onClick={() => handleSort('cpuUsage')}
                            className="flex items-center gap-1"
                          >
                            CPU {getSortIcon('cpuUsage')}
                          </button>
                        </th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
                          <button 
                            onClick={() => handleSort('memoryUsage')}
                            className="flex items-center gap-1"
                          >
                            Memory {getSortIcon('memoryUsage')}
                          </button>
                        </th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">
                          Connections
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSystemStatus.map((system) => (
                        <tr key={system.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                <Cpu className="h-4 w-4 text-foreground" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{system.name}</div>
                                <div className="text-xs text-muted-foreground">{system.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <StatusIndicator status={system.status} />
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {formatUptime(system.uptime)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[100px] h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    system.cpuUsage > 80 ? 'bg-destructive' : 
                                    system.cpuUsage > 60 ? 'bg-warning' : 
                                    'bg-success'
                                  }`}
                                  style={{ width: `${system.cpuUsage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{system.cpuUsage}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[100px] h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    system.memoryUsage > 80 ? 'bg-destructive' : 
                                    system.memoryUsage > 60 ? 'bg-warning' : 
                                    'bg-success'
                                  }`}
                                  style={{ width: `${system.memoryUsage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{system.memoryUsage}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {system.activeConnections}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="glass-card p-5">
                <h3 className="text-sm font-medium mb-3">Average CPU Usage</h3>
                <DataVisualizer 
                  title=""
                  type="line"
                  data={cpuChartData}
                  height={150}
                />
              </div>
              
              <div className="glass-card p-5">
                <h3 className="text-sm font-medium mb-3">Average Memory Usage</h3>
                <DataVisualizer 
                  title=""
                  type="line"
                  data={memoryChartData}
                  height={150}
                  colors={['#8b5cf6']}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Network Connections</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map(connection => (
                <ConnectionMonitor 
                  key={connection.id} 
                  connection={connection}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
