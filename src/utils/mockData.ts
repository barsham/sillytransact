
// Mock data for SillyPostilion transaction processing system
export interface Transaction {
  id: string;
  timestamp: string;
  type: 'purchase' | 'withdrawal' | 'balance' | 'transfer' | 'refund';
  amount: number;
  status: 'approved' | 'declined' | 'processing' | 'error';
  source: string;
  destination: string;
  cardNumber: string;
  responseCode: string;
  processingTime: number;
}

export interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  uptime: number;
  activeConnections: number;
  cpuUsage: number;
  memoryUsage: number;
  lastUpdated: string;
}

export interface ConnectionStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  protocol: 'TCP/IP' | 'HTTP' | 'HTTPS';
  host: string;
  port: number;
  lastActive: string;
  messagesSent: number;
  messagesReceived: number;
  errorRate: number;
}

export interface ConfigOption {
  id: string;
  name: string;
  category: 'network' | 'security' | 'processing' | 'monitoring' | 'notification';
  description: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
}

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    type: 'purchase',
    amount: 125.50,
    status: 'approved',
    source: 'POS Terminal #A1234',
    destination: 'Merchant #M5678',
    cardNumber: '************1234',
    responseCode: '00',
    processingTime: 245,
  },
  {
    id: 'txn-002',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    type: 'withdrawal',
    amount: 200.00,
    status: 'approved',
    source: 'ATM #B5678',
    destination: 'Card Issuer #I9012',
    cardNumber: '************5678',
    responseCode: '00',
    processingTime: 188,
  },
  {
    id: 'txn-003',
    timestamp: new Date(Date.now() - 360000).toISOString(),
    type: 'balance',
    amount: 0,
    status: 'approved',
    source: 'Mobile App',
    destination: 'Card Issuer #I9012',
    cardNumber: '************9012',
    responseCode: '00',
    processingTime: 156,
  },
  {
    id: 'txn-004',
    timestamp: new Date(Date.now() - 480000).toISOString(),
    type: 'transfer',
    amount: 500.00,
    status: 'processing',
    source: 'Account #A1234',
    destination: 'Account #B5678',
    cardNumber: '************3456',
    responseCode: '01',
    processingTime: 345,
  },
  {
    id: 'txn-005',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    type: 'purchase',
    amount: 75.25,
    status: 'declined',
    source: 'E-commerce Website',
    destination: 'Merchant #M9012',
    cardNumber: '************7890',
    responseCode: '05',
    processingTime: 267,
  },
  {
    id: 'txn-006',
    timestamp: new Date(Date.now() - 720000).toISOString(),
    type: 'refund',
    amount: 50.00,
    status: 'approved',
    source: 'Merchant #M5678',
    destination: 'Card Issuer #I9012',
    cardNumber: '************1234',
    responseCode: '00',
    processingTime: 298,
  },
];

// Generate system status
export const mockSystemStatus: SystemStatus[] = [
  {
    id: 'sys-001',
    name: 'Main Processing Server',
    status: 'online',
    uptime: 8760, // hours
    activeConnections: 15,
    cpuUsage: 32,
    memoryUsage: 45,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sys-002',
    name: 'Backup Processing Server',
    status: 'online',
    uptime: 720, // hours
    activeConnections: 0,
    cpuUsage: 5,
    memoryUsage: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sys-003',
    name: 'Database Cluster',
    status: 'online',
    uptime: 4380, // hours
    activeConnections: 25,
    cpuUsage: 40,
    memoryUsage: 60,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sys-004',
    name: 'Load Balancer',
    status: 'online',
    uptime: 8760, // hours
    activeConnections: 30,
    cpuUsage: 25,
    memoryUsage: 30,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sys-005',
    name: 'Message Queue',
    status: 'degraded',
    uptime: 2160, // hours
    activeConnections: 10,
    cpuUsage: 70,
    memoryUsage: 85,
    lastUpdated: new Date().toISOString(),
  },
];

