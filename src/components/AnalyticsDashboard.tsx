import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Star,
  Award,
  Calendar as CalendarIcon,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Brain,
  PieChart,
  LineChart
} from 'lucide-react';

interface AnalyticsData {
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

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  onRefresh: () => void;
  loading?: boolean;
  onTopPerformerClick?: (studentName: string) => void;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-83d15fec`;

export default function AnalyticsDashboard({ data, onRefresh, loading = false, onTopPerformerClick }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [exportFormat, setExportFormat] = useState('csv');

  // Calculate trends and percentages
  const portfolioPublishRate = (data.overview.publishedPortfolios / data.overview.totalStudents) * 100;
  const averageViewsPerPortfolio = data.overview.totalViews / data.overview.publishedPortfolios;

  const handleExport = async () => {
    try {
      // Simulate export processing time
      toast.info('Preparing analytics export...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock analytics data for export
      const analyticsData = {
        overview: data.overview,
        skillsPopularity: data.skillsPopularity,
        departmentDistribution: data.departmentDistribution,
        exportDate: new Date().toISOString(),
        dateRange: dateRange
      };
      
      let content, fileExtension, mimeType;
      
      if (exportFormat === 'json') {
        content = JSON.stringify(analyticsData, null, 2);
        fileExtension = 'json';
        mimeType = 'application/json';
      } else {
        // Default to CSV
        const csvHeaders = 'Metric,Value\n';
        const csvData = [
          `Total Students,${data.overview.totalStudents}`,
          `Published Portfolios,${data.overview.publishedPortfolios}`,
          `Total Views,${data.overview.totalViews}`,
          `Average Rating,${data.overview.avgRating}`,
          `Active This Month,${data.overview.activeThisMonth}`,
          `Portfolio Publish Rate,${portfolioPublishRate.toFixed(1)}%`,
          `Avg Views Per Portfolio,${averageViewsPerPortfolio.toFixed(0)}`
        ].join('\n');
        
        content = csvHeaders + csvData;
        fileExtension = 'csv';
        mimeType = 'text/csv;charset=utf-8;';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Analytics data exported successfully!');
      
      // Show user notification about format conversion if needed
      if (exportFormat === 'xlsx' || exportFormat === 'pdf') {
        toast.info(`Note: Exported as ${fileExtension.toUpperCase()} format (${exportFormat.toUpperCase()} support coming soon)`);
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Export failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              {dateRange === 'custom' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-60">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf" disabled>PDF (Soon)</SelectItem>
                  <SelectItem value="xlsx" disabled>Excel (Soon)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" onClick={onRefresh} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.overview.totalStudents}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +12% vs last month
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.overview.activeThisMonth} active this month
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Publish Rate</CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolioPublishRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +8% vs last month
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.overview.publishedPortfolios} of {data.overview.totalStudents} students
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views per Portfolio</CardTitle>
            <Eye className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(averageViewsPerPortfolio)}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +23% vs last month
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.overview.totalViews.toLocaleString()} total views
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.overview.avgRating.toFixed(1)}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +0.3 vs last month
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on portfolio reviews
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Department Distribution
                </CardTitle>
                <CardDescription>Student distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.departmentDistribution.map((dept, index) => {
                    const percentage = (dept.count / data.overview.totalStudents) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
                    
                    return (
                      <div key={dept.department} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dept.department}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{dept.count} students</span>
                            <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                          </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colors[index % colors.length]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Top Performers
                </CardTitle>
                <CardDescription>Highest rated student portfolios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.overview.topPerformers.map((performer, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-all hover:shadow-md hover:shadow-purple-500/10 group"
                      onClick={() => onTopPerformerClick?.(performer.name)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{performer.name}</p>
                          <p className="text-sm text-muted-foreground">{performer.views} portfolio views</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">{performer.rating}</span>
                        <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>Machine learning analysis of your student data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Skills Popularity Analysis
              </CardTitle>
              <CardDescription>Most in-demand skills among your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.skillsPopularity.map((skill, index) => {
                  const percentage = (skill.count / data.overview.totalStudents) * 100;
                  const isTopSkill = index < 3;
                  
                  return (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{skill.skill}</span>
                          {isTopSkill && (
                            <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
                              Top {index + 1}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">{skill.count} students</span>
                          <span className="font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isTopSkill 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                              : 'bg-primary'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {isTopSkill && (
                        <p className="text-xs text-muted-foreground">
                          High demand skill - consider promoting this in your curriculum
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Portfolio Completion Rate</span>
                    <span className="text-sm font-bold">{portfolioPublishRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={portfolioPublishRate} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Average Quality Score</span>
                    <span className="text-sm font-bold">{((data.overview.avgRating / 5) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(data.overview.avgRating / 5) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Student Engagement</span>
                    <span className="text-sm font-bold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Analysis</CardTitle>
                <CardDescription>Student activity and engagement levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300">High Engagement</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Students with 4+ portfolio updates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {Math.floor(data.overview.totalStudents * 0.3)}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">30% of students</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <div>
                      <p className="font-medium text-yellow-700 dark:text-yellow-300">Medium Engagement</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Students with 2-3 portfolio updates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                        {Math.floor(data.overview.totalStudents * 0.5)}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">50% of students</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-300">Low Engagement</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Students with 0-1 portfolio updates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {Math.floor(data.overview.totalStudents * 0.2)}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">20% of students</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="w-5 h-5 mr-2" />
                Activity Trends
              </CardTitle>
              <CardDescription>Portfolio activity over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-1">
                {data.activityTimeline.slice(-14).map((day, index) => {
                  const maxPortfolios = Math.max(...data.activityTimeline.map(d => d.portfolios));
                  const height = (day.portfolios / maxPortfolios) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <span className="text-xs text-muted-foreground transform -rotate-45">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-500">
                    {data.activityTimeline.reduce((sum, day) => sum + day.portfolios, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Portfolio Updates</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-500">
                    {data.activityTimeline.reduce((sum, day) => sum + day.views, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Portfolio Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}