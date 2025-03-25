
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TestSuite, Test, TestResult } from '@/utils/testTypes';
import { generateRandomTransaction } from '@/utils/mockData';
import { toast } from '@/hooks/use-toast';
import { Play, Pause, RefreshCw, Plus } from 'lucide-react';

interface TestRunnerProps {
  testSuite: TestSuite;
  onTestComplete: (updatedSuite: TestSuite) => void;
}

const TestRunner = ({ testSuite, onTestComplete }: TestRunnerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [runningTestSuite, setRunningTestSuite] = useState<TestSuite>({...testSuite});

  const runTest = (test: Test): Promise<TestResult> => {
    return new Promise((resolve) => {
      const mockResponseCodes = ['00', '01', '05', '14', '51', '54'];
      const mockResponseMessages = [
        'Approved', 'Refer to card issuer', 'Do not honor', 
        'Invalid card number', 'Insufficient funds', 'Expired card'
      ];
      
      // Simulate random processing time between 200ms and 2000ms
      const processingTime = Math.floor(Math.random() * 1800) + 200;
      
      // Simulate possible failures or timeouts
      const randomOutcome = Math.random();
      let status: 'success' | 'failed' | 'timeout' | 'unknown';
      let responseCode: string;
      let responseMessage: string;
      
      if (randomOutcome > 0.9) {
        // 10% chance of timeout
        status = 'timeout';
        responseCode = '91';
        responseMessage = 'Issuer or switch inoperative';
      } else if (randomOutcome > 0.7) {
        // 20% chance of failure
        status = 'failed';
        const randomIndex = Math.floor(Math.random() * 5) + 1; // Skip success code
        responseCode = mockResponseCodes[randomIndex];
        responseMessage = mockResponseMessages[randomIndex];
      } else {
        // 70% chance of success
        status = 'success';
        responseCode = '00';
        responseMessage = 'Approved';
      }
      
      // Generate a mock transaction
      const transaction = generateRandomTransaction();
      transaction.type = test.transactionType;
      if (test.transactionAmount) {
        transaction.amount = test.transactionAmount;
      }
      
      // Simulate network delay
      setTimeout(() => {
        resolve({
          id: `result-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toISOString(),
          testName: test.name,
          status,
          transaction,
          responseTime: processingTime,
          responseCode,
          responseMessage,
          protocol: 'TCP/IP',
          messageFormat: 'AS2805'
        });
      }, processingTime);
    });
  };

  const startTestRun = async () => {
    // Reset the test suite
    const resetSuite = {
      ...runningTestSuite,
      successCount: 0,
      failureCount: 0,
      timeoutCount: 0,
      averageResponseTime: 0,
      startTime: new Date().toISOString(),
      endTime: null,
      isRunning: true,
      tests: runningTestSuite.tests.map(test => ({...test, result: null}))
    };
    
    setRunningTestSuite(resetSuite);
    setIsRunning(true);
    setProgress(0);
    setCurrentTestIndex(0);
    toast({
      title: "Test suite started",
      description: `Running ${resetSuite.totalTests} tests...`,
    });
    
    let totalResponseTime = 0;
    let successCount = 0;
    let failureCount = 0;
    let timeoutCount = 0;
    
    for (let i = 0; i < resetSuite.tests.length; i++) {
      if (!isRunning) break; // Check if we should stop
      
      const test = resetSuite.tests[i];
      setCurrentTestIndex(i);
      
      try {
        const result = await runTest(test);
        totalResponseTime += result.responseTime;
        
        // Update counts
        if (result.status === 'success') successCount++;
        else if (result.status === 'failed') failureCount++;
        else if (result.status === 'timeout') timeoutCount++;
        
        // Update the test result
        const updatedTests = [...resetSuite.tests];
        updatedTests[i] = { ...test, result };
        
        const updatedSuite = {
          ...resetSuite,
          tests: updatedTests,
          successCount,
          failureCount,
          timeoutCount,
          averageResponseTime: totalResponseTime / (i + 1)
        };
        
        setRunningTestSuite(updatedSuite);
        setProgress(((i + 1) / resetSuite.tests.length) * 100);
      } catch (error) {
        console.error("Error running test:", error);
      }
    }
    
    // Complete the test run
    const completedSuite = {
      ...runningTestSuite,
      endTime: new Date().toISOString(),
      isRunning: false,
      successCount,
      failureCount,
      timeoutCount,
      averageResponseTime: totalResponseTime / resetSuite.tests.length
    };
    
    setRunningTestSuite(completedSuite);
    setIsRunning(false);
    setProgress(100);
    onTestComplete(completedSuite);
    
    toast({
      title: "Test suite completed",
      description: `Success: ${successCount}, Failed: ${failureCount}, Timeout: ${timeoutCount}`,
    });
  };

  const stopTestRun = () => {
    setIsRunning(false);
    toast({
      title: "Test suite stopped",
      description: "The test run was manually stopped.",
      variant: "destructive"
    });
  };

  return (
    <div className="glass-card p-5 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{runningTestSuite.name}</h3>
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <Button 
                onClick={startTestRun} 
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                <span>Run Tests</span>
              </Button>
            ) : (
              <Button 
                onClick={stopTestRun} 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                <span>Stop</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => {
                const newSuite = {...testSuite};
                setRunningTestSuite(newSuite);
                onTestComplete(newSuite);
              }}
              disabled={isRunning}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {runningTestSuite.description}
        </div>
        
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running test {currentTestIndex + 1} of {runningTestSuite.totalTests}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {!isRunning && runningTestSuite.endTime && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
            <div className="glass-card p-3 text-center">
              <div className="text-2xl font-bold">{runningTestSuite.totalTests}</div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </div>
            <div className="glass-card p-3 text-center bg-success/5">
              <div className="text-2xl font-bold text-success">{runningTestSuite.successCount}</div>
              <div className="text-xs text-muted-foreground">Success</div>
            </div>
            <div className="glass-card p-3 text-center bg-destructive/5">
              <div className="text-2xl font-bold text-destructive">{runningTestSuite.failureCount}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div className="glass-card p-3 text-center bg-yellow-500/5">
              <div className="text-2xl font-bold text-yellow-500">{runningTestSuite.timeoutCount}</div>
              <div className="text-xs text-muted-foreground">Timeout</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRunner;
