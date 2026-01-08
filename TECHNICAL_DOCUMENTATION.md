# Elevate360 LMS - Technical Documentation
## Version 2.0 | January 2025

---

## 📋 **Table of Contents**

1. [Technology Stack Overview](#technology-stack-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Design](#database-design)
5. [API Documentation](#api-documentation)
6. [Development Environment](#development-environment)
7. [Deployment Guide](#deployment-guide)
8. [Performance Optimization](#performance-optimization)
9. [Security Implementation](#security-implementation)
10. [Testing Strategy](#testing-strategy)
11. [Monitoring & Analytics](#monitoring--analytics)
12. [Troubleshooting](#troubleshooting)

---

## 🛠️ **Technology Stack Overview**

### **Core Technologies**

#### **Frontend Stack**
- **React 18.2.0** - Modern React with concurrent features
- **TypeScript 5.0+** - Type-safe JavaScript development
- **Vite 5.0+** - Fast build tool and development server
- **Wouter 2.12.0** - Lightweight client-side routing
- **TanStack React Query 5.0+** - Server state management
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built component library

#### **Backend Stack**
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.18+** - Web application framework
- **TypeScript 5.0+** - Type-safe server development
- **PostgreSQL 15+** - Relational database
- **Drizzle ORM 0.29+** - Type-safe database toolkit
- **Google Cloud Storage** - File storage service
- **Express Sessions** - Session management

#### **Development Tools**
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking
- **Vite Dev Server** - Hot module replacement
- **Drizzle Kit** - Database migrations and introspection

---

## 🎨 **Frontend Architecture**

### **Project Structure**
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui component library
│   │   ├── *-dashboard.tsx # Role-specific dashboards
│   │   └── nura-ai-*.tsx   # AI assistant components
│   ├── pages/              # Route-based page components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
└── vite.config.ts          # Vite configuration
```

### **Component Architecture**

#### **Design System**
- **Color Palette**: Sophisticated slate blue theme
  - Primary: `#0D1321` (Deep Navy)
  - Secondary: `#1D2D44` (Dark Blue)
  - Accent: `#3E5C76` (Medium Blue)
  - Light: `#748CAB` (Light Blue)
  - Surface: `#F0EBD8` (Cream)

#### **Component Library**
- **Base Components**: Built on Radix UI primitives
- **Custom Components**: Tailored for LMS functionality
- **AI Components**: Specialized Nura AI interface elements
- **Dashboard Components**: Role-specific layouts

### **State Management**

#### **TanStack React Query**
```typescript
// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

#### **Custom Hooks**
- `useAuth` - Authentication state management
- `useCourses` - Course data management
- `useAnalytics` - Analytics data fetching
- `useNuraAI` - AI assistant functionality

### **Routing System**

#### **Wouter Router**
```typescript
// Route definitions
const AppRouter = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <Router>
      <Route path="/" component={user ? Dashboard : Landing} />
      <Route path="/nura-ai/learner" component={NuraAILearnerPage} />
      <Route path="/nura-ai/mentor" component={NuraAIMentorPage} />
      <Route path="/nura-ai/admin" component={NuraAIAdminPage} />
      <Route path="/course/:id" component={CoursePage} />
      <Route path="/create-course" component={CreateCoursePage} />
      <Route path="/edit-course/:id" component={EditCoursePage} />
    </Router>
  );
};
```

### **Styling System**

#### **Tailwind CSS Configuration**
```typescript
// tailwind.config.ts
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(207, 47%, 34%)',
          dark: 'hsl(211, 50%, 19%)',
        },
        academic: 'hsl(207, 47%, 34%)',
        corporate: 'hsl(210, 26%, 56%)',
        surface: 'hsl(42, 15%, 96%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

#### **CSS Custom Properties**
```css
:root {
  --background: hsl(42, 15%, 94%);
  --foreground: hsl(210, 35%, 8%);
  --primary: hsl(207, 47%, 34%);
  --primary-dark: hsl(211, 50%, 19%);
  --academic: hsl(207, 47%, 34%);
  --corporate: hsl(210, 26%, 56%);
  --surface: hsl(42, 15%, 96%);
}
```

---

## ⚙️ **Backend Architecture**

### **Project Structure**
```
server/
├── routes/                 # API route definitions
│   ├── enhanced.ts        # Advanced features (AI, analytics)
│   └── routes.ts          # Core CRUD operations
├── services/              # Business logic services
│   ├── aiService.ts       # Nura AI functionality
│   ├── analyticsService.ts # Analytics and reporting
│   ├── quizService.ts     # Quiz system management
│   └── tagEngine.ts       # Content tagging system
├── middleware/            # Express middleware
├── config/               # Configuration management
├── db.ts                 # Database connection
└── index.ts              # Server entry point
```

### **Express.js Configuration**

#### **Server Setup**
```typescript
// server/index.ts
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { queryParser } from 'express-query-parser';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));
```

#### **Route Organization**
```typescript
// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/nura-ai', nuraAIRoutes);
```

### **Service Layer Architecture**

#### **AI Service**
```typescript
// server/services/aiService.ts
export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.baseUrl = process.env.GOOGLE_API_URL || 'https://generativelanguage.googleapis.com/v1';
  }

  async generateLearnerReport(userId: string): Promise<any> {
    // Implementation for AI-powered learner reports
  }

  async generateStudyPlan(request: StudyPlanRequest): Promise<any> {
    // Implementation for personalized study plans
  }
}
```

#### **Analytics Service**
```typescript
// server/services/analyticsService.ts
export class AnalyticsService {
  async getLearningMetrics(filters: AnalyticsFilters = {}): Promise<LearningMetrics> {
    // Implementation for learning analytics
  }

  async getCourseAnalytics(filters: AnalyticsFilters = {}): Promise<CourseAnalytics[]> {
    // Implementation for course-specific analytics
  }
}
```

---

## 🗄️ **Database Design**

### **Database Schema**

#### **Core Tables**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role user_role NOT NULL DEFAULT 'learner',
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type course_type NOT NULL DEFAULT 'academic',
  category VARCHAR(100),
  organization_id UUID REFERENCES organizations(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  course_id UUID REFERENCES courses(id) NOT NULL,
  status enrollment_status DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP
);
```

#### **AI & Analytics Tables**
```sql
-- Nura AI Reports
CREATE TABLE nura_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type report_type NOT NULL,
  target_id UUID,
  content TEXT NOT NULL,
  insights TEXT[],
  recommendations TEXT[],
  confidence DECIMAL(3,2),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Plans
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
  created_at TIMESTAMP DEFAULT NOW()
);

-- System Metrics
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric VARCHAR(100) NOT NULL,
  value DECIMAL(10,2),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### **Drizzle ORM Configuration**

#### **Schema Definition**
```typescript
// shared/schema.ts
import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  role: userRole('role').notNull().default('learner'),
  organizationId: uuid('organization_id').references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: courseType('type').notNull().default('academic'),
  category: varchar('category', { length: 100 }),
  organizationId: uuid('organization_id').references(() => organizations.id),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### **Database Connection**
```typescript
// server/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

---

## 🔌 **API Documentation**

### **Authentication Endpoints**

#### **POST /api/auth/login**
```typescript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "learner"
  }
}
```

#### **GET /api/auth/user**
```typescript
// Response
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "learner",
  "organizationId": "uuid"
}
```

### **Course Management Endpoints**

#### **GET /api/courses**
```typescript
// Query Parameters
{
  "page": 1,
  "limit": 10,
  "type": "academic" | "corporate",
  "category": "technology",
  "search": "react"
}

// Response
{
  "courses": [
    {
      "id": "uuid",
      "title": "Advanced React Development",
      "description": "Learn advanced React patterns",
      "type": "academic",
      "category": "technology",
      "enrollmentCount": 150,
      "averageRating": 4.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### **POST /api/courses**
```typescript
// Request
{
  "title": "New Course",
  "description": "Course description",
  "type": "academic",
  "category": "technology",
  "modules": [
    {
      "title": "Module 1",
      "content": "Module content",
      "order": 1
    }
  ]
}

// Response
{
  "id": "uuid",
  "title": "New Course",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### **Nura AI Endpoints**

#### **POST /api/nura-ai/learner-report**
```typescript
// Request
{
  "userId": "uuid"
}

// Response
{
  "reportId": "uuid",
  "content": "AI-generated learner analysis",
  "insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence": 0.85
}
```

#### **POST /api/nura-ai/study-plan**
```typescript
// Request
{
  "userId": "uuid",
  "goals": ["Learn React", "Master TypeScript"],
  "timeAvailable": 10,
  "preferences": {
    "learningStyle": "visual",
    "difficulty": "intermediate"
  }
}

// Response
{
  "planId": "uuid",
  "title": "AI Generated Study Plan",
  "schedule": {
    "monday": "2 hours - React Basics",
    "tuesday": "1 hour - TypeScript",
    "wednesday": "2 hours - React Advanced"
  },
  "goals": ["Complete React modules 1-3", "Practice TypeScript exercises"]
}
```

### **Analytics Endpoints**

#### **GET /api/analytics/learning-metrics**
```typescript
// Query Parameters
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "organizationId": "uuid"
}

// Response
{
  "totalUsers": 1000,
  "totalCourses": 50,
  "totalEnrollments": 2500,
  "completionRate": 75.5,
  "averageProgress": 68.2,
  "averageScore": 82.1,
  "activeUsers": 750
}
```

---

## 🚀 **Development Environment**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 15+
- Git
- Code editor (VS Code recommended)

### **Environment Setup**

#### **1. Clone Repository**
```bash
git clone <repository-url>
cd ElevateLearn
```

#### **2. Install Dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

#### **3. Environment Configuration**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your configuration
DATABASE_URL=postgresql://username:password@localhost:5432/elevatelearn
SESSION_SECRET=your-session-secret
GOOGLE_API_KEY=your-google-api-key
CLIENT_URL=http://localhost:5173
```

#### **4. Database Setup**
```bash
# Run database migrations
npm run db:push

# Seed database with sample data
npm run db:seed
```

#### **5. Start Development Servers**
```bash
# Start backend server
npm run dev:server

# Start frontend development server
npm run dev:client
```

### **Development Scripts**

#### **Package.json Scripts**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "start": "cd server && npm start",
    "db:push": "drizzle-kit push",
    "db:seed": "cd server && npm run seed",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### **VS Code Configuration**

#### **Recommended Extensions**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

#### **Settings.json**
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

---

## 🚀 **Deployment Guide**

### **Production Environment**

#### **Frontend Deployment (Vercel/Netlify)**
```bash
# Build frontend
cd client
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### **Backend Deployment (Render/Railway)**
```bash
# Build backend
cd server
npm run build

# Deploy to Render
# Configure environment variables in Render dashboard
DATABASE_URL=postgresql://...
SESSION_SECRET=...
GOOGLE_API_KEY=...
CLIENT_URL=https://your-frontend-url.com
```

### **Database Deployment**

#### **PostgreSQL Setup**
```sql
-- Create production database
CREATE DATABASE elevatelearn_prod;

-- Create user
CREATE USER elevatelearn_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE elevatelearn_prod TO elevatelearn_user;
```

#### **Migration Deployment**
```bash
# Run migrations in production
DATABASE_URL=postgresql://... npm run db:push
```

### **Environment Variables**

#### **Production Configuration**
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
SESSION_SECRET=your-super-secure-session-secret

# AI Services
GOOGLE_API_KEY=your-google-api-key
GOOGLE_API_URL=https://generativelanguage.googleapis.com/v1

# CORS
CLIENT_URL=https://your-frontend-domain.com

# File Storage
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

---

## ⚡ **Performance Optimization**

### **Frontend Optimization**

#### **Code Splitting**
```typescript
// Lazy load components
const NuraAILearnerPage = lazy(() => import('./pages/nura-ai-learner'));
const CoursePage = lazy(() => import('./pages/course'));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <NuraAILearnerPage />
</Suspense>
```

#### **Image Optimization**
```typescript
// Use optimized images
<img
  src="/images/course-thumbnail.webp"
  alt="Course thumbnail"
  loading="lazy"
  width={300}
  height={200}
/>
```

#### **Bundle Analysis**
```bash
# Analyze bundle size
cd client
npm run build
npx vite-bundle-analyzer dist
```

### **Backend Optimization**

#### **Database Indexing**
```sql
-- Create indexes for common queries
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_courses_organization_id ON courses(organization_id);
CREATE INDEX idx_assignments_course_id ON assignments(course_id);
```

#### **Query Optimization**
```typescript
// Use efficient queries with Drizzle
const coursesWithEnrollments = await db
  .select({
    course: courses,
    enrollmentCount: count(enrollments.id),
  })
  .from(courses)
  .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
  .groupBy(courses.id)
  .limit(10);
```

#### **Caching Strategy**
```typescript
// Implement Redis caching for frequently accessed data
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const getCachedData = async (key: string) => {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const setCachedData = async (key: string, data: any, ttl = 3600) => {
  await redis.setex(key, ttl, JSON.stringify(data));
};
```

### **API Optimization**

#### **Response Compression**
```typescript
import compression from 'compression';

app.use(compression());
```

#### **Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🔒 **Security Implementation**

### **Authentication Security**

#### **Password Hashing**
```typescript
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

#### **Session Security**
```typescript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict',
  },
}));
```

### **API Security**

#### **Input Validation**
```typescript
import { z } from 'zod';

const createCourseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['academic', 'corporate']),
  category: z.string().optional(),
});

