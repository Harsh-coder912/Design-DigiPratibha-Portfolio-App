import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-83d15fec`;

export default function SystemTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    addResult('Starting system tests...');

    try {
      // Test 1: Health check
      addResult('Testing health check...');
      const healthResponse = await fetch(`${API_BASE}/health`);
      if (healthResponse.ok) {
        addResult('✅ Health check passed');
      } else {
        addResult('❌ Health check failed');
      }

      // Test 2: Analytics endpoint
      addResult('Testing analytics endpoint...');
      const analyticsResponse = await fetch(`${API_BASE}/analytics`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      if (analyticsResponse.ok) {
        addResult('✅ Analytics endpoint working');
      } else {
        addResult('❌ Analytics endpoint failed');
      }

      // Test 3: Students endpoint
      addResult('Testing students endpoint...');
      const studentsResponse = await fetch(`${API_BASE}/students`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      if (studentsResponse.ok) {
        addResult('✅ Students endpoint working');
      } else {
        addResult('❌ Students endpoint failed');
      }

      // Test 4: Export endpoints
      addResult('Testing CSV export...');
      const csvResponse = await fetch(`${API_BASE}/export/csv?type=students`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      if (csvResponse.ok) {
        addResult('✅ CSV export working');
      } else {
        const error = await csvResponse.text();
        addResult(`❌ CSV export failed: ${error}`);
      }

      addResult('Testing JSON export...');
      const jsonResponse = await fetch(`${API_BASE}/export/json?type=analytics`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      if (jsonResponse.ok) {
        addResult('✅ JSON export working');
      } else {
        const error = await jsonResponse.text();
        addResult(`❌ JSON export failed: ${error}`);
      }

      // Test 5: AI Search
      addResult('Testing AI search...');
      const aiResponse = await fetch(`${API_BASE}/ai/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ query: 'students with React skills' })
      });
      if (aiResponse.ok) {
        addResult('✅ AI search working');
      } else {
        addResult('❌ AI search failed');
      }

      addResult('Tests completed!');
      toast.success('System tests completed');

    } catch (error) {
      addResult(`❌ Test error: ${error.message}`);
      toast.error('System tests failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>System Test Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={testing}>
          {testing ? 'Running Tests...' : 'Run System Tests'}
        </Button>
        
        {results.length > 0 && (
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index}>{result}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}