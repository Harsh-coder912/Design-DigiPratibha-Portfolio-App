import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTheme } from './ThemeProvider';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Plus, 
  Save, 
  Eye, 
  Download, 
  Share2, 
  Image, 
  Type, 
  Layout, 
  Star, 
  Mail,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Wand2,
  Palette,
  Trash2,
  Edit
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'admin';
}

interface LightStudentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface PortfolioComponent {
  id: string;
  type: 'text' | 'image' | 'project' | 'skill' | 'contact';
  content: any;
  style: any;
}

const componentTypes = [
  { type: 'text', icon: Type, label: 'Text Block', description: 'Add headings, paragraphs, or quotes' },
  { type: 'image', icon: Image, label: 'Image', description: 'Upload photos or graphics' },
  { type: 'project', icon: Layout, label: 'Project Card', description: 'Showcase your work' },
  { type: 'skill', icon: Star, label: 'Skill Bar', description: 'Display your skills and ratings' },
  { type: 'contact', icon: Mail, label: 'Contact Form', description: 'Let visitors reach out' }
];

export default function LightStudentDashboard({ user, onLogout }: LightStudentDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('builder');
  const [portfolioComponents, setPortfolioComponents] = useState<PortfolioComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Mock portfolio data
  const [portfolioData, setPortfolioData] = useState({
    title: `${user.name}'s Portfolio`,
    subtitle: 'Aspiring Developer',
    bio: 'Passionate computer science student with experience in web development and AI.',
    skills: ['React', 'Python', 'JavaScript', 'Node.js']
  });

  const addComponent = (type: string) => {
    const newComponent: PortfolioComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type: type as any,
      content: getDefaultContent(type),
      style: { padding: '16px', margin: '8px' }
    };
    
    setPortfolioComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
    toast.success(`${type} component added!`);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Your text content here...', size: 'medium', align: 'left' };
      case 'image':
        return { src: '', alt: 'Image description', width: '100%' };
      case 'project':
        return { title: 'Project Title', description: 'Project description...', tech: [] };
      case 'skill':
        return { skill: 'Skill Name', level: 80 };
      case 'contact':
        return { title: 'Contact Me', fields: ['name', 'email', 'message'] };
      default:
        return {};
    }
  };

  const removeComponent = (id: string) => {
    setPortfolioComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
    toast.success('Component removed');
  };

  const generateAIContent = async (type: string) => {
    toast.info('Generating AI content...');
    // Mock AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (type === 'bio') {
      setPortfolioData(prev => ({
        ...prev,
        bio: 'Driven computer science student with a passion for full-stack development and machine learning. Experienced in building scalable web applications and implementing AI solutions.'
      }));
      toast.success('AI bio generated!');
    }
  };

  const savePortfolio = async () => {
    toast.info('Saving portfolio...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Portfolio saved successfully!');
  };

  const publishPortfolio = async () => {
    toast.info('Publishing portfolio...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Portfolio published!');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
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
              <p className="text-sm text-muted-foreground">Student</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button 
              variant={activeTab === 'builder' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('builder')}
            >
              <Layout className="w-4 h-4 mr-2" />
              Portfolio Builder
            </Button>
            <Button 
              variant={activeTab === 'templates' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('templates')}
            >
              <Palette className="w-4 h-4 mr-2" />
              Templates
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Portfolio Builder</h1>
              <p className="text-muted-foreground">Create your professional portfolio</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={savePortfolio}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={() => navigate('/portfolio/john-doe')}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={publishPortfolio}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {activeTab === 'builder' && (
            <>
              {/* Component Palette */}
              <div className="w-80 bg-muted/30 border-r border-border p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Components</h3>
                    <div className="space-y-2">
                      {componentTypes.map((component) => (
                        <Card 
                          key={component.type}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/50"
                          onClick={() => addComponent(component.type)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <component.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{component.label}</p>
                                <p className="text-xs text-muted-foreground">{component.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">AI Tools</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => generateAIContent('bio')}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Bio
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <Card className="min-h-[600px] border-2 border-dashed border-border/50">
                    <CardContent className="p-8">
                      {/* Portfolio Header */}
                      <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">{portfolioData.title}</h1>
                        <p className="text-xl text-muted-foreground mb-4">{portfolioData.subtitle}</p>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{portfolioData.bio}</p>
                      </div>

                      {/* Dynamic Components */}
                      <div className="space-y-4">
                        {portfolioComponents.map((component) => (
                          <div
                            key={component.id}
                            className={`group relative p-4 rounded-lg border border-border/50 hover:border-border cursor-pointer ${
                              selectedComponent === component.id ? 'ring-2 ring-purple-500' : ''
                            }`}
                            onClick={() => setSelectedComponent(component.id)}
                          >
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeComponent(component.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {component.type === 'text' && (
                              <div>
                                <p>{component.content.text}</p>
                              </div>
                            )}

                            {component.type === 'project' && (
                              <div>
                                <h3 className="font-medium mb-2">{component.content.title}</h3>
                                <p className="text-muted-foreground">{component.content.description}</p>
                              </div>
                            )}

                            {component.type === 'skill' && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span>{component.content.skill}</span>
                                  <span>{component.content.level}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                    style={{ width: `${component.content.level}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {portfolioComponents.length === 0 && (
                          <div className="text-center py-16 text-muted-foreground">
                            <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Start building your portfolio by adding components from the left panel</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {(activeTab === 'templates' || activeTab === 'settings') && (
            <div className="flex-1 p-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {activeTab === 'templates' ? 'Choose a Template' : 'Portfolio Settings'}
                </h2>
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <Label>Portfolio Title</Label>
                      <Input 
                        value={portfolioData.title}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input 
                        value={portfolioData.subtitle}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, subtitle: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea 
                        value={portfolioData.bio}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}