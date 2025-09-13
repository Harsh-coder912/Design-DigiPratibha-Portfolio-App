import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useTheme } from './ThemeProvider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Download, 
  Share2, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe,
  Star,
  Calendar,
  ExternalLink,
  ChevronDown,
  Sun,
  Moon,
  Home
} from 'lucide-react';

// Mock portfolio data
const portfolioData = {
  'john-doe': {
    name: 'John Doe',
    title: 'Full-Stack Developer',
    subtitle: 'Computer Science Graduate',
    bio: 'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. I love building scalable web applications that solve real-world problems and create meaningful user experiences.',
    avatar: 'JD',
    location: 'San Francisco, CA',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    website: 'johndoe.dev',
    social: {
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      twitter: 'twitter.com/johndoe'
    },
    skills: [
      { name: 'React', level: 90, category: 'Frontend' },
      { name: 'Node.js', level: 85, category: 'Backend' },
      { name: 'Python', level: 80, category: 'Programming' },
      { name: 'AWS', level: 75, category: 'Cloud' },
      { name: 'Docker', level: 70, category: 'DevOps' },
      { name: 'PostgreSQL', level: 85, category: 'Database' }
    ],
    experience: [
      {
        title: 'Software Engineering Intern',
        company: 'TechCorp Inc.',
        duration: 'Jun 2023 - Aug 2023',
        description: 'Developed and maintained React components for the main dashboard, improving user engagement by 25%.'
      },
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        duration: 'Sep 2023 - Present',
        description: 'Built responsive web applications using React and TypeScript, collaborated with design team on UI/UX improvements.'
      }
    ],
    projects: [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Features include user authentication, payment processing, and admin dashboard.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
        github: 'https://github.com/johndoe/ecommerce',
        demo: 'https://ecommerce-demo.com',
        featured: true
      },
      {
        id: 2,
        title: 'AI-Powered Chatbot',
        description: 'Intelligent chatbot using natural language processing to provide customer support. Built with Python, Flask, and integrated with various messaging platforms.',
        image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        technologies: ['Python', 'Flask', 'NLP', 'TensorFlow'],
        github: 'https://github.com/johndoe/ai-chatbot',
        demo: 'https://chatbot-demo.com',
        featured: true
      },
      {
        id: 3,
        title: 'Task Management App',
        description: 'Collaborative task management application with real-time updates, team collaboration features, and progress tracking.',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io'],
        github: 'https://github.com/johndoe/task-manager',
        demo: 'https://taskmanager-demo.com',
        featured: false
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        duration: '2020 - 2024',
        gpa: '3.8/4.0',
        coursework: ['Data Structures', 'Algorithms', 'Database Systems', 'Machine Learning']
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: 'March 2024',
        id: 'AWS-DEV-2024-001'
      },
      {
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: 'January 2024',
        id: 'META-REACT-2024-001'
      }
    ],
    template: 'modern',
    theme: 'dark'
  }
};

export default function PortfolioView() {
  const { slug } = useParams<{ slug: string }>();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const portfolio = portfolioData[slug as keyof typeof portfolioData];

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">The portfolio you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const downloadPDF = () => {
    // Mock PDF download
    alert('PDF download would be implemented here');
  };

  const sharePortfolio = () => {
    if (navigator.share) {
      navigator.share({
        title: `${portfolio.name} - Portfolio`,
        text: `Check out ${portfolio.name}'s portfolio!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>DigiPratibha</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('about')}
                className={`hover:text-primary transition-colors ${activeSection === 'about' ? 'text-primary' : ''}`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('experience')}
                className={`hover:text-primary transition-colors ${activeSection === 'experience' ? 'text-primary' : ''}`}
              >
                Experience
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className={`hover:text-primary transition-colors ${activeSection === 'projects' ? 'text-primary' : ''}`}
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('skills')}
                className={`hover:text-primary transition-colors ${activeSection === 'skills' ? 'text-primary' : ''}`}
              >
                Skills
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`hover:text-primary transition-colors ${activeSection === 'contact' ? 'text-primary' : ''}`}
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={sharePortfolio}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2 border-t border-border pt-4"
            >
              <button onClick={() => scrollToSection('about')} className="block w-full text-left p-2 hover:bg-muted rounded">About</button>
              <button onClick={() => scrollToSection('experience')} className="block w-full text-left p-2 hover:bg-muted rounded">Experience</button>
              <button onClick={() => scrollToSection('projects')} className="block w-full text-left p-2 hover:bg-muted rounded">Projects</button>
              <button onClick={() => scrollToSection('skills')} className="block w-full text-left p-2 hover:bg-muted rounded">Skills</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left p-2 hover:bg-muted rounded">Contact</button>
            </motion.div>
          )}
        </div>
      </motion.nav>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          id="about" 
          className="text-center mb-16"
        >
          <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20">
            <AvatarFallback className="text-2xl">{portfolio.avatar}</AvatarFallback>
          </Avatar>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {portfolio.name}
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-2">{portfolio.title}</h2>
          <p className="text-muted-foreground mb-6">{portfolio.subtitle}</p>
          
          <div className="flex items-center justify-center space-x-2 mb-6 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{portfolio.location}</span>
          </div>
          
          <p className="text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
            {portfolio.bio}
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Mail className="w-4 h-4 mr-2" />
              Contact Me
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="experience" 
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {portfolio.experience.map((exp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{exp.title}</h3>
                      <p className="text-lg text-primary">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="mt-2 md:mt-0">
                      <Calendar className="w-4 h-4 mr-1" />
                      {exp.duration}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="projects" 
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.projects.filter(p => p.featured).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: project.id * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                        <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </Button>
                        <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="skills" 
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Skills & Expertise</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(
                portfolio.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof portfolio.skills>)
              ).map(([category, skills]) => (
                <Card key={category}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{category}</h3>
                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="contact" 
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Let's Connect</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-lg mb-8 text-muted-foreground">
                I'm always interested in hearing about new opportunities and exciting projects.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${portfolio.email}`} className="hover:text-primary transition-colors">
                    {portfolio.email}
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href={`tel:${portfolio.phone}`} className="hover:text-primary transition-colors">
                    {portfolio.phone}
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <a href={`https://${portfolio.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    {portfolio.website}
                  </a>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 {portfolio.name}. Portfolio built with DigiPratibha.</p>
        </div>
      </footer>
    </div>
  );
}