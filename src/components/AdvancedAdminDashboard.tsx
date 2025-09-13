import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useTheme } from './ThemeProvider';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import MessageCenter from './MessageCenter';
import AnalyticsDashboard from './AnalyticsDashboard';
import PortfolioPreviewModal from './PortfolioPreviewModal';
import EnhancedAIInsights from './EnhancedAIInsights';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Search, 
  Download,
  Mail,
  Eye,
  Star,
  Activity,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  Sun,
  Moon,
  RefreshCw,
  MessageCircle,
  Calendar,
  Filter,
  Brain,
  ChevronDown,
  Clock,
  Target,
  Zap,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Video,
  Send,
  X,
  Plus,
  FileText
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'admin';
}

interface Student {
  id: string;
  name: string;
  email: string;
  skills: string[];
  gpa: number;
  portfolioStatus: 'published' | 'draft';
  achievements: string[];
  views: number;
  rating: number;
  lastActive: string;
  department: string;
  graduationYear: number;
  profileImage: string;
}

interface Analytics {
  overview: {
    totalStudents: number;
    publishedPortfolios: number;
    totalViews: number;
    avgRating: number;
    activeThisMonth: number;
    topPerformers: Array<{ name: string; rating: number; views: number }>;
  };
  skillsPopularity: Array<{ skill: string; count: number }>;
  activityTimeline: Array<{ date: string; portfolios: number; views: number }>;
  departmentDistribution: Array<{ department: string; count: number }>;
  aiInsights: string[];
}

