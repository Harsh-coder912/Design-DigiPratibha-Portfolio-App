import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useTheme } from './ThemeProvider';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Sparkles, 
  Search, 
  ChevronDown, 
  ChevronRight,
  HelpCircle,
  Zap,
  Users,
  CreditCard,
  Shield,
  Settings,
  BookOpen,
  MessageSquare
} from 'lucide-react';

const faqCategories = [
  { id: 'general', label: 'General', icon: HelpCircle, color: 'bg-blue-100 text-blue-600' },
  { id: 'getting-started', label: 'Getting Started', icon: Zap, color: 'bg-green-100 text-green-600' },
  { id: 'features', label: 'Features & AI', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  { id: 'institutions', label: 'Institutions', icon: Users, color: 'bg-orange-100 text-orange-600' },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, color: 'bg-pink-100 text-pink-600' },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: 'bg-red-100 text-red-600' },
  { id: 'technical', label: 'Technical', icon: Settings, color: 'bg-gray-100 text-gray-600' }
];

const faqs = {
  general: [
    {
      question: "What is DigiPratibha?",
      answer: "DigiPratibha is an AI-powered portfolio builder designed specifically for students and educational institutions. It helps students create professional portfolios with AI-generated content, templates, and career insights to improve their job prospects."
    },
    {
      question: "Who can use DigiPratibha?",
      answer: "DigiPratibha is designed for students, recent graduates, educational institutions, and career counselors. Whether you're in computer science, design, business, or any other field, our platform can help you showcase your work professionally."
    },
    {
      question: "Is DigiPratibha really free?",
      answer: "Yes! We offer a comprehensive free tier that includes portfolio creation, basic templates, AI content generation, and portfolio hosting. Premium features like advanced analytics, custom domains, and priority support are available in our paid plans."
    },
    {
      question: "How is DigiPratibha different from other portfolio builders?",
      answer: "DigiPratibha is specifically designed for students and leverages AI to help with content creation, skill assessment, and career guidance. Unlike generic portfolio builders, we understand the unique challenges students face and provide tools tailored to their needs."
    }
  ],
  'getting-started': [
    {
      question: "How do I create my first portfolio?",
      answer: "Simply sign up for a free account, choose from our professionally designed templates, add your information, and let our AI help optimize your content. You can have a professional portfolio ready in minutes!"
    },
    {
      question: "What information do I need to get started?",
      answer: "Basic information like your name, contact details, education background, and projects. Don't worry if you don't have everything ready – you can add and edit content anytime, and our AI can help generate missing pieces."
    },
    {
      question: "Can I change my template after creating a portfolio?",
      answer: "Absolutely! You can switch between templates at any time. Your content will automatically adapt to the new template design, though you may want to review the layout to ensure everything looks perfect."
    },
    {
      question: "How do I share my portfolio?",
      answer: "Each portfolio gets a unique, shareable URL (like digipratibha.com/portfolio/yourname). You can share this link on social media, in email signatures, job applications, or anywhere you want to showcase your work."
    }
  ],
  features: [
    {
      question: "How does the AI content generation work?",
      answer: "Our AI analyzes the information you provide about your projects, skills, and experience to generate professional descriptions, bios, and summaries. It understands different industries and can tailor content to your field."
    },
    {
      question: "What AI features are available?",
      answer: "We offer AI-powered bio writing, project description generation, skill assessment, career path analysis, resume optimization, and visual content suggestions. New AI features are added regularly based on user feedback."
    },
    {
      question: "Can I edit AI-generated content?",
      answer: "Yes! All AI-generated content is fully editable. Think of the AI as your writing assistant – it provides a great starting point that you can customize to match your voice and style."
    },
    {
      question: "Is the AI content unique?",
      answer: "Yes, our AI generates unique content based on your specific input. While it may use common industry terminology, each piece of content is tailored to your individual projects and experience."
    }
  ],
  institutions: [
    {
      question: "How can my institution use DigiPratibha?",
      answer: "Educational institutions can create admin accounts to manage student portfolios, track progress, access analytics, and help students with career placement. We offer special institutional pricing and features."
    },
    {
      question: "What features are available for institution admins?",
      answer: "Institution admins get access to student management dashboards, portfolio analytics, placement tracking, bulk operations, AI insights about student performance, and dedicated support."
    },
    {
      question: "Can we integrate DigiPratibha with our existing systems?",
      answer: "We offer API access and integration options for institutional customers. This allows you to connect DigiPratibha with your student information systems, learning management systems, and career services platforms."
    },
    {
      question: "Do you offer training for institution staff?",
      answer: "Yes! We provide comprehensive training sessions, documentation, and ongoing support to help your staff make the most of DigiPratibha's features. This includes both technical training and best practices for student portfolio guidance."
    }
  ],
  billing: [
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes one portfolio, basic templates, AI content generation (with limits), portfolio hosting, and basic analytics. This is perfect for students who want to get started without any cost."
    },
    {
      question: "What are the premium plan benefits?",
      answer: "Premium plans include unlimited portfolios, advanced templates, unlimited AI features, custom domains, priority support, advanced analytics, PDF exports, and more customization options."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan anytime. When upgrading, new features are available immediately. When downgrading, you'll retain access to premium features until your current billing period ends."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Students with valid .edu email addresses automatically receive significant discounts on all premium plans. We also offer special rates for student organizations and clubs."
    }
  ],
  privacy: [
    {
      question: "Is my portfolio data secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest, we follow industry best practices for data protection, and we're compliant with major privacy regulations including GDPR and CCPA."
    },
    {
      question: "Who can see my portfolio?",
      answer: "By default, portfolios are private until you choose to publish them. Once published, they're accessible via the unique URL you share. You can also make portfolios password-protected or private again at any time."
    },
    {
      question: "Can I delete my account and data?",
      answer: "Absolutely. You can delete your account and all associated data at any time from your account settings. This action is permanent and cannot be undone, so we recommend downloading any content you want to keep first."
    },
    {
      question: "Do you share my data with third parties?",
      answer: "We never sell your personal data to third parties. We may use anonymous, aggregated data for product improvement and research, but individual portfolio content remains private unless you choose to make it public."
    }
  ],
  technical: [
    {
      question: "What browsers are supported?",
      answer: "DigiPratibha works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience."
    },
    {
      question: "Can I use DigiPratibha on mobile devices?",
      answer: "Yes! Our platform is fully responsive and works great on smartphones and tablets. You can create, edit, and share portfolios from any device."
    },
    {
      question: "What file formats can I upload?",
      answer: "You can upload images (JPG, PNG, GIF, WebP), documents (PDF), and soon we'll support video files. There are file size limits depending on your plan – free accounts have smaller limits than premium accounts."
    },
    {
      question: "Is there an API available?",
      answer: "We offer API access for institutional customers and enterprise users. This allows integration with existing systems and bulk operations. Contact our sales team to learn more about API access."
    }
  ]
};

