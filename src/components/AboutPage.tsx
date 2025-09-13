import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Sparkles, 
  Users, 
  Target, 
  Award, 
  Heart,
  Zap,
  BookOpen,
  TrendingUp,
  Code,
  Palette,
  Brain
} from 'lucide-react';

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    avatar: "SC",
    bio: "Former Google engineer passionate about education technology and AI.",
    expertise: ["Product Strategy", "AI/ML", "Team Leadership"]
  },
  {
    name: "Amit Patel", 
    role: "CTO",
    avatar: "AP",
    bio: "Full-stack developer with expertise in scalable web applications.",
    expertise: ["Backend Development", "Cloud Architecture", "DevOps"]
  },
  {
    name: "Emily Johnson",
    role: "Head of Design",
    avatar: "EJ", 
    bio: "UX designer focused on creating intuitive and accessible interfaces.",
    expertise: ["UI/UX Design", "User Research", "Design Systems"]
  },
  {
    name: "David Kim",
    role: "AI Research Lead",
    avatar: "DK",
    bio: "PhD in Computer Science specializing in natural language processing.",
    expertise: ["Machine Learning", "NLP", "AI Research"]
  }
];

const milestones = [
  {
    year: "2023",
    title: "The Hackathon Spark",
    description: "DigiPratibha was born during a 48-hour hackathon focused on education technology.",
    icon: Zap
  },
  {
    year: "2023",
    title: "First Prototype",
    description: "Launched our MVP with basic portfolio building features for 100 beta users.",
    icon: Code
  },
  {
    year: "2024",
    title: "AI Integration",
    description: "Integrated advanced AI features for content generation and career insights.",
    icon: Brain
  },
  {
    year: "2024",
    title: "10,000+ Students",
    description: "Reached our first major milestone with over 10,000 student portfolios created.",
    icon: Users
  }
];

const values = [
  {
    icon: Users,
    title: "Student-Centric",
    description: "Every feature is designed with student success in mind, focusing on their unique needs and challenges."
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "We leverage cutting-edge AI technology to provide tools that were previously unavailable to students."
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "Professional portfolio creation should be accessible to every student, regardless of technical background."
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "We're committed to helping students grow professionally and achieve their career aspirations."
  }
];

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();

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
              DigiPratibha
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Empowering Student Success
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            DigiPratibha was born from a simple belief: every student deserves the tools to showcase 
            their potential and launch their dream career. We're on a mission to democratize 
            professional portfolio creation with the power of AI.
          </p>
          
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Students Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Institutions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">85%</div>
              <div className="text-muted-foreground">Placement Rate</div>
            </div>
          </div>
        </motion.section>

        {/* Our Story */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  It all started during a college hackathon in 2023. As computer science students, 
                  we witnessed firsthand how talented peers struggled to present their work professionally. 
                  Traditional portfolio tools were either too complex, too expensive, or simply 
                  didn't understand the unique needs of students.
                </p>
                <p>
                  We decided to build something different. Something that would understand that students 
                  often have amazing projects but struggle with professional presentation. Something 
                  that could leverage AI to help students articulate their achievements and potential.
                </p>
                <p>
                  That 48-hour hackathon project evolved into DigiPratibha – a platform that has now 
                  helped thousands of students land their dream jobs and showcase their talents to the world.
                </p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Hackathon Winner</h3>
                      <p className="text-sm text-muted-foreground">Best EdTech Solution 2023</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The judges were impressed by how DigiPratibha addressed a real problem 
                    that every student faces – presenting their work professionally."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center space-x-4 ${index % 2 === 1 ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div className="flex-1">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <milestone.icon className="w-6 h-6 text-primary" />
                          <Badge variant="outline">{milestone.year}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Team */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarFallback className="text-xl">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.expertise.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Mission Statement */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                To democratize professional portfolio creation by providing students with AI-powered tools 
                that help them showcase their talents, skills, and potential to the world. We believe that 
                every student, regardless of their background or technical expertise, deserves the opportunity 
                to present themselves professionally and compete in today's job market.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a student ready to showcase your potential or an educator 
            looking to empower your students, we'd love to have you as part of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3">
                Start Building Your Portfolio
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Get in Touch
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}