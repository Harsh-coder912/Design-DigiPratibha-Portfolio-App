import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Home, User, LogIn, Sparkles } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'admin';
}

interface SimpleAppProps {
  onLogin: (user: User) => void;
  user: User | null;
  onLogout: () => void;
}

export default function SimpleApp({ onLogin, user, onLogout }: SimpleAppProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'student' | 'admin'>('student');

  const handleLogin = () => {
    if (!email || !name) return;
    
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      type: userType
    };
    
    onLogin(userData);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <h1 className="text-xl font-semibold">DigiPratibha</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button 
                  onClick={() => {
                    localStorage.removeItem('digipratibha_simple_mode');
                    window.location.reload();
                  }}
                  variant="outline" 
                  size="sm"
                  className="mr-2"
                >
                  Full Mode
                </Button>
                <Button onClick={onLogout} variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Type:</strong> {user.type}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Portfolio Score:</span>
                    <span className="font-semibold">85/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills Completed:</span>
                    <span className="font-semibold">12/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span className="font-semibold">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Portfolio updated 2 hours ago</p>
                  <p>• New skill added: TypeScript</p>
                  <p>• Project submitted: AI Chatbot</p>
                  <p>• Profile viewed 15 times</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-blue-800 dark:text-blue-200">
                        ⚡ Fast Mode Active - Optimized for performance
                      </p>
                      <Button
                        onClick={() => {
                          localStorage.removeItem('digipratibha_simple_mode');
                          window.location.reload();
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Switch to Full Mode
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is a lightweight version of DigiPratibha designed for quick loading and optimal performance.
                    All core functionality is preserved while providing a smooth user experience. You can switch back to 
                    full mode anytime using the button above.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold">DigiPratibha</h1>
          <p className="text-muted-foreground mt-2">
            AI-Powered Portfolio Builder
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label>User Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={userType === 'student' ? 'default' : 'outline'}
                  onClick={() => setUserType('student')}
                  className="flex-1"
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant={userType === 'admin' ? 'default' : 'outline'}
                  onClick={() => setUserType('admin')}
                  className="flex-1"
                >
                  Admin
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full"
              disabled={!email || !name}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}