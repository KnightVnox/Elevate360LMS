# Elevate360 LMS - Dependencies Documentation
## Version 2.0 | January 2025

---

## 📋 **Overview**

This document provides a comprehensive overview of all dependencies used in the Elevate360 LMS project, including their purposes, versions, and usage patterns.

---

## 🎨 **Frontend Dependencies**

### **Core Framework Dependencies**

#### **React & TypeScript**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0"
}
```
- **Purpose**: Core React framework with TypeScript support
- **Usage**: Main UI framework for building components and pages
- **Key Features**: Concurrent rendering, hooks, TypeScript integration

#### **Vite Build Tool**
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0"
}
```
- **Purpose**: Fast build tool and development server
- **Usage**: Module bundling, hot module replacement, production builds
- **Key Features**: ES modules, fast HMR, optimized builds

### **Routing & State Management**

#### **Wouter Router**
```json
{
  "wouter": "^2.12.0"
}
```
- **Purpose**: Lightweight client-side routing
- **Usage**: Page navigation and route management
- **Key Features**: Small bundle size, React hooks integration

#### **TanStack React Query**
```json
{
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-query-devtools": "^5.0.0"
}
```
- **Purpose**: Server state management and data fetching
- **Usage**: API calls, caching, background updates
- **Key Features**: Automatic caching, background refetching, optimistic updates

### **UI Component Libraries**

#### **Radix UI Primitives**
```json
{
  "@radix-ui/react-accordion": "^1.1.2",
  "@radix-ui/react-alert-dialog": "^1.0.5",
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-hover-card": "^1.0.7",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-progress": "^1.0.3",
  "@radix-ui/react-radio-group": "^1.1.3",
  "@radix-ui/react-scroll-area": "^1.0.5",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-sheet": "^0.2.3",
  "@radix-ui/react-slider": "^1.1.2",
  "@radix-ui/react-switch": "^1.0.3",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-toggle": "^1.0.3",
  "@radix-ui/react-tooltip": "^1.0.7"
}
```
- **Purpose**: Accessible, unstyled UI primitives
- **Usage**: Building custom components with accessibility features
- **Key Features**: ARIA compliance, keyboard navigation, focus management

#### **shadcn/ui Components**
```json
{
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "lucide-react": "^0.294.0",
  "tailwind-merge": "^2.0.0",
  "tailwindcss-animate": "^1.0.7"
}
```
- **Purpose**: Pre-built component library based on Radix UI
- **Usage**: Ready-to-use components with consistent styling
- **Key Features**: TypeScript support, customizable, accessible

### **Styling Dependencies**

#### **Tailwind CSS**
```json
{
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```
- **Purpose**: Utility-first CSS framework
- **Usage**: Styling components and layouts
- **Key Features**: Responsive design, custom design system, purging

### **Development Dependencies**

#### **TypeScript & Build Tools**
```json
{
  "typescript": "^5.0.0",
  "@types/node": "^20.0.0",
  "vite-plugin-eslint": "^1.8.1"
}
```
- **Purpose**: Type checking and development tooling
- **Usage**: Type safety, development server integration
- **Key Features**: Static type checking, IntelliSense support

#### **Linting & Formatting**
```json
{
  "eslint": "^8.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0",
  "eslint-plugin-react": "^7.33.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.0",
  "prettier": "^3.0.0",
  "prettier-plugin-tailwindcss": "^0.5.0"
}
```
- **Purpose**: Code quality and formatting
- **Usage**: Linting, code formatting, style enforcement
- **Key Features**: TypeScript support, React-specific rules, Tailwind CSS formatting

---

## ⚙️ **Backend Dependencies**

### **Core Server Dependencies**

#### **Express.js Framework**
```json
{
  "express": "^4.18.2",
  "@types/express": "^4.17.17",
  "cors": "^2.8.5",
  "@types/cors": "^2.8.13"
}
```
- **Purpose**: Web application framework
- **Usage**: HTTP server, middleware, routing
- **Key Features**: Middleware support, routing, CORS handling

