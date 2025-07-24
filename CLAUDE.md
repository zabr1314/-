# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Chinese AI-powered fortune-telling platform** called "玄机阁" (Xuan Ji Gé) built with Next.js 15 + Supabase. The application provides Bazi (八字) and Liuyao (六爻) divination services powered by AI analysis using DeepSeek. It features a credit-based payment system and includes a mall for fortune-related products.

## Development Commands

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Production build  
npm run start    # Start production server
npm run lint     # ESLint with Next.js rules
```

**Note:** No test configuration exists - testing setup would need to be added if required.

## Architecture Overview

### Authentication System
- **Supabase Auth** with `@supabase/ssr` for full-stack authentication
- **Cookie-based sessions** that work across SSR/CSR
- **Route protection** via middleware.ts
- **Server/Client separation** - different Supabase clients for each context

### Key Directories
```
app/                 # Next.js App Router (not Pages Router)
├── api/            # API routes for AI, payments, admin functions
├── auth/           # Authentication routes (/login, /sign-up, etc.)
├── protected/      # Routes requiring authentication
├── pricing/        # Credit purchase page
└── layout.tsx      # Root layout with theme provider

lib/
├── supabase/       # Supabase client configuration
├── ai/             # DeepSeek AI integration
├── payment/        # ZPay payment processing
├── fortune/        # Fortune-telling algorithms (Bazi, Liuyao)
└── db/             # Database utilities

components/
├── ui/             # shadcn/ui component library
└── [auth-forms]    # Authentication form components

docs/               # Project documentation
├── ai.md           # DeepSeek integration guide
├── prompt.md       # Product requirements document
└── z-pay.md        # Payment integration guide
```

### Styling System
- **Tailwind CSS** with CSS variables for theming
- **shadcn/ui** components using Radix UI primitives
- **next-themes** for dark/light mode switching
- **Utility function**: `cn()` in `lib/utils.ts` combines `clsx` and `tailwind-merge`

## Environment Configuration

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
DEEPSEEK_API_KEY=your-deepseek-api-key
ZPAY_PID=your-zpay-merchant-id
ZPAY_PKEY=your-zpay-secret-key
NEXT_PUBLIC_SITE_URL=your-site-url
```

**Important:** Variable name must be `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` (not `ANON_KEY`) to match client.ts configuration.

## Authentication Patterns

### Server Components (Data Fetching)
```typescript
// Use server client for protected server components
const supabase = await createClient();
const { data } = await supabase.auth.getClaims();
const user = data?.claims;
```

### Client Components (Auth Actions)
```typescript
"use client";
const supabase = createClient(); // Browser client
// Use for signIn, signUp, signOut actions
```

### Route Protection
- **Middleware** (`middleware.ts`) handles automatic redirects
- Protected routes under `/protected/*` require authentication
- Unauthenticated users redirected to `/auth/login`
- Middleware runs session refresh on each request

## Development Patterns

### Adding Protected Routes
1. Create under `app/protected/`
2. Use server Supabase client for data fetching
3. Navigation will be handled by protected layout

### Creating Auth Forms
- Follow pattern in `components/login-form.tsx`
- Use client Supabase client for auth actions
- Handle loading states and error messages
- Redirect to `/protected` after successful authentication

### Component Development
- Use shadcn/ui components from `components/ui/`
- Apply `cn()` utility for conditional styling
- Support both light/dark themes via CSS variables
- Make components responsive with Tailwind classes

### Database Integration
- No local Supabase setup - uses hosted service
- All database operations via Supabase client
- Authentication handled entirely by Supabase Auth
- No custom API routes needed for basic CRUD operations

## Critical Implementation Notes

- **Always create fresh Supabase clients** - never store in globals (required for Edge Runtime compatibility)
- **Server vs Client context matters** - use appropriate Supabase client type
- **Cookie handling is automatic** via `@supabase/ssr` package
- **Session management** handled by middleware calling `getClaims()`
- **Environment variables** must match exact names in client configuration

## Application-Specific Features

### AI Integration
- **Provider**: DeepSeek (OpenAI-compatible)
- **Base URL**: `https://api.deepseek.com`
- **Model**: `deepseek-chat`
- **Usage**: Fortune-telling interpretations based on Bazi/Liuyao calculations

### Payment System
- **Provider**: ZPay (Chinese payment processor)
- **Credits**: "玄机值" (Xuanji credits) - users purchase credits to use services
- **Pricing**: 
  - Liuyao (六爻): 5 credits
  - Bazi (八字): 15 credits
- **Signature**: MD5-based signature verification required

### Fortune-telling Features
- **Bazi (八字)**: Detailed life analysis based on birth date/time
- **Liuyao (六爻)**: Divination for specific questions/decisions
- **Image Generation**: Shareable fortune results using @vercel/og
- **History**: User can view past readings in `/protected/readings`

## File Structure Conventions

- **Server Components**: Default in App Router, use for data fetching
- **Client Components**: Mark with `"use client"` directive, use for interactivity
- **Layouts**: Nested layouts for different app sections (`app/protected/layout.tsx`)
- **Route Groups**: Use `(auth)` pattern if needed for route organization
- **Component Library**: shadcn/ui pattern with separate `ui/` folder
- **API Routes**: Organized by function (readings, payment, admin, images)

## shadcn/ui Configuration

- **Style**: "new-york" variant
- **Base Color**: neutral
- **Icon Library**: lucide-react
- **CSS Variables**: Enabled for theming
- **Path Aliases**: `@/components`, `@/lib`, `@/utils` configured