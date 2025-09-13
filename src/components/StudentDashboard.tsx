import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { useTheme } from './ThemeProvider';
import { toast } from 'sonner';
import { 
  Home, Brain, User, TrendingUp, Briefcase, MessageCircle, Users, Settings, 
  LogOut, Sun, Moon, Bell, Search, Sparkles, Plus, Save, Eye, Download, 
  Share2, Target, BookOpen, Award, Calendar, Clock, FileText, Code, 
  Camera, Video, Mic, BarChart3, PieChart, LineChart, Zap, Star, 
  ChevronRight, ChevronDown, Menu, Filter, ExternalLink, Lightbulb,
  GraduationCap, MapPin, Mail, Phone, LinkedinIcon, Github,
  Layout, Type, Image, Edit, Trash2, Wand2, Palette, Loader2,
  CheckCircle, AlertCircle, RefreshCw, PlayCircle, BookmarkPlus, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Cell,
  AreaChart, Area, ComposedChart
} from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'admin';
  portfolioId?: string;
}

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface SkillData {
  skill: string;
  current: number;
  target: number;
  growth: number;
  trend: number[];
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'soft-skills';
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'ongoing' | 'completed' | 'planned' | 'paused';
  progress: number;
  tech: string[];
  aiScore: number;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  commits: number;
  linesOfCode: number;
}

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  match: number;
  location: string;
  type: 'internship' | 'full-time' | 'part-time' | 'contract';
  skills: string[];
  salary?: string;
  posted: string;
  applied: boolean;
}

interface PortfolioComponent {
  id: string;
  type: 'text' | 'image' | 'project' | 'skill' | 'contact' | 'education' | 'experience' | 'testimonial' | 'certificate';
  content: any;
  style: any;
  order: number;
}

interface FormData {
  [key: string]: string | number | boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [portfolioComponents, setPortfolioComponents] = useState<PortfolioComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced mock data with more realistic values
  const [dashboardData, setDashboardData] = useState({
    portfolioScore: 78,
    skillsLearned: 12,
    ongoingProjects: 3,
    jobMatches: 5,
    weeklyProgress: 85,
    nextMilestone: 'Complete React certification',
    aiTip: "Based on current market trends, adding TypeScript to your skill set could increase your job match rate by 25%.",
    totalPoints: 1980,
    rank: 3,
    streakDays: 7,
    certificatesEarned: 3,
    hoursLearned: 45,
    practiceProjects: 8
  });

  const [skillsData, setSkillsData] = useState<SkillData[]>([
    { 
      skill: 'React', 
      current: 85, 
      target: 95, 
      growth: 15, 
      trend: [70, 75, 78, 80, 82, 85],
      category: 'frontend'
    },
    { 
      skill: 'Python', 
      current: 78, 
      target: 90, 
      growth: 12, 
      trend: [60, 65, 70, 73, 76, 78],
      category: 'backend'
    },
    { 
      skill: 'JavaScript', 
      current: 90, 
      target: 95, 
      growth: 8, 
      trend: [80, 82, 85, 87, 88, 90],
      category: 'frontend'
    },
    { 
      skill: 'Node.js', 
      current: 70, 
      target: 85, 
      growth: 20, 
      trend: [45, 50, 58, 62, 67, 70],
      category: 'backend'
    },
    { 
      skill: 'TypeScript', 
      current: 45, 
      target: 80, 
      growth: 35, 
      trend: [10, 15, 25, 32, 38, 45],
      category: 'frontend'
    },
    { 
      skill: 'MongoDB', 
      current: 60, 
      target: 75, 
      growth: 18, 
      trend: [30, 35, 42, 48, 55, 60],
      category: 'database'
    }
  ]);

  const [projectsData, setProjectsData] = useState<ProjectData[]>([
    {
      id: '1',
      title: 'E-commerce Web App',
      description: 'Full-stack MERN application with payment integration and admin dashboard',
      status: 'ongoing',
      progress: 75,
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
      aiScore: 88,
      deadline: '2024-02-15',
      priority: 'high',
      commits: 127,
      linesOfCode: 5420
    },
    {
      id: '2',
      title: 'AI Chatbot',
      description: 'Natural language processing chatbot using Python and TensorFlow',
      status: 'completed',
      progress: 100,
      tech: ['Python', 'TensorFlow', 'Flask', 'NLP', 'Docker'],
      aiScore: 92,
      deadline: '2024-01-20',
      priority: 'medium',
      commits: 89,
      linesOfCode: 3200
    },
    {
      id: '3',
      title: 'Mobile Task Manager',
      description: 'React Native app for productivity management with offline sync',
      status: 'planned',
      progress: 10,
      tech: ['React Native', 'Firebase', 'Redux', 'Async Storage'],
      aiScore: 0,
      deadline: '2024-03-30',
      priority: 'medium',
      commits: 5,
      linesOfCode: 150
    },
    {
      id: '4',
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for sales analytics using D3.js',
      status: 'paused',
      progress: 40,
      tech: ['D3.js', 'React', 'Express', 'PostgreSQL'],
      aiScore: 75,
      deadline: '2024-04-15',
      priority: 'low',
      commits: 34,
      linesOfCode: 1800
    }
  ]);

  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([
    {
      id: '1',
      title: 'Frontend Developer Intern',
      company: 'TechCorp Inc.',
      match: 92,
      location: 'Remote',
      type: 'internship',
      skills: ['React', 'JavaScript', 'CSS', 'Git'],
      salary: '$15-20/hour',
      posted: '2 days ago',
      applied: false
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      match: 85,
      location: 'San Francisco, CA',
      type: 'full-time',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      salary: '$80,000-100,000',
      posted: '1 week ago',
      applied: true
    },
    {
      id: '3',
      title: 'Python Developer Intern',
      company: 'DataTech Solutions',
      match: 78,
      location: 'New York, NY',
      type: 'internship',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      salary: '$18-25/hour',
      posted: '3 days ago',
      applied: false
    },
    {
      id: '4',
      title: 'React Developer',
      company: 'WebFlow Agency',
      match: 88,
      location: 'Remote',
      type: 'contract',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
      salary: '$40-60/hour',
      posted: '5 days ago',
      applied: false
    }
  ]);

  // Memoized chart data for performance
  const skillChartData = useMemo(() => 
    skillsData.map(skill => ({
      skill: skill.skill,
      current: skill.current,
      target: skill.target,
      growth: skill.growth
    }))
  , [skillsData]);

  const skillRadarData = useMemo(() => 
    skillsData.map(skill => ({
      skill: skill.skill.substring(0, 8),
      value: skill.current,
      fullMark: 100
    }))
  , [skillsData]);