#### **Session Management**
```json
{
  "express-session": "^1.17.3",
  "@types/express-session": "^1.17.7",
  "connect-pg-simple": "^9.0.1",
  "@types/connect-pg-simple": "^8.0.0"
}
```
- **Purpose**: User session management
- **Usage**: Authentication state, user persistence
- **Key Features**: PostgreSQL session store, secure cookies

### **Database Dependencies**

#### **PostgreSQL & ORM**
```json
{
  "postgres": "^3.4.3",
  "drizzle-orm": "^0.29.0",
  "drizzle-kit": "^0.20.0"
}
```
- **Purpose**: Database connection and ORM
- **Usage**: Database queries, schema management, migrations
- **Key Features**: Type-safe queries, migration system, PostgreSQL support

### **Authentication & Security**

#### **Password Hashing**
```json
{
  "bcrypt": "^5.1.1",
  "@types/bcrypt": "^5.0.0"
}
```
- **Purpose**: Password hashing and verification
- **Usage**: User authentication, password security
- **Key Features**: Salt rounds, secure hashing

#### **Input Validation**
```json
{
  "zod": "^3.22.0"
}
```
- **Purpose**: Runtime type validation
- **Usage**: API input validation, type safety
- **Key Features**: Schema validation, TypeScript integration

### **File Storage & External Services**

#### **Google Cloud Storage**
```json
{
  "@google-cloud/storage": "^7.5.0"
}
```
- **Purpose**: File storage service
- **Usage**: Course materials, user uploads, media files
- **Key Features**: Scalable storage, CDN integration

#### **HTTP Client**
```json
{
  "node-fetch": "^3.3.2",
  "@types/node-fetch": "^2.6.4"
}
```
- **Purpose**: HTTP requests to external APIs
- **Usage**: AI service integration, external API calls
- **Key Features**: Promise-based, TypeScript support

### **Development Dependencies**

#### **TypeScript & Build Tools**
```json
{
  "typescript": "^5.0.0",
  "@types/node": "^20.0.0",
  "tsx": "^4.0.0",
  "nodemon": "^3.0.0"
}
```
- **Purpose**: TypeScript compilation and development
- **Usage**: Type checking, development server, hot reload
- **Key Features**: Fast compilation, watch mode

#### **Testing Dependencies**
```json
{
  "jest": "^29.0.0",
  "@types/jest": "^29.0.0",
  "supertest": "^6.3.0",
  "@types/supertest": "^2.0.0"
}
```
- **Purpose**: Unit and integration testing
- **Usage**: API testing, component testing
- **Key Features**: Mocking, assertions, test runners

---

## 🔧 **Shared Dependencies**

### **Type Definitions**
```json
{
  "@types/node": "^20.0.0"
}
```
- **Purpose**: Node.js type definitions
- **Usage**: TypeScript support for Node.js APIs
- **Key Features**: Type safety for server-side code

### **Utility Libraries**
```json
{
  "zod": "^3.22.0"
}
```
- **Purpose**: Runtime validation and type inference
- **Usage**: Shared validation schemas, type safety
- **Key Features**: Schema composition, error handling

---

## 📊 **Dependency Analysis**

### **Bundle Size Impact**

#### **Frontend Bundle Analysis**
```
Total Bundle Size: ~2.1MB (gzipped: ~650KB)

Largest Dependencies:
- React + React-DOM: ~130KB
- TanStack React Query: ~45KB
- Radix UI Components: ~180KB
- Tailwind CSS: ~15KB
- Lucide React Icons: ~25KB
```

#### **Backend Bundle Analysis**
```
Total Bundle Size: ~15MB (production: ~8MB)

Largest Dependencies:
- Express.js: ~200KB
- Drizzle ORM: ~150KB
- PostgreSQL Driver: ~300KB
- Google Cloud Storage: ~2MB
```

### **Security Considerations**

#### **High-Risk Dependencies**
- **bcrypt**: Used for password hashing (secure)
- **express-session**: Session management (requires secure configuration)
- **postgres**: Database driver (regular updates required)

#### **Dependency Updates**
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

### **Performance Impact**

#### **Critical Dependencies for Performance**
- **Vite**: Fast build times and HMR
- **TanStack React Query**: Efficient data fetching and caching
- **Drizzle ORM**: Optimized database queries
- **Tailwind CSS**: Minimal CSS bundle size

#### **Optimization Strategies**
- Tree shaking for unused code
- Code splitting for large dependencies
- Lazy loading for non-critical components
- Bundle analysis and optimization

---

## 🚀 **Installation & Management**

### **Installation Commands**

#### **Frontend Dependencies**
```bash
cd client
npm install

# Install specific dependency
npm install @radix-ui/react-dialog

# Install development dependency
npm install -D @types/react
```

#### **Backend Dependencies**
```bash
cd server
npm install

# Install specific dependency
npm install drizzle-orm

# Install development dependency
npm install -D @types/express
```

#### **Root Dependencies**
```bash
# Install root dependencies
npm install

# Install specific dependency
npm install concurrently
```

### **Dependency Management**

#### **Version Pinning**
```json
{
  "dependencies": {
    "react": "18.2.0",  // Exact version
    "express": "^4.18.2", // Compatible version
    "typescript": "~5.0.0" // Patch version updates
  }
}
```

#### **Lock File Management**
```bash
# Update package-lock.json
npm install

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### **Dependency Updates**

#### **Safe Update Strategy**
```bash
# Check outdated packages
npm outdated

# Update patch versions
npm update

# Update minor versions (test first)
npm install package@latest

# Major version updates (requires testing)
npm install package@^2.0.0
```

#### **Update Checklist**
- [ ] Review changelog for breaking changes
- [ ] Test in development environment
- [ ] Update TypeScript types if needed
- [ ] Run full test suite
- [ ] Check for security vulnerabilities
- [ ] Update documentation if needed

---

## 🔍 **Troubleshooting Dependencies**

### **Common Issues**

#### **Version Conflicts**
```bash
# Check for peer dependency warnings
npm install --verbose

# Resolve conflicts
npm install --legacy-peer-deps
```

#### **TypeScript Errors**
```bash
# Check TypeScript errors
npm run type-check

# Install missing types
npm install -D @types/package-name
```

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for circular dependencies
npm ls --depth=0
```

### **Dependency Security**

#### **Security Audit**
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (use with caution)
npm audit fix --force
```

#### **Dependency Scanning**
```bash
# Check for known vulnerabilities
npm audit --audit-level moderate

# Generate security report
npm audit --json > security-report.json
```

---

## 📚 **Best Practices**

### **Dependency Selection**

#### **Criteria for New Dependencies**
- [ ] Active maintenance and community support
- [ ] TypeScript support
- [ ] Small bundle size impact
- [ ] Security track record
- [ ] License compatibility
- [ ] Documentation quality

#### **Dependency Review Process**
1. **Research**: Check GitHub stars, issues, and recent commits
2. **Evaluate**: Test in development environment
3. **Document**: Add to this documentation
4. **Monitor**: Track for updates and security issues

### **Maintenance Strategy**

#### **Regular Updates**
- **Weekly**: Check for security updates
- **Monthly**: Update patch and minor versions
- **Quarterly**: Review major version updates
- **Annually**: Audit all dependencies for relevance

#### **Monitoring Tools**
- **Dependabot**: Automated dependency updates
- **Snyk**: Security vulnerability scanning
- **npm audit**: Built-in security checking
- **Bundle analyzer**: Size impact monitoring

---

## 📋 **Dependency Checklist**

### **Before Adding New Dependencies**
- [ ] Is this dependency necessary?
- [ ] Are there lighter alternatives?
- [ ] Does it have TypeScript support?
- [ ] Is it actively maintained?
- [ ] What's the security track record?
- [ ] How does it affect bundle size?
- [ ] Is the license compatible?

### **Before Updating Dependencies**
- [ ] Read the changelog
- [ ] Check for breaking changes
- [ ] Test in development
- [ ] Update related types
- [ ] Run full test suite
- [ ] Check security implications
- [ ] Update documentation

### **Regular Maintenance Tasks**
- [ ] Run `npm audit` weekly
- [ ] Check `npm outdated` monthly
- [ ] Review bundle size impact
- [ ] Update lock files
- [ ] Test after updates
- [ ] Document changes

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Next Review**: March 2025
