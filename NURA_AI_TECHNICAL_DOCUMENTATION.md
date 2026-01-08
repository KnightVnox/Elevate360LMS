# Nura AI - Technical Documentation
## Version 2.0 | January 2025

---

## 📋 **Table of Contents**

1. [System Overview](#system-overview)
2. [Architecture & Components](#architecture--components)
3. [API Documentation](#api-documentation)
4. [Database Schema](#database-schema)
5. [AI Service Implementation](#ai-service-implementation)
6. [Frontend Components](#frontend-components)
7. [Authentication & Security](#authentication--security)
8. [Performance & Optimization](#performance--optimization)
9. [Error Handling & Logging](#error-handling--logging)
10. [Testing Strategy](#testing-strategy)
11. [Deployment & Configuration](#deployment--configuration)
12. [Monitoring & Analytics](#monitoring--analytics)
13. [Troubleshooting](#troubleshooting)

---

## 🏗️ **System Overview**

### **Nura AI System Architecture**

Nura AI is a comprehensive artificial intelligence system integrated into the Elevate360 LMS platform, providing role-specific AI capabilities through Google Gemini integration with fallback systems for reliability.

#### **Core Technology Stack**
- **AI Engine**: Google Gemini 1.5 Flash API
- **Backend**: Node.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: React 18 with TypeScript
- **State Management**: TanStack React Query
- **UI Framework**: Radix UI with shadcn/ui
- **Styling**: Tailwind CSS

#### **System Characteristics**
- **Modular Design**: Role-specific AI modules (Learner, Mentor, Admin)
- **Fallback System**: Mock responses when AI service unavailable
- **Type Safety**: End-to-end TypeScript implementation
- **Scalable Architecture**: Designed for high concurrent usage
- **Real-time Processing**: Immediate AI response generation

---

## 🏛️ **Architecture & Components**

### **Backend Architecture**

#### **AI Service Layer**
```typescript
// server/services/aiService.ts
export class AIService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.baseUrl = process.env.GOOGLE_API_URL || 'https://generativelanguage.googleapis.com/v1';
  }
}
```

#### **Core Components Structure**
```
server/
├── services/
│   ├── aiService.ts           # Main AI service implementation
│   ├── analyticsService.ts    # Learning analytics processing
│   └── promptEngine.ts        # AI prompt generation
├── routes/
│   └── enhanced.ts            # AI-specific API endpoints
├── middleware/
│   ├── authMiddleware.ts      # Authentication for AI endpoints
│   └── rateLimiting.ts        # AI request rate limiting
└── types/
    └── aiTypes.ts             # AI-specific TypeScript types
```

### **Frontend Architecture**

#### **Component Structure**
```
client/src/
├── components/
│   ├── nura-ai-section.tsx    # Reusable AI container
│   ├── learner-nura-ai.tsx    # Learner AI interface
│   ├── mentor-nura-ai.tsx     # Mentor AI interface
│   └── admin-nura-ai.tsx      # Admin AI interface
├── pages/
│   ├── nura-ai-learner.tsx    # Learner AI page
│   ├── nura-ai-mentor.tsx     # Mentor AI page
│   └── nura-ai-admin.tsx      # Admin AI page
├── hooks/
│   ├── useNuraAI.ts          # AI-specific React hooks
│   └── useAIAnalytics.ts     # AI analytics hooks
└── lib/
    └── aiClient.ts            # AI API client
```

---

## 🔌 **API Documentation**

### **AI Service Endpoints**

#### **Learner AI Endpoints**

##### **POST /api/nura-ai/learner-report**
Generate comprehensive learner performance report.

**Request:**
```typescript
{
  "userId": "string",
  "includeRecommendations": boolean,
  "timeRange": "week" | "month" | "quarter"
}
```

**Response:**
```typescript
{
  "reportId": "string",
  "content": "string",
  "insights": string[],
  "recommendations": string[],
  "confidence": number,
  "metadata": {
    "metrics": {
      "totalCourses": number,
      "completedCourses": number,
      "averageProgress": number,
      "averageScore": number
    }
  },
  "generatedAt": "ISO 8601 timestamp"
}
```

##### **POST /api/nura-ai/study-plan**
Generate personalized study plan.

**Request:**
```typescript
{
  "userId": "string",
  "goals": string[],
  "timeAvailable": number, // hours per week
  "preferences": {
    "learningStyle": "visual" | "auditory" | "kinesthetic",
    "difficulty": "beginner" | "intermediate" | "advanced",
    "schedule": "morning" | "afternoon" | "evening" | "flexible"
  }
}
```

**Response:**
```typescript
{
  "planId": "string",
  "title": "string",
  "description": "string",
  "schedule": {
    "monday": "string",
    "tuesday": "string",
    // ... other days
  },
  "goals": string[],
  "progress": {
    "completed": number,
    "total": number
  },
  "aiGenerated": boolean,
  "isActive": boolean,
  "createdAt": "ISO 8601 timestamp"
}
```

##### **POST /api/nura-ai/quiz-feedback**
Generate immediate quiz feedback.

**Request:**
```typescript
{
  "submissionId": "string",
  "questionId": "string",
  "userAnswer": "string",
  "correctAnswer": "string",
  "explanation": "string"
}
```

**Response:**
```typescript
{
  "feedback": "string",
  "isCorrect": boolean,
  "explanation": "string",
  "recommendations": string[],
  "relatedTopics": string[]
}
```

#### **Mentor AI Endpoints**

##### **POST /api/nura-ai/course-report**
Generate course analysis report.

**Request:**
```typescript
{
  "courseId": "string",
  "includeStudentData": boolean,
  "timeRange": "week" | "month" | "quarter"
}
```

**Response:**
```typescript
{
  "reportId": "string",
  "courseTitle": "string",
  "metrics": {
    "totalEnrollments": number,
    "activeEnrollments": number,
    "completionRate": number,
    "averageProgress": number,
    "averageScore": number
  },
  "insights": string[],
  "recommendations": string[],
  "studentPerformance": {
    "topPerformers": string[],
    "strugglingStudents": string[],
    "interventionNeeded": string[]
  }
}
```

#### **Admin AI Endpoints**

##### **POST /api/nura-ai/system-report**
Generate system-wide analytics report.

**Request:**
```typescript
{
  "organizationId": "string",
  "includeTrends": boolean,
  "includeEquity": boolean,
  "timeRange": "month" | "quarter" | "year"
}
```

**Response:**
```typescript
{
  "reportId": "string",
  "systemMetrics": {
    "totalUsers": number,
    "totalCourses": number,
    "totalEnrollments": number,
    "completionRate": number,
    "activeUsers": number
  },
  "trends": {
    "skillDemand": Array<{skill: string, growth: number}>,
    "coursePopularity": Array<{course: string, enrollments: number}>,
    "userEngagement": Array<{period: string, engagement: number}>
  },
  "equityAnalysis": {
    "demographicBreakdown": Object,
    "performanceGaps": Array<{group: string, gap: number}>,
    "recommendations": string[]
  },
  "strategicInsights": string[]
}
```

### **Error Responses**

#### **Standard Error Format**
```typescript
{
  "error": "string",
  "message": "string",
  "code": "string",
  "timestamp": "ISO 8601 timestamp",
  "requestId": "string"
}
```

#### **Common Error Codes**
- `AI_SERVICE_UNAVAILABLE`: AI service temporarily unavailable
- `INVALID_USER_ROLE`: User role not authorized for AI feature
- `RATE_LIMIT_EXCEEDED`: Too many AI requests
- `INVALID_INPUT`: Malformed request data
- `AI_PROCESSING_ERROR`: Error during AI processing

---

## 🗄️ **Database Schema**

### **AI-Specific Tables**

#### **Nura Reports Table**
```sql
CREATE TABLE nura_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type report_type NOT NULL,
  target_id UUID,
  content TEXT NOT NULL,
  insights TEXT[],
  recommendations TEXT[],
  confidence DECIMAL(3,2),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE report_type AS ENUM (
  'learner',
  'course', 
  'system',
  'quiz_feedback'
);
```

#### **Study Plans Table**
```sql
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  schedule JSONB,
  goals TEXT[],
  progress JSONB,
  ai_generated BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **AI Interactions Table**
```sql
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  feature VARCHAR(100) NOT NULL,
  input_data JSONB,
  output_data JSONB,
  response_time INTEGER, -- milliseconds
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Drizzle ORM Schema**

#### **TypeScript Schema Definition**
```typescript
// shared/schema.ts
export const nuraReports = pgTable('nura_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: reportType('type').notNull(),
  targetId: uuid('target_id'),
  content: text('content').notNull(),
  insights: text('insights').array(),
  recommendations: text('recommendations').array(),
  confidence: decimal('confidence', { precision: 3, scale: 2 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const studyPlans = pgTable('study_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  schedule: jsonb('schedule'),
  goals: text('goals').array(),
  progress: jsonb('progress'),
  aiGenerated: boolean('ai_generated').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const aiInteractions = pgTable('ai_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  feature: varchar('feature', { length: 100 }).notNull(),
  inputData: jsonb('input_data'),
  outputData: jsonb('output_data'),
  responseTime: integer('response_time'),
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## 🤖 **AI Service Implementation**

### **Core AI Service Class**

#### **AIService Implementation**
```typescript
// server/services/aiService.ts
export class AIService {
  private apiKey: string;
  private baseUrl: string;
  private fallbackEnabled: boolean;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.baseUrl = process.env.GOOGLE_API_URL || 'https://generativelanguage.googleapis.com/v1';
    this.fallbackEnabled = process.env.AI_FALLBACK_ENABLED === 'true';
  }

  // Generate learner performance report
  async generateLearnerReport(userId: string): Promise<LearnerReport> {
    try {
      const userData = await this.fetchUserData(userId);
      const prompt = this.buildLearnerReportPrompt(userData);
      const aiResponse = await this.callAI(prompt);
      
      return this.processLearnerReport(aiResponse, userData);
    } catch (error) {
      if (this.fallbackEnabled) {
        return this.generateMockLearnerReport(userId);
      }
      throw error;
    }
  }

  // Generate study plan
  async generateStudyPlan(request: StudyPlanRequest): Promise<StudyPlan> {
    try {
      const userData = await this.fetchUserData(request.userId);
      const prompt = this.buildStudyPlanPrompt(request, userData);
      const aiResponse = await this.callAI(prompt);
      
      return this.processStudyPlan(aiResponse, request);
    } catch (error) {
      if (this.fallbackEnabled) {
        return this.generateMockStudyPlan(request);
      }
      throw error;
    }
  }

  // Core AI API call
  private async callAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
  }

  // Prompt engineering methods
  private buildLearnerReportPrompt(userData: UserData): string {
    return `Analyze the following learner data and provide insights and recommendations:

User: ${userData.firstName} ${userData.lastName}
Role: ${userData.role}
Total Courses: ${userData.totalCourses}
Completed Courses: ${userData.completedCourses}
Average Progress: ${userData.averageProgress}%
Average Score: ${userData.averageScore}/100

Please provide:
1. Key insights about learning patterns
2. Specific recommendations for improvement
3. Suggested learning strategies
4. Progress tracking suggestions

Format the response as structured JSON with sections for insights, recommendations, and strengths.`;
  }

  private buildStudyPlanPrompt(request: StudyPlanRequest, userData: UserData): string {
    return `Create a personalized study plan for this learner:

User: ${userData.firstName} ${userData.lastName}
Active Courses: ${userData.activeCourses.length}
Time Available: ${request.timeAvailable || 10} hours per week
Goals: ${request.goals?.join(', ') || 'Improve overall learning'}

Please provide:
1. Weekly schedule breakdown
2. Specific learning objectives
3. Time management tips
4. Progress tracking methods

Format as structured JSON with schedule, goals, and recommendations.`;
  }

  // Fallback methods
  private generateMockLearnerReport(userId: string): LearnerReport {
    return {
      reportId: generateId(),
      content: "Mock learner report based on available data",
      insights: ["Consistent course completion", "Good engagement patterns"],
      recommendations: ["Focus on advanced topics", "Join study groups"],
      confidence: 0.75,
      metadata: { mock: true },
      generatedAt: new Date().toISOString()
    };
  }
}
```

### **Prompt Engineering**

#### **Prompt Templates**
```typescript
// server/services/promptTemplates.ts
export const PROMPT_TEMPLATES = {
  LEARNER_REPORT: `
    Analyze this learner's performance data and provide comprehensive insights:
    
    User Profile:
    - Name: {firstName} {lastName}
    - Role: {role}
    - Learning History: {learningHistory}
    
    Performance Metrics:
    - Total Courses: {totalCourses}
    - Completion Rate: {completionRate}%
    - Average Score: {averageScore}/100
    - Time Spent: {timeSpent} hours
    
    Please provide:
    1. Strengths and achievements
    2. Areas for improvement
    3. Learning pattern analysis
    4. Personalized recommendations
    5. Next steps for growth
    
    Format as structured analysis with clear sections.
  `,
  
  STUDY_PLAN: `
    Create a personalized study plan based on:
    
    User Goals: {goals}
    Available Time: {timeAvailable} hours/week
    Learning Style: {learningStyle}
    Current Courses: {activeCourses}
    
    Generate:
    1. Weekly schedule with specific time blocks
    2. Learning objectives for each session
    3. Progress milestones
    4. Study techniques recommendations
    5. Review and assessment schedule
    
    Format as actionable study plan with clear structure.
  `,
  
  QUIZ_FEEDBACK: `
    Provide immediate feedback for this quiz response:
    
    Question: {question}
    Student Answer: {userAnswer}
    Correct Answer: {correctAnswer}
    Context: {explanation}
    
    Provide:
    1. Correctness assessment
    2. Explanation of the correct answer
    3. Why the student's answer was right/wrong
    4. Learning recommendations
    5. Related topics to review
    
    Keep feedback encouraging and educational.
  `
};
```

---

## 🎨 **Frontend Components**

### **Core AI Components**

#### **NuraAISection Component**
```typescript
// client/src/components/nura-ai-section.tsx
interface NuraAISectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  compact?: boolean;
}

export default function NuraAISection({ 
  title, 
  description, 
  children, 
  compact = false 
}: NuraAISectionProps) {
  return (
    <Card className={`${compact ? 'p-4' : 'p-6'} bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200`}>
      <CardHeader className={compact ? 'pb-3' : 'pb-4'}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-indigo-900">
              {title}
            </CardTitle>
            <p className="text-sm text-indigo-700 mt-1">
              {description}
            </p>
          </div>
          <Badge className="ml-auto bg-indigo-600 text-white text-xs">
            AI-Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={compact ? 'pt-0' : 'pt-2'}>
        {children}
      </CardContent>
    </Card>
  );
}
```

#### **AI Response Card Component**
```typescript
// client/src/components/ai-response-card.tsx
interface AIResponseCardProps {
  content: string;
  insights?: string[];
  recommendations?: string[];
  confidence?: number;
  isLoading?: boolean;
}

export default function AIResponseCard({
  content,
  insights = [],
  recommendations = [],
  confidence,
  isLoading = false
}: AIResponseCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
            <span className="text-blue-700">Nura is thinking...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>Nura's Response</span>
          {confidence && (
            <Badge variant="outline" className="ml-auto">
              {Math.round(confidence * 100)}% confidence
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="whitespace-pre-line text-sm">{content}</div>
        
        {insights.length > 0 && (
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Key Insights</h4>
            <ul className="space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **Custom Hooks**

#### **useNuraAI Hook**
```typescript
// client/src/hooks/useNuraAI.ts
export function useNuraAI() {
  const queryClient = useQueryClient();

  const generateLearnerReport = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('POST', '/api/nura-ai/learner-report', { userId });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['learner-report', data.userId], data);
    }
  });

  const generateStudyPlan = useMutation({
    mutationFn: async (request: StudyPlanRequest) => {
      const response = await apiRequest('POST', '/api/nura-ai/study-plan', request);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['study-plan', data.userId], data);
    }
  });

  const generateQuizFeedback = useMutation({
    mutationFn: async (request: QuizFeedbackRequest) => {
      const response = await apiRequest('POST', '/api/nura-ai/quiz-feedback', request);
      return response.json();
    }
  });

  return {
    generateLearnerReport,
    generateStudyPlan,
    generateQuizFeedback,
    isLoading: generateLearnerReport.isPending || 
               generateStudyPlan.isPending || 
               generateQuizFeedback.isPending
  };
}
```

---

## 🔐 **Authentication & Security**

### **AI Endpoint Security**

#### **Authentication Middleware**
```typescript
// server/middleware/aiAuthMiddleware.ts
export const aiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Verify user authentication
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check user role permissions for AI features
  const userRole = req.session.userRole;
  const aiFeature = req.path.split('/').pop();
  
  if (!hasAIPermission(userRole, aiFeature)) {
    return res.status(403).json({ error: 'Insufficient permissions for AI feature' });
  }

  next();
};

function hasAIPermission(role: string, feature: string): boolean {
  const permissions = {
    learner: ['learner-report', 'study-plan', 'quiz-feedback'],
    mentor: ['learner-report', 'course-report', 'progress-summary'],
    admin: ['system-report', 'trends', 'equity-monitor']
  };
  
  return permissions[role]?.includes(feature) || false;
}
```

#### **Rate Limiting**
```typescript
// server/middleware/aiRateLimit.ts
import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 AI requests per window
  message: {
    error: 'Too many AI requests',
    message: 'Please wait before making another AI request',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `${req.session?.userId || req.ip}-ai`;
  }
});
```

### **Data Privacy & Security**

#### **Input Sanitization**
```typescript
// server/middleware/aiInputValidation.ts
import { z } from 'zod';

const aiRequestSchema = z.object({
  userId: z.string().uuid(),
  content: z.string().min(1).max(10000),
  context: z.object({
    courseId: z.string().uuid().optional(),
    moduleId: z.string().uuid().optional(),
    assignmentId: z.string().uuid().optional()
  }).optional()
});

export const validateAIRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = aiRequestSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Invalid request data',
      message: 'AI request validation failed',
      details: error.errors
    });
  }
};
```

#### **Content Filtering**
```typescript
// server/services/contentFilter.ts
export class ContentFilter {
  private static readonly BLOCKED_PATTERNS = [
    /personal\s+information/i,
    /password|credit\s+card|ssn/i,
    /inappropriate\s+content/i
  ];

  static filterInput(input: string): string {
    return this.BLOCKED_PATTERNS.reduce((filtered, pattern) => {
      return filtered.replace(pattern, '[REDACTED]');
    }, input);
  }

  static filterOutput(output: string): string {
    // Additional output filtering for AI responses
    return output.replace(/inappropriate|offensive|harmful/gi, 'inappropriate');
  }
}
```

---

## ⚡ **Performance & Optimization**

### **Caching Strategy**

#### **AI Response Caching**
```typescript
// server/services/aiCache.ts
import NodeCache from 'node-cache';

class AICache {
  private cache: NodeCache;
  
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 3600, // 1 hour default TTL
      checkperiod: 600, // Check for expired keys every 10 minutes
      useClones: false
    });
  }

  async getCachedResponse(key: string): Promise<any> {
    return this.cache.get(key);
  }

  setCachedResponse(key: string, data: any, ttl?: number): void {
    this.cache.set(key, data, ttl);
  }

  generateCacheKey(userId: string, feature: string, params: any): string {
    const paramHash = crypto.createHash('md5')
      .update(JSON.stringify(params))
      .digest('hex');
    return `ai:${feature}:${userId}:${paramHash}`;
  }
}

export const aiCache = new AICache();
```

#### **Database Query Optimization**
```typescript
// server/services/optimizedQueries.ts
export class OptimizedAIQueries {
  static async getUserLearningData(userId: string): Promise<UserLearningData> {
    // Single query with joins instead of multiple queries
    const result = await db
      .select({
        user: users,
        enrollments: enrollments,
        submissions: assignmentSubmissions,
        quizSubmissions: quizSubmissions
      })
      .from(users)
      .leftJoin(enrollments, eq(users.id, enrollments.userId))
      .leftJoin(assignmentSubmissions, eq(users.id, assignmentSubmissions.userId))
      .leftJoin(quizSubmissions, eq(users.id, quizSubmissions.userId))
      .where(eq(users.id, userId))
      .limit(1);

    return this.processUserData(result[0]);
  }

  static async getCourseAnalytics(courseId: string): Promise<CourseAnalytics> {
    // Optimized query for course analytics
    const result = await db
      .select({
        course: courses,
        enrollmentCount: count(enrollments.id),
        completionCount: count(sql`CASE WHEN ${enrollments.status} = 'completed' THEN 1 END`),
        averageProgress: sql`AVG(${enrollments.progress})`,
        averageScore: sql`AVG(${assignmentSubmissions.points})`
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(assignmentSubmissions, eq(courses.id, assignmentSubmissions.assignmentId))
      .where(eq(courses.id, courseId))
      .groupBy(courses.id);

    return this.processCourseData(result[0]);
  }
}
```

### **Frontend Performance**

#### **Lazy Loading AI Components**
```typescript
// client/src/pages/nura-ai-learner.tsx
import { lazy, Suspense } from 'react';

const LearnerNuraAI = lazy(() => import('@/components/learner-nura-ai'));

export default function NuraAILearnerPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<AILoadingSpinner />}>
          <LearnerNuraAI />
        </Suspense>
      </div>
    </div>
  );
}
```

#### **AI Response Debouncing**
```typescript
// client/src/hooks/useDebouncedAI.ts
import { useCallback, useRef } from 'react';

export function useDebouncedAI(delay: number = 500) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedAIRequest = useCallback((requestFn: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(requestFn, delay);
  }, [delay]);

  return debouncedAIRequest;
}
```

---

## 🚨 **Error Handling & Logging**

### **AI Service Error Handling**

#### **Comprehensive Error Handler**
```typescript
// server/middleware/aiErrorHandler.ts
export class AIErrorHandler {
  static handleAIError(error: Error, context: AIErrorContext): AIErrorResponse {
    const errorId = generateErrorId();
    
    // Log error for monitoring
    this.logError(error, context, errorId);
    
    // Determine error type and response
    if (error.message.includes('API key')) {
      return {
        error: 'AI_SERVICE_CONFIGURATION_ERROR',
        message: 'AI service not properly configured',
        code: 'CONFIG_ERROR',
        timestamp: new Date().toISOString(),
        requestId: errorId
      };
    }
    
    if (error.message.includes('rate limit')) {
      return {
        error: 'AI_RATE_LIMIT_EXCEEDED',
        message: 'Too many AI requests, please try again later',
        code: 'RATE_LIMIT',
        timestamp: new Date().toISOString(),
        requestId: errorId,
        retryAfter: 300 // 5 minutes
      };
    }
    
    if (error.message.includes('timeout')) {
      return {
        error: 'AI_SERVICE_TIMEOUT',
        message: 'AI service is taking longer than expected',
        code: 'TIMEOUT',
        timestamp: new Date().toISOString(),
        requestId: errorId
      };
    }
    
    // Generic error
    return {
      error: 'AI_PROCESSING_ERROR',
      message: 'An error occurred while processing your AI request',
      code: 'PROCESSING_ERROR',
      timestamp: new Date().toISOString(),
      requestId: errorId
    };
  }

  private static logError(error: Error, context: AIErrorContext, errorId: string): void {
    const logEntry = {
      errorId,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      severity: this.determineSeverity(error)
    };
    
    console.error('AI Error:', logEntry);
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(logEntry);
    }
  }
}
```

### **Structured Logging**

#### **AI Interaction Logging**
```typescript
// server/services/aiLogger.ts
import winston from 'winston';

export class AILogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/ai-errors.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/ai-interactions.log' }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }

  logAIInteraction(interaction: AIInteractionLog): void {
    this.logger.info('AI Interaction', {
      userId: interaction.userId,
      feature: interaction.feature,
      inputLength: interaction.inputData?.length || 0,
      responseTime: interaction.responseTime,
      success: interaction.success,
      timestamp: interaction.timestamp
    });
  }

  logAIError(error: AIErrorLog): void {
    this.logger.error('AI Error', {
      userId: error.userId,
      feature: error.feature,
      errorMessage: error.errorMessage,
      stack: error.stack,
      timestamp: error.timestamp
    });
  }
}

interface AIInteractionLog {
  userId: string;
  feature: string;
  inputData?: any;
  responseTime: number;
  success: boolean;
  timestamp: string;
}

interface AIErrorLog {
  userId: string;
  feature: string;
  errorMessage: string;
  stack?: string;
  timestamp: string;
}
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**

#### **AI Service Tests**
```typescript
// tests/services/aiService.test.ts
import { AIService } from '../server/services/aiService';
import { jest } from '@jest/globals';

describe('AIService', () => {
  let aiService: AIService;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    aiService = new AIService();
    mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = mockFetch;
  });

  describe('generateLearnerReport', () => {
    it('should generate learner report successfully', async () => {
      const mockResponse = {
        candidates: [{
          content: {
            parts: [{
              text: 'Mock AI response with insights and recommendations'
            }]
          }
        }]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await aiService.generateLearnerReport('user-123');

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('recommendations');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-goog-api-key': expect.any(String)
          })
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'API Error'
      } as Response);

      await expect(aiService.generateLearnerReport('user-123'))
        .rejects.toThrow('AI API error: API Error');
    });

    it('should use fallback when API key is not configured', async () => {
      process.env.GOOGLE_API_KEY = '';
      
      const result = await aiService.generateLearnerReport('user-123');
      
      expect(result).toHaveProperty('metadata.mock', true);
    });
  });
});
```

#### **Frontend Component Tests**
```typescript
// tests/components/nura-ai-section.test.tsx
import { render, screen } from '@testing-library/react';
import { NuraAISection } from '../client/src/components/nura-ai-section';

describe('NuraAISection', () => {
  it('renders with title and description', () => {
    render(
      <NuraAISection 
        title="Test AI Feature" 
        description="Test description"
      >
        <div>Test content</div>
      </NuraAISection>
    );

    expect(screen.getByText('Test AI Feature')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('shows AI-Powered badge', () => {
    render(
      <NuraAISection 
        title="Test" 
        description="Test"
      >
        <div>Content</div>
      </NuraAISection>
    );

    expect(screen.getByText('AI-Powered')).toBeInTheDocument();
  });
});
```

### **Integration Tests**

#### **AI API Integration Tests**
```typescript
// tests/integration/ai-api.test.ts
import request from 'supertest';
import { app } from '../server';

describe('AI API Integration', () => {
  let authToken: string;

  beforeAll(async () => {
    // Setup test user and get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = loginResponse.body.token;
  });

  describe('POST /api/nura-ai/learner-report', () => {
    it('should generate learner report with valid authentication', async () => {
      const response = await request(app)
        .post('/api/nura-ai/learner-report')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 'user-123' })
        .expect(200);

      expect(response.body).toHaveProperty('reportId');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('insights');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/nura-ai/learner-report')
        .send({ userId: 'user-123' })
        .expect(401);
    });
  });
});
```

---

## 🚀 **Deployment & Configuration**

### **Environment Configuration**

#### **AI Service Environment Variables**
```env
# AI Service Configuration
GOOGLE_API_KEY=your-google-api-key
GOOGLE_API_URL=https://generativelanguage.googleapis.com/v1
AI_FALLBACK_ENABLED=true
AI_CACHE_TTL=3600
AI_RATE_LIMIT_PER_HOUR=100

# AI Model Configuration
AI_MODEL_NAME=gemini-1.5-flash
AI_MAX_TOKENS=1000
AI_TEMPERATURE=0.7
AI_TOP_P=0.8
AI_TOP_K=40

# AI Monitoring
AI_MONITORING_ENABLED=true
AI_LOG_LEVEL=info
AI_ERROR_REPORTING=true
```

#### **Docker Configuration**
```dockerfile
# Dockerfile for AI Service
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### **Production Configuration**

#### **AI Service Scaling**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  ai-service:
    build: .
    environment:
      - NODE_ENV=production
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - AI_CACHE_TTL=3600
      - AI_RATE_LIMIT_PER_HOUR=1000
    ports:
      - "5000:5000"
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 📊 **Monitoring & Analytics**

### **AI Performance Monitoring**

#### **Metrics Collection**
```typescript
// server/services/aiMetrics.ts
export class AIMetrics {
  private static metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    cacheHitRate: 0
  };

  static recordRequest(success: boolean, responseTime: number): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }
    
    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime + responseTime) / 2;
  }

  static getMetrics(): AIMetricsData {
    return {
      ...this.metrics,
      successRate: this.metrics.successfulRequests / this.metrics.totalRequests,
      timestamp: new Date().toISOString()
    };
  }
}
```

#### **Real-time Monitoring Dashboard**
```typescript
// server/routes/ai-monitoring.ts
router.get('/api/ai/metrics', (req, res) => {
  const metrics = AIMetrics.getMetrics();
  const healthStatus = {
    status: metrics.successRate > 0.95 ? 'healthy' : 'degraded',
    metrics,
    timestamp: new Date().toISOString()
  };
  
  res.json(healthStatus);
});

router.get('/api/ai/health', (req, res) => {
  res.json({
    status: 'ok',
    aiService: 'operational',
    fallbackEnabled: process.env.AI_FALLBACK_ENABLED === 'true',
    timestamp: new Date().toISOString()
  });
});
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **AI Service Issues**
```bash
# Check AI service status
curl http://localhost:5000/api/ai/health

# Check AI metrics
curl http://localhost:5000/api/ai/metrics

# Test AI endpoint
curl -X POST http://localhost:5000/api/nura-ai/learner-report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId": "test-user"}'
```

#### **Configuration Issues**
```bash
# Verify environment variables
echo $GOOGLE_API_KEY
echo $AI_FALLBACK_ENABLED

# Check API key validity
curl -H "x-goog-api-key: $GOOGLE_API_KEY" \
  "https://generativelanguage.googleapis.com/v1/models"
```

#### **Performance Issues**
```bash
# Check response times
grep "AI Response Time" logs/ai-interactions.log | tail -10

# Monitor error rates
grep "ERROR" logs/ai-errors.log | wc -l

# Check cache performance
grep "Cache Hit" logs/ai-interactions.log | tail -10
```

### **Debug Mode**

#### **Enable AI Debug Logging**
```typescript
// server/config/aiDebug.ts
export const AI_DEBUG_CONFIG = {
  enabled: process.env.AI_DEBUG === 'true',
  logLevel: process.env.AI_LOG_LEVEL || 'info',
  logPrompts: process.env.AI_LOG_PROMPTS === 'true',
  logResponses: process.env.AI_LOG_RESPONSES === 'true',
  mockMode: process.env.AI_MOCK_MODE === 'true'
};
```

---

## 📚 **Additional Resources**

### **API Documentation**
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Elevate360 LMS API Documentation](./TECHNICAL_DOCUMENTATION.md#api-documentation)

### **Development Tools**
- [Postman Collection for AI Endpoints](./postman/ai-endpoints.json)
- [AI Testing Scripts](./scripts/test-ai-features.js)

### **Monitoring Tools**
- [AI Metrics Dashboard](./monitoring/ai-dashboard.html)
- [Error Tracking Configuration](./monitoring/error-tracking.json)

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Next Review**: March 2025
