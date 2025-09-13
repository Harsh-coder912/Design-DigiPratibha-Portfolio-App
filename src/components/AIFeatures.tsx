import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTheme } from './ThemeProvider';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Wand2, 
  Brain, 
  Target, 
  TrendingUp, 
  FileText, 
  Image, 
  Star,
  ArrowLeft,
  Sun,
  Moon,
  Zap,
  BookOpen,
  Users,
  Award,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Palette
} from 'lucide-react';

const aiFeatures = [
  {
    icon: Wand2,
    title: "AI Content Generator",
    description: "Generate professional bios, project descriptions, and skill summaries with advanced AI.",
    features: ["Professional Bio Writing", "Project Descriptions", "Achievement Summaries", "Cover Letters"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Brain,
    title: "Smart Skill Assessment",
    description: "AI analyzes your projects and suggests relevant skills with proficiency levels.",
    features: ["Skill Detection", "Proficiency Analysis", "Gap Identification", "Learning Recommendations"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Target,
    title: "Career Path Analyzer",
    description: "Get personalized career recommendations based on your skills and interests.",
    features: ["Career Matching", "Salary Insights", "Job Market Trends", "Growth Opportunities"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Image,
    title: "Visual Content AI",
    description: "Generate project thumbnails, banners, and visual elements for your portfolio.",
    features: ["Thumbnail Generation", "Banner Creation", "Color Schemes", "Layout Suggestions"],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: FileText,
    title: "Resume Optimizer",
    description: "AI-powered resume analysis and optimization for better job applications.",
    features: ["ATS Optimization", "Keyword Analysis", "Format Suggestions", "Content Enhancement"],
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track portfolio performance and get AI-driven insights for improvement.",
    features: ["View Analytics", "Engagement Metrics", "Optimization Tips", "A/B Testing"],
    color: "from-pink-500 to-rose-500"
  }
];

const careerTools = [
  {
    title: "Job Market Analyzer",
    description: "Analyze current job market trends for your field",
    icon: BarChart3,
    status: "Live"
  },
  {
    title: "Interview Prep AI",
    description: "Practice interviews with AI-powered mock sessions",
    icon: MessageSquare,
    status: "Beta"
  },
  {
    title: "Salary Negotiator",
    description: "Get data-driven salary negotiation strategies",
    icon: TrendingUp,
    status: "Coming Soon"
  },
  {
    title: "Network Builder",
    description: "AI recommendations for professional networking",
    icon: Users,
    status: "Live"
  }
];

export default function AIFeatures() {
  const { theme, toggleTheme } = useTheme();
  const [activeDemo, setActiveDemo] = useState('content-generator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateContent = async (type: string) => {
    setIsGenerating(true);
    setGeneratedContent('');
    
    // Mock AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockContent = {
      bio: "Passionate full-stack developer with 3+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Strong problem-solving skills with a track record of delivering high-quality software solutions. Eager to contribute to innovative projects and collaborate with cross-functional teams.",
      project: "Developed a comprehensive e-commerce platform using React and Node.js, featuring user authentication, payment processing, inventory management, and real-time order tracking. Implemented responsive design principles and optimized for mobile devices, resulting in a 40% increase in mobile conversions.",
      skills: "React (Advanced), JavaScript (Expert), Node.js (Intermediate), Python (Intermediate), AWS (Beginner), Docker (Intermediate), PostgreSQL (Advanced), Git (Expert)"
    };
    
    setGeneratedContent(mockContent[type as keyof typeof mockContent] || 'Generated content would appear here...');
    setIsGenerating(false);
    toast.success('Content generated successfully!');
  };

  const analyzeCareerPath = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Career analysis complete! Check the results below.');
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Features
            </span>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            AI-Powered Portfolio Tools
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Leverage cutting-edge artificial intelligence to create compelling content, 
            analyze career opportunities, and optimize your professional presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3">
                Try AI Tools Free
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </motion.section>

        {/* AI Features Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Powerful AI Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.features.map((item, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Interactive Demo */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 bg-muted/30 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Try AI Tools Live</h2>
          
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content-generator">Content Generator</TabsTrigger>
              <TabsTrigger value="skill-analyzer">Skill Analyzer</TabsTrigger>
              <TabsTrigger value="career-path">Career Path</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content-generator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wand2 className="w-5 h-5 mr-2" />
                    AI Content Generator
                  </CardTitle>
                  <CardDescription>
                    Generate professional content for your portfolio with AI assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tell us about yourself or your project:</label>
                    <Textarea 
                      placeholder="e.g., I'm a software developer who built an e-commerce website using React and Node.js..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateContent('bio')}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isGenerating ? '✨ Generating...' : 'Generate Bio'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => generateContent('project')}
                      disabled={isGenerating}
                    >
                      Generate Project Description
                    </Button>
                  </div>
                  
                  {generatedContent && (
                    <div className="p-4 bg-background rounded-lg border border-border">
                      <h4 className="font-medium mb-2">Generated Content:</h4>
                      <p className="text-muted-foreground leading-relaxed">{generatedContent}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skill-analyzer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Smart Skill Analyzer
                  </CardTitle>
                  <CardDescription>
                    AI analyzes your background and suggests relevant skills.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Describe your experience and projects:</label>
                    <Textarea 
                      placeholder="e.g., I've worked with React for 2 years, built several web applications, experience with databases..."
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => generateContent('skills')}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {isGenerating ? '🧠 Analyzing...' : 'Analyze Skills'}
                  </Button>
                  
                  {generatedContent && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Suggested Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.split(', ').map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="career-path" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Career Path Analyzer
                  </CardTitle>
                  <CardDescription>
                    Get personalized career recommendations based on your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Role/Field:</label>
                      <Input placeholder="e.g., Software Developer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Years of Experience:</label>
                      <Input placeholder="e.g., 2-3 years" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Career Interests:</label>
                    <Textarea 
                      placeholder="e.g., Leadership roles, AI/ML, startup environment..."
                      rows={2}
                    />
                  </div>
                  
                  <Button 
                    onClick={analyzeCareerPath}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isGenerating ? '🎯 Analyzing...' : 'Analyze Career Path'}
                  </Button>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <h4 className="font-medium mb-1">Senior Developer</h4>
                        <p className="text-sm text-muted-foreground">95% Match</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <h4 className="font-medium mb-1">Tech Lead</h4>
                        <p className="text-sm text-muted-foreground">88% Match</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Lightbulb className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                        <h4 className="font-medium mb-1">Product Manager</h4>
                        <p className="text-sm text-muted-foreground">72% Match</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Career Tools */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">AI Career Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <tool.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <Badge 
                      variant={tool.status === 'Live' ? 'default' : 
                               tool.status === 'Beta' ? 'secondary' : 'outline'}
                    >
                      {tool.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are using AI to accelerate their career growth 
            and land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3">
                Start Building with AI
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-3">
              View Pricing
            </Button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}