// Generate connection status
export const mockConnections: ConnectionStatus[] = [
  {
    id: 'conn-001',
    name: 'Primary Switch Connection',
    status: 'connected',
    protocol: 'TCP/IP',
    host: '192.168.1.100',
    port: 8583,
    lastActive: new Date().toISOString(),
    messagesSent: 15687,
    messagesReceived: 15245,
    errorRate: 0.05,
  },
  {
    id: 'conn-002',
    name: 'Secondary Switch Connection',
    status: 'connected',
    protocol: 'TCP/IP',
    host: '192.168.1.101',
    port: 8583,
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    messagesSent: 5421,
    messagesReceived: 5245,
    errorRate: 0.02,
  },
  {
    id: 'conn-003',
    name: 'VISA Network',
    status: 'connected',
    protocol: 'TCP/IP',
    host: '10.0.1.50',
    port: 7000,
    lastActive: new Date().toISOString(),
    messagesSent: 8547,
    messagesReceived: 8500,
    errorRate: 0.01,
  },
  {
    id: 'conn-004',
    name: 'MasterCard Network',
    status: 'error',
    protocol: 'TCP/IP',
    host: '10.0.1.51',
    port: 7001,
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    messagesSent: 4562,
    messagesReceived: 4502,
    errorRate: 1.25,
  },
  {
    id: 'conn-005',
    name: 'Admin Portal',
    status: 'connected',
    protocol: 'HTTPS',
    host: 'admin.sillypostilion.com',
    port: 443,
    lastActive: new Date().toISOString(),
    messagesSent: 1245,
    messagesReceived: 1245,
    errorRate: 0,
  },
];

// Generate configuration options
export const mockConfigOptions: ConfigOption[] = [
  {
    id: 'cfg-001',
    name: 'TCP/IP Listener Port',
    category: 'network',
    description: 'The port number for the TCP/IP listener service',
    value: '8583',
    type: 'number',
  },
  {
    id: 'cfg-002',
    name: 'Max Connections',
    category: 'network',
    description: 'Maximum number of simultaneous connections',
    value: '100',
    type: 'number',
  },
  {
    id: 'cfg-003',
    name: 'Connection Timeout',
    category: 'network',
    description: 'Connection timeout in seconds',
    value: '30',
    type: 'number',
  },
  {
    id: 'cfg-004',
    name: 'SSL Enabled',
    category: 'security',
    description: 'Enable SSL for secure communications',
    value: 'true',
    type: 'boolean',
  },
  {
    id: 'cfg-005',
    name: 'Encryption Algorithm',
    category: 'security',
    description: 'Algorithm used for data encryption',
    value: 'AES-256',
    type: 'select',
    options: ['AES-128', 'AES-256', 'DES', 'Triple-DES'],
  },
  {
    id: 'cfg-006',
    name: 'Message Format',
    category: 'processing',
    description: 'ISO message format version',
    value: 'ISO8583-1993',
    type: 'select',
    options: ['ISO8583-1987', 'ISO8583-1993', 'ISO8583-2003', 'AS2805'],
  },
  {
    id: 'cfg-007',
    name: 'Transaction Logs Retention',
    category: 'monitoring',
    description: 'Number of days to retain transaction logs',
    value: '90',
    type: 'number',
  },
  {
    id: 'cfg-008',
    name: 'Email Notifications',
    category: 'notification',
    description: 'Enable email notifications for critical events',
    value: 'true',
    type: 'boolean',
  },
  {
    id: 'cfg-009',
    name: 'Admin Email',
    category: 'notification',
    description: 'Email address for administrative notifications',
    value: 'admin@sillypostilion.com',
    type: 'text',
  },
  {
    id: 'cfg-010',
    name: 'Batch Processing Time',
    category: 'processing',
    description: 'Time of day to process batch transactions (24-hour format)',
    value: '23:00',
    type: 'text',
  },
];

// Helper function to generate random transactions
export const generateRandomTransaction = (): Transaction => {
  const types = ['purchase', 'withdrawal', 'balance', 'transfer', 'refund'] as const;
  const statuses = ['approved', 'declined', 'processing', 'error'] as const;
  const sources = ['POS Terminal', 'ATM', 'Mobile App', 'E-commerce', 'Branch'] as const;
  const destinations = ['Merchant', 'Card Issuer', 'Account', 'Bank'] as const;
  const responseCodes = ['00', '01', '05', '14', '51', '54'] as const;
  
  return {
    id: `txn-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    type: types[Math.floor(Math.random() * types.length)],
    amount: parseFloat((Math.random() * 1000).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: `${sources[Math.floor(Math.random() * sources.length)]} #${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000)}`,
    destination: `${destinations[Math.floor(Math.random() * destinations.length)]} #${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000)}`,
    cardNumber: `************${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    responseCode: responseCodes[Math.floor(Math.random() * responseCodes.length)],
    processingTime: Math.floor(Math.random() * 500) + 100,
  };
};

// Helper function to get status color class
export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'approved':
    case 'online':
    case 'connected':
      return 'bg-success/10 text-success border-success/20';
    case 'declined':
    case 'offline':
    case 'disconnected':
    case 'error':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'processing':
    case 'maintenance':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'degraded':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

// Helper function to format dates
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

// Helper function to format amount
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to format uptime
export const formatUptime = (hours: number): string => {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  }
  
  return `${hours}h`;
};
