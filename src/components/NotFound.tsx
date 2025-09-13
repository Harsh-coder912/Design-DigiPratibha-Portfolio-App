import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useTheme } from './ThemeProvider';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export default function NotFound() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex items-center justify-between"
      >
        <Link to="/" className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            DigiPratibha
          </span>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </motion.header>

      {/* 404 Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="border-border/50">
            <CardContent className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                404 - Page Not Found
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                Oops! The page you're looking for doesn't exist.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-8">
                <p className="text-sm text-muted-foreground">
                  <strong>Requested URL:</strong> {location.pathname}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The page you're trying to reach might have been moved, deleted, 
                  or you might have typed the URL incorrectly.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2">
                      <Home className="w-4 h-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.history.back()}
                    className="px-6 py-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-medium mb-4">Popular Pages</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Link to="/auth" className="text-primary hover:underline">Sign Up / Login</Link>
                  <Link to="/ai-features" className="text-primary hover:underline">AI Features</Link>
                  <Link to="/about" className="text-primary hover:underline">About Us</Link>
                  <Link to="/contact" className="text-primary hover:underline">Contact</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}