export default function FAQPage() {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setOpenItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const filteredFaqs = Object.entries(faqs).map(([category, items]) => ({
    category,
    items: items.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(({ items }) => items.length > 0);

  const displayFaqs = searchTerm ? filteredFaqs : [{ category: selectedCategory, items: faqs[selectedCategory as keyof typeof faqs] }];

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
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Find quick answers to common questions about DigiPratibha. 
            Can't find what you're looking for? Don't hesitate to contact our support team.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          {!searchTerm && (
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {faqCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                          <category.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{category.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {faqs[category.id as keyof typeof faqs].length} questions
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.aside>
          )}

          {/* FAQ Content */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={searchTerm ? "lg:col-span-4" : "lg:col-span-3"}
          >
            {displayFaqs.map(({ category, items }) => (
              <div key={category} className="mb-8">
                {searchTerm && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline">
                      {faqCategories.find(cat => cat.id === category)?.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {items.length} result{items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                <div className="space-y-4">
                  {items.map((faq, index) => {
                    const itemId = `${category}-${index}`;
                    const isOpen = openItems.includes(itemId);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Collapsible>
                          <Card className="border-border/50 hover:border-border transition-colors">
                            <CollapsibleTrigger 
                              className="w-full"
                              onClick={() => toggleItem(itemId)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-left">{faq.question}</h3>
                                  {isOpen ? (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                              </CardContent>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="px-4 pb-4 pt-0">
                                <div className="border-t border-border pt-4">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}

            {displayFaqs.every(({ items }) => items.length === 0) && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any FAQs matching "{searchTerm}". Try a different search term.
                </p>
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              </div>
            )}
          </motion.section>
        </div>

        {/* Contact Support */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help! 
                Get in touch and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Contact Support
                  </Button>
                </Link>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}