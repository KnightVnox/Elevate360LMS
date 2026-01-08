# Elevate360 LMS - Setup & Deployment Guide
## Version 2.0 | January 2025

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Development Workflow](#development-workflow)
6. [Production Deployment](#production-deployment)
7. [Docker Deployment](#docker-deployment)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## 🛠️ **Prerequisites**

### **System Requirements**

#### **Minimum Requirements**
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 8GB (16GB recommended)
- **Storage**: 10GB free space
- **CPU**: 2 cores (4 cores recommended)

#### **Required Software**
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 15.0 or higher
- **Git**: Version 2.30.0 or higher

### **Development Tools (Recommended)**
- **VS Code**: Latest version with recommended extensions
- **Postman**: For API testing
- **pgAdmin**: For database management
- **Docker Desktop**: For containerized development

---

## 🚀 **Local Development Setup**

### **Step 1: Clone Repository**

```bash
# Clone the repository
git clone https://github.com/your-username/ElevateLearn.git
cd ElevateLearn

# Verify repository structure
ls -la
```

**Expected Structure:**
```
ElevateLearn/
├── client/          # Frontend React application
├── server/          # Backend Express application
├── shared/          # Shared TypeScript types and schemas
├── package.json     # Root package.json
├── .env.example     # Environment variables template
└── README.md        # Project documentation
```

### **Step 2: Install Dependencies**

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root directory
cd ..
```

### **Step 3: Database Setup**

#### **PostgreSQL Installation**

**Windows:**
```bash
# Download and install PostgreSQL from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **Create Database**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE elevatelearn_dev;
CREATE USER elevatelearn_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE elevatelearn_dev TO elevatelearn_user;

# Exit PostgreSQL
\q
```

### **Step 4: Environment Configuration**

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Environment Variables (.env):**
```env
# Database Configuration
DATABASE_URL=postgresql://elevatelearn_user:your_password@localhost:5432/elevatelearn_dev

# Session Configuration
SESSION_SECRET=your-super-secure-session-secret-here

# AI Services (Optional for development)
GOOGLE_API_KEY=your-google-api-key
GOOGLE_API_URL=https://generativelanguage.googleapis.com/v1

# CORS Configuration
CLIENT_URL=http://localhost:5173

# File Storage (Optional for development)
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account.json

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
```

### **Step 5: Database Migration**

```bash
# Run database migrations
npm run db:push

# Seed database with sample data
npm run db:seed
```

### **Step 6: Start Development Servers**

```bash
# Start both frontend and backend (recommended)
npm run dev

# Or start them separately
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### **Step 7: Verify Installation**

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response: `{"status": "ok", "timestamp": "2025-01-01T00:00:00.000Z"}`

2. **Frontend Access:**
   - Open browser to `http://localhost:5173`
   - Should see the Elevate360 LMS landing page

3. **Database Connection:**
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
   ```

---

## 🗄️ **Database Setup**

### **Database Schema**

#### **Initial Migration**
```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push

# Verify schema
psql $DATABASE_URL -c "\dt"
```

#### **Seed Data**
```bash
# Run seed script
npm run db:seed

# Verify seeded data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM courses;"
```

### **Database Management**

#### **Backup Database**
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_20250101_120000.sql
```

#### **Reset Database**
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS elevatelearn_dev;"
psql -U postgres -c "CREATE DATABASE elevatelearn_dev;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE elevatelearn_dev TO elevatelearn_user;"

# Run migrations and seed
npm run db:push
npm run db:seed
```

---

## ⚙️ **Environment Configuration**

### **Development Environment**

#### **Frontend Environment (.env.local)**
```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Elevate360 LMS
VITE_APP_VERSION=2.0.0

# Feature Flags
VITE_ENABLE_AI=true
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=true
```

#### **Backend Environment (.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://elevatelearn_user:password@localhost:5432/elevatelearn_dev

# Security
SESSION_SECRET=dev-session-secret-change-in-production
CORS_ORIGIN=http://localhost:5173

# AI Services
GOOGLE_API_KEY=your-google-api-key
GOOGLE_API_URL=https://generativelanguage.googleapis.com/v1

# File Storage
GOOGLE_CLOUD_STORAGE_BUCKET=dev-bucket
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### **Production Environment**

#### **Environment Variables Checklist**
- [ ] `DATABASE_URL` - Production database connection
- [ ] `SESSION_SECRET` - Strong, unique secret key
- [ ] `GOOGLE_API_KEY` - AI service API key
- [ ] `CLIENT_URL` - Frontend production URL
- [ ] `NODE_ENV=production`
- [ ] `LOG_LEVEL=info`
- [ ] `CORS_ORIGIN` - Production frontend URL

---

## 🔄 **Development Workflow**

### **Daily Development Process**

#### **1. Start Development Session**
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Start development servers
npm run dev
```

#### **2. Make Changes**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make your changes
# Test locally
npm run test

# Commit changes
git add .
git commit -m "feat: add new feature"
```

#### **3. Code Quality Checks**
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Run tests
npm run test
```

### **Git Workflow**

#### **Branch Naming Convention**
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `refactor/refactor-description` - Code refactoring

#### **Commit Message Convention**
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Build process or auxiliary tool changes
```

**Examples:**
```bash
git commit -m "feat(auth): add OAuth2 integration"
git commit -m "fix(api): resolve CORS issues"
git commit -m "docs(readme): update installation instructions"
```

### **Testing Workflow**

#### **Unit Tests**
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### **Integration Tests**
```bash
# Run API tests
cd server
npm run test:api

# Run database tests
npm run test:db
```

#### **End-to-End Tests**
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in headless mode
npm run test:e2e:headless
```

---

## 🚀 **Production Deployment**

### **Frontend Deployment (Vercel)**

#### **1. Prepare for Deployment**
```bash
# Build frontend
cd client
npm run build

# Test production build locally
npm run preview
```

#### **2. Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=Elevate360 LMS
```

#### **3. Configure Custom Domain**
```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS
# Add CNAME record pointing to your Vercel deployment
```

### **Backend Deployment (Render)**

#### **1. Prepare for Deployment**
```bash
# Build backend
cd server
npm run build

# Test production build
npm start
```

#### **2. Deploy to Render**
1. Connect GitHub repository to Render
2. Create new Web Service
3. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18

#### **3. Environment Variables**
Set in Render dashboard:
```env
DATABASE_URL=postgresql://user:pass@host:port/db
SESSION_SECRET=your-production-secret
GOOGLE_API_KEY=your-google-api-key
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
```

### **Database Deployment (PostgreSQL)**

#### **1. Production Database Setup**
```bash
# Create production database
psql -h your-host -U postgres -c "CREATE DATABASE elevatelearn_prod;"
psql -h your-host -U postgres -c "CREATE USER elevatelearn_prod WITH PASSWORD 'secure_password';"
psql -h your-host -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE elevatelearn_prod TO elevatelearn_prod;"
```

#### **2. Run Migrations**
```bash
# Set production database URL
export DATABASE_URL=postgresql://elevatelearn_prod:password@host:port/elevatelearn_prod

# Run migrations
npm run db:push

# Seed production data (if needed)
npm run db:seed
```

---

## 🐳 **Docker Deployment**

### **Dockerfile Configuration**

#### **Frontend Dockerfile**
```dockerfile
# client/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Backend Dockerfile**
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### **Docker Compose**

#### **docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: elevatelearn
      POSTGRES_USER: elevatelearn_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./server
    environment:
      DATABASE_URL: postgresql://elevatelearn_user:password@postgres:5432/elevatelearn
      SESSION_SECRET: your-session-secret
      CLIENT_URL: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### **Docker Commands**
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**

#### **.github/workflows/ci.yml**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run tests
      run: npm run test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add deployment commands here
```

### **Deployment Automation**

#### **Frontend Deployment**
```yaml
- name: Deploy Frontend
  run: |
    cd client
    npm run build
    # Deploy to Vercel/Netlify
```

#### **Backend Deployment**
```yaml
- name: Deploy Backend
  run: |
    cd server
    npm run build
    # Deploy to Render/Railway
```

---

## 📊 **Monitoring & Maintenance**

### **Application Monitoring**

#### **Health Checks**
```typescript
// server/routes/health.ts
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

#### **Error Tracking**
```typescript
// server/middleware/errorHandler.ts
import Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Sentry.captureException(err);
  // Error handling logic
};
```

### **Database Monitoring**

#### **Connection Monitoring**
```typescript
// server/middleware/dbHealth.ts
export const checkDatabaseHealth = async () => {
  try {
    await db.select().from(users).limit(1);
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date() };
  }
};
```

#### **Performance Monitoring**
```sql
-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Monitor table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **Log Management**

#### **Structured Logging**
```typescript
// server/lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
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

# Check user permissions
psql $DATABASE_URL -c "\du"
```

#### **Port Already in Use**
```bash
# Find process using port
lsof -i :5000
lsof -i :5173

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev:server
```

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### **Environment Variable Issues**
```bash
# Check if variables are loaded
echo $DATABASE_URL
echo $SESSION_SECRET

# Test with explicit variables
DATABASE_URL=postgresql://... npm run dev:server
```

### **Performance Issues**

#### **Slow Database Queries**
```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC;
```

#### **Memory Issues**
```bash
# Check Node.js memory usage
node --inspect server/index.js

# Monitor memory in production
pm2 monit
```

### **Deployment Issues**

#### **Build Failures in Production**
```bash
# Check build logs
npm run build 2>&1 | tee build.log

# Test production build locally
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

#### **Environment Variable Issues**
```bash
# Verify all required variables are set
echo "DATABASE_URL: ${DATABASE_URL:+SET}"
echo "SESSION_SECRET: ${SESSION_SECRET:+SET}"
echo "GOOGLE_API_KEY: ${GOOGLE_API_KEY:+SET}"
```

---

## 📚 **Additional Resources**

### **Documentation Links**
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Deployment Platforms**
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Docker Documentation](https://docs.docker.com/)

### **Monitoring Tools**
- [Sentry Documentation](https://docs.sentry.io/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [PM2 Process Manager](https://pm2.keymetrics.io/docs/)

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Next Review**: March 2025
