
import { Transaction } from './mockData';

export interface TestResult {
  id: string;
  timestamp: string;
  testName: string;
  status: 'success' | 'failed' | 'timeout' | 'unknown';
  transaction: Transaction;
  responseTime: number;
  responseCode: string;
  responseMessage: string;
  protocol: 'TCP/IP' | 'HTTP' | 'HTTPS';
  messageFormat: 'ISO8583-1987' | 'ISO8583-1993' | 'ISO8583-2003' | 'AS2805';
}

export type TestSuite = {
  id: string;
  name: string;
  description: string;
  tests: Test[];
  totalTests: number;
  successCount: number;
  failureCount: number;
  timeoutCount: number;
  averageResponseTime: number;
  startTime: string | null;
  endTime: string | null;
  isRunning: boolean;
};

export type Test = {
  id: string;
  name: string;
  description: string;
  transactionType: 'purchase' | 'withdrawal' | 'balance' | 'transfer' | 'refund';
  transactionAmount?: number;
  expectedResponseCode: string;
  result: TestResult | null;
};

// Generate a mock test suite
export const generateMockTestSuite = (testCount: number = 10): TestSuite => {
  const tests: Test[] = [];
  const transactionTypes = ['purchase', 'withdrawal', 'balance', 'transfer', 'refund'] as const;
  const responseCodes = ['00', '01', '05', '14', '51', '54'];
  
  for (let i = 0; i < testCount; i++) {
    const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    
    tests.push({
      id: `test-${i + 1}`,
      name: `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} Test ${i + 1}`,
      description: `Test ${transactionType} transaction processing`,
      transactionType,
      transactionAmount: transactionType !== 'balance' ? Math.floor(Math.random() * 1000) + 10 : undefined,
      expectedResponseCode: responseCodes[Math.floor(Math.random() * responseCodes.length)],
      result: null
    });
  }
  
  return {
    id: `suite-${Math.random().toString(36).substring(2, 9)}`,
    name: 'Standard Transaction Test Suite',
    description: 'Tests all transaction types with various parameters',
    tests,
    totalTests: tests.length,
    successCount: 0,
    failureCount: 0, 
    timeoutCount: 0,
    averageResponseTime: 0,
    startTime: null,
    endTime: null,
    isRunning: false
  };
};
