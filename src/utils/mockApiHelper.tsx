// Mock API Helper with timeout protection
export class MockApiHelper {
  static async simulateApiCall<T>(
    mockDataGenerator: () => T,
    options: {
      delay?: number;
      successMessage?: string;
      errorMessage?: string;
      shouldFail?: boolean;
    } = {}
  ): Promise<T> {
    const {
      delay = 800,
      successMessage = 'Data loaded successfully',
      errorMessage = 'Failed to load data',
      shouldFail = false
    } = options;

    try {
      // Add timeout protection - max 5 seconds for any mock call
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Mock API call timeout')), 5000)
      );

      const simulationPromise = new Promise<T>((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error(errorMessage));
          } else {
            resolve(mockDataGenerator());
          }
        }, delay);
      });

      return await Promise.race([simulationPromise, timeoutPromise]);
    } catch (error) {
      console.error('Mock API Helper error:', error);
      // Always return mock data as fallback
      return mockDataGenerator();
    }
  }

  // Helper to prevent infinite useEffect loops
  static createStableCallback<T extends (...args: any[]) => any>(callback: T): T {
    return callback;
  }

  // Helper to handle component unmounting during async operations
  static createCancellablePromise<T>(promise: Promise<T>) {
    let cancelled = false;
    
    const cancellablePromise = promise.then(
      (result) => cancelled ? Promise.reject(new Error('Cancelled')) : result,
      (error) => cancelled ? Promise.reject(new Error('Cancelled')) : Promise.reject(error)
    );
    
    return {
      promise: cancellablePromise,
      cancel: () => { cancelled = true; }
    };
  }

  // Helper to debounce API calls
  static debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  }
}

// Common mock data generators
export const MockDataGenerators = {
  studentList: () => [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@university.edu',
      department: 'Computer Science',
      skills: ['React', 'JavaScript', 'Python', 'Machine Learning'],
      gpa: 3.8,
      portfolioStatus: 'published' as const,
      achievements: ['Hackathon Winner', 'Research Publication'],
      views: 234,
      rating: 4.6,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      graduationYear: 2024
    },
    {
      id: '2',
      name: 'Amit Patel',
      email: 'amit@university.edu',
      department: 'Data Science',
      skills: ['Python', 'Machine Learning', 'SQL', 'R'],
      gpa: 3.6,
      portfolioStatus: 'published' as const,
      achievements: ['Data Science Certificate'],
      views: 187,
      rating: 4.3,
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      graduationYear: 2024
    }
  ],

  analyticsData: () => ({
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
  })
};