import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTheme } from './ThemeProvider';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Search, 
  Filter,
  Download,
  Mail,
  Eye,
  Star,
  Calendar,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  Settings,
  LogOut,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'admin';
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

// Mock data
const studentsData = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@university.edu', portfolio: 'Published', lastActive: '2 hours ago', views: 342, rating: 4.8 },
  { id: 2, name: 'Amit Patel', email: 'amit@university.edu', portfolio: 'Draft', lastActive: '1 day ago', views: 128, rating: 4.2 },
  { id: 3, name: 'Emily Johnson', email: 'emily@university.edu', portfolio: 'Published', lastActive: '3 hours ago', views: 256, rating: 4.6 },
  { id: 4, name: 'David Kim', email: 'david@university.edu', portfolio: 'Published', lastActive: '5 hours ago', views: 189, rating: 4.4 },
  { id: 5, name: 'Lisa Wong', email: 'lisa@university.edu', portfolio: 'Draft', lastActive: '2 days ago', views: 67, rating: 3.9 }
];

const analyticsData = [
  { month: 'Jan', portfolios: 12, views: 850, applications: 23 },
  { month: 'Feb', portfolios: 19, views: 1200, applications: 34 },
  { month: 'Mar', portfolios: 25, views: 1650, applications: 45 },
  { month: 'Apr', portfolios: 31, views: 2100, applications: 67 },
  { month: 'May', portfolios: 28, views: 1950, applications: 52 },
  { month: 'Jun', portfolios: 35, views: 2400, applications: 78 }
];

const skillsData = [
  { name: 'React', value: 85, color: '#8884d8' },
  { name: 'Python', value: 78, color: '#82ca9d' },
  { name: 'JavaScript', value: 92, color: '#ffc658' },
  { name: 'Node.js', value: 65, color: '#ff7300' },
  { name: 'Design', value: 45, color: '#8dd1e1' }
];

const topPerformers = [
  { name: 'Sarah Chen', score: 95, portfolio: 'AI Research Portfolio', applications: 12 },
  { name: 'Emily Johnson', score: 92, portfolio: 'UX Design Showcase', applications: 8 },
  { name: 'David Kim', score: 89, portfolio: 'Full-Stack Developer', applications: 15 }
];

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || student.portfolio.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalStudents: studentsData.length,
    publishedPortfolios: studentsData.filter(s => s.portfolio === 'Published').length,
    totalViews: studentsData.reduce((sum, s) => sum + s.views, 0),
    avgRating: studentsData.reduce((sum, s) => sum + s.rating, 0) / studentsData.length
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        className="w-64 bg-card border-r border-border flex flex-col"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              DigiPratibha
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button 
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button 
              variant={activeTab === 'students' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('students')}
            >
              <Users className="w-4 h-4 mr-2" />
              Students
            </Button>
            <Button 
              variant={activeTab === 'analytics' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button 
              variant={activeTab === 'ai-insights' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('ai-insights')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header 
          initial={false}
          className="bg-card border-b border-border px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Institution Dashboard</h1>
              <p className="text-muted-foreground">Manage student portfolios and track success metrics</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Published Portfolios</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.publishedPortfolios}</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+23% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">+0.3 from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Activity</CardTitle>
                    <CardDescription>Monthly portfolio creation and views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Bar dataKey="portfolios" fill="hsl(var(--primary))" />
                        <Bar dataKey="views" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Skills</CardTitle>
                    <CardDescription>Most popular skills among students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={skillsData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {skillsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Students</CardTitle>
                  <CardDescription>Students with highest portfolio ratings and job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.portfolio}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary">Score: {student.score}</Badge>
                          <Badge variant="outline">{student.applications} Applications</Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedFilter('all')}
                      >
                        All
                      </Button>
                      <Button
                        variant={selectedFilter === 'published' ? 'default' : 'outline'}
                        onClick={() => setSelectedFilter('published')}
                      >
                        Published
                      </Button>
                      <Button
                        variant={selectedFilter === 'draft' ? 'default' : 'outline'}
                        onClick={() => setSelectedFilter('draft')}
                      >
                        Draft
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Portfolio Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.portfolio === 'Published' ? 'default' : 'secondary'}>
                              {student.portfolio}
                            </Badge>
                          </TableCell>
                          <TableCell>{student.views}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              {student.rating}
                            </div>
                          </TableCell>
                          <TableCell>{student.lastActive}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance Trends</CardTitle>
                  <CardDescription>Monthly analytics showing portfolio creation, views, and job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Line type="monotone" dataKey="portfolios" stroke="hsl(var(--primary))" name="Portfolios" />
                      <Line type="monotone" dataKey="views" stroke="hsl(var(--chart-1))" name="Views" />
                      <Line type="monotone" dataKey="applications" stroke="hsl(var(--chart-2))" name="Applications" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Average Time on Portfolio</span>
                        <span className="font-medium">3m 24s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bounce Rate</span>
                        <span className="font-medium">24.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Social Shares</span>
                        <span className="font-medium">847</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>PDF Downloads</span>
                        <span className="font-medium">1,234</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Success Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Job Applications Sent</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Interview Invitations</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Job Offers Received</span>
                        <span className="font-medium">34</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Placement Rate</span>
                        <span className="font-medium">78.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai-insights' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>
                    Intelligent recommendations and predictions based on student portfolio data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Skill Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Machine Learning</span>
                            <Badge>High Demand</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Cloud Computing</span>
                            <Badge>Growing</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Data Science</span>
                            <Badge>High Demand</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Career Predictions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Software Engineer</span>
                            <Badge variant="secondary">85% Match</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Data Analyst</span>
                            <Badge variant="secondary">72% Match</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Product Manager</span>
                            <Badge variant="secondary">68% Match</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Portfolio Optimization</h4>
                          <p className="text-sm text-muted-foreground">
                            Students with project descriptions over 150 words receive 40% more views. Consider suggesting longer project descriptions.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Skill Gap Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                            Based on job market trends, students should focus on cloud technologies and DevOps skills for better placement rates.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Engagement Boost</h4>
                          <p className="text-sm text-muted-foreground">
                            Portfolios with professional headshots receive 60% more profile visits. Encourage students to add professional photos.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Institution Settings</CardTitle>
                  <CardDescription>Manage your institution's DigiPratibha configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Institution Name</label>
                    <Input defaultValue="University of Excellence" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Email</label>
                    <Input defaultValue={user.email} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Institution Domain</label>
                    <Input defaultValue="@university.edu" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">AI Features</h4>
                      <p className="text-sm text-muted-foreground">Enable AI-powered suggestions for students</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates about student activity</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}