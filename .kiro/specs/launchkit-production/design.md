# Design Document: LaunchKit Production Features

## Overview

This design document outlines the architecture and implementation approach for transforming LaunchKit from an MVP into a production-ready application. The system will integrate Supabase Auth for authentication, implement user-specific data access with Row Level Security, automate website deployment using static site generation, configure DNS programmatically via Ola.CV API, send transactional emails via Resend, and manage subscriptions with Stripe.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Pages   │  │  Dashboard   │  │ Launch Flow  │     │
│  │ - Login      │  │ - Brand List │  │ - Bio Input  │     │
│  │ - Signup     │  │ - Settings   │  │ - Generator  │     │
│  │ - Reset      │  │ - Analytics  │  │ - Contact    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│                    Server Actions Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Actions │  │ Brand Actions│  │Deploy Actions│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Supabase    │  │   Ola.CV     │  │    Resend    │     │
│  │  - Auth      │  │  - Domains   │  │   - Email    │     │
│  │  - Database  │  │  - DNS       │  │              │     │
│  │  - Storage   │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │    Stripe    │  │   Vercel     │                        │
│  │  - Payments  │  │  - Hosting   │                        │
│  │  - Billing   │  │  - Blob      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**
   - User signs up → Supabase Auth creates account → Email verification sent
   - User logs in → Supabase Auth validates → Session created → JWT stored
   - Protected routes check JWT → Allow/deny access

2. **Brand Creation Flow**
   - User submits bio → AI generates brands → User selects brand
   - User submits contact → Ola.CV creates contact → Domain registered
   - System creates brand record → Triggers deployment → Configures DNS
   - System sends email → User receives confirmation

3. **Deployment Flow**
   - Brand created → Generate HTML/CSS from template
   - Upload to Vercel Blob → Get public URL
   - Create DNS A record → Wait for propagation
   - Update brand status → Send success email

## Components and Interfaces

### Authentication Components

#### LoginPage Component
```typescript
interface LoginPageProps {}

// Displays email/password form
// Handles Supabase Auth sign in
// Redirects to dashboard on success
// Shows error messages on failure
```

#### SignupPage Component
```typescript
interface SignupPageProps {}

// Displays email/password/confirm form
// Validates password strength
// Creates Supabase Auth account
// Sends verification email
// Shows success message
```

#### PasswordResetPage Component
```typescript
interface PasswordResetPageProps {}

// Displays email input form
// Sends password reset email via Supabase
// Shows confirmation message
```

### Dashboard Components

#### DashboardLayout Component
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Provides navigation sidebar
// Shows user profile in header
// Displays subscription status
// Includes logout button
```

#### BrandCard Component
```typescript
interface BrandCardProps {
  brand: Brand;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
}

// Displays brand information
// Shows status badge (live, deploying, failed)
// Provides action buttons
// Includes hover animations
```

#### EmptyState Component
```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

// Shows when no brands exist
// Displays call-to-action button
// Includes illustration
```

### Deployment Components

#### DeploymentService
```typescript
interface DeploymentService {
  deployBrand(brand: Brand): Promise<DeploymentResult>;
  generateWebsite(brand: Brand): Promise<string>; // Returns HTML
  uploadToBlob(html: string, domain: string): Promise<string>; // Returns URL
  configureDNS(domain: string, url: string): Promise<void>;
  verifyDeployment(url: string): Promise<boolean>;
}
```

#### EmailService
```typescript
interface EmailService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendDeploymentSuccess(email: string, brand: Brand): Promise<void>;
  sendDeploymentFailure(email: string, brand: Brand, error: string): Promise<void>;
}
```

## Data Models

### User Model (Extended)
```typescript
interface User {
  id: string; // UUID from Supabase Auth
  email: string;
  subscription: 'free' | 'pro';
  subscriptionId?: string; // Stripe subscription ID
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  brandLimit: number; // 1 for free, unlimited for pro
  createdAt: string;
  updatedAt: string;
}
```

### Brand Model (Extended)
```typescript
interface Brand {
  id: string;
  userId: string; // Foreign key to users
  name: string;
  domain: string;
  tagline: string;
  bio: string;
  colors: {
    primary: string;
    accent: string;
    neutral: string;
  };
  templateType: 'minimal-card' | 'magazine-grid' | 'terminal-retro';
  olaDomainId: string;
  olaContactId: string;
  olaZoneId?: string;
  deploymentUrl?: string; // Vercel Blob URL
  status: 'registering' | 'deploying' | 'configuring_dns' | 'live' | 'failed';
  errorMessage?: string;
  lastDeployedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Deployment Model
```typescript
interface Deployment {
  id: string;
  brandId: string;
  status: 'pending' | 'generating' | 'uploading' | 'configuring_dns' | 'success' | 'failed';
  deploymentUrl?: string;
  errorMessage?: string;
  retryCount: number;
  startedAt: string;
  completedAt?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Authentication Session Persistence
*For any* authenticated user, if they refresh the page, their session should remain valid and they should not be redirected to login.
**Validates: Requirements 2.2**

### Property 2: User Data Isolation
*For any* user, when they query their brands, the results should contain only brands where userId matches their ID.
**Validates: Requirements 3.2**

### Property 3: Brand Ownership Verification
*For any* brand edit or delete operation, the system should verify that the requesting user's ID matches the brand's userId before allowing the operation.
**Validates: Requirements 3.3, 3.4**

### Property 4: Free Tier Brand Limit
*For any* free tier user, attempting to create more than 1 brand should be rejected with an upgrade prompt.
**Validates: Requirements 8.1**

### Property 5: Free Tier Service Limit
*For any* free tier user, attempting to add more than 3 services to a brand should be rejected with an upgrade prompt.
**Validates: Requirements 8.2**

### Property 6: Deployment Status Progression
*For any* brand deployment, the status should progress in order: registering → deploying → configuring_dns → live, and never skip states or go backwards (except to failed).
**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 7: DNS Configuration Idempotence
*For any* domain, configuring DNS records multiple times should result in the same final state (idempotent operation).
**Validates: Requirements 6.2, 6.3**

### Property 8: Email Notification Delivery
*For any* brand deployment completion (success or failure), exactly one email notification should be sent to the user.
**Validates: Requirements 7.3, 7.4**

### Property 9: Deployment Retry Limit
*For any* failed deployment, the system should retry up to 3 times, and after the 3rd failure, mark the brand as "failed" without further retries.
**Validates: Requirements 12.1**

### Property 10: Password Strength Validation
*For any* password submission during signup, passwords shorter than 8 characters or without mixed case and numbers should be rejected.
**Validates: Requirements 13.1**

### Property 11: Subscription Upgrade Effect
*For any* user who upgrades from free to pro, their brandLimit should immediately change from 1 to unlimited (represented as a large number like 999).
**Validates: Requirements 9.4**

### Property 12: Session Expiration Redirect
*For any* expired session, when a user attempts to access a protected route, they should be redirected to the login page with a return URL parameter.
**Validates: Requirements 2.3**

## Error Handling

### Authentication Errors
- **Invalid credentials**: Display "Email or password is incorrect"
- **Email already exists**: Display "An account with this email already exists"
- **Weak password**: Display specific requirements not met
- **Email not verified**: Display "Please verify your email before logging in"
- **Session expired**: Redirect to login with message "Your session has expired"

### Deployment Errors
- **Domain registration failed**: Retry with backoff, then mark as failed
- **Website generation failed**: Log error, mark as failed, notify user
- **Upload failed**: Retry 3 times, then mark as failed
- **DNS configuration failed**: Retry 5 times with backoff, then mark as failed
- **Verification failed**: Wait and retry, timeout after 10 minutes

### Subscription Errors
- **Payment failed**: Display Stripe error message, keep user on free tier
- **Subscription canceled**: Downgrade at period end, notify user
- **Webhook failed**: Log error, retry webhook processing

### User-Facing Error Messages
- Use friendly, actionable language
- Never expose technical details or stack traces
- Provide next steps or support contact
- Log full technical details server-side

## Testing Strategy

### Unit Tests
- Test authentication functions (signup, login, logout)
- Test brand CRUD operations with user ownership checks
- Test deployment service functions individually
- Test email template generation
- Test subscription tier validation

### Property-Based Tests
- Run each correctness property with 100+ random inputs
- Test with various user states (free, pro, expired)
- Test with different brand configurations
- Test deployment with simulated failures
- Test concurrent operations (multiple users deploying)

### Integration Tests
- Test complete authentication flow (signup → verify → login)
- Test complete brand creation flow (bio → brand → deploy → live)
- Test subscription upgrade flow (free → payment → pro)
- Test deployment retry logic with simulated failures
- Test email delivery with test email service

### End-to-End Tests
- Test user journey: signup → create brand → view dashboard → upgrade
- Test deployment monitoring: create brand → watch status updates → verify live
- Test error recovery: simulate failures → verify retries → check notifications

## Security Considerations

### Authentication Security
- Use Supabase Auth with secure JWT tokens
- Implement CSRF protection on all forms
- Use HTTP-only cookies for session storage
- Enforce HTTPS in production
- Implement rate limiting on auth endpoints

### Data Security
- Use Row Level Security (RLS) in Supabase
- Encrypt sensitive data at rest
- Validate all user inputs server-side
- Sanitize data before rendering
- Use parameterized queries to prevent SQL injection

### API Security
- Validate authentication tokens on all API routes
- Implement rate limiting per user
- Use API keys for external services (stored in env vars)
- Validate webhook signatures (Stripe, Resend)
- Log all security-relevant events

## Performance Optimization

### Dashboard Performance
- Implement pagination for brand lists (10 per page)
- Use React Server Components for initial render
- Lazy load brand details on demand
- Cache user subscription status
- Optimize images with Next.js Image component

### Deployment Performance
- Queue deployments to prevent overload
- Use background jobs for long-running tasks
- Implement caching for generated websites
- Use CDN for static assets
- Monitor deployment times and optimize bottlenecks

### Database Performance
- Add indexes on userId, status, createdAt
- Use database connection pooling
- Implement query result caching
- Optimize RLS policies for performance
- Monitor slow queries and optimize

## Deployment Strategy

### Environment Setup
- Development: Local Supabase + test Stripe account
- Staging: Supabase staging + Stripe test mode
- Production: Supabase production + Stripe live mode

### Database Migrations
- Create migration for users table extensions
- Create migration for deployment tracking
- Update RLS policies for user isolation
- Add indexes for performance

### Feature Flags
- Enable authentication gradually
- Test deployment system with subset of users
- Roll out subscription features incrementally
- Monitor metrics at each stage

### Monitoring
- Track authentication success/failure rates
- Monitor deployment success rates
- Track email delivery rates
- Monitor subscription conversion rates
- Set up alerts for critical failures