  const progressTrendData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        skills: Math.floor(Math.random() * 20) + 70,
        projects: Math.floor(Math.random() * 15) + 60,
        portfolio: Math.floor(Math.random() * 10) + 75
      });
    }
    return last7Days;
  }, []);

  const portfolioData = {
    title: `${user.name}'s Portfolio`,
    subtitle: 'Aspiring Full Stack Developer',
    bio: 'Passionate computer science student with experience in web development, AI, and cloud technologies. Always eager to learn and take on new challenges.',
    skills: ['React', 'Python', 'JavaScript', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Git'],
    education: 'Computer Science, University of Technology',
    location: 'San Francisco, CA',
    experience: '2+ years of project experience'
  };

  const componentTypes = [
    { type: 'text', icon: Type, label: 'Text Block', description: 'Add headings, paragraphs, or quotes' },
    { type: 'image', icon: Image, label: 'Image', description: 'Upload photos or graphics' },
    { type: 'project', icon: Layout, label: 'Project Card', description: 'Showcase your work' },
    { type: 'skill', icon: Star, label: 'Skill Bar', description: 'Display your skills and ratings' },
    { type: 'contact', icon: Mail, label: 'Contact Form', description: 'Let visitors reach out' },
    { type: 'education', icon: GraduationCap, label: 'Education', description: 'Academic background' },
    { type: 'experience', icon: Briefcase, label: 'Experience', description: 'Work experience' },
    { type: 'testimonial', icon: MessageCircle, label: 'Testimonial', description: 'Client/peer reviews' },
    { type: 'certificate', icon: Award, label: 'Certificate', description: 'Certifications and achievements' }
  ];

  // Form validation utility
  const validateForm = useCallback((data: FormData, rules: any): ValidationResult => {
    const errors: string[] = [];
    
    Object.keys(rules).forEach(field => {
      const value = data[field];
      const rule = rules[field];
      
      if (rule.required && (!value || value === '')) {
        errors.push(`${field} is required`);
      }
      
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      
      if (rule.email && typeof value === 'string' && !/\S+@\S+\.\S+/.test(value)) {
        errors.push(`${field} must be a valid email`);
      }
      
      if (rule.url && typeof value === 'string' && !/^https?:\/\/.+/.test(value)) {
        errors.push(`${field} must be a valid URL`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }, []);

  // Enhanced AI chat with better responses
  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    const newUserMessage = { 
      role: 'user' as const, 
      content: userMessage, 
      timestamp: new Date() 
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);

    // Show typing indicator
    setLoading(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let aiResponse = '';
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('portfolio')) {
        if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
          aiResponse = `Great question! Based on your current portfolio score of ${dashboardData.portfolioScore}/100, I recommend: 1) Add more project details and screenshots, 2) Include testimonials from peers or mentors, 3) Showcase your ${skillsData[0].skill} skills more prominently since you're at ${skillsData[0].current}%, 4) Add a professional headshot. Would you like me to help you implement any of these suggestions?`;
        } else {
          aiResponse = `Your portfolio is looking good! You have ${portfolioComponents.length} components added. To make it stand out, consider adding a brief video introduction, more detailed project case studies, and quantifiable achievements. Your strongest skill (${skillsData.find(s => s.current === Math.max(...skillsData.map(sk => sk.current)))?.skill}) should be highlighted prominently!`;
        }
      } else if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
        const topMatch = jobRecommendations.reduce((max, job) => job.match > max.match ? job : max);
        aiResponse = `Your career prospects look promising! You have ${jobRecommendations.length} job matches with your top match being "${topMatch.title}" at ${topMatch.company} (${topMatch.match}% match). To improve your chances: 1) Complete your TypeScript learning (currently ${skillsData.find(s => s.skill === 'TypeScript')?.current}%), 2) Build more projects showcasing full-stack skills, 3) Practice coding interviews. Should I create a personalized action plan?`;
      } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
        const weakestSkill = skillsData.reduce((min, skill) => skill.current < min.current ? skill : min);
        const strongestSkill = skillsData.reduce((max, skill) => skill.current > max.current ? skill : max);
        aiResponse = `Your skill development is on track! Strongest: ${strongestSkill.skill} (${strongestSkill.current}%), Focus area: ${weakestSkill.skill} (${weakestSkill.current}% - target: ${weakestSkill.target}%). Based on market trends, I suggest prioritizing: 1) ${weakestSkill.skill} to reach your target, 2) Adding cloud skills (AWS/Azure), 3) DevOps fundamentals. Want a detailed learning roadmap?`;
      } else if (lowerMessage.includes('project')) {
        const ongoingProjects = projectsData.filter(p => p.status === 'ongoing').length;
        aiResponse = `You have ${ongoingProjects} ongoing projects - great momentum! Your "E-commerce Web App" project (${projectsData[0].progress}% complete) is performing well with an AI score of ${projectsData[0].aiScore}/100. For your next project, consider: 1) A machine learning project to complement your Python skills, 2) A mobile app using React Native, 3) An open-source contribution. What type of project interests you most?`;
      } else if (lowerMessage.includes('deadline') || lowerMessage.includes('time')) {
        const upcomingProject = projectsData.find(p => p.deadline && new Date(p.deadline) > new Date());
        if (upcomingProject) {
          aiResponse = `Your next deadline is "${upcomingProject.title}" on ${upcomingProject.deadline}. At ${upcomingProject.progress}% completion, you're ${upcomingProject.progress > 75 ? 'on track' : 'behind schedule'}. I recommend focusing ${upcomingProject.progress < 50 ? '3-4 hours daily' : '2-3 hours daily'} to meet your deadline. Need help breaking down the remaining tasks?`;
        } else {
          aiResponse = `Good news! You're ahead of schedule on your current projects. This is a perfect time to start planning your next project or dive deeper into learning new skills. Consider working on that TypeScript proficiency!`;
        }
      } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
        aiResponse = `I'm here to help with everything related to your academic and professional growth! I can assist with: 📚 Study planning & skill development, 🚀 Career guidance & job matching, 💼 Portfolio optimization, 🎯 Project management & deadlines, 📈 Progress tracking & analytics, 💡 Personalized recommendations. What would you like to focus on today?`;
      } else {
        aiResponse = `I understand you're asking about "${userMessage}". As your AI mentor, I'm here to help with portfolio development, career planning, skill building, and project management. Could you be more specific about what aspect you'd like assistance with? For example, ask about "improving my portfolio" or "career advice for frontend development."`;
      }

      const aiMessage = { 
        role: 'ai' as const, 
        content: aiResponse, 
        timestamp: new Date() 
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('AI mentor is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [chatInput, dashboardData, skillsData, jobRecommendations, portfolioComponents, projectsData]);

  // Enhanced portfolio component management
  const addPortfolioComponent = useCallback((type: string) => {
    const newComponent: PortfolioComponent = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      content: getDefaultContent(type),
      style: { 
        padding: '16px', 
        margin: '8px',
        backgroundColor: 'transparent',
        borderRadius: '8px'
      },
      order: portfolioComponents.length
    };
    
    setPortfolioComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
    toast.success(`${componentTypes.find(c => c.type === type)?.label} added successfully!`);
  }, [portfolioComponents.length]);

  const getDefaultContent = useCallback((type: string) => {
    const defaults = {
      text: { 
        text: 'Your compelling content here...', 
        size: 'medium', 
        align: 'left',
        style: 'paragraph'
      },
      image: { 
        src: '', 
        alt: 'Professional image', 
        width: '100%',
        caption: ''
      },
      project: { 
        title: 'Project Title', 
        description: 'Detailed project description highlighting your role and achievements...', 
        tech: [], 
        link: '',
        github: '',
        demo: '',
        features: []
      },
      skill: { 
        skill: 'Skill Name', 
        level: 80,
        description: 'Brief description of your expertise level'
      },
      contact: { 
        title: 'Get In Touch', 
        fields: ['name', 'email', 'message'],
        socialLinks: []
      },
      education: { 
        degree: 'Bachelor of Science', 
        field: 'Computer Science', 
        university: 'University Name', 
        year: '2024',
        gpa: '',
        honors: []
      },
      experience: { 
        title: 'Software Developer Intern', 
        company: 'Company Name', 
        duration: '2023-2024', 
        description: 'Detailed description of your responsibilities and achievements...',
        achievements: []
      },
      testimonial: {
        quote: 'Outstanding work and dedication to quality...',
        author: 'Client/Colleague Name',
        position: 'Title at Company',
        avatar: ''
      },
      certificate: {
        name: 'Certificate Name',
        issuer: 'Issuing Organization',
        date: '2024',
        credentialId: '',
        verifyUrl: ''
      }
    };
    
    return defaults[type as keyof typeof defaults] || {};
  }, []);

  const removePortfolioComponent = useCallback((id: string) => {
    setPortfolioComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
    toast.success('Component removed successfully');
  }, [selectedComponent]);

  const updatePortfolioComponent = useCallback((id: string, updates: any) => {
    setPortfolioComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  }, []);

  // Enhanced AI content generation
  const generateAIContent = useCallback(async (type: string, context?: any) => {
    setLoading(true);
    toast.info('AI is generating content...', { duration: 2000 });
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const responses = {
        'portfolio-summary': () => {
          const summary = `Dynamic ${portfolioData.subtitle.toLowerCase()} with ${skillsData.length} core technical skills and ${projectsData.length} projects completed. Specialized in ${skillsData.slice(0, 3).map(s => s.skill).join(', ')} with proven track record in full-stack development. Currently maintaining a ${dashboardData.portfolioScore}/100 portfolio score with growing expertise in modern web technologies.`;
          toast.success('AI generated a compelling portfolio summary!');
          return summary;
        },
        'skill-roadmap': () => {
          const weakSkills = skillsData.filter(s => s.current < s.target).sort((a, b) => (b.target - b.current) - (a.target - a.current));
          toast.success(`AI created a learning roadmap focusing on ${weakSkills.length} skills!`);
          return `Prioritized learning path: ${weakSkills.slice(0, 3).map(s => `${s.skill} (${s.current}% → ${s.target}%)`).join(', ')}`;
        },
        'project-ideas': () => {
          const userSkills = skillsData.filter(s => s.current > 70).map(s => s.skill);
          const ideas = [
            `${userSkills[0]} Dashboard with real-time analytics`,
            `${userSkills[1]} API with microservices architecture`,
            `Full-stack ${userSkills.slice(0, 2).join(' + ')} application`,
            `Mobile app using React Native and ${userSkills[2] || 'Firebase'}`,
            `AI-powered tool using ${userSkills.includes('Python') ? 'Python' : userSkills[0]}`
          ];
          toast.success('AI suggested 5 personalized project ideas!');
          return ideas;
        },
        'resume-tips': () => {
          toast.success('AI analyzed your profile and provided resume optimization tips!');
          return `Focus on quantifiable achievements, highlight your ${skillsData[0].skill} expertise, and include metrics from your projects.`;
        }
      };
      
      const result = responses[type as keyof typeof responses]?.() || 'AI content generated successfully!';
      return result;
      
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('AI content generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [portfolioData, skillsData, projectsData, dashboardData]);

  // Enhanced search functionality
  const filteredContent = useMemo(() => {
    if (!searchQuery) return { projects: projectsData, jobs: jobRecommendations, skills: skillsData };
    
    const query = searchQuery.toLowerCase();
    return {
      projects: projectsData.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tech.some(t => t.toLowerCase().includes(query))
      ),
      jobs: jobRecommendations.filter(j =>
        j.title.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.skills.some(s => s.toLowerCase().includes(query))
      ),
      skills: skillsData.filter(s =>
        s.skill.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      )
    };
  }, [searchQuery, projectsData, jobRecommendations, skillsData]);

  // Save form data with validation
  const saveFormData = useCallback(async (data: FormData, validationRules?: any) => {
    if (validationRules) {
      const validation = validateForm(data, validationRules);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return false;
      }
    }
    
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(prev => ({ ...prev, ...data }));
      toast.success('Changes saved successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to save changes. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateForm]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'portfolio', label: 'Portfolio Builder', icon: User },
    { id: 'skills', label: 'Skill Analytics', icon: TrendingUp },
    { id: 'projects', label: 'Project Hub', icon: Code },
    { id: 'career', label: 'Career Center', icon: Briefcase },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-lg opacity-90">Ready to level up your career journey?</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">{dashboardData.streakDays} day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span className="text-sm">{dashboardData.certificatesEarned} certificates</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{dashboardData.hoursLearned}h learned</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{dashboardData.totalPoints}</div>
            <div className="text-sm opacity-75">Total Points</div>
            <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
              Rank #{dashboardData.rank}
            </Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Score</p>
                <p className="text-2xl font-bold text-purple-500">{dashboardData.portfolioScore}/100</p>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% this week
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skills Mastered</p>
                <p className="text-2xl font-bold text-green-500">{dashboardData.skillsLearned}</p>
                <div className="flex items-center text-xs text-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  2 this month
                </div>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-blue-500">{dashboardData.ongoingProjects}</p>
                <div className="flex items-center text-xs text-blue-500">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  {projectsData.filter(p => p.status === 'ongoing').length} in progress
                </div>
              </div>
              <Code className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Job Matches</p>
                <p className="text-2xl font-bold text-orange-500">{dashboardData.jobMatches}</p>
                <div className="flex items-center text-xs text-orange-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {jobRecommendations.filter(j => j.match > 85).length} high match
                </div>
              </div>
              <Briefcase className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={progressTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="skills" stroke="#8b5cf6" fill="#8b5cf6/20" />
                <Area type="monotone" dataKey="projects" stroke="#06b6d4" fill="#06b6d4/20" />
                <Area type="monotone" dataKey="portfolio" stroke="#10b981" fill="#10b981/20" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Skills" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900 dark:text-purple-100">Daily AI Tip</p>
                  <p className="text-purple-800 dark:text-purple-200 mt-1 text-sm">{dashboardData.aiTip}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-purple-300 text-purple-700"
                    onClick={() => generateAIContent('skill-roadmap')}
                  >
                    Get Learning Plan
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Next Milestone</p>
                  <p className="text-blue-800 dark:text-blue-200 mt-1 text-sm">{dashboardData.nextMilestone}</p>
                  <Progress value={75} className="mt-2 h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Projects
              <Button variant="outline" size="sm" onClick={() => setActiveSection('projects')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectsData.slice(0, 3).map(project => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{project.title}</p>
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.tech.slice(0, 3).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.progress}%</p>
                    <Progress value={project.progress} className="w-16 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Skill Growth This Week
              <Button variant="outline" size="sm" onClick={() => setActiveSection('skills')}>
                Analytics
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillsData.slice(0, 4).map(skill => (
                <div key={skill.skill} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{skill.skill}</span>
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={skill.current} className="w-20 h-2" />
                    <Badge variant="secondary" className="text-xs">+{skill.growth}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Enhanced component editing state
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [componentFormData, setComponentFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editMode, setEditMode] = useState<'inline' | 'panel'>('inline');
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);

  // Enhanced file upload handler with multiple file types
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, componentId: string, field: string = 'src') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP, SVG)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(imageUrl);
        updatePortfolioComponent(componentId, {
          content: {
            ...portfolioComponents.find(c => c.id === componentId)?.content,
            [field]: imageUrl
          }
        });
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }, [portfolioComponents, updatePortfolioComponent]);

  // Inline text editor
  const handleInlineTextEdit = useCallback((componentId: string, field: string, value: string) => {
    updatePortfolioComponent(componentId, {
      content: {
        ...portfolioComponents.find(c => c.id === componentId)?.content,
        [field]: value
      }
    });
  }, [portfolioComponents, updatePortfolioComponent]);

  // Dynamic list management (for arrays like tech, features, etc.)
  const updateArrayField = useCallback((componentId: string, field: string, index: number, value: string) => {
    const component = portfolioComponents.find(c => c.id === componentId);
    if (component) {
      const currentArray = component.content[field] || [];
      const newArray = [...currentArray];
      if (value.trim() === '' && index < newArray.length) {
        newArray.splice(index, 1);
      } else {
        newArray[index] = value;
      }
      updatePortfolioComponent(componentId, {
        content: {
          ...component.content,
          [field]: newArray.filter(item => item.trim() !== '')
        }
      });
    }
  }, [portfolioComponents, updatePortfolioComponent]);

  const addArrayItem = useCallback((componentId: string, field: string) => {
    const component = portfolioComponents.find(c => c.id === componentId);
    if (component) {
      const currentArray = component.content[field] || [];
      updatePortfolioComponent(componentId, {
        content: {
          ...component.content,
          [field]: [...currentArray, '']
        }
      });
    }
  }, [portfolioComponents, updatePortfolioComponent]);

  // Component editor form
  const renderComponentEditor = (component: PortfolioComponent) => {
    if (!component) return null;

    const updateContent = (key: string, value: any) => {
      updatePortfolioComponent(component.id, {
        content: {
          ...component.content,
          [key]: value
        }
      });
    };

    switch (component.type) {
      case 'text':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Edit Text Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Text Style</Label>
                <Select 
                  value={component.content.style || 'paragraph'} 
                  onValueChange={(value) => updateContent('style', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heading">Heading (H2)</SelectItem>
                    <SelectItem value="subheading">Subheading (H3)</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content</Label>
                <Textarea 
                  value={component.content.text}
                  onChange={(e) => updateContent('text', e.target.value)}
                  placeholder="Enter your text content..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Text Alignment</Label>
                <Select 
                  value={component.content.align || 'left'} 
                  onValueChange={(value) => updateContent('align', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 'image':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Edit Image Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, component.id)}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">Max size: 5MB. Supported: JPG, PNG, WebP</p>
              </div>
              {(component.content.src || imagePreview) && (
                <div className="border rounded-lg p-4">
                  <img 
                    src={component.content.src || imagePreview} 
                    alt={component.content.alt}
                    className="max-w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              <div>
                <Label>Alt Text</Label>
                <Input 
                  value={component.content.alt}
                  onChange={(e) => updateContent('alt', e.target.value)}
                  placeholder="Describe the image for accessibility..."
                />
              </div>
              <div>
                <Label>Caption (Optional)</Label>
                <Input 
                  value={component.content.caption || ''}
                  onChange={(e) => updateContent('caption', e.target.value)}
                  placeholder="Image caption..."
                />
              </div>
              <div>
                <Label>Width</Label>
                <Select 
                  value={component.content.width || '100%'} 
                  onValueChange={(value) => updateContent('width', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50%">50%</SelectItem>
                    <SelectItem value="75%">75%</SelectItem>
                    <SelectItem value="100%">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 'project':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                Edit Project Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Title</Label>
                <Input 
                  value={component.content.title}
                  onChange={(e) => updateContent('title', e.target.value)}
                  placeholder="Enter project title..."
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={component.content.description}
                  onChange={(e) => updateContent('description', e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Technologies Used</Label>
                <Input 
                  value={component.content.tech?.join(', ') || ''}
                  onChange={(e) => updateContent('tech', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                  placeholder="React, Node.js, MongoDB..."
                />
                <p className="text-xs text-muted-foreground mt-1">Separate technologies with commas</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Live Demo URL</Label>
                  <Input 
                    value={component.content.demo || ''}
                    onChange={(e) => updateContent('demo', e.target.value)}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input 
                    value={component.content.github || ''}
                    onChange={(e) => updateContent('github', e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
              <div>
                <Label>Key Features</Label>
                <Textarea 
                  value={component.content.features?.join('\n') || ''}
                  onChange={(e) => updateContent('features', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Enter key features (one per line)..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'skill':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Edit Skill Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Skill Name</Label>
                <Input 
                  value={component.content.skill}
                  onChange={(e) => updateContent('skill', e.target.value)}
                  placeholder="e.g., React, Python, Design..."
                />
              </div>
              <div>
                <Label>Proficiency Level: {component.content.level}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={component.content.level}
                  onChange={(e) => updateContent('level', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Textarea 
                  value={component.content.description || ''}
                  onChange={(e) => updateContent('description', e.target.value)}
                  placeholder="Brief description of your expertise..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'education':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Edit Education Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Degree</Label>
                  <Input 
                    value={component.content.degree}
                    onChange={(e) => updateContent('degree', e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input 
                    value={component.content.field}
                    onChange={(e) => updateContent('field', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
              </div>
              <div>
                <Label>University/Institution</Label>
                <Input 
                  value={component.content.university}
                  onChange={(e) => updateContent('university', e.target.value)}
                  placeholder="University Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Graduation Year</Label>
                  <Input 
                    value={component.content.year}
                    onChange={(e) => updateContent('year', e.target.value)}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input 
                    value={component.content.gpa || ''}
                    onChange={(e) => updateContent('gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
              <div>
                <Label>Honors/Awards (Optional)</Label>
                <Textarea 
                  value={component.content.honors?.join('\n') || ''}
                  onChange={(e) => updateContent('honors', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Dean's List, Magna Cum Laude..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'experience':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Edit Experience Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Job Title</Label>
                <Input 
                  value={component.content.title}
                  onChange={(e) => updateContent('title', e.target.value)}
                  placeholder="Software Developer"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input 
                    value={component.content.company}
                    onChange={(e) => updateContent('company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input 
                    value={component.content.duration}
                    onChange={(e) => updateContent('duration', e.target.value)}
                    placeholder="Jan 2023 - Present"
                  />
                </div>
              </div>
              <div>
                <Label>Job Description</Label>
                <Textarea 
                  value={component.content.description}
                  onChange={(e) => updateContent('description', e.target.value)}
                  placeholder="Describe your role and responsibilities..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Key Achievements</Label>
                <Textarea 
                  value={component.content.achievements?.join('\n') || ''}
                  onChange={(e) => updateContent('achievements', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Increased performance by 30%..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'testimonial':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Edit Testimonial Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Quote</Label>
                <Textarea 
                  value={component.content.quote}
                  onChange={(e) => updateContent('quote', e.target.value)}
                  placeholder="Enter the testimonial quote..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Author Name</Label>
                  <Input 
                    value={component.content.author}
                    onChange={(e) => updateContent('author', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label>Author Position</Label>
                  <Input 
                    value={component.content.position}
                    onChange={(e) => updateContent('position', e.target.value)}
                    placeholder="CEO at Company"
                  />
                </div>
              </div>
              <div>
                <Label>Author Photo (Optional)</Label>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateContent('avatar', event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'certificate':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Edit Certificate Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Certificate Name</Label>
                <Input 
                  value={component.content.name}
                  onChange={(e) => updateContent('name', e.target.value)}
                  placeholder="AWS Certified Developer"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Issuing Organization</Label>
                  <Input 
                    value={component.content.issuer}
                    onChange={(e) => updateContent('issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Date Issued</Label>
                  <Input 
                    value={component.content.date}
                    onChange={(e) => updateContent('date', e.target.value)}
                    placeholder="March 2024"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Credential ID (Optional)</Label>
                  <Input 
                    value={component.content.credentialId || ''}
                    onChange={(e) => updateContent('credentialId', e.target.value)}
                    placeholder="ABC123XYZ"
                  />
                </div>
                <div>
                  <Label>Verification URL (Optional)</Label>
                  <Input 
                    value={component.content.verifyUrl || ''}
                    onChange={(e) => updateContent('verifyUrl', e.target.value)}
                    placeholder="https://verify.example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'contact':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Edit Contact Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Section Title</Label>
                <Input 
                  value={component.content.title}
                  onChange={(e) => updateContent('title', e.target.value)}
                  placeholder="Get In Touch"
                />
              </div>
              <div>
                <Label>Contact Methods</Label>
                <div className="space-y-2">
                  {['Email', 'LinkedIn', 'GitHub', 'Phone', 'Website'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={component.content.methods?.includes(method.toLowerCase()) || false}
                        onChange={(e) => {
                          const methods = component.content.methods || [];
                          if (e.target.checked) {
                            updateContent('methods', [...methods, method.toLowerCase()]);
                          } else {
                            updateContent('methods', methods.filter((m: string) => m !== method.toLowerCase()));
                          }
                        }}
                      />
                      <Label>{method}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Builder</h2>
          <p className="text-muted-foreground">Create and customize your professional portfolio with AI assistance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => saveFormData(formData)}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Draft'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/portfolio/preview')}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Share2 className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Component Palette */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Components</CardTitle>
              <p className="text-sm text-muted-foreground">Click to add to portfolio</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {componentTypes.map((component) => (
                <Button
                  key={component.type}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => addPortfolioComponent(component.type)}
                >
                  <component.icon className="w-4 h-4 mr-3 text-purple-500" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{component.label}</p>
                    <p className="text-xs text-muted-foreground">{component.description}</p>
                  </div>
                </Button>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <p className="font-medium text-sm flex items-center">
                  <Wand2 className="w-4 h-4 mr-2 text-purple-500" />
                  AI Tools
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => generateAIContent('portfolio-summary')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                  Generate Summary
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => generateAIContent('project-ideas')}
                  disabled={loading}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Suggest Projects
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => generateAIContent('resume-tips')}
                  disabled={loading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Resume Tips
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Portfolio Canvas with Editor */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Portfolio Preview */}
            <div className="lg:col-span-2">
              <Card className="min-h-[600px]">
                <CardContent className="p-6">
                  {/* Portfolio Header */}
                  <div className="text-center mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{portfolioData.title}</h1>
                    <p className="text-xl text-muted-foreground mb-2">{portfolioData.subtitle}</p>
                    <p className="text-muted-foreground mb-4">{portfolioData.location}</p>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{portfolioData.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {portfolioData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" size="sm">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <Button variant="outline" size="sm">
                        <LinkedinIcon className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>

                  {/* Dynamic Components */}
                  <div className="space-y-4">
                    {portfolioComponents.map((component) => (
                      <div
                        key={component.id}
                        className={`group relative p-4 rounded-lg border border-border/50 hover:border-purple-300 cursor-pointer transition-all ${
                          selectedComponent === component.id ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/10' : ''
                        }`}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingComponent(component.id);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePortfolioComponent(component.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {component.type === 'text' && (
                          <div className="prose dark:prose-invert">
                            {selectedComponent === component.id ? (
                              <div>
                                <Textarea
                                  value={component.content.text}
                                  onChange={(e) => handleInlineTextEdit(component.id, 'text', e.target.value)}
                                  placeholder="Enter your text content..."
                                  className="min-h-[100px] mb-2 bg-white/50 dark:bg-gray-800/50"
                                  autoFocus
                                />
                                <div className="flex space-x-2 mb-2">
                                  <Select 
                                    value={component.content.style || 'paragraph'} 
                                    onValueChange={(value) => handleInlineTextEdit(component.id, 'style', value)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="heading">Heading</SelectItem>
                                      <SelectItem value="subheading">Subheading</SelectItem>
                                      <SelectItem value="paragraph">Paragraph</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select 
                                    value={component.content.align || 'left'} 
                                    onValueChange={(value) => handleInlineTextEdit(component.id, 'align', value)}
                                  >
                                    <SelectTrigger className="w-24">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="center">Center</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ) : (
                              <div onClick={() => setSelectedComponent(component.id)} className="cursor-text">
                                {component.content.style === 'heading' ? (
                                  <h2 style={{ textAlign: component.content.align }}>
                                    {component.content.text || 'Click to edit text...'}
                                  </h2>
                                ) : component.content.style === 'subheading' ? (
                                  <h3 style={{ textAlign: component.content.align }}>
                                    {component.content.text || 'Click to edit text...'}
                                  </h3>
                                ) : (
                                  <p style={{ textAlign: component.content.align }}>
                                    {component.content.text || 'Click to edit text...'}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'image' && (
                          <div className="text-center">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label className="block mb-2">Upload Image</Label>
                                  <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, component.id, 'src')}
                                    className="cursor-pointer"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Max size: 10MB. Supported: JPG, PNG, WebP, SVG</p>
                                </div>
                                {component.content.src && (
                                  <div className="border rounded-lg p-4">
                                    <img 
                                      src={component.content.src} 
                                      alt={component.content.alt}
                                      className="max-w-full h-auto rounded-lg mx-auto"
                                      style={{ width: component.content.width }}
                                    />
                                  </div>
                                )}
                                <div>
                                  <Label>Alt Text</Label>
                                  <Input 
                                    value={component.content.alt || ''}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'alt', e.target.value)}
                                    placeholder="Describe the image for accessibility..."
                                  />
                                </div>
                                <div>
                                  <Label>Caption (Optional)</Label>
                                  <Input 
                                    value={component.content.caption || ''}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'caption', e.target.value)}
                                    placeholder="Image caption..."
                                  />
                                </div>
                                <div>
                                  <Label>Width</Label>
                                  <Select 
                                    value={component.content.width || '100%'} 
                                    onValueChange={(value) => handleInlineTextEdit(component.id, 'width', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="25%">25%</SelectItem>
                                      <SelectItem value="50%">50%</SelectItem>
                                      <SelectItem value="75%">75%</SelectItem>
                                      <SelectItem value="100%">100%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ) : (
                              <div>
                                {component.content.src ? (
                                  <div>
                                    <img 
                                      src={component.content.src} 
                                      alt={component.content.alt}
                                      className="max-w-full h-auto rounded-lg mx-auto cursor-pointer hover:opacity-90"
                                      style={{ width: component.content.width }}
                                      onClick={() => setSelectedComponent(component.id)}
                                    />
                                    {component.content.caption && (
                                      <p className="text-sm text-muted-foreground mt-2">{component.content.caption}</p>
                                    )}
                                  </div>
                                ) : (
                                  <div 
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-purple-400 transition-colors"
                                    onClick={() => setSelectedComponent(component.id)}
                                  >
                                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500">Click to upload image</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'project' && (
                          <div className="space-y-3">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Project Title</Label>
                                  <Input 
                                    value={component.content.title}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'title', e.target.value)}
                                    placeholder="Enter project title..."
                                  />
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Textarea 
                                    value={component.content.description}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'description', e.target.value)}
                                    placeholder="Describe your project..."
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label>Technologies</Label>
                                  <div className="space-y-2">
                                    {(component.content.tech || []).map((tech: string, index: number) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <Input
                                          value={tech}
                                          onChange={(e) => updateArrayField(component.id, 'tech', index, e.target.value)}
                                          placeholder="Technology name..."
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => updateArrayField(component.id, 'tech', index, '')}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addArrayItem(component.id, 'tech')}
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add Technology
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Live Demo URL</Label>
                                    <Input 
                                      value={component.content.demo || ''}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'demo', e.target.value)}
                                      placeholder="https://myproject.com"
                                    />
                                  </div>
                                  <div>
                                    <Label>GitHub URL</Label>
                                    <Input 
                                      value={component.content.github || ''}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'github', e.target.value)}
                                      placeholder="https://github.com/username/repo"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Key Features</Label>
                                  <div className="space-y-2">
                                    {(component.content.features || []).map((feature: string, index: number) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <Input
                                          value={feature}
                                          onChange={(e) => updateArrayField(component.id, 'features', index, e.target.value)}
                                          placeholder="Feature description..."
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => updateArrayField(component.id, 'features', index, '')}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addArrayItem(component.id, 'features')}
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add Feature
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2 cursor-pointer hover:text-purple-600" onClick={() => setSelectedComponent(component.id)}>
                                      {component.content.title || 'Click to add project title...'}
                                    </h3>
                                    <p className="text-muted-foreground mb-3 cursor-pointer" onClick={() => setSelectedComponent(component.id)}>
                                      {component.content.description || 'Click to add project description...'}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="ml-2">Featured</Badge>
                                </div>
                                {component.content.tech && component.content.tech.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {component.content.tech.map((tech: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {component.content.features && component.content.features.length > 0 && (
                                  <ul className="text-sm text-muted-foreground mb-3">
                                    {component.content.features.map((feature: string, index: number) => (
                                      <li key={index}>• {feature}</li>
                                    ))}
                                  </ul>
                                )}
                                <div className="flex space-x-2">
                                  {component.content.demo && (
                                    <Button variant="outline" size="sm" onClick={() => window.open(component.content.demo, '_blank')}>
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Live Demo
                                    </Button>
                                  )}
                                  {component.content.github && (
                                    <Button variant="outline" size="sm" onClick={() => window.open(component.content.github, '_blank')}>
                                      <Github className="w-3 h-3 mr-1" />
                                      Source Code
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'skill' && (
                          <div className="space-y-2">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Skill Name</Label>
                                  <Input 
                                    value={component.content.skill}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'skill', e.target.value)}
                                    placeholder="e.g., React, Python, Design..."
                                  />
                                </div>
                                <div>
                                  <Label>Proficiency Level: {component.content.level}%</Label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={component.content.level}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'level', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Beginner</span>
                                    <span>Intermediate</span>
                                    <span>Expert</span>
                                  </div>
                                </div>
                                <div>
                                  <Label>Description (Optional)</Label>
                                  <Textarea 
                                    value={component.content.description || ''}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'description', e.target.value)}
                                    placeholder="Brief description of your expertise..."
                                    rows={2}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between">
                                  <span 
                                    className="font-medium cursor-pointer hover:text-purple-600" 
                                    onClick={() => setSelectedComponent(component.id)}
                                  >
                                    {component.content.skill || 'Click to add skill name...'}
                                  </span>
                                  <span className="text-sm text-muted-foreground">{component.content.level}%</span>
                                </div>
                                <Progress value={component.content.level} className="h-3 cursor-pointer" onClick={() => setSelectedComponent(component.id)} />
                                {component.content.description && (
                                  <p className="text-sm text-muted-foreground">{component.content.description}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'education' && (
                          <div className="space-y-2">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Degree</Label>
                                    <Input 
                                      value={component.content.degree}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'degree', e.target.value)}
                                      placeholder="Bachelor of Science"
                                    />
                                  </div>
                                  <div>
                                    <Label>Field of Study</Label>
                                    <Input 
                                      value={component.content.field}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'field', e.target.value)}
                                      placeholder="Computer Science"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>University/Institution</Label>
                                  <Input 
                                    value={component.content.university}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'university', e.target.value)}
                                    placeholder="University Name"
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Graduation Year</Label>
                                    <Input 
                                      value={component.content.year}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'year', e.target.value)}
                                      placeholder="2024"
                                    />
                                  </div>
                                  <div>
                                    <Label>GPA (Optional)</Label>
                                    <Input 
                                      value={component.content.gpa || ''}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'gpa', e.target.value)}
                                      placeholder="3.8/4.0"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Honors/Awards</Label>
                                  <div className="space-y-2">
                                    {(component.content.honors || []).map((honor: string, index: number) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <Input
                                          value={honor}
                                          onChange={(e) => updateArrayField(component.id, 'honors', index, e.target.value)}
                                          placeholder="Honor or award..."
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => updateArrayField(component.id, 'honors', index, '')}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addArrayItem(component.id, 'honors')}
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add Honor/Award
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start justify-between">
                                  <div className="cursor-pointer" onClick={() => setSelectedComponent(component.id)}>
                                    <h3 className="font-bold hover:text-purple-600">
                                      {component.content.degree || 'Click to add degree'} in {component.content.field || 'field'}
                                    </h3>
                                    <p className="text-purple-600 dark:text-purple-400">
                                      {component.content.university || 'Click to add university'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {component.content.year || 'Click to add year'}
                                    </p>
                                  </div>
                                  <GraduationCap className="w-6 h-6 text-purple-500" />
                                </div>
                                {component.content.gpa && (
                                  <p className="text-sm"><strong>GPA:</strong> {component.content.gpa}</p>
                                )}
                                {component.content.honors && component.content.honors.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium">Honors:</p>
                                    <ul className="text-sm text-muted-foreground">
                                      {component.content.honors.map((honor: string, index: number) => (
                                        <li key={index}>• {honor}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'experience' && (
                          <div className="space-y-2">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Job Title</Label>
                                  <Input 
                                    value={component.content.title}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'title', e.target.value)}
                                    placeholder="Software Developer"
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Company</Label>
                                    <Input 
                                      value={component.content.company}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'company', e.target.value)}
                                      placeholder="Company Name"
                                    />
                                  </div>
                                  <div>
                                    <Label>Duration</Label>
                                    <Input 
                                      value={component.content.duration}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'duration', e.target.value)}
                                      placeholder="Jan 2023 - Present"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Job Description</Label>
                                  <Textarea 
                                    value={component.content.description}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'description', e.target.value)}
                                    placeholder="Describe your role and responsibilities..."
                                    rows={4}
                                  />
                                </div>
                                <div>
                                  <Label>Key Achievements</Label>
                                  <div className="space-y-2">
                                    {(component.content.achievements || []).map((achievement: string, index: number) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <Input
                                          value={achievement}
                                          onChange={(e) => updateArrayField(component.id, 'achievements', index, e.target.value)}
                                          placeholder="Achievement description..."
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => updateArrayField(component.id, 'achievements', index, '')}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addArrayItem(component.id, 'achievements')}
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add Achievement
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start justify-between">
                                  <div className="cursor-pointer" onClick={() => setSelectedComponent(component.id)}>
                                    <h3 className="font-bold hover:text-purple-600">
                                      {component.content.title || 'Click to add job title...'}
                                    </h3>
                                    <p className="text-purple-600 dark:text-purple-400">
                                      {component.content.company || 'Click to add company...'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {component.content.duration || 'Click to add duration...'}
                                    </p>
                                  </div>
                                  <Briefcase className="w-6 h-6 text-purple-500" />
                                </div>
                                <p className="text-sm cursor-pointer" onClick={() => setSelectedComponent(component.id)}>
                                  {component.content.description || 'Click to add job description...'}
                                </p>
                                {component.content.achievements && component.content.achievements.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium">Key Achievements:</p>
                                    <ul className="text-sm text-muted-foreground">
                                      {component.content.achievements.map((achievement: string, index: number) => (
                                        <li key={index}>• {achievement}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'testimonial' && (
                          <div className="bg-muted/50 p-4 rounded-lg">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Quote</Label>
                                  <Textarea 
                                    value={component.content.quote}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'quote', e.target.value)}
                                    placeholder="Enter the testimonial quote..."
                                    rows={3}
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Author Name</Label>
                                    <Input 
                                      value={component.content.author}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'author', e.target.value)}
                                      placeholder="John Smith"
                                    />
                                  </div>
                                  <div>
                                    <Label>Author Position</Label>
                                    <Input 
                                      value={component.content.position}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'position', e.target.value)}
                                      placeholder="CEO at Company"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Author Photo (Optional)</Label>
                                  <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, component.id, 'avatar')}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <blockquote 
                                  className="text-lg italic mb-3 cursor-pointer hover:text-purple-600" 
                                  onClick={() => setSelectedComponent(component.id)}
                                >
                                  "{component.content.quote || 'Click to add testimonial quote...'}"
                                </blockquote>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-10 h-10">
                                    {component.content.avatar ? (
                                      <AvatarImage src={component.content.avatar} alt={component.content.author} />
                                    ) : (
                                      <AvatarFallback>{component.content.author?.charAt(0) || 'A'}</AvatarFallback>
                                    )}
                                  </Avatar>
                                  <div className="cursor-pointer" onClick={() => setSelectedComponent(component.id)}>
                                    <p className="font-medium hover:text-purple-600">
                                      {component.content.author || 'Click to add author name...'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {component.content.position || 'Click to add position...'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'certificate' && (
                          <div className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Certificate Name</Label>
                                  <Input 
                                    value={component.content.name}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'name', e.target.value)}
                                    placeholder="AWS Certified Developer"
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Issuing Organization</Label>
                                    <Input 
                                      value={component.content.issuer}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'issuer', e.target.value)}
                                      placeholder="Amazon Web Services"
                                    />
                                  </div>
                                  <div>
                                    <Label>Date Issued</Label>
                                    <Input 
                                      value={component.content.date}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'date', e.target.value)}
                                      placeholder="March 2024"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Credential ID (Optional)</Label>
                                    <Input 
                                      value={component.content.credentialId || ''}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'credentialId', e.target.value)}
                                      placeholder="ABC123XYZ"
                                    />
                                  </div>
                                  <div>
                                    <Label>Verification URL (Optional)</Label>
                                    <Input 
                                      value={component.content.verifyUrl || ''}
                                      onChange={(e) => handleInlineTextEdit(component.id, 'verifyUrl', e.target.value)}
                                      placeholder="https://verify.example.com"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <Award className="w-8 h-8 text-yellow-600" />
                                <div className="cursor-pointer" onClick={() => setSelectedComponent(component.id)}>
                                  <h3 className="font-bold hover:text-purple-600">
                                    {component.content.name || 'Click to add certificate name...'}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    {component.content.issuer || 'Click to add issuer'} • {component.content.date || 'Date'}
                                  </p>
                                  {component.content.credentialId && (
                                    <p className="text-xs text-muted-foreground">ID: {component.content.credentialId}</p>
                                  )}
                                  {component.content.verifyUrl && (
                                    <a 
                                      href={component.content.verifyUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-xs text-blue-600 hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Verify Certificate
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {component.type === 'contact' && (
                          <div className="text-center space-y-4">
                            {selectedComponent === component.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Section Title</Label>
                                  <Input 
                                    value={component.content.title}
                                    onChange={(e) => handleInlineTextEdit(component.id, 'title', e.target.value)}
                                    placeholder="Get In Touch"
                                  />
                                </div>
                                <div>
                                  <Label>Contact Methods</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['email', 'linkedin', 'github', 'phone', 'website'].map((method) => (
                                      <div key={method} className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          checked={component.content.methods?.includes(method) || false}
                                          onChange={(e) => {
                                            const methods = component.content.methods || [];
                                            if (e.target.checked) {
                                              handleInlineTextEdit(component.id, 'methods', [...methods, method]);
                                            } else {
                                              handleInlineTextEdit(component.id, 'methods', methods.filter((m: string) => m !== method));
                                            }
                                          }}
                                        />
                                        <Label className="capitalize">{method}</Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 
                                  className="font-bold text-lg cursor-pointer hover:text-purple-600"
                                  onClick={() => setSelectedComponent(component.id)}
                                >
                                  {component.content.title || 'Click to add contact title...'}
                                </h3>
                                <div className="flex justify-center space-x-4">
                                  {(component.content.methods || ['email', 'linkedin', 'github']).map((method: string) => {
                                    const icons = {
                                      email: Mail,
                                      linkedin: LinkedinIcon,
                                      github: Github,
                                      phone: Phone,
                                      website: ExternalLink
                                    };
                                    const Icon = icons[method as keyof typeof icons] || Mail;
                                    return (
                                      <Button key={method} variant="outline" size="sm">
                                        <Icon className="w-4 h-4 mr-2" />
                                        {method.charAt(0).toUpperCase() + method.slice(1)}
                                      </Button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {portfolioComponents.length === 0 && (
                      <div className="text-center py-16 text-muted-foreground">
                        <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Start Building Your Portfolio</h3>
                        <p className="mb-4">Add components from the left panel to create your professional portfolio</p>
                        <Button 
                          onClick={() => addPortfolioComponent('text')}
                          className="bg-gradient-to-r from-purple-500 to-pink-500"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Component
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Component Editor Panel */}
            <div className="lg:col-span-1">
              {selectedComponent && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between">
                        Component Editor
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedComponent(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Click on any component in the portfolio to edit its properties.
                      </p>
                      <Button 
                        onClick={() => setEditingComponent(selectedComponent)}
                        className="w-full"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Component
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {editingComponent === selectedComponent && renderComponentEditor(
                    portfolioComponents.find(c => c.id === selectedComponent)!
                  )}
                </>
              )}
              
              {!selectedComponent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>1. Click any component type on the left to add it to your portfolio</p>
                      <p>2. Click on a component in the portfolio to select it</p>
                      <p>3. Use the editor panel to customize content, upload images, and modify properties</p>
                      <p>4. Preview your changes in real-time</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skill Analytics</h2>
          <p className="text-muted-foreground">Track your learning journey and get AI-powered recommendations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => generateAIContent('skill-roadmap')}>
            <Brain className="w-4 h-4 mr-2" />
            AI Learning Path
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Skill Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current vs Target Skills</CardTitle>
              <p className="text-sm text-muted-foreground">Progress toward your learning goals</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={skillChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="current" fill="#8b5cf6" name="Current Level" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#e5e7eb" name="Target Level" radius={[4, 4, 0, 0]} />
                  <Line dataKey="growth" stroke="#10b981" strokeWidth={3} name="Growth %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Progression Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsLineChart data={skillsData.map(skill => ({
                  skill: skill.skill,
                  ...skill.trend.reduce((acc, val, idx) => ({...acc, [`week${idx+1}`]: val}), {})
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  {[1,2,3,4,5,6].map(week => (
                    <Line 
                      key={week}
                      dataKey={`week${week}`} 
                      stroke={`hsl(${(week-1) * 60}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Skill Recommendations */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Priority Focus</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Complete TypeScript fundamentals. High market demand with 35% growth potential!
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full border-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      toast.success("🚀 TypeScript Learning Plan Created!", {
                        description: "Added 12-week TypeScript roadmap to your learning goals."
                      });
                      
                      // Update TypeScript skill or add if not exists
                      const hasTypeScript = skillsData.some(skill => 
                        skill.skill.toLowerCase().includes('typescript')
                      );
                      
                      if (!hasTypeScript) {
                        const newSkill = {
                          skill: 'TypeScript',
                          current: 25,
                          target: 80,
                          growth: 55,
                          trend: [0, 5, 10, 15, 20, 25],
                          category: 'frontend' as const
                        };
                        setSkillsData(prev => [...prev, newSkill]);
                      } else {
                        // Update existing TypeScript skill
                        setSkillsData(prev => prev.map(skill => 
                          skill.skill.toLowerCase().includes('typescript') ? 
                          { 
                            ...skill, 
                            target: Math.max(skill.target, 80),
                            growth: Math.max(skill.growth, 35)
                          } : skill
                        ));
                      }
                      setLoading(false);
                    }, 1500);
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <PlayCircle className="w-3 h-3 mr-2" />}
                  Start Learning
                </Button>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                  <span className="font-medium text-green-900 dark:text-green-100">Growth Opportunity</span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your React skills are strong (85%). Consider learning Next.js or React Native!
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full border-green-200 hover:bg-green-100 dark:hover:bg-green-800/50"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      const options = ['Next.js', 'React Native', 'Remix'];
                      const selectedOption = options[Math.floor(Math.random() * options.length)];
                      
                      toast.success(`🌟 ${selectedOption} Recommended!`, {
                        description: `Based on your React expertise, ${selectedOption} offers the best career growth opportunities.`
                      });
                      
                      // Show exploration modal or add to learning goals
                      const explorationPlan = {
                        technology: selectedOption,
                        timeframe: '8-10 weeks',
                        projects: ['Portfolio Migration', 'E-commerce App', 'Mobile App'],
                        salaryIncrease: '$15,000 - $25,000',
                        demandGrowth: '40% YoY'
                      };
                      
                      console.log('Exploration Plan:', explorationPlan);
                      setLoading(false);
                    }, 1200);
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <ExternalLink className="w-3 h-3 mr-2" />}
                  Explore Options
                </Button>
              </div>

              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200">
                <div className="flex items-center mb-2">
                  <Target className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="font-medium text-orange-900 dark:text-orange-100">Quick Win</span>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Boost MongoDB from 60% to 75%. Only 2-3 weeks of focused practice needed.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full border-orange-200 hover:bg-orange-100 dark:hover:bg-orange-800/50"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      toast.success("📋 MongoDB Improvement Plan Created!", {
                        description: "3-week intensive plan with daily exercises and project milestones."
                      });
                      
                      // Update MongoDB skill level
                      setSkillsData(prev => prev.map(skill => 
                        skill.skill.toLowerCase().includes('mongodb') ? 
                        { 
                          ...skill, 
                          current: 75,
                          growth: skill.growth + 15,
                          trend: [...skill.trend.slice(1), 75]
                        } : skill
                      ));
                      
                      // Add achievement
                      const achievement = {
                        id: `achievement-${Date.now()}`,
                        title: 'Quick Win Challenge Started',
                        description: 'MongoDB skill improvement plan activated',
                        type: 'learning',
                        date: new Date().toLocaleDateString()
                      };
                      
                      setLoading(false);
                    }, 1000);
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <BookmarkPlus className="w-3 h-3 mr-2" />}
                  Create Plan
                </Button>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300" 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    const roadmapData = {
                      totalSkills: skillsData.length,
                      weakestSkills: skillsData
                        .filter(skill => skill.current < 70)
                        .sort((a, b) => a.current - b.current)
                        .slice(0, 3),
                      recommendedPath: [
                        { month: 1, focus: 'TypeScript Fundamentals', skills: ['TypeScript', 'Type Safety'] },
                        { month: 2, focus: 'Database Mastery', skills: ['MongoDB', 'PostgreSQL'] },
                        { month: 3, focus: 'Frontend Frameworks', skills: ['Next.js', 'React Native'] },
                        { month: 4, focus: 'DevOps & Deployment', skills: ['Docker', 'AWS'] }
                      ],
                      estimatedCompletion: '4 months',
                      salaryImpact: '$20,000 - $35,000 increase',
                      marketReadiness: '95%'
                    };
                    
                    toast.success("🧠 AI Learning Path Generated!", {
                      description: `Personalized 4-month roadmap created based on ${skillsData.length} skills analysis.`
                    });
                    
                    // Store the roadmap for later use
                    localStorage.setItem('ai_learning_roadmap', JSON.stringify(roadmapData));
                    
                    // Show detailed roadmap in console for demo
                    console.log('🎯 Your Personalized Learning Roadmap:', roadmapData);
                    
                    setLoading(false);
                  }, 2000);
                }}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
                Generate Learning Path
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['frontend', 'backend', 'database', 'tools'].map(category => {
                  const categorySkills = skillsData.filter(s => s.category === category);
                  const avgScore = categorySkills.reduce((sum, s) => sum + s.current, 0) / categorySkills.length;
                  
                  return (
                    <div key={category} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{category}</span>
                        <Badge variant="secondary">{Math.round(avgScore)}%</Badge>
                      </div>
                      <Progress value={avgScore} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {categorySkills.length} skills
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Skills List */}
      <Card className="overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-primary/10">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Detailed Skill Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {skillsData.map((skill, index) => {
              const categoryColors = {
                frontend: {
                  bg: 'from-blue-500/10 via-blue-400/5 to-cyan-500/10',
                  border: 'border-blue-200/50 dark:border-blue-800/50',
                  accent: 'text-blue-600 dark:text-blue-400',
                  icon: 'bg-blue-500/10 text-blue-600',
                  progress: 'from-blue-500 to-cyan-500'
                },
                backend: {
                  bg: 'from-green-500/10 via-green-400/5 to-emerald-500/10',
                  border: 'border-green-200/50 dark:border-green-800/50',
                  accent: 'text-green-600 dark:text-green-400',
                  icon: 'bg-green-500/10 text-green-600',
                  progress: 'from-green-500 to-emerald-500'
                },
                database: {
                  bg: 'from-purple-500/10 via-purple-400/5 to-violet-500/10',
                  border: 'border-purple-200/50 dark:border-purple-800/50',
                  accent: 'text-purple-600 dark:text-purple-400',
                  icon: 'bg-purple-500/10 text-purple-600',
                  progress: 'from-purple-500 to-violet-500'
                },
                tools: {
                  bg: 'from-orange-500/10 via-orange-400/5 to-amber-500/10',
                  border: 'border-orange-200/50 dark:border-orange-800/50',
                  accent: 'text-orange-600 dark:text-orange-400',
                  icon: 'bg-orange-500/10 text-orange-600',
                  progress: 'from-orange-500 to-amber-500'
                },
                'soft-skills': {
                  bg: 'from-pink-500/10 via-pink-400/5 to-rose-500/10',
                  border: 'border-pink-200/50 dark:border-pink-800/50',
                  accent: 'text-pink-600 dark:text-pink-400',
                  icon: 'bg-pink-500/10 text-pink-600',
                  progress: 'from-pink-500 to-rose-500'
                }
              };

              const colors = categoryColors[skill.category] || categoryColors.frontend;
              const progressPercentage = (skill.current / skill.target) * 100;
              
              return (
                <div 
                  key={skill.skill} 
                  className={`group relative p-5 rounded-2xl bg-gradient-to-br ${colors.bg} ${colors.border} border backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background sparkle */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className={`absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br ${colors.progress} rounded-full opacity-20 animate-pulse`} />
                    <div className={`absolute top-1/3 -right-1 w-2 h-2 bg-gradient-to-br ${colors.progress} rounded-full opacity-30 animate-pulse`} style={{ animationDelay: '1s' }} />
                  </div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {skill.category === 'frontend' && <Code className="w-6 h-6" />}
                        {skill.category === 'backend' && <BarChart3 className="w-6 h-6" />}
                        {skill.category === 'database' && <FileText className="w-6 h-6" />}
                        {skill.category === 'tools' && <Settings className="w-6 h-6" />}
                        {skill.category === 'soft-skills' && <Brain className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {skill.skill}
                        </h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {skill.category.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <Badge 
                        variant="secondary" 
                        className={`${colors.accent} bg-transparent border font-semibold group-hover:scale-105 transition-transform`}
                      >
                        {skill.current}%
                      </Badge>
                      {skill.growth > 0 && (
                        <Badge 
                          variant="outline" 
                          className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 animate-pulse"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{skill.growth}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{skill.current}% / {skill.target}%</span>
                    </div>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="relative">
                      <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${colors.progress} rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover:shadow-lg`}
                          style={{ width: `${skill.current}%` }}
                        >
                          {/* Animated shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine" />
                        </div>
                      </div>
                      
                      {/* Target indicator */}
                      {skill.target > skill.current && (
                        <div 
                          className="absolute top-0 h-3 w-1 bg-foreground/20 rounded-full"
                          style={{ left: `${skill.target}%` }}
                        >
                          <div className="absolute -top-1 -left-2 w-5 h-5 flex items-center justify-center">
                            <Target className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress to Target */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.progress}`} />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(progressPercentage)}% to target
                        </span>
                      </div>
                      <div className={`text-xs ${colors.accent} font-medium`}>
                        {skill.target - skill.current}% remaining
                      </div>
                    </div>
                  </div>
                  
                  {/* Mini Trend Chart */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">6-Month Trend</span>
                      <div className="flex items-center gap-1">
                        {skill.trend.slice(-2).every((val, i, arr) => i === 0 || val >= arr[i - 1]) ? (
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <TrendingUp className="w-3 h-3 text-amber-500 rotate-180" />
                        )}
                        <span className={`text-xs font-medium ${colors.accent}`}>
                          {skill.trend[skill.trend.length - 1] - skill.trend[0] > 0 ? '+' : ''}{skill.trend[skill.trend.length - 1] - skill.trend[0]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-1 h-8">
                      {skill.trend.map((value, i) => (
                        <div
                          key={i}
                          className={`flex-1 bg-gradient-to-t ${colors.progress} rounded-sm opacity-70 hover:opacity-100 transition-all duration-300`}
                          style={{ 
                            height: `${(value / Math.max(...skill.trend)) * 100}%`,
                            animationDelay: `${i * 100}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`flex-1 ${colors.accent} hover:bg-primary/5 group-hover:scale-105 transition-all`}
                    >
                      <BookOpen className="w-3 h-3 mr-2" />
                      Practice
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-10 hover:bg-primary/5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Skill Level Badge */}
                  <div className="absolute top-3 right-3">
                    {skill.current >= 90 && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center animate-pulse">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {skill.current >= 70 && skill.current < 90 && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {skill.growth > 20 && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center animate-bounce">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Hub</h2>
          <p className="text-muted-foreground">Manage your projects and get AI feedback</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{projectsData.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {projectsData.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {projectsData.filter(p => p.status === 'ongoing').length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {Math.round(projectsData.reduce((sum, p) => sum + p.aiScore, 0) / projectsData.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg AI Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                  {project.title}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <Badge 
                    variant={
                      project.status === 'completed' ? 'default' : 
                      project.status === 'ongoing' ? 'secondary' : 
                      project.status === 'paused' ? 'outline' : 'outline'
                    }
                  >
                    {project.status}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={
                      project.priority === 'high' ? 'border-red-200 text-red-700' :
                      project.priority === 'medium' ? 'border-orange-200 text-orange-700' :
                      'border-green-200 text-green-700'
                    }
                  >
                    {project.priority}
                  </Badge>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Technologies:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.deadline && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Code className="w-3 h-3 mr-1" />
                      {project.commits} commits
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {project.linesOfCode.toLocaleString()} lines
                    </span>
                  </div>
                </div>

                {project.aiScore > 0 && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-100">AI Quality Score</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-600">{project.aiScore}/100</span>
                        <Brain className="w-4 h-4 text-purple-500" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-16">
            <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Start building your portfolio with your first project'}
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCareer = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Career Center</h2>
          <p className="text-muted-foreground">AI-powered career guidance and job matching</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Jobs
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <BookmarkPlus className="w-4 h-4 mr-2" />
            Job Alerts
          </Button>
        </div>
      </div>

      {/* Career Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {Math.round(jobRecommendations.reduce((sum, j) => sum + j.match, 0) / jobRecommendations.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Match Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {jobRecommendations.filter(j => j.match > 85).length}
            </div>
            <div className="text-sm text-muted-foreground">High Matches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {jobRecommendations.filter(j => j.applied).length}
            </div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {new Set(jobRecommendations.flatMap(j => j.skills)).size}
            </div>
            <div className="text-sm text-muted-foreground">Unique Skills</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Job Recommendations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Job Recommendations
                <Badge variant="secondary">{filteredContent.jobs.length} matches</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContent.jobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-lg group-hover:text-purple-600 transition-colors">
                            {job.title}
                          </h3>
                          {job.applied && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Applied
                            </Badge>
                          )}
                        </div>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">{job.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.location}
                          </span>
                          <span className="capitalize">{job.type}</span>
                          <span>{job.posted}</span>
                        </div>
                        {job.salary && (
                          <p className="text-sm font-medium text-green-600 mt-1">{job.salary}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-500">{job.match}%</div>
                        <div className="text-xs text-muted-foreground">Match</div>
                        <div className="flex justify-end mt-1">
                          {job.match >= 90 && <Badge variant="default" className="text-xs">Perfect</Badge>}
                          {job.match >= 80 && job.match < 90 && <Badge variant="secondary" className="text-xs">Great</Badge>}
                          {job.match >= 70 && job.match < 80 && <Badge variant="outline" className="text-xs">Good</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className={`text-xs ${
                            skillsData.some(s => s.skill === skill && s.current >= 70) 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {skill}
                          {skillsData.some(s => s.skill === skill && s.current >= 70) && ' ✓'}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className={`flex-1 ${
                          job.applied 
                            ? 'bg-gray-400 hover:bg-gray-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        }`}
                        disabled={job.applied}
                      >
                        {job.applied ? 'Applied' : 'Apply Now'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Career Tools */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Career Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <FileText className="w-4 h-4 mr-2 text-purple-500" />
                Resume Review & Optimization
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Mic className="w-4 h-4 mr-2 text-blue-500" />
                Mock Interview Practice
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20">
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                Career Path Mapping
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-orange-50 dark:hover:bg-orange-900/20">
                <Target className="w-4 h-4 mr-2 text-orange-500" />
                Skill Gap Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <Users className="w-4 h-4 mr-2 text-pink-500" />
                Networking Opportunities
              </Button>

              <Separator className="my-4" />

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => generateAIContent('resume-tips')}
              >
                <Brain className="w-4 h-4 mr-2" />
                Get AI Career Advice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200">
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="font-medium text-orange-900 dark:text-orange-100">Career Tip</span>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Build a strong GitHub profile with consistent contributions. Recruiters often check it as part of their evaluation process!
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Market Trend</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  TypeScript demand increased 40% this quarter. Perfect time to add it to your skillset!
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Award className="w-4 h-4 text-green-500 mr-2" />
                  <span className="font-medium text-green-900 dark:text-green-100">Achievement</span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your portfolio score improved 15% this month. Keep up the excellent work!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Frontend Developer</span>
                  <span className="font-medium">$65-85k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Full Stack Developer</span>
                  <span className="font-medium">$75-95k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Python Developer</span>
                  <span className="font-medium">$70-90k</span>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Based on your skills and location</p>
                  <p className="font-bold text-lg text-purple-600">$70-88k</p>
                  <p className="text-sm text-muted-foreground">Estimated range</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Community</h2>
        <p className="text-muted-foreground">Connect with peers and collaborate on projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Forum</CardTitle>
              <p className="text-sm text-muted-foreground">Latest conversations in your network</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    author: 'John Doe',
                    role: 'Student',
                    time: '2 hours ago',
                    content: 'Looking for teammates for a React project. Anyone interested in building an e-commerce platform?',
                    likes: 5,
                    replies: 3,
                    avatar: 'JD'
                  },
                  {
                    author: 'Alice Smith',
                    role: 'Mentor',
                    time: '5 hours ago',
                    content: 'Great explanation of React hooks! For those interested, here\'s a follow-up resource on advanced patterns...',
                    likes: 12,
                    replies: 8,
                    avatar: 'AS'
                  },
                  {
                    author: 'Mike Chen',
                    role: 'Student',
                    time: '1 day ago',
                    content: 'Just completed my first full-stack app! Thanks to everyone who helped with debugging. Here\'s what I learned...',
                    likes: 18,
                    replies: 6,
                    avatar: 'MC'
                  }
                ].map((post, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback>{post.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{post.author}</span>
                          <Badge 
                            variant={post.role === 'Mentor' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {post.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-sm mb-3">{post.content}</p>
                        <div className="flex space-x-4 text-xs text-muted-foreground">
                          <button className="hover:text-purple-500 flex items-center space-x-1">
                            <span>👍</span>
                            <span>{post.likes}</span>
                          </button>
                          <button className="hover:text-purple-500 flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{post.replies} replies</span>
                          </button>
                          <button className="hover:text-purple-500">Share</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <Textarea 
                  placeholder="Share your thoughts, ask a question, or start a discussion..." 
                  className="min-h-[80px]" 
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-1" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Code className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Groups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'React Masterclass', members: 15, status: 'Active', topic: 'Advanced Hooks' },
                { name: 'Python for AI', members: 23, status: 'Active', topic: 'Machine Learning' },
                { name: 'Web Dev Bootcamp', members: 31, status: 'Active', topic: 'Full Stack Projects' },
                { name: 'Database Design', members: 12, status: 'Starting Soon', topic: 'SQL & NoSQL' }
              ].map((group, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{group.name}</h4>
                    <Badge 
                      variant={group.status === 'Active' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {group.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{group.members} members</p>
                  <p className="text-xs text-purple-600 mb-3">Current: {group.topic}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {group.status === 'Active' ? 'Join Group' : 'Get Notified'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', points: 2450, rank: 1, change: '+2' },
                  { name: 'Mike Johnson', points: 2200, rank: 2, change: '0' },
                  { name: user.name, points: 1980, rank: 3, change: '+1' },
                  { name: 'Lisa Wang', points: 1875, rank: 4, change: '-1' },
                  { name: 'Alex Kumar', points: 1720, rank: 5, change: '+3' }
                ].map((member, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 rounded ${
                      member.name === user.name ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        member.rank === 1 ? 'bg-yellow-500' :
                        member.rank === 2 ? 'bg-gray-400' :
                        member.rank === 3 ? 'bg-orange-500' : 'bg-purple-500'
                      }`}>
                        {member.rank}
                      </span>
                      <span className={`font-medium ${member.name === user.name ? 'text-purple-600' : ''}`}>
                        {member.name}
                      </span>
                      {member.change !== '0' && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            member.change.startsWith('+') ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'
                          }`}
                        >
                          {member.change}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {member.points.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { 
                  title: 'Tech Talk: AI in Web Development', 
                  date: 'Tomorrow, 3:00 PM',
                  type: 'Virtual',
                  attendees: 45
                },
                { 
                  title: 'Coding Challenge: React Performance', 
                  date: 'Jan 20, 10:00 AM',
                  type: 'Competition',
                  attendees: 89
                },
                { 
                  title: 'Career Fair: Tech Startups', 
                  date: 'Jan 25, 9:00 AM',
                  type: 'Networking',
                  attendees: 120
                }
              ].map((event, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{event.date}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {event.attendees} attending
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Join Event
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Customize your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                defaultValue={user.name} 
                onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                defaultValue={user.email} 
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                defaultValue={portfolioData.bio} 
                rows={3} 
                onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input 
                id="linkedin"
                placeholder="https://linkedin.com/in/yourname" 
                onChange={(e) => setFormData(prev => ({...prev, linkedin: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub Profile</Label>
              <Input 
                id="github"
                placeholder="https://github.com/yourname" 
                onChange={(e) => setFormData(prev => ({...prev, github: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                placeholder="City, Country" 
                defaultValue={portfolioData.location}
                onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
              />
            </div>
            <Button 
              onClick={() => saveFormData(formData, {
                email: { required: true, email: true },
                fullName: { required: true, minLength: 2 }
              })}
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Portfolio Public</Label>
                <p className="text-sm text-muted-foreground">Make portfolio visible to recruiters</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Job Recommendations</Label>
                <p className="text-sm text-muted-foreground">Get weekly job suggestions</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <Label>Preferred Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Time Zone</Label>
              <Select defaultValue="pst">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Standard Time</SelectItem>
                  <SelectItem value="est">Eastern Standard Time</SelectItem>
                  <SelectItem value="cst">Central Standard Time</SelectItem>
                  <SelectItem value="mst">Mountain Standard Time</SelectItem>
                  <SelectItem value="ist">India Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Career Recommendations</Label>
              <p className="text-sm text-muted-foreground">Get AI-powered job suggestions</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Learning Path Suggestions</Label>
              <p className="text-sm text-muted-foreground">Receive personalized skill recommendations</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Project Feedback</Label>
              <p className="text-sm text-muted-foreground">Get AI analysis of your projects</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Portfolio Optimization</Label>
              <p className="text-sm text-muted-foreground">Auto-suggestions for portfolio improvements</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics Collection</Label>
              <p className="text-sm text-muted-foreground">Help improve the platform with usage data</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Allow others to find your profile</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            <Button variant="outline" className="w-full">
              Request Data Deletion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'portfolio':
        return renderPortfolio();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      case 'career':
        return renderCareer();
      case 'community':
        return renderCommunity();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        {/* Enhanced Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                DigiPratibha
              </span>
            </div>
            
            <div className="flex items-center space-x-3 px-2 mt-4">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">Student • Rank #{dashboardData.rank}</p>
              </div>
            </div>
            
            <div className="px-2 mt-3">
              <Progress value={dashboardData.weeklyProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Weekly progress: {dashboardData.weeklyProgress}%
              </p>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {item.id === 'career' && jobRecommendations.filter(j => !j.applied && j.match > 85).length > 0 && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {jobRecommendations.filter(j => !j.applied && j.match > 85).length}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="flex items-center justify-between px-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search projects, skills, jobs..." 
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setChatOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  AI Mentor
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 relative overflow-hidden">
            {/* Dynamic Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Gradient Mesh Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
              
              {/* Floating Orbs */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl animate-float" />
              <div className="absolute top-1/3 -right-20 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-purple-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
              <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
              
              {/* Animated Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }} />
              </div>
              
              {/* Dynamic Light Rays */}
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-pulse" />
              <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Section-specific Background Effects */}
              {activeSection === 'dashboard' && (
                <>
                  <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-conic from-primary/10 via-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-lg animate-pulse" />
                </>
              )}
              
              {activeSection === 'skills' && (
                <>
                  <div className="absolute top-1/4 left-1/2 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
                  <div className="absolute bottom-1/4 right-1/4 w-18 h-18 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse" />
                </>
              )}
              
              {activeSection === 'portfolio' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/2 to-transparent" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-radial from-primary/5 to-transparent rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                </>
              )}
              
              {activeSection === 'projects' && (
                <>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/5 to-amber-500/5 rounded-full blur-2xl animate-float" />
                  <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-red-500/5 to-pink-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
                </>
              )}
            </div>

            {/* Enhanced Scrollable Content Area */}
            <div className="relative h-full overflow-y-auto overflow-x-hidden">
              {/* Content Container with Dynamic Padding and Animations */}
              <div className={`
                relative transition-all duration-700 ease-out min-h-full
                ${activeSection === 'dashboard' ? 'p-6 lg:p-8' : 'p-4 lg:p-6'}
                ${activeSection === 'portfolio' ? 'px-2 lg:px-4' : ''}
                ${activeSection === 'skills' ? 'p-3 lg:p-6' : ''}
                ${activeSection === 'projects' ? 'p-5 lg:p-7' : ''}
                ${activeSection === 'analytics' ? 'p-4 lg:p-6' : ''}
                ${loading ? 'pointer-events-none' : ''}
              `}>
                {/* Dynamic Section-Specific Background Graphics */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Dashboard Section Graphics */}
                  {activeSection === 'dashboard' && (
                    <>
                      <div className="absolute top-10 right-16 w-32 h-32 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-2xl animate-pulse" />
                      <div className="absolute bottom-20 left-12 w-24 h-24 bg-gradient-to-tr from-green-500/8 to-emerald-500/8 rounded-full blur-xl animate-float" />
                      <div className="absolute top-1/3 left-1/4 w-2 h-20 bg-gradient-to-b from-transparent via-primary/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </>
                  )}

                  {/* Skills Section Graphics */}
                  {activeSection === 'skills' && (
                    <>
                      <div className="absolute top-8 left-8 w-40 h-40 bg-gradient-conic from-purple-500/8 via-blue-500/8 via-green-500/8 to-purple-500/8 rounded-full blur-3xl animate-spin" style={{ animationDuration: '15s' }} />
                      <div className="absolute bottom-12 right-12 w-28 h-28 bg-gradient-to-br from-orange-500/6 to-red-500/6 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s' }} />
                      <div className="absolute top-1/2 right-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-blue-500/15 to-transparent animate-pulse" />
                    </>
                  )}

                  {/* Portfolio Section Graphics */}
                  {activeSection === 'portfolio' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/3" />
                      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-radial from-primary/8 to-transparent rounded-full animate-ping" style={{ animationDuration: '6s' }} />
                      <div className="absolute bottom-1/4 right-1/3 w-36 h-36 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
                    </>
                  )}

                  {/* Projects Section Graphics */}
                  {activeSection === 'projects' && (
                    <>
                      <div className="absolute top-16 right-20 w-44 h-44 bg-gradient-to-br from-cyan-500/6 via-blue-500/6 to-indigo-500/6 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute bottom-16 left-16 w-32 h-32 bg-gradient-to-tr from-yellow-500/8 to-orange-500/8 rounded-full blur-2xl animate-float" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-primary/8 to-transparent animate-pulse" />
                    </>
                  )}

                  {/* Career Center Section Graphics */}
                  {activeSection === 'dashboard' && (
                    <>
                      {/* Career-focused background elements */}
                      <div className="absolute top-1/4 right-8 w-36 h-36 bg-gradient-to-br from-emerald-500/6 via-green-500/6 to-teal-500/6 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                      <div className="absolute bottom-1/3 left-8 w-28 h-28 bg-gradient-to-tr from-blue-600/8 to-indigo-600/8 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
                      
                      {/* Job opportunity indicators */}
                      <div className="absolute top-20 left-1/3 w-2 h-16 bg-gradient-to-b from-transparent via-emerald-500/12 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                      <div className="absolute bottom-20 right-1/3 w-1 h-12 bg-gradient-to-b from-transparent via-blue-500/15 to-transparent rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
                      
                      {/* Success metrics visualization */}
                      <div className="absolute top-1/2 left-12 w-20 h-20 bg-gradient-conic from-emerald-500/8 via-green-500/8 via-blue-500/8 to-emerald-500/8 rounded-full blur-xl animate-spin" style={{ animationDuration: '12s' }} />
                      
                      {/* Career progress indicators */}
                      <div className="absolute top-16 right-1/4 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-8 bg-gradient-to-t from-transparent via-green-500/10 to-transparent rounded-full animate-pulse"
                            style={{ 
                              animationDelay: `${i * 0.5}s`,
                              height: `${(i + 1) * 6}px`
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Analytics Section Graphics */}
                  {activeSection === 'analytics' && (
                    <>
                      <div className="absolute top-12 left-1/4 w-56 h-56 bg-gradient-conic from-green-500/6 via-blue-500/6 via-purple-500/6 to-green-500/6 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
                      <div className="absolute bottom-12 right-1/4 w-40 h-40 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '5s' }} />
                    </>
                  )}

                  {/* Universal Grid Overlay */}
                  <div className="absolute inset-0 opacity-[0.015]">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `
                          linear-gradient(currentColor 1px, transparent 1px),
                          linear-gradient(90deg, currentColor 1px, transparent 1px)
                        `,
                        backgroundSize: '32px 32px'
                      }}
                    />
                  </div>
                </div>

                {/* Enhanced Section Transition Wrapper */}
                <div className="relative z-10">
                  {/* Dynamic Section Header Effects */}
                  <div className={`
                    absolute -top-4 left-0 right-0 rounded-full transition-all duration-500
                    ${activeSection === 'dashboard' ? 'h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent' : ''}
                    ${activeSection === 'skills' ? 'h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent' : ''}
                    ${activeSection === 'portfolio' ? 'h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent' : ''}
                    ${activeSection === 'projects' ? 'h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent' : ''}
                    ${activeSection === 'analytics' ? 'h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent' : ''}
                    ${!['dashboard', 'skills', 'portfolio', 'projects', 'analytics'].includes(activeSection) ? 'h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent' : ''}
                  `} />

                  {/* Section Title and Breadcrumb */}
                  <div className="flex items-center justify-between mb-6 relative">
                    <div className="flex items-center gap-4">
                      {/* Dynamic Section Icon */}
                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110
                        ${activeSection === 'dashboard' ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : ''}
                        ${activeSection === 'skills' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : ''}
                        ${activeSection === 'portfolio' ? 'bg-gradient-to-br from-primary/20 to-accent/30' : ''}
                        ${activeSection === 'projects' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20' : ''}
                        ${activeSection === 'analytics' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : ''}
                        ${!['dashboard', 'skills', 'portfolio', 'projects', 'analytics'].includes(activeSection) ? 'bg-gradient-to-br from-primary/10 to-accent/20' : ''}
                      `}>
                        {activeSection === 'dashboard' && <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                        {activeSection === 'skills' && <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                        {activeSection === 'portfolio' && <User className="w-5 h-5 text-primary" />}
                        {activeSection === 'projects' && <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
                        {activeSection === 'analytics' && <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />}
                        {!['dashboard', 'skills', 'portfolio', 'projects', 'analytics'].includes(activeSection) && <Settings className="w-5 h-5 text-primary" />}
                      </div>

                      {/* Section Title with Gradient */}
                      <div>
                        <h1 className={`
                          text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent
                          ${activeSection === 'dashboard' ? 'from-blue-600 to-purple-600' : ''}
                          ${activeSection === 'skills' ? 'from-purple-600 to-pink-600' : ''}
                          ${activeSection === 'portfolio' ? 'from-primary to-primary/70' : ''}
                          ${activeSection === 'projects' ? 'from-cyan-600 to-blue-600' : ''}
                          ${activeSection === 'analytics' ? 'from-green-600 to-emerald-600' : ''}
                          ${!['dashboard', 'skills', 'portfolio', 'projects', 'analytics'].includes(activeSection) ? 'from-primary to-primary/70' : ''}
                        `}>
                          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activeSection === 'dashboard' && 'Your personalized learning hub'}
                          {activeSection === 'skills' && 'Track and improve your abilities'}
                          {activeSection === 'portfolio' && 'Showcase your professional profile'}
                          {activeSection === 'projects' && 'Manage your creative work'}
                          {activeSection === 'analytics' && 'Insights and performance metrics'}
                          {!['dashboard', 'skills', 'portfolio', 'projects', 'analytics'].includes(activeSection) && 'Customize your experience'}
                        </p>
                      </div>
                    </div>

                    {/* Real-time Activity Indicators */}
                    <div className="flex items-center gap-3">
                      {/* Performance Metrics */}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>

                      {/* Dynamic Section Stats */}
                      {activeSection === 'dashboard' && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-xl">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{dashboardData.portfolioScore}% Complete</span>
                          </div>
                          
                          {/* Career Center Stats */}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-xl animate-pulse">
                            <Briefcase className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{jobRecommendations.length} Jobs</span>
                          </div>
                          
                          {/* Live Job Matching Indicator */}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              {jobRecommendations.filter(job => job.match >= 80).length} High Matches
                            </span>
                          </div>
                        </div>
                      )}

                      {activeSection === 'skills' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-xl">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{skillsData.length} Skills</span>
                        </div>
                      )}

                      {activeSection === 'projects' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-xl">
                          <Briefcase className="w-4 h-4 text-cyan-600" />
                          <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">{projectsData.length} Projects</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Dynamic Content with Advanced Animations */}
                  <div className={`
                    relative transition-all duration-700 ease-out
                    ${loading ? 'opacity-50 scale-[0.98] blur-sm' : 'opacity-100 scale-100 blur-0'}
                  `}>
                    {/* Content Loading Overlay */}
                    {loading && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl">
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-r-primary/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                          </div>
                          <p className="text-sm text-muted-foreground animate-pulse">Loading {activeSection}...</p>
                        </div>
                      </div>
                    )}

                    {/* Content Wrapper with Stagger Animation */}
                    <div className={`
                      animate-in fade-in slide-in-from-bottom-4 duration-700
                      ${activeSection === 'dashboard' ? 'space-y-6' : ''}
                      ${activeSection === 'skills' ? 'space-y-4' : ''}
                      ${activeSection === 'portfolio' ? 'space-y-3' : ''}
                      ${activeSection === 'projects' ? 'space-y-5' : ''}
                      ${activeSection === 'analytics' ? 'space-y-4' : ''}
                    `}>
                      {/* Pre-content Section Indicators */}
                      <div className="flex items-center gap-2 mb-4 opacity-60">
                        {Array.from({ length: Math.min(4, Math.ceil(Math.random() * 6)) }).map((_, i) => (
                          <div
                            key={i}
                            className={`
                              w-1 h-1 rounded-full animate-pulse
                              ${activeSection === 'dashboard' ? 'bg-blue-500' : ''}
                              ${activeSection === 'skills' ? 'bg-purple-500' : ''}
                              ${activeSection === 'portfolio' ? 'bg-primary' : ''}
                              ${activeSection === 'projects' ? 'bg-cyan-500' : ''}
                              ${activeSection === 'analytics' ? 'bg-green-500' : ''}
                              ${!['dashboard', 'skills', 'portfolio', 'projects', 'analytics'].includes(activeSection) ? 'bg-primary' : ''}
                            `}
                            style={{ animationDelay: `${i * 200}ms` }}
                          />
                        ))}
                      </div>

                      {/* Main Content */}
                      {renderContent()}

                      {/* Post-content Enhancement Elements */}
                      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/50 opacity-40">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Section Footer Effects */}
                  <div className={`
                    absolute -bottom-4 left-0 right-0 rounded-full transition-all duration-500
                    ${activeSection === 'dashboard' ? 'h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent' : ''}
                    ${activeSection === 'skills' ? 'h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent' : ''}
                    ${activeSection === 'portfolio' ? 'h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent' : ''}
                    ${activeSection === 'projects' ? 'h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent' : ''}
                    ${activeSection === 'analytics' ? 'h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent' : ''}
                    ${!['dashboard', 'skills', 'portfolio', 'projects', 'analytics'].includes(activeSection) ? 'h-px bg-gradient-to-r from-transparent via-border to-transparent' : ''}
                  `} />
                </div>

                {/* Enhanced Section-specific Quick Actions */}
                <div className="fixed bottom-20 right-6 flex flex-col gap-3 z-30">
                  {activeSection === 'dashboard' && (
                    <>
                      {/* AI Career Insights */}
                      <button 
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                        onClick={() => {
                          toast.success("🧠 AI Career Insights", {
                            description: "Analyzing your profile for career opportunities..."
                          });
                        }}
                      >
                        <Brain className="w-5 h-5 text-white group-hover:animate-pulse" />
                      </button>
                      
                      {/* Quick Job Application */}
                      <button 
                        className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                        onClick={() => {
                          const availableJobs = jobRecommendations.filter(job => !job.applied && job.match >= 80);
                          if (availableJobs.length > 0) {
                            toast.success("🚀 Quick Apply", {
                              description: `Found ${availableJobs.length} high-match jobs ready for application!`
                            });
                          } else {
                            toast.info("🔍 Job Search", {
                              description: "Searching for new opportunities matching your profile..."
                            });
                          }
                        }}
                      >
                        <Briefcase className="w-5 h-5 text-white group-hover:animate-bounce" />
                      </button>
                      
                      {/* Career Progress Tracker */}
                      <button 
                        className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group relative"
                        onClick={() => {
                          toast.success("📈 Career Progress", {
                            description: `Portfolio ${dashboardData.portfolioScore}% complete. ${skillsData.length} skills tracked.`
                          });
                        }}
                      >
                        <TrendingUp className="w-5 h-5 text-white group-hover:scale-125 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      </button>
                      
                      {/* Network & Referrals */}
                      <button 
                        className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                        onClick={() => {
                          toast.success("🤝 Network Building", {
                            description: "Connect with professionals in your field for referrals and mentorship!"
                          });
                        }}
                      >
                        <Users className="w-5 h-5 text-white group-hover:animate-pulse" />
                      </button>
                    </>
                  )}
                  
                  {activeSection === 'skills' && (
                    <button className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group">
                      <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
                    </button>
                  )}

                  {activeSection === 'portfolio' && (
                    <button className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group">
                      <Eye className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                    </button>
                  )}

                  {activeSection === 'projects' && (
                    <button className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group">
                      <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
                    </button>
                  )}
                </div>

                {/* Career Center Enhancement Overlay */}
                {activeSection === 'dashboard' && (
                  <>
                    {/* Live Job Notifications */}
                    <div className="fixed top-20 right-6 z-20">
                      <div className="bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-sm font-medium">
                            {jobRecommendations.filter(job => job.match >= 90).length} Perfect Matches
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Career Achievement Progress */}
                    <div className="fixed bottom-6 left-6 z-20">
                      <div className="bg-card/95 backdrop-blur-sm border rounded-xl p-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">Career Level</p>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000"
                                  style={{ width: `${dashboardData.portfolioScore}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{dashboardData.portfolioScore}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Job Market Indicators */}
                    <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-10">
                      <div className="flex flex-col gap-2">
                        {['Frontend', 'Backend', 'Full Stack', 'DevOps'].map((role, index) => (
                          <div
                            key={role}
                            className="w-1 bg-gradient-to-t from-transparent via-emerald-500/60 to-transparent rounded-full animate-pulse"
                            style={{ 
                              height: `${40 + index * 10}px`,
                              animationDelay: `${index * 0.5}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Success Metrics Visualization */}
                    <div className="fixed top-1/3 right-4 z-10">
                      <div className="flex items-end gap-1 h-16">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-blue-500/30 to-emerald-500/60 rounded-sm animate-pulse"
                            style={{ 
                              height: `${20 + Math.random() * 40}px`,
                              animationDelay: `${i * 0.3}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Scroll Progress Indicator */}
              <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-blue-500 to-purple-500 transition-all duration-300 ease-out"
                  style={{
                    width: '0%',
                    background: `linear-gradient(90deg, 
                      hsl(var(--primary)) 0%, 
                      rgb(59, 130, 246) 50%, 
                      rgb(147, 51, 234) 100%)`
                  }}
                  onScroll={(e) => {
                    const scrolled = (e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight)) * 100;
                    e.currentTarget.style.width = `${scrolled}%`;
                  }}
                />
              </div>

              {/* Dynamic Corner Decorations */}
              <div className="fixed top-4 right-4 w-2 h-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-pulse z-10" />
              <div className="fixed bottom-4 left-4 w-2 h-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-pulse z-10" style={{ animationDelay: '1s' }} />
              
              {/* Floating Action Hints */}
              {activeSection === 'dashboard' && (
                <div className="fixed bottom-6 right-6 group cursor-pointer z-20">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                    <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="absolute -top-12 -left-16 bg-popover text-popover-foreground px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    AI Insights
                  </div>
                </div>
              )}

              {/* Performance Indicators */}
              <div className="fixed top-4 left-4 flex gap-1 z-20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              {/* Section Change Ripple Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`
                  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  w-0 h-0 bg-primary/5 rounded-full transition-all duration-1000 ease-out
                  ${loading ? 'w-96 h-96' : 'w-0 h-0'}
                `} />
              </div>
            </div>

            {/* Responsive Design Indicators */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-20 z-10">
              <div className="block sm:hidden w-1 h-1 bg-red-500 rounded-full" />
              <div className="hidden sm:block md:hidden w-1 h-1 bg-yellow-500 rounded-full" />
              <div className="hidden md:block lg:hidden w-1 h-1 bg-blue-500 rounded-full" />
              <div className="hidden lg:block xl:hidden w-1 h-1 bg-green-500 rounded-full" />
              <div className="hidden xl:block w-1 h-1 bg-purple-500 rounded-full" />
            </div>
          </main>
        </div>

        {/* Enhanced AI Mentor Chat Dialog */}
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[700px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                AI Mentor Chat
                <Badge variant="secondary" className="ml-2">Online</Badge>
              </DialogTitle>
              <DialogDescription>
                Your personal AI assistant for academic and career guidance. Ask anything!
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1 min-h-[400px] p-4 border rounded-lg bg-muted/20">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">Hi {user.name}! 👋</h3>
                  <p className="mb-4">I'm your AI mentor. I can help with:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                      📊 Portfolio optimization
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      🚀 Career guidance
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      📚 Skill development
                    </div>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      💡 Project ideas
                    </div>
                  </div>
                  <p className="text-xs mt-4 opacity-75">
                    Try asking: "How can I improve my portfolio?" or "What should I learn next?"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-muted text-foreground border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            
            <div className="space-y-3">
              {chatMessages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {[
                    "How can I improve my portfolio?",
                    "What skills should I learn next?",
                    "Career advice for frontend dev?",
                    "Help with project ideas"
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput(suggestion);
                        setTimeout(() => sendChatMessage(), 100);
                      }}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask your AI mentor..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && sendChatMessage()}
                  disabled={loading}
                />
                <Button 
                  onClick={sendChatMessage} 
                  disabled={!chatInput.trim() || loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}