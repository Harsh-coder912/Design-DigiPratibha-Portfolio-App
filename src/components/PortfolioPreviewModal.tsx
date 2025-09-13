import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Star,
  Eye,
  Download,
  ExternalLink,
  Award,
  BookOpen,
  Code,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Video,
  Heart,
  Share,
  Sparkles
} from 'lucide-react';

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

interface PortfolioData {
  student: Student;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    imageUrl: string;
    liveUrl?: string;
    githubUrl?: string;
    category: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    gpa: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  certifications: string[];
  resumeUrl: string;
  portfolioScore: number;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
}

interface PortfolioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
  students?: Student[];
  onNavigate?: (direction: 'prev' | 'next') => void;
  onMessage?: (student: Student) => void;
  onScheduleMeeting?: (student: Student) => void;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-83d15fec`;

export default function PortfolioPreviewModal({
  isOpen,
  onClose,
  studentId,
  students = [],
  onNavigate,
  onMessage,
  onScheduleMeeting
}: PortfolioPreviewModalProps) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Find current student index
  useEffect(() => {
    if (studentId && students.length > 0) {
      const index = students.findIndex(s => s.id === studentId);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [studentId, students]);

  const fetchPortfolioData = async (id: string) => {
    setLoading(true);
    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use mock portfolio data directly
      const student = students.find(s => s.id === id);
      if (student) {
        setPortfolioData(generateMockPortfolioData(student));
        toast.success('Portfolio preview loaded');
      } else {
        throw new Error('Student not found');
      }
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      toast.error('Failed to load portfolio preview');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock portfolio data
  const generateMockPortfolioData = (student: Student): PortfolioData => {
    const mockProjects = [
      {
        id: '1',
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
        liveUrl: 'https://demo-ecommerce.com',
        githubUrl: 'https://github.com/student/ecommerce',
        category: 'Web Development'
      },
      {
        id: '2',
        title: 'Data Visualization Dashboard',
        description: 'Interactive dashboard for business analytics using D3.js',
        technologies: ['D3.js', 'Python', 'Flask', 'PostgreSQL'],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        liveUrl: 'https://dashboard-demo.com',
        category: 'Data Science'
      }
    ];

    return {
      student,
      projects: mockProjects,
      education: [
        {
          degree: 'Bachelor of Technology',
          institution: 'University of Excellence',
          year: student.graduationYear,
          gpa: student.gpa
        }
      ],
      experience: [
        {
          title: 'Software Development Intern',
          company: 'Tech Corp',
          duration: '3 months',
          description: 'Developed web applications using React and Node.js'
        }
      ],
      certifications: ['AWS Cloud Practitioner', 'Google Analytics Certified'],
      resumeUrl: '/resumes/student-resume.pdf',
      portfolioScore: Math.floor(student.rating * 20), // Convert 5-point to 100-point scale
      skills: student.skills.map(skill => ({
        name: skill,
        level: 70 + Math.floor(Math.random() * 30),
        category: skill.includes('React') || skill.includes('JavaScript') ? 'Frontend' : 
                 skill.includes('Python') || skill.includes('Java') ? 'Backend' : 'Other'
      }))
    };
  };

  useEffect(() => {
    if (isOpen && studentId) {
      fetchPortfolioData(studentId);
    }
  }, [isOpen, studentId]);

  const handleNavigation = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(students.length - 1, currentIndex + 1);
    
    const newStudent = students[newIndex];
    if (newStudent) {
      setCurrentIndex(newIndex);
      fetchPortfolioData(newStudent.id);
      if (onNavigate) onNavigate(direction);
    }
  };

  const handleDownloadResume = () => {
    toast.success('Resume download started');
    // In real implementation, trigger download
  };

  const handleShare = () => {
    toast.success('Portfolio link copied to clipboard');
    // In real implementation, copy portfolio URL
  };

  if (!isOpen || !portfolioData) {
    return null;
  }

  const { student } = portfolioData;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">{student.name} Portfolio Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Portfolio preview for {student.name}, a {student.department} student graduating in {student.graduationYear}. 
            View their projects, skills, and achievements.
          </DialogDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.profileImage} />
                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <div className="flex items-center space-x-4 text-muted-foreground mt-1">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {student.email}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {student.department}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Class of {student.graduationYear}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Navigation */}
              {students.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigation('prev')}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    {currentIndex + 1} of {students.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigation('next')}
                    disabled={currentIndex === students.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                </>
              )}
              
              {/* Actions */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{portfolioData.portfolioScore}</div>
                  <div className="text-xs text-muted-foreground">Portfolio Score</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-2xl font-bold">{student.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-500 mr-1" />
                    <span className="text-2xl font-bold">{student.views}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Portfolio Views</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{student.gpa}</div>
                  <div className="text-xs text-muted-foreground">GPA</div>
                </CardContent>
              </Card>
            </div>

            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Skills & Proficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioData.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Featured Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioData.projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${project.imageUrl})` }}>
                        <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div>
                            <h4 className="font-semibold text-white">{project.title}</h4>
                            <Badge variant="secondary" className="mt-1">{project.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{project.technologies.length - 3}</Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {project.liveUrl && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Live
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Code className="w-3 h-3 mr-1" />
                              Code
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolioData.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <div className="flex justify-between text-sm">
                        <span>Class of {edu.year}</span>
                        <span className="font-medium">GPA: {edu.gpa}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Experience & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData.experience.map((exp, index) => (
                      <div key={index}>
                        <h4 className="font-semibold">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                    
                    {student.achievements.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Key Achievements</h5>
                        <div className="space-y-1">
                          {student.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center">
                              <Sparkles className="w-3 h-3 text-yellow-500 mr-2" />
                              <span className="text-sm">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button onClick={handleDownloadResume} variant="default">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
              {onMessage && (
                <Button onClick={() => onMessage(student)} variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              )}
              {onScheduleMeeting && (
                <Button onClick={() => onScheduleMeeting(student)} variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              )}
              <Button variant="outline" onClick={() => window.open(`/portfolio/${student.id}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Portfolio
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}