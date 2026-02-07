# Secure Task Management System

**Candidate:** Sneha Bejugam  
**Repository:** sbejugam-af393582-1fa4-4326-bf76-3457374b5aca

---

## Overview

A full-stack task management system with Role-Based Access Control (RBAC) built using NestJS, Angular, and SQLite in an NX monorepo. The system implements secure authentication with JWT tokens and enforces organizational hierarchy and permission-based access control.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture Overview](#architecture-overview)
- [Data Model](#data-model)
- [Access Control Implementation](#access-control-implementation)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Testing](#testing)
- [Future Considerations](#future-considerations)

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sbejugam-af393582-1fa4-4326-bf76-3457374b5aca

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
PORT=3000
```

**Note:** Use a cryptographically secure random string for JWT_SECRET in production. Generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Database Setup

The SQLite database is created automatically on first run. The application seeds initial data including:
- 3 roles (Owner, Admin, Viewer)
- 2 organizations (Parent Company, Child Department)
- 3 test users

**The seeding happens automatically when the API starts.**

### Running the Application

#### Option 1: Run Both Services Simultaneously

```bash
npx nx run-many --target=serve --projects=api,dashboard --parallel=2
```

#### Option 2: Run Services Separately

**Terminal 1 - Backend (NestJS API):**
```bash
npx nx serve api
```
The API will be available at: `http://localhost:3000/api`

**Terminal 2 - Frontend (Angular Dashboard):**
```bash
npx nx serve dashboard
```
The dashboard will be available at: `http://localhost:4200`

### Test Credentials

Use these credentials to test different role permissions:

| Email | Password | Role | Organization | Permissions |
|-------|----------|------|--------------|-------------|
| owner@example.com | password123 | Owner | Parent Company | Full access to parent + child org tasks, create/edit/delete, view audit logs |
| admin@example.com | password123 | Admin | Child Department | Full access to child org tasks only, create/edit/delete, view audit logs |
| viewer@example.com | password123 | Viewer | Child Department | Read-only access to child org tasks |

---

## Architecture Overview

### NX Monorepo Structure

```
sbejugam-af393582-1fa4-4326-bf76-3457374b5aca/
├── apps/
│   ├── api/                        # NestJS Backend Application
│   │   ├── src/
│   │   │   ├── auth/              # Authentication module (JWT)
│   │   │   │   ├── dto/           # Login/Register DTOs
│   │   │   │   ├── guards/        # JWT authentication guard
│   │   │   │   ├── strategies/    # Passport JWT strategy
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── tasks/             # Task management module
│   │   │   │   ├── dto/           # Create/Update task DTOs
│   │   │   │   ├── tasks.controller.ts
│   │   │   │   ├── tasks.service.ts
│   │   │   │   └── tasks.module.ts
│   │   │   ├── audit-log/         # Audit logging module
│   │   │   ├── common/            # Shared RBAC guards & decorators
│   │   │   │   ├── decorators/    # @Roles, @CurrentUser
│   │   │   │   └── guards/        # RolesGuard
│   │   │   ├── entities/          # TypeORM database entities
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── organization.entity.ts
│   │   │   │   ├── role.entity.ts
│   │   │   │   ├── task.entity.ts
│   │   │   │   └── audit-log.entity.ts
│   │   │   ├── seed/              # Database seeding
│   │   │   │   ├── seed.service.ts
│   │   │   │   └── seed.module.ts
│   │   │   ├── app/               # Root application module
│   │   │   └── main.ts            # Application entry point
│   │   └── ...
│   └── dashboard/                 # Angular Frontend Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/          # Core services, guards, interceptors
│       │   │   │   ├── guards/    # Auth guard for route protection
│       │   │   │   ├── interceptors/ # HTTP interceptor for JWT
│       │   │   │   ├── models/    # TypeScript interfaces
│       │   │   │   └── services/  # Auth, Task, Theme services
│       │   │   ├── features/      # Feature modules
│       │   │   │   ├── auth/      # Login component
│       │   │   │   └── tasks/     # Dashboard, task components
│       │   │   ├── app.component.ts
│       │   │   ├── app.config.ts  # App configuration with providers
│       │   │   └── app.routes.ts  # Route definitions
│       │   └── ...
│       └── ...
├── libs/
│   ├── data/                      # Shared TypeScript interfaces (optional)
│   └── auth/                      # Shared RBAC logic (moved to API)
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
└── package.json                   # Dependencies and scripts
```

### Technology Stack

**Backend:**
- **NestJS** - Progressive Node.js framework for building server-side applications
- **TypeORM** - ORM for TypeScript and JavaScript
- **SQLite** - Lightweight, file-based relational database
- **Passport JWT** - JWT authentication strategy
- **bcrypt** - Password hashing library
- **class-validator** - DTO validation

**Frontend:**
- **Angular 21** - Modern web application framework
- **TailwindCSS v3** - Utility-first CSS framework
- **Angular CDK** - Component Dev Kit for drag & drop
- **RxJS** - Reactive programming library

**Development:**
- **NX** - Smart monorepo build system
- **Jest** - JavaScript testing framework
- **TypeScript** - Typed superset of JavaScript

---

## Data Model

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│    Role     │────┐    │ Organization │
├─────────────┤    │    ├──────────────┤
│ id          │    │    │ id           │
│ name        │    │    │ name         │
└─────────────┘    │    │ parentOrgId  │◄─┐
                   │    └──────────────┘  │ (2-level
                   │           │          │  hierarchy)
                   │           │          │
                   ▼           ▼          │
              ┌─────────────────────┐    │
              │       User          │    │
              ├─────────────────────┤    │
              │ id                  │    │
              │ email               │    │
              │ password (hashed)   │    │
              │ roleId         ─────┘    │
              │ organizationId ──────────┘
              └─────────────────────┘
                        │
                        │ createdBy
                        ▼
              ┌─────────────────────┐
              │       Task          │
              ├─────────────────────┤
              │ id                  │
              │ title               │
              │ description         │
              │ status              │
              │ category            │
              │ organizationId      │
              │ createdById         │
              │ assignedToId        │
              └─────────────────────┘
```

### Database Schema

**users**
- `id` (Primary Key)
- `email` (Unique, indexed)
- `name`
- `password` (hashed with bcrypt, salt rounds: 10)
- `role_id` (Foreign Key → roles)
- `organization_id` (Foreign Key → organizations)
- `created_at`, `updated_at` (Timestamps)

**organizations**
- `id` (Primary Key)
- `name`
- `parent_organization_id` (Foreign Key → organizations, nullable for top-level)
- `created_at`, `updated_at`

**roles**
- `id` (Primary Key)
- `name` (Enum: 'Owner' | 'Admin' | 'Viewer')
- `created_at`, `updated_at`

**tasks**
- `id` (Primary Key)
- `title`
- `description` (Text)
- `status` (Enum: 'TODO' | 'IN_PROGRESS' | 'DONE')
- `category` (Enum: 'Work' | 'Personal')
- `organization_id` (Foreign Key → organizations)
- `created_by_id` (Foreign Key → users)
- `assigned_to_id` (Foreign Key → users, nullable)
- `created_at`, `updated_at`

**audit_logs**
- `id` (Primary Key)
- `user_id` (Foreign Key → users)
- `action` (CREATE | UPDATE | DELETE)
- `resource` (Task)
- `resource_id` (Reference to task ID)
- `details` (JSON text with action details)
- `timestamp` (Auto-generated)

---

## Access Control Implementation

### Role Hierarchy & Permissions

The system implements a three-tier role hierarchy with distinct permission levels:

**1. Owner**
- **Organization Access:** Own organization + all child organizations
- **Task Permissions:** Full CRUD (Create, Read, Update, Delete)
- **Special Privileges:** View audit logs, access nested organizational data
- **Use Case:** C-level executives, department heads

**2. Admin**
- **Organization Access:** Own organization only
- **Task Permissions:** Full CRUD within their organization
- **Special Privileges:** View audit logs
- **Use Case:** Team leads, managers

**3. Viewer**
- **Organization Access:** Own organization only (read-only)
- **Task Permissions:** Read-only access
- **Restrictions:** Cannot create, edit, or delete tasks; cannot view audit logs
- **Use Case:** Observers, stakeholders, external collaborators

### Permission Matrix

| Action | Owner | Admin | Viewer |
|--------|:-----:|:-----:|:------:|
| **Tasks** ||||
| Create Task | ✅ | ✅ | ❌ |
| View Tasks (Own Org) | ✅ | ✅ | ✅ |
| View Tasks (Child Org) | ✅ | ❌ | ❌ |
| Edit Task | ✅ | ✅ | ❌ |
| Delete Task | ✅ | ✅ | ❌ |
| **Audit** ||||
| View Audit Log | ✅ | ✅ | ❌ |

### JWT Authentication Flow

**Token Generation:**
```json
{
  "sub": 1,                    // User ID
  "email": "owner@example.com",
  "roleId": 1,                 // Role identifier
  "organizationId": 1,         // Organization identifier
  "iat": 1707264000,          // Issued at
  "exp": 1707350400           // Expires at (24h default)
}
```

**Authentication Sequence:**
1. **Login:** User submits credentials to `/api/auth/login`
2. **Validation:** Backend validates email/password with bcrypt
3. **Token Generation:** JWT signed with secret from environment
4. **Client Storage:** Frontend stores token in localStorage
5. **Request Authentication:** HTTP interceptor attaches `Authorization: Bearer <token>` header
6. **Token Validation:** JwtStrategy validates token on each request
7. **User Loading:** Strategy loads user with role and organization relationships
8. **Authorization:** RolesGuard checks permissions using custom `@Roles()` decorator

### RBAC Implementation Details

**Custom Decorators** (`apps/api/src/common/decorators/`):

```typescript
// @Roles decorator - specify required roles for endpoints
@Roles('Owner', 'Admin')

// @CurrentUser decorator - inject authenticated user into controller
create(@CurrentUser() user: User)
```

**Guards** (`apps/api/src/common/guards/`):

```typescript
// RolesGuard - validates user has required role
// Uses Reflector to read @Roles metadata
// Throws ForbiddenException if user lacks permission
```

**Organization Scoping** (`apps/api/src/tasks/tasks.service.ts`):

```typescript
private async getAccessibleOrganizations(user: any): Promise<number[]> {
  const userOrgId = user.organizationId;
  const accessibleOrgs = [userOrgId];

  // Owners can access child organizations
  if (user.role?.name === 'Owner') {
    const childOrgs = await this.organizationRepository.find({
      where: { parentOrganizationId: userOrgId },
    });
    accessibleOrgs.push(...childOrgs.map((org) => org.id));
  }

  return accessibleOrgs;
}
```

Tasks are filtered using `WHERE organization_id IN (accessible_org_ids)` to enforce data isolation.

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /auth/login

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "owner@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "owner@example.com",
    "name": "Owner User",
    "roleId": 1,
    "organizationId": 1,
    "role": {
      "id": 1,
      "name": "Owner"
    },
    "organization": {
      "id": 1,
      "name": "Parent Company"
    }
  }
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

#### POST /auth/register

Register a new user (typically restricted in production).

**Request:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "securepassword123",
  "roleId": 3,
  "organizationId": 2
}
```

#### GET /auth/me

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "email": "owner@example.com",
  "name": "Owner User",
  "roleId": 1,
  "organizationId": 1,
  "role": { "id": 1, "name": "Owner" },
  "organization": { "id": 1, "name": "Parent Company" }
}
```

---

### Task Management Endpoints

**All task endpoints require JWT authentication via `Authorization: Bearer <token>` header.**

#### POST /tasks

Create a new task.

**Permissions:** Owner, Admin only  
**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Complete Q4 Report",
  "description": "Finalize quarterly business report",
  "status": "TODO",
  "category": "Work",
  "assignedToId": 2
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete Q4 Report",
  "description": "Finalize quarterly business report",
  "status": "TODO",
  "category": "Work",
  "organizationId": 1,
  "createdById": 1,
  "assignedToId": 2,
  "createdAt": "2026-02-07T00:00:00.000Z",
  "updatedAt": "2026-02-07T00:00:00.000Z"
}
```

#### GET /tasks

Retrieve all tasks accessible to the current user (scoped by organization and role).

**Permissions:** All authenticated users  
**Scoping:** 
- Owner: Parent org + child org tasks
- Admin/Viewer: Own org tasks only

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete Q4 Report",
    "description": "Finalize quarterly business report",
    "status": "TODO",
    "category": "Work",
    "organizationId": 1,
    "createdBy": {
      "id": 1,
      "name": "Owner User"
    },
    "assignedTo": {
      "id": 2,
      "name": "Admin User"
    },
    "createdAt": "2026-02-07T00:00:00.000Z",
    "updatedAt": "2026-02-07T00:00:00.000Z"
  }
]
```

#### GET /tasks/:id

Get a specific task by ID (with organization access validation).

**Permissions:** All authenticated users (must have access to task's organization)

#### PATCH /tasks/:id

Update an existing task.

**Permissions:** Owner, Admin only

**Request:**
```json
{
  "status": "IN_PROGRESS",
  "description": "Updated: Making good progress"
}
```

#### DELETE /tasks/:id

Delete a task.

**Permissions:** Owner, Admin only

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

### Audit Log Endpoint

#### GET /audit-log

View access and modification logs for compliance and security monitoring.

**Permissions:** Owner, Admin only  
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "action": "CREATE",
    "resource": "Task",
    "resourceId": 1,
    "details": "Created task: Complete Q4 Report",
    "timestamp": "2026-02-07T00:00:00.000Z",
    "user": {
      "id": 1,
      "name": "Owner User",
      "email": "owner@example.com"
    }
  },
  {
    "id": 2,
    "userId": 1,
    "action": "UPDATE",
    "resource": "Task",
    "resourceId": 1,
    "details": "Updated task: Complete Q4 Report",
    "timestamp": "2026-02-07T01:00:00.000Z",
    "user": {
      "id": 1,
      "name": "Owner User"
    }
  }
]
```

**Audit Log Actions:**
- `CREATE` - Task creation
- `UPDATE` - Task modification (status, content, assignment)
- `DELETE` - Task removal

---

## Features

### Backend Features

✅ **Real JWT Authentication** (not mock)
- Secure password hashing with bcrypt (10 salt rounds)
- Token-based stateless authentication
- Automatic token validation on protected routes

✅ **Role-Based Access Control (RBAC)**
- Three distinct roles with different permission levels
- Custom decorators for declarative authorization
- Guards for runtime permission enforcement

✅ **Organization Hierarchy**
- 2-level organizational structure
- Cascading access for Owner role
- Strict data isolation per organization

✅ **Comprehensive Audit Logging**
- Automatic logging of all task operations
- User attribution and timestamp tracking
- Queryable audit trail for compliance

✅ **Data Validation**
- DTO validation with class-validator
- Input sanitization and type checking
- Proper error responses with status codes

### Frontend Features

✅ **Secure Authentication UI**
- Login form with validation
- Error handling and feedback
- Automatic token management

✅ **Task Management Dashboard**
- Kanban-style board with 3 columns (To Do, In Progress, Done)
- Create, edit, and delete tasks
- Real-time updates after operations

✅ **Drag & Drop Functionality**
- Drag tasks between status columns
- Automatic status updates on drop
- Visual feedback during drag

✅ **Advanced Filtering & Sorting**
- Search by title or description
- Filter by category (Work, Personal)
- Sort by date or alphabetically

✅ **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Grid layout adapts from 1 column (mobile) to 3 columns (desktop)
- Touch-friendly interface elements

✅ **Dark/Light Theme Toggle**
- User preference persistence
- Smooth transitions between themes
- System preference detection

✅ **Role-Based UI**
- Shows/hides features based on user permissions
- Clear visual indicators for user role
- Disabled states for unauthorized actions

---

## Testing

### Backend Tests

**Run Tests:**
```bash
npx nx test api
```

**Test Coverage:**
- ✅ Authentication service (login, token generation, password validation)
- ✅ RBAC guards (role-based access enforcement)
- ✅ Task controller (CRUD operations)
- ✅ Permission logic (Owner, Admin, Viewer scenarios)

**Test Results:**
```
Test Suites: 5 passed, 5 total
Tests:       18 passed, 18 total
```

**Key Test Scenarios:**
1. **Authentication Tests:**
   - Valid credentials return JWT token
   - Invalid email/password throws UnauthorizedException
   - User password not included in response

2. **RBAC Tests:**
   - Owner/Admin roles can access protected endpoints
   - Viewer role denied access to modification endpoints
   - Unauthenticated requests are blocked

3. **Task Access Tests:**
   - Users can only access tasks from their organization
   - Owners can access child organization tasks
   - Admin/Viewer scoped to single organization

### Frontend Tests

**Note:** Frontend testing was deprioritized in favor of comprehensive backend security testing and feature completeness. In a production environment, would implement:
- Component unit tests with TestBed
- Service mocking and integration tests
- E2E tests for critical user flows

---

## Future Considerations

### Security Enhancements

**1. JWT Refresh Tokens**
- Implement short-lived access tokens (15 min) with refresh token rotation
- Store refresh tokens in HttpOnly cookies
- Reduces attack surface from stolen access tokens

**2. CSRF Protection**
- Implement CSRF tokens for state-changing operations
- Use double-submit cookie pattern
- Protect against cross-site request forgery

**3. Rate Limiting**
- Throttle login attempts (5 attempts per 15 minutes)
- Per-user API rate limits (100 requests per minute)
- DDoS protection with request queuing

**4. Enhanced Password Security**
- Enforce password complexity requirements
- Implement password history (prevent reuse of last 5 passwords)
- Password expiration after 90 days
- Multi-factor authentication (TOTP, SMS)

**5. Security Headers**
- Helmet.js for HTTP security headers
- Content Security Policy (CSP)
- HTTPS enforcement in production

### Performance Optimizations

**1. RBAC Caching**
- Cache user permissions in Redis (TTL: 5 minutes)
- Invalidate cache on role/organization changes
- Reduce database queries by 60-70%

**2. Database Optimization**
- Add indexes on frequently queried fields:
  - `tasks(organization_id, status)`
  - `tasks(created_by_id)`
  - `users(email)` (already unique)
- Use database views for complex queries
- Implement query result caching

**3. API Performance**
- Implement pagination (cursor-based, 50 items per page)
- Add ETag support for conditional requests
- Response compression with gzip
- API response caching with Redis

**4. Frontend Optimization**
- Virtual scrolling for large task lists
- Lazy loading of task details
- Optimistic UI updates
- Service Worker for offline support

### Feature Enhancements

**1. Advanced Role Management**
- Custom roles with granular permissions
- Project-level permissions (beyond organization)
- Time-based access grants (temporary permissions)
- Role delegation and impersonation

**2. Task Features**
- **Attachments:** File uploads with cloud storage (S3, Azure Blob)
- **Comments:** Threaded discussions on tasks
- **Due Dates:** Calendar integration and reminders
- **Subtasks:** Task dependencies and hierarchies
- **Tags:** Custom labels beyond categories
- **Task Templates:** Reusable task structures

**3. Collaboration**
- **Real-time Updates:** WebSocket integration for live changes
- **Notifications:** Email/push notifications for assignments and mentions
- **Activity Feed:** Real-time stream of task updates
- **Team Workspaces:** Shared views and filters

**4. Analytics & Reporting**
- **Dashboards:** Task completion rates, velocity metrics
- **Burndown Charts:** Sprint progress tracking
- **User Productivity:** Individual and team statistics
- **Export:** PDF/Excel reports for presentations

**5. Integrations**
- Calendar sync (Google Calendar, Outlook)
- Slack/Teams notifications
- GitHub/Jira issue linking
- Time tracking integration (Toggl, Harvest)

### Scalability Considerations

**1. Database Migration**
- Easy migration path to PostgreSQL for production
- Connection pooling configuration
- Read replicas for high-traffic scenarios

**2. Microservices Architecture**
- Separate auth service for SSO capabilities
- Dedicated notification service
- Event-driven architecture with message queues (RabbitMQ, Kafka)

**3. Deployment**
- Containerization with Docker
- Kubernetes orchestration
- Horizontal scaling with load balancers
- CDN for static assets

---

## Implementation Details

### Time Spent

**Total:** Approximately 8 hours

**Breakdown:**
- Setup & NX Configuration: 1 hour
- Backend Development (API, Auth, RBAC): 3.5 hours
- Frontend Development (Dashboard, Components): 2.5 hours
- Testing & Bug Fixes: 1 hour

### Key Design Decisions

**1. Standalone Angular Components**
- Leverages Angular's modern standalone component architecture
- Better tree-shaking and bundle optimization
- Simplified dependency management

**2. Service-Layer Authorization**
- Organization scoping implemented in service layer vs database views
- More flexible and testable permission logic
- Easier to modify rules without schema changes

**3. Functional HTTP Interceptors**
- Used Angular's new functional interceptor API
- Cleaner, more composable than class-based interceptors
- Better type safety

**4. In-Memory State Management**
- RxJS BehaviorSubjects for state management
- No external state library needed for this scope
- Simple and effective for small-medium applications

**5. Inline Component Templates**
- Task card and form use inline templates
- Reduces file count and improves colocation
- Easier to maintain for small components

### Tradeoffs Made

**1. Shared Library Complexity**
- **Initial Plan:** Use `libs/data` and `libs/auth` for shared interfaces and RBAC logic
- **Reality:** Module resolution and webpack externals caused build issues
- **Solution:** Moved RBAC guards/decorators to `apps/api/src/common/`
- **Tradeoff:** Less code reuse between potential future services
- **Future Fix:** Configure webpack properly or use publishable libraries

**2. SQLite vs PostgreSQL**
- **Choice:** SQLite for development simplicity
- **Tradeoff:** Limited concurrent writes, not production-scalable
- **Benefit:** Zero-configuration, portable database file
- **Migration Path:** TypeORM makes PostgreSQL migration trivial (just change connection config)

**3. LocalStorage for JWT**
- **Choice:** Simple token storage in browser localStorage
- **Tradeoff:** Vulnerable to XSS attacks
- **Alternative:** HttpOnly cookies would be more secure
- **Context:** Acceptable for demonstration, needs hardening for production

**4. No Token Refresh**
- **Choice:** Single long-lived tokens (24h)
- **Tradeoff:** Stolen tokens valid until expiration
- **Future:** Implement refresh token rotation for better security

**5. Console-Based Audit Logging**
- **Choice:** Logs saved to SQLite database, viewable via API
- **Tradeoff:** No structured logging or external monitoring
- **Future:** Integrate Winston, ELK stack, or cloud logging services

**6. Simplified Testing Strategy**
- **Choice:** Comprehensive backend tests (18 passing), minimal frontend tests
- **Rationale:** RBAC security is critical, frontend is more straightforward
- **Tradeoff:** Less confidence in UI behavior
- **Future:** Add E2E tests with Cypress or Playwright

### Challenges Overcome

**1. TypeScript Decorator Metadata**
- Issue: TypeORM decorators failing with tsx/ts-node
- Solution: Explicit column types, proper tsconfig configuration
- Learning: Decorator metadata requires specific compiler settings

**2. NX Module Resolution**
- Issue: Shared libraries not resolving at runtime
- Solution: Moved shared code to API, fixed TypeScript composite projects
- Learning: Webpack externals and library publishing in monorepos

**3. Angular CDK Integration**
- Issue: CDK directives not recognized initially
- Solution: Proper module imports, cache clearing
- Learning: Standalone components require explicit DragDropModule import

**4. JWT Strategy and Relations**
- Issue: User role not loaded from database
- Solution: Load relations in JWT strategy, add @JoinColumn decorators
- Learning: TypeORM lazy loading vs eager loading considerations

---

## Security Best Practices Implemented

✅ **Password Security**
- Bcrypt hashing with 10 salt rounds
- Passwords never returned in API responses
- Minimum 6-character requirement

✅ **JWT Security**
- Signed with strong secret key
- Short expiration time (24h)
- Validated on every request

✅ **CORS Configuration**
- Restricted to frontend origin only
- Credentials support enabled
- Prevents unauthorized cross-origin requests

✅ **Input Validation**
- DTO validation with class-validator
- Whitelist mode (strips unknown properties)
- Type coercion and sanitization

✅ **Error Handling**
- No sensitive information in error messages
- Consistent error response format
- Proper HTTP status codes

✅ **Data Isolation**
- Organization-scoped queries
- No cross-organization data leakage
- Permission checks before all operations

---

## Project Structure Rationale

### Why NX Monorepo?

- **Shared Code:** Easy sharing of TypeScript interfaces and utilities
- **Atomic Changes:** Update API and frontend in single commit
- **Build Optimization:** Intelligent caching and affected project detection
- **Developer Experience:** Consistent tooling across projects

### Why NestJS?

- **TypeScript-First:** Strong typing throughout the stack
- **Modular Architecture:** Clean separation of concerns
- **Decorator-Based:** Intuitive RBAC implementation
- **Production-Ready:** Built-in validation, guards, interceptors

### Why Angular?

- **Enterprise-Grade:** Mature framework with comprehensive tooling
- **TypeScript Native:** Full type safety from API to UI
- **Dependency Injection:** Clean service architecture
- **Reactive Programming:** RxJS for complex async workflows

---

## Running in Production

### Environment Variables

Required environment variables for production deployment:

```env
# JWT Configuration (CRITICAL - Use strong random secret!)
JWT_SECRET=<64-character-random-hex-string>
JWT_EXPIRATION=1h

# Database
DATABASE_TYPE=postgres
DATABASE_HOST=your-db-host.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=taskmanager
DATABASE_USERNAME=dbuser
DATABASE_PASSWORD=secure-password
DATABASE_SSL=true

# Application
PORT=3000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.com
```

### Build for Production

```bash
# Build backend
npx nx build api --configuration=production

# Build frontend
npx nx build dashboard --configuration=production

# Outputs:
# dist/apps/api - Backend bundle
# dist/apps/dashboard - Frontend static files
```

### Deployment Checklist

- [ ] Set strong JWT_SECRET (64+ character random string)
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Disable synchronize in TypeORM (use migrations)
- [ ] Set up environment-specific configs
- [ ] Configure logging service (Winston, CloudWatch)
- [ ] Set up monitoring (New Relic, Datadog)
- [ ] Implement rate limiting
- [ ] Add health check endpoints
- [ ] Configure CDN for frontend assets
- [ ] Set up CI/CD pipeline
- [ ] Database backups and recovery plan

---

## Known Limitations

1. **Single Organization Assignment:** Users can only belong to one organization (could extend to multi-tenancy)
2. **Two-Level Hierarchy Only:** Organization structure limited to parent-child (could support deeper nesting)
3. **No Real-Time Updates:** Changes require manual refresh (could add WebSockets)
4. **Limited Task Fields:** Basic task structure (could add more metadata like priority, tags, due dates)
5. **No File Attachments:** Tasks support text only (could add file upload to cloud storage)

---

## Contributing

This is a coding challenge submission. For questions or feedback, please contact through the submission portal.

---

## License

This project is submitted as part of a coding assessment and is not licensed for external use.

---

**Built with dedication for the Full Stack Coding Challenge**  
**Sneha Bejugam • February 2026**