export const validateCreateCourse = (data: unknown) => {
  return createCourseSchema.parse(data);
};
```

#### **CORS Configuration**
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### **Database Security**

#### **SQL Injection Prevention**
```typescript
// Use parameterized queries with Drizzle
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);
```

#### **Data Encryption**
```typescript
import crypto from 'crypto';

const encrypt = (text: string): string => {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  // Implementation details...
};
```

---

## 🧪 **Testing Strategy**

### **Frontend Testing**

#### **Unit Tests with Vitest**
```typescript
// tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### **Integration Tests**
```typescript
// tests/pages/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '../pages/dashboard';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Dashboard', () => {
  it('renders learner dashboard for learner role', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );
    expect(screen.getByText('Learning Hub')).toBeInTheDocument();
  });
});
```

### **Backend Testing**

#### **API Tests with Jest**
```typescript
// tests/api/courses.test.ts
import request from 'supertest';
import { app } from '../server';

describe('Courses API', () => {
  it('GET /api/courses returns courses list', async () => {
    const response = await request(app)
      .get('/api/courses')
      .expect(200);
    
    expect(response.body).toHaveProperty('courses');
    expect(Array.isArray(response.body.courses)).toBe(true);
  });

  it('POST /api/courses creates new course', async () => {
    const courseData = {
      title: 'Test Course',
      description: 'Test Description',
      type: 'academic',
    };

    const response = await request(app)
      .post('/api/courses')
      .send(courseData)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(courseData.title);
  });
});
```