interface AdvancedAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-83d15fec`;

export default function AdvancedAdminDashboard({ user, onLogout }: AdvancedAdminDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [portfolioPreviewOpen, setPortfolioPreviewOpen] = useState(false);
  const [previewStudentId, setPreviewStudentId] = useState<string | null>(null);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [minGpa, setMinGpa] = useState([0]);
  const [portfolioStatus, setPortfolioStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Message state
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // Meeting state
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');

  const availableSkills = [
    'React', 'JavaScript', 'Python', 'Java', 'UI/UX Design', 
    'Machine Learning', 'Data Science', 'AWS', 'Spring Boot', 
    'MySQL', 'Flutter', 'Dart', 'Firebase', 'Mobile Development',
    'Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'
  ];

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use mock analytics data
      const mockAnalytics: Analytics = {
        overview: {
          totalStudents: 124,
          publishedPortfolios: 134,
          totalViews: 12840,
          avgRating: 4.2,
          activeThisMonth: 89,
          topPerformers: [
            { name: 'Sarah Chen', rating: 4.8, views: 312 },
            { name: 'Emily Johnson', rating: 4.6, views: 289 },
            { name: 'Lisa Wang', rating: 4.4, views: 203 }
          ]
        },
        skillsPopularity: [
          { skill: 'React', count: 45 },
          { skill: 'Python', count: 38 },
          { skill: 'JavaScript', count: 52 },
          { skill: 'Java', count: 28 },
          { skill: 'UI/UX Design', count: 22 }
        ],
        activityTimeline: [
          { date: '2024-01-01', portfolios: 120, views: 8400 },
          { date: '2024-01-15', portfolios: 125, views: 9200 },
          { date: '2024-02-01', portfolios: 134, views: 12840 }
        ],
        departmentDistribution: [
          { department: 'Computer Science', count: 45 },
          { department: 'Data Science', count: 28 },
          { department: 'Mobile Development', count: 22 },
          { department: 'Marketing', count: 18 },
          { department: 'Design', count: 11 }
        ],
        aiInsights: [
          'React skills are trending upward (+15% this month)',
          'Portfolio completion rate improved by 8%',
          'Average view time increased to 3.2 minutes',
          'Top performers show consistent skill development'
        ]
      };
      
      setAnalytics(mockAnalytics);
      toast.success('Analytics loaded successfully');
    } catch (error) {
      console.error('Analytics fetch error:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Generate mock students data with filters applied
      let mockStudents: Student[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          email: 'sarah@university.edu',
          department: 'Computer Science',
          skills: ['React', 'JavaScript', 'Python', 'Machine Learning'],
          gpa: 3.8,
          portfolioStatus: 'published',
          achievements: ['Hackathon Winner', 'Research Publication'],
          views: 234,
          rating: 4.6,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        {
          id: '2',
          name: 'Amit Patel',
          email: 'amit@university.edu',
          department: 'Data Science',
          skills: ['Python', 'Machine Learning', 'SQL', 'R'],
          gpa: 3.6,
          portfolioStatus: 'published',
          achievements: ['Data Science Certificate'],
          views: 187,
          rating: 4.3,
          lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
        },
        {
          id: '3',
          name: 'Emily Johnson',
          email: 'emily@university.edu',
          department: 'Computer Science',
          skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
          gpa: 3.9,
          portfolioStatus: 'published',
          achievements: ['Dean\'s List', 'Tech Talk Speaker'],
          views: 312,
          rating: 4.8,
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
        },
        {
          id: '4',
          name: 'David Wilson',
          email: 'david@university.edu',
          department: 'Mobile Development',
          skills: ['Flutter', 'Dart', 'Firebase', 'Mobile Development'],
          gpa: 3.7,
          portfolioStatus: 'draft',
          achievements: ['App Store Publication'],
          views: 156,
          rating: 4.2,
          lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
        },
        {
          id: '5',
          name: 'Lisa Wang',
          email: 'lisa@university.edu',
          department: 'Marketing',
          skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
          gpa: 3.5,
          portfolioStatus: 'published',
          achievements: ['Marketing Campaign Winner'],
          views: 203,
          rating: 4.4,
          lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa'
        }
      ];

      // Apply filters
      if (searchTerm) {
        mockStudents = mockStudents.filter(student => 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedSkills.length > 0) {
        mockStudents = mockStudents.filter(student =>
          selectedSkills.some(skill => student.skills.includes(skill))
        );
      }
      
      if (minGpa[0] > 0) {
        mockStudents = mockStudents.filter(student => student.gpa >= minGpa[0]);
      }
      
      if (portfolioStatus) {
        mockStudents = mockStudents.filter(student => student.portfolioStatus === portfolioStatus);
      }
      
      if (selectedDepartment) {
        mockStudents = mockStudents.filter(student => student.department === selectedDepartment);
      }
      
      setStudents(mockStudents);
      toast.success(`Loaded ${mockStudents.length} students`);
    } catch (error) {
      console.error('Students fetch error:', error);
      toast.error('Failed to load students data');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSkills, minGpa, portfolioStatus, selectedDepartment]);

  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Simulate AI search processing time
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock AI search results based on query
      const query = aiSearchQuery.toLowerCase();
      const mockResults = {
        students: students.filter(student =>
          student.name.toLowerCase().includes(query) ||
          student.skills.some(skill => skill.toLowerCase().includes(query)) ||
          student.department.toLowerCase().includes(query)
        ),
        insights: [
          `Found ${students.length} students matching "${aiSearchQuery}"`,
          `Top skills in results: React, Python, JavaScript`,
          `Average GPA of matching students: 3.7`,
          `Most common department: Computer Science`
        ],
        recommendations: [
          'Consider reaching out to Sarah Chen for frontend opportunities',
          'Emily Johnson shows strong full-stack capabilities', 
          'Data Science students show high engagement rates'
        ]
      };
      
      setAiResults(mockResults);
      toast.success('AI search completed!');
    } catch (error) {
      console.error('AI search error:', error);
      toast.error('AI search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedStudent) return;
    
    try {
      // Simulate message sending time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add to messages array for demonstration
      const newMessage = {
        id: Date.now().toString(),
        sender: 'admin',
        recipient: selectedStudent.name,
        message: messageText,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, newMessage]);
      toast.success('Message sent successfully!');
      setMessageText('');
      setMessageDialogOpen(false);
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    }
  };

  const handleScheduleMeeting = async () => {
    if (!meetingDate || !selectedStudent) return;
    
    try {
      // Simulate meeting scheduling time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock meeting record
      const meeting = {
        id: Date.now().toString(),
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        adminId: user.id,
        date: meetingDate,
        title: meetingTitle || 'Portfolio Discussion',
        description: meetingDescription,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      // In a real app, this would be stored in a meetings state
      console.log('Meeting scheduled:', meeting);
      
      toast.success('Meeting scheduled successfully!');
      setMeetingDialogOpen(false);
      setMeetingDate('');
      setMeetingTitle('');
      setMeetingDescription('');
    } catch (error) {
      console.error('Schedule meeting error:', error);
      toast.error('Failed to schedule meeting');
    }
  };

  const handleExportData = async (format: string) => {
    setLoading(true);
    try {
      // Enhanced export with progress indication
      toast.info(`Preparing ${format.toUpperCase()} export...`);
      
      // Simulate export processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock CSV data
      const csvHeaders = 'Name,Email,Department,GPA,Portfolio Status,Skills,Views,Rating\n';
      const csvData = students.map(student => 
        `"${student.name}","${student.email}","${student.department}",${student.gpa},"${student.portfolioStatus}","${student.skills.join('; ')}",${student.views},${student.rating}`
      ).join('\n');
      
      const csvContent = csvHeaders + csvData;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Use appropriate file extension based on format
      const fileExtension = format === 'json' ? 'json' : 'csv';
      a.download = `students_export_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} exported successfully!`);
      
      // Show user notification about format if converted
      if (format === 'excel' || format === 'pdf') {
        toast.info(`Note: Exported as CSV format (${format.toUpperCase()} support coming soon)`);
      }
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Open portfolio preview
  const handlePreviewPortfolio = (studentId: string) => {
    setPreviewStudentId(studentId);
    setPortfolioPreviewOpen(true);
  };

  // Handle clicking on top performers
  const handleTopPerformerClick = (studentName: string) => {
    const student = students.find(s => s.name === studentName);
    if (student) {
      handlePreviewPortfolio(student.id);
    } else {
      // If student not found in current list, show toast and suggest search
      toast.info(`${studentName} - Use search to find this student's portfolio`);
    }
  };

  useEffect(() => {
    // Add timeout protection for useEffect
    const timeoutId = setTimeout(() => {
      console.warn('useEffect timeout - switching to simple mode');
      localStorage.setItem('digipratibha_simple_mode', 'true');
      window.location.reload();
    }, 25000); // 25 second timeout

    // Clear timeout when effect completes
    Promise.all([fetchAnalytics(), fetchStudents()])
      .then(() => clearTimeout(timeoutId))
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('Dashboard initialization error:', error);
      });

    return () => clearTimeout(timeoutId);
  }, [fetchAnalytics, fetchStudents]);

  if (loading && !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                DigiPratibha
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">Institution Admin</p>
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
              <BarChart3 className="w-4 h-4 mr-3" />
              Analytics Overview
            </Button>
            <Button 
              variant={activeTab === 'students' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('students')}
            >
              <Users className="w-4 h-4 mr-3" />
              Student Management
            </Button>
            <Button 
              variant={activeTab === 'ai-insights' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('ai-insights')}
            >
              <Brain className="w-4 h-4 mr-3" />
              AI Insights
            </Button>
            <Button 
              variant={activeTab === 'communications' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('communications')}
            >
              <MessageCircle className="w-4 h-4 mr-3" />
              Communications
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={fetchAnalytics}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Institution Dashboard</h1>
              <p className="text-muted-foreground">
                {activeTab === 'overview' && 'Analytics and performance metrics'}
                {activeTab === 'students' && 'Manage and discover talented students'}
                {activeTab === 'ai-insights' && 'AI-powered recommendations and insights'}
                {activeTab === 'communications' && 'Message students and schedule meetings'}
                {activeTab === 'settings' && 'Configure your institution settings'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExportData('csv')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData('json')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData('excel')} className="text-muted-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as Excel (Soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData('pdf')} className="text-muted-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF (Soon)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && analytics && (
            <AnalyticsDashboard 
              data={analytics} 
              onRefresh={fetchAnalytics} 
              loading={loading}
              onTopPerformerClick={handleTopPerformerClick}
            />
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Advanced Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Student Filters</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {showFilters ? 'Hide' : 'Show'} Filters
                      <ChevronDown className={`w-4 h-4 ml-2 transform ${showFilters ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={portfolioStatus} onValueChange={setPortfolioStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Portfolio Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showFilters && (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Skills Filter</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {availableSkills.map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox
                                id={skill}
                                checked={selectedSkills.includes(skill)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSkills([...selectedSkills, skill]);
                                  } else {
                                    setSelectedSkills(selectedSkills.filter(s => s !== skill));
                                  }
                                }}
                              />
                              <label htmlFor={skill} className="text-sm">{skill}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Minimum GPA: {minGpa[0].toFixed(1)}
                        </label>
                        <Slider
                          value={minGpa}
                          onValueChange={setMinGpa}
                          max={4.0}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Students Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Students Directory</CardTitle>
                      <CardDescription>Showing {students.length} students</CardDescription>
                    </div>
                    <Button onClick={fetchStudents} disabled={loading}>
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      {loading ? 'Loading...' : 'Search'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Skills</TableHead>
                          <TableHead>GPA</TableHead>
                          <TableHead>Portfolio</TableHead>
                          <TableHead>Performance</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={student.profileImage} />
                                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{student.department}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {student.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {student.skills.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{student.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <span className="font-medium">{student.gpa}</span>
                                <span className="text-xs text-muted-foreground">/4.0</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.portfolioStatus === 'published' ? 'default' : 'secondary'}>
                                {student.portfolioStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{student.rating}</span>
                                <span className="text-xs text-muted-foreground">({student.views} views)</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handlePreviewPortfolio(student.id)}
                                  title="Preview Portfolio"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setMessageDialogOpen(true);
                                  }}
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setMeetingDialogOpen(true);
                                  }}
                                >
                                  <Calendar className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <EnhancedAIInsights onStudentSelect={handlePreviewPortfolio} />
          )}

          {activeTab === 'communications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Center</CardTitle>
                  <CardDescription>Manage messages and meetings with students</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <MessageCenter currentUserId={user.id} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Institution Settings</CardTitle>
                  <CardDescription>Configure your DigiPratibha institution account</CardDescription>
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
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">AI Features</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enable AI recommendations</span>
                        <Button variant="outline" size="sm">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto skill extraction</span>
                        <Button variant="outline" size="sm">Enabled</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Send a direct message to discuss portfolio opportunities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Dialog */}
      <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting with {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Schedule a video call to discuss portfolio and opportunities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Meeting Date & Time</label>
              <Input
                type="datetime-local"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meeting Title</label>
              <Input
                placeholder="Portfolio Discussion"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <Textarea
                placeholder="Agenda and topics to discuss..."
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setMeetingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleMeeting}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Portfolio Preview Modal */}
      <PortfolioPreviewModal
        isOpen={portfolioPreviewOpen}
        onClose={() => {
          setPortfolioPreviewOpen(false);
          setPreviewStudentId(null);
        }}
        studentId={previewStudentId}
        students={students}
        onMessage={(student) => {
          setSelectedStudent(student);
          setMessageDialogOpen(true);
          setPortfolioPreviewOpen(false);
        }}
        onScheduleMeeting={(student) => {
          setSelectedStudent(student);
          setMeetingDialogOpen(true);
          setPortfolioPreviewOpen(false);
        }}
      />
    </div>
  );
}