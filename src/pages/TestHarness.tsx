
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TestRunner from '@/components/TestRunner';
import TestResultCard from '@/components/TestResultCard';
import { generateMockTestSuite, TestSuite, TestResult } from '@/utils/testTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/utils/mockData';
import StatusIndicator from '@/components/StatusIndicator';
import { FileText, Download, BarChart } from 'lucide-react';

const TestHarness = () => {
  const [testSuite, setTestSuite] = useState<TestSuite>(generateMockTestSuite(10));
  const [completedResults, setCompletedResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState("runner");

  useEffect(() => {
    // If testSuite changes, collect all completed results
    const results: TestResult[] = [];
    testSuite.tests.forEach(test => {
      if (test.result) {
        results.push(test.result);
      }
    });
    setCompletedResults(results);
  }, [testSuite]);

  const handleTestComplete = (updatedSuite: TestSuite) => {
    setTestSuite(updatedSuite);
    setActiveTab("results");
  };

  const handleExportResults = () => {
    // Create a JSON file with the test results
    const dataStr = JSON.stringify(testSuite, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sillypostilion-test-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const mapStatusToIndicator = (status: string) => {
    switch(status) {
      case 'success': return 'approved';
      case 'failed': return 'declined';
      case 'timeout': return 'error';
      default: return 'processing';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pl-[16rem] p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Test Harness</h1>
              <p className="text-muted-foreground">Simulate transactions and test the processing system</p>
            </div>
            
            {completedResults.length > 0 && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportResults}
              >
                <Download className="h-4 w-4" />
                <span>Export Results</span>
              </Button>
            )}
          </header>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="runner" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Test Runner</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Results</span>
                {completedResults.length > 0 && (
                  <span className="ml-1 h-5 w-5 text-xs bg-secondary rounded-full flex items-center justify-center">
                    {completedResults.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="runner">
              <TestRunner testSuite={testSuite} onTestComplete={handleTestComplete} />
              
              <div className="glass-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Expected Response</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testSuite.tests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-mono">{test.id}</TableCell>
                        <TableCell>{test.name}</TableCell>
                        <TableCell className="capitalize">{test.transactionType}</TableCell>
                        <TableCell>{test.transactionAmount !== undefined ? `$${test.transactionAmount.toFixed(2)}` : 'N/A'}</TableCell>
                        <TableCell className="font-mono">{test.expectedResponseCode}</TableCell>
                        <TableCell>
                          {test.result ? (
                            <StatusIndicator 
                              status={mapStatusToIndicator(test.result.status) as any} 
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">Pending</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {completedResults.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No test results yet</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Run a test suite to see results here
                  </p>
                  <Button onClick={() => setActiveTab("runner")}>
                    Go to Test Runner
                  </Button>
                </div>
              ) : (
                <>
                  {testSuite.endTime && (
                    <div className="glass-card p-5 mb-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Test Suite</h4>
                          <p className="text-lg">{testSuite.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Duration</h4>
                          <p className="text-lg">
                            {new Date(new Date(testSuite.endTime).getTime() - new Date(testSuite.startTime!).getTime()).getSeconds()}s
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Avg Response Time</h4>
                          <p className="text-lg">{Math.round(testSuite.averageResponseTime)}ms</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Success Rate</h4>
                          <p className="text-lg">{Math.round((testSuite.successCount / testSuite.totalTests) * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedResults.map((result) => (
                      <TestResultCard key={result.id} result={result} />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TestHarness;
