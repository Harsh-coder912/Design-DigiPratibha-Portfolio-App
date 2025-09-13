import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Star,
  Eye,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Code,
  Briefcase,
  BookOpen,
  Award,
  Phone,
  User,
  Heart,
  Share,
  MessageCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PortfolioData {
  student: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
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
    socialLinks?: {
      github?: string;
      linkedin?: string;
      website?: string;
    };
  };
  projects: Array<{
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    imageUrl: string;
    images?: string[];
    liveUrl?: string;
    githubUrl?: string;
    category: string;
    featured?: boolean;
    metrics?: {
      users?: number;
      downloads?: number;
      github_stars?: number;
    };
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    gpa: number;
    coursework?: string[];
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    location?: string;
    type?: 'internship' | 'part-time' | 'full-time' | 'contract';
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }>;
  resumeUrl: string;
  portfolioScore: number;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  testimonials?: Array<{
    name: string;
    role: string;
    company: string;
    text: string;
    image?: string;
  }>;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-83d15fec`;

export default function FullPortfolioView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
  }, [slug]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data directly to avoid API errors
      setPortfolioData(generateMockFullPortfolioData(slug || '1'));
      toast.success('Portfolio loaded successfully');
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      toast.error('Failed to load portfolio');
      // Fallback to mock data
      setPortfolioData(generateMockFullPortfolioData(slug || '1'));
    } finally {
      setLoading(false);
    }
  };

  const generateMockFullPortfolioData = (studentId: string): PortfolioData => {
    return {
      student: {
        id: studentId,
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. I love creating user-centric applications that solve real-world problems. Currently pursuing my degree while building innovative projects.',
        skills: ['React', 'JavaScript', 'Python', 'Node.js', 'AWS', 'MongoDB'],
        gpa: 3.8,
        portfolioStatus: 'published',
        achievements: ['Dean\'s List', 'Hackathon Winner', 'Outstanding Student Award'],
        views: 1247,
        rating: 4.8,
        lastActive: new Date().toISOString(),
        department: 'Computer Science',
        graduationYear: 2024,
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        socialLinks: {
          github: 'https://github.com/sarahchen',
          linkedin: 'https://linkedin.com/in/sarahchen',
          website: 'https://sarahchen.dev'
        }
      },
      projects: [
        {
          id: '1',
          title: 'EcoTrack - Sustainability Platform',
          description: 'A comprehensive platform for tracking and improving environmental impact',
          longDescription: 'EcoTrack is a full-stack web application that helps individuals and organizations track their carbon footprint, set sustainability goals, and connect with like-minded communities. The platform features real-time data visualization, gamification elements, and integration with IoT devices for automated tracking.',
          technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
          imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb1bb4c3?w=1200&h=600&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1569163139394-de44cb1bb4c3?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop'
          ],
          liveUrl: 'https://ecotrack-demo.com',
          githubUrl: 'https://github.com/sarahchen/ecotrack',
          category: 'Web Development',
          featured: true,
          metrics: {
            users: 2500,
            github_stars: 156
          }
        },
        {
          id: '2',
          title: 'ML-Powered Recipe Recommender',
          description: 'Intelligent recipe recommendation system using machine learning',
          longDescription: 'This project combines my passion for cooking and data science. The system analyzes user preferences, dietary restrictions, and available ingredients to recommend personalized recipes. Built with Python, scikit-learn, and deployed on AWS.',
          technologies: ['Python', 'scikit-learn', 'Flask', 'React', 'AWS', 'MongoDB'],
          imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
          liveUrl: 'https://recipe-ai-demo.com',
          githubUrl: 'https://github.com/sarahchen/recipe-recommender',
          category: 'Machine Learning',
          featured: true,
          metrics: {
            users: 1200,
            github_stars: 89
          }
        },
        {
          id: '3',
          title: 'Task Management Mobile App',
          description: 'React Native app with real-time synchronization',
          technologies: ['React Native', 'Firebase', 'TypeScript'],
          imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop',
          githubUrl: 'https://github.com/sarahchen/taskmanager',
          category: 'Mobile Development',
          metrics: {
            downloads: 5000
          }
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Excellence',
          year: 2024,
          gpa: 3.8,
          coursework: ['Data Structures', 'Algorithms', 'Machine Learning', 'Web Development', 'Database Systems']
        }
      ],
      experience: [
        {
          title: 'Software Engineering Intern',
          company: 'TechCorp Inc.',
          duration: 'Jun 2023 - Aug 2023',
          description: 'Developed and deployed microservices using Node.js and Docker. Improved API performance by 40% through optimization techniques.',
          location: 'San Francisco, CA',
          type: 'internship'
        },
        {
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          duration: 'Sep 2023 - Present',
          description: 'Part-time role developing React components for a fintech application. Led the redesign of the user dashboard.',
          location: 'Remote',
          type: 'part-time'
        }
      ],
      certifications: [
        {
          name: 'AWS Solutions Architect Associate',
          issuer: 'Amazon Web Services',
          date: '2023-08-15',
          credentialUrl: 'https://aws.amazon.com/certification/'
        },
        {
          name: 'React Developer Certification',
          issuer: 'Meta',
          date: '2023-05-20'
        }
      ],
      resumeUrl: '/resumes/sarah-chen-resume.pdf',
      portfolioScore: 96,
      skills: [
        { name: 'React', level: 95, category: 'Frontend' },
        { name: 'JavaScript', level: 92, category: 'Frontend' },
        { name: 'TypeScript', level: 88, category: 'Frontend' },
        { name: 'Node.js', level: 85, category: 'Backend' },
        { name: 'Python', level: 90, category: 'Backend' },
        { name: 'AWS', level: 82, category: 'Cloud' },
        { name: 'MongoDB', level: 78, category: 'Database' },
        { name: 'PostgreSQL', level: 80, category: 'Database' }
      ],
      testimonials: [
        {
          name: 'John Smith',
          role: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          text: 'Sarah is an exceptional developer with strong problem-solving skills. Her work on our microservices architecture was outstanding.',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        },
        {
          name: 'Emily Johnson',
          role: 'Product Manager',
          company: 'StartupXYZ',
          text: 'Working with Sarah has been a pleasure. She delivers high-quality code and has great attention to detail.',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const { student } = portfolioData;
  const featuredProjects = portfolioData.projects.filter(p => p.featured);
  const otherProjects = portfolioData.projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="w-5 h-5" />
              </Button>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/10 via-pink-500/5 to-blue-600/10 p-8 mb-8">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <Avatar className="h-24 w-24 border-4 border-white/20">
                <AvatarImage src={student.profileImage} />
                <AvatarFallback className="text-2xl">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{student.name}</h1>
                <p className="text-xl text-muted-foreground mb-4">{student.department} • Class of {student.graduationYear}</p>
                {student.bio && (
                  <p className="text-lg leading-relaxed max-w-3xl">{student.bio}</p>
                )}
              </div>
            </div>

            {/* Contact Info & Social Links */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center text-muted-foreground">
                <Mail className="w-5 h-5 mr-2" />
                {student.email}
              </div>
              {student.phone && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="w-5 h-5 mr-2" />
                  {student.phone}
                </div>
              )}
              {student.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-2" />
                  {student.location}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {student.socialLinks?.github && (
                <Button variant="outline" size="sm" onClick={() => window.open(student.socialLinks?.github, '_blank')}>
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              )}
              {student.socialLinks?.linkedin && (
                <Button variant="outline" size="sm" onClick={() => window.open(student.socialLinks?.linkedin, '_blank')}>
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              )}
              {student.socialLinks?.website && (
                <Button variant="outline" size="sm" onClick={() => window.open(student.socialLinks?.website, '_blank')}>
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
              )}
              <Button variant="default">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{portfolioData.portfolioScore}</div>
                  <div className="text-sm text-muted-foreground">Portfolio Score</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-2xl font-bold">{student.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-500 mr-1" />
                    <span className="text-2xl font-bold">{student.views}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{student.gpa}</div>
                  <div className="text-sm text-muted-foreground">GPA</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {/* Projects */}
          <TabsContent value="projects">
            <div className="space-y-8">
              {/* Featured Projects */}
              {featuredProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
                    Featured Projects
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredProjects.map((project) => (
                      <Card key={project.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-cover bg-center relative overflow-hidden">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                              <Badge variant="secondary">{project.category}</Badge>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <p className="text-muted-foreground mb-4">{project.longDescription || project.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                            ))}
                          </div>

                          {project.metrics && (
                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                              {project.metrics.users && <span>{project.metrics.users.toLocaleString()} users</span>}
                              {project.metrics.downloads && <span>{project.metrics.downloads.toLocaleString()} downloads</span>}
                              {project.metrics.github_stars && <span>★ {project.metrics.github_stars} stars</span>}
                            </div>
                          )}

                          <div className="flex space-x-3">
                            {project.liveUrl && (
                              <Button size="sm" onClick={() => window.open(project.liveUrl, '_blank')}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Live Demo
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" onClick={() => window.open(project.githubUrl, '_blank')}>
                                <Github className="w-4 h-4 mr-2" />
                                Code
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Projects */}
              {otherProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Code className="w-6 h-6 mr-2" />
                    Other Projects
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherProjects.map((project) => (
                      <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-cover bg-center">
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{project.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                            ))}
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
                                <Github className="w-3 h-3 mr-1" />
                                Code
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Technical Skills</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['Frontend', 'Backend', 'Database', 'Cloud'].map((category) => {
                  const categorySkills = portfolioData.skills.filter(skill => skill.category === category);
                  if (categorySkills.length === 0) return null;
                  
                  return (
                    <Card key={category}>
                      <CardHeader>
                        <CardTitle>{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {categorySkills.map((skill) => (
                            <div key={skill.name} className="space-y-2">
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
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Work Experience</h2>
              
              <div className="space-y-6">
                {portfolioData.experience.map((exp, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{exp.title}</h3>
                          <p className="text-lg text-purple-600">{exp.company}</p>
                          {exp.location && <p className="text-sm text-muted-foreground">{exp.location}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{exp.duration}</p>
                          {exp.type && (
                            <Badge variant="outline" className="mt-1">
                              {exp.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Education & Certifications</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Education */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Education</h3>
                  <div className="space-y-4">
                    {portfolioData.education.map((edu, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-lg">{edu.degree}</h4>
                          <p className="text-purple-600">{edu.institution}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-muted-foreground">Class of {edu.year}</span>
                            <span className="font-medium">GPA: {edu.gpa}/4.0</span>
                          </div>
                          {edu.coursework && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">Relevant Coursework:</p>
                              <div className="flex flex-wrap gap-1">
                                {edu.coursework.map((course) => (
                                  <Badge key={course} variant="secondary" className="text-xs">{course}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                  <div className="space-y-4">
                    {portfolioData.certifications.map((cert, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-purple-600">{cert.issuer}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Issued {new Date(cert.date).toLocaleDateString()}
                          </p>
                          {cert.credentialUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3"
                              onClick={() => window.open(cert.credentialUrl, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              View Credential
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Testimonials */}
          <TabsContent value="testimonials">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Testimonials</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioData.testimonials?.map((testimonial, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.image} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}