#### **Database Tests**
```typescript
// tests/database/users.test.ts
import { db } from '../server/db';
import { users } from '@shared/schema';

describe('Users Database', () => {
  beforeEach(async () => {
    // Clean up test data
    await db.delete(users);
  });

  it('creates user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'learner' as const,
    };

    const [user] = await db.insert(users).values(userData).returning();
    
    expect(user.email).toBe(userData.email);
    expect(user.firstName).toBe(userData.firstName);
  });
});
```

### **End-to-End Testing**

#### **Playwright Tests**
```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('learner can view dashboard', async ({ page }) => {
  await page.goto('/');
  
  // Login as learner
  await page.click('text=Demo Login');
  await page.click('text=Login as Learner');
  
  // Check dashboard elements
  await expect(page.locator('text=Learning Hub')).toBeVisible();
  await expect(page.locator('text=Active Courses')).toBeVisible();
  await expect(page.locator('text=Nura AI Assistant')).toBeVisible();
});
```

---

## 📊 **Monitoring & Analytics**

### **Application Monitoring**

#### **Error Tracking**
```typescript
// server/middleware/errorHandler.ts
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  // Log to external service (e.g., Sentry)
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
};
```

#### **Performance Monitoring**
```typescript
// server/middleware/performance.ts
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Store metrics in database
    analyticsService.storeSystemMetrics({
      'api_response_time': duration,
      'endpoint': `${req.method} ${req.path}`,
      'status_code': res.statusCode,
    });
  });
  
  next();
};
```

### **Database Monitoring**

#### **Query Performance**
```typescript
// server/middleware/dbMonitoring.ts
export const dbMonitoring = (query: string, params: any[], duration: number) => {
  if (duration > 1000) { // Log slow queries
    console.warn(`Slow query detected: ${query} (${duration}ms)`);
  }
  
  // Store query metrics
  analyticsService.storeSystemMetrics({
    'db_query_duration': duration,
    'db_query': query.substring(0, 100), // Truncate for storage
  });
};
```

### **User Analytics**

#### **Event Tracking**
```typescript
// client/src/lib/analytics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  // Send to analytics service
  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties, timestamp: new Date() }),
  });
};

// Usage in components
const handleCourseEnroll = (courseId: string) => {
  trackEvent('course_enrolled', { courseId });
  // Enrollment logic...
};
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check if database exists
psql $DATABASE_URL -c "\l"

# Reset database
npm run db:push
npm run db:seed
```

#### **Frontend Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Check linting issues
npm run lint
```

#### **API Issues**
```bash
# Check server logs
cd server
npm run dev

# Test API endpoints
curl http://localhost:5000/api/health

# Check environment variables
echo $DATABASE_URL
echo $SESSION_SECRET
```

### **Performance Issues**

#### **Slow Database Queries**
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### **Memory Issues**
```bash
# Check Node.js memory usage
node --inspect server/index.js

# Monitor memory in production
pm2 monit
```

### **Deployment Issues**

#### **Environment Variables**
```bash
# Check if all required variables are set
echo "DATABASE_URL: ${DATABASE_URL:+SET}"
echo "SESSION_SECRET: ${SESSION_SECRET:+SET}"
echo "GOOGLE_API_KEY: ${GOOGLE_API_KEY:+SET}"
```

#### **CORS Issues**
```typescript
// Check CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL, // Make sure this matches your frontend URL
  credentials: true,
}));
```

---

## 📚 **Additional Resources**

### **Documentation Links**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### **Best Practices**
- Follow TypeScript strict mode
- Use meaningful variable and function names
- Implement proper error handling
- Write comprehensive tests
- Document complex functions
- Use consistent code formatting
- Implement proper logging
- Follow security best practices

### **Code Style Guidelines**
- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons
- Use camelCase for variables and functions
- Use PascalCase for components and classes
- Use kebab-case for file names
- Use descriptive commit messages

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Next Review**: March 2025
