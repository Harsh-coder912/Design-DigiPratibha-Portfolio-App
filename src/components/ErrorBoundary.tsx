import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // If it's a component loading timeout or chunk load error, enable simple mode
    if (error.message.includes('timeout') || error.message.includes('Loading chunk') || error.message.includes('ChunkLoadError')) {
      localStorage.setItem('digipratibha_simple_mode', 'true');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    
    // If it's a routing error, try to navigate to home
    if (error.message.includes('No routes matched') || error.message.includes('preview_page')) {
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                There was an error loading the application. This might be due to a network issue or component loading timeout.
              </p>
              
              {this.state.error?.message && (
                <div className="bg-muted/50 p-3 rounded text-xs">
                  <code>{this.state.error.message}</code>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => {
                    localStorage.setItem('digipratibha_simple_mode', 'true');
                    window.location.reload();
                  }}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Switch to Fast Mode
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}