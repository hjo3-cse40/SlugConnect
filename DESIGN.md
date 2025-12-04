# SlugConnect Design & Architecture Documentation

This document describes the architecture, design decisions, and technical implementation details of SlugConnect.

## Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Component Architecture](#component-architecture)
- [API Design](#api-design)
- [Security Considerations](#security-considerations)
- [File Structure](#file-structure)
- [Design Patterns](#design-patterns)

## System Architecture

SlugConnect follows a modern full-stack architecture:

```
┌─────────────────┐
│   Next.js App   │  (Frontend + Server Components)
│   (Client)      │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│   Supabase      │
│   ┌──────────┐  │
│   │   Auth   │  │  (Authentication)
│   └──────────┘  │
│   ┌──────────┐  │
│   │ Database │  │  (PostgreSQL with RLS)
│   └──────────┘  │
└─────────────────┘
```

### Architecture Overview

- **Frontend**: Next.js 16 with App Router (React Server Components + Client Components)
- **Backend**: Supabase (BaaS - Backend as a Service)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with email/password
- **Styling**: TailwindCSS 4

## Technology Stack

### Frontend

- **Next.js 16.0.1**: React framework with App Router
  - Server Components for data fetching
  - Client Components for interactivity
  - Server Actions for mutations
- **React 19.2.0**: UI library
- **TailwindCSS 4**: Utility-first CSS framework

### Backend & Services

- **Supabase**: Backend-as-a-Service platform
  - Authentication service
  - PostgreSQL database
  - Row Level Security (RLS) policies
  - Real-time subscriptions (potential future use)

### Development Tools

- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Git**: Version control

## Database Schema

### Tables

#### `profiles`

Stores user profile information.

```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  major TEXT,
  college TEXT,
  year TEXT,
  interests TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### `connection_requests`

Stores connection requests between users.

```sql
connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
)
```

### Row Level Security (RLS)

Supabase RLS policies ensure:

1. **Profiles**:
   - Users can read all profiles
   - Users can only update their own profile
   - Users can only insert their own profile

2. **Connection Requests**:
   - Users can read requests where they are sender or receiver
   - Users can create requests (as sender)
   - Users can update requests where they are receiver (to accept/reject)

## Authentication Flow

### Sign Up Flow

```
1. User enters email (@ucsc.edu) and password
2. Client validates email domain
3. Supabase Auth creates user account
4. Confirmation email sent to user
5. User clicks confirmation link
6. User redirected to onboarding
7. Profile created in profiles table
```

### Sign In Flow

```
1. User enters email and password
2. Supabase Auth validates credentials
3. Session created and stored in localStorage
4. Session synced to cookies for server-side access
5. User redirected to home/discover page
```

### Session Management

- **Client-side**: Session stored in localStorage via Supabase client
- **Server-side**: Session synced to cookies for Server Components and Server Actions
- **Auto-refresh**: Supabase automatically refreshes tokens

## Component Architecture

### Component Hierarchy

```
App Layout
├── NavBar (Client Component)
│   └── Navigation links, user menu
├── Page Components (Server/Client)
│   ├── Home Page
│   ├── Auth Page
│   │   ├── SignUpCard (Client)
│   │   └── LogInCard (Client)
│   ├── Onboarding Page
│   │   └── OnboardingCard (Client)
│   ├── Discover Page
│   │   ├── SearchBar (Client)
│   │   ├── FilterSideBar (Client)
│   │   └── ProfileGrid (Client)
│   │       └── ProfileCard (Client)
│   ├── Profile Page
│   │   └── ProfileCard (Client)
│   ├── Connections Page
│   │   ├── AcceptRejectButtons (Client)
│   │   └── ProfileGrid (Client)
│   └── Settings Page
└── Global Styles (TailwindCSS)
```

### Component Types

- **Server Components**: Default in Next.js App Router, used for data fetching
- **Client Components**: Marked with `'use client'`, used for interactivity

### Key Components

#### `NavBar.jsx`
- Navigation bar with links to main pages
- User authentication state display
- Logout functionality

#### `ProfileCard.js`
- Displays user profile information
- Used in grids and individual profile views
- Shows name, major, college, year, interests

#### `SearchBar.jsx`
- Search input for finding users
- Real-time search filtering

#### `FilterSideBar.jsx`
- Filter options for discover page
- Filters by major, college, year, interests

#### `AcceptRejectButtons.jsx`
- Handles connection request responses
- Accept/reject functionality

## API Design

### Server Actions

Located in `app/actions/profile.js`:

- `createProfile(profileData)`: Create a new user profile
- `updateProfile(userId, profileData)`: Update existing profile
- `getProfile(userId)`: Get profile by user ID
- `getAllProfiles()`: Get all profiles (with filters)

### Supabase Client Usage

#### Client-Side (`lib/supabaseClient.js`)
- Used in Client Components
- Handles authentication
- Syncs session to cookies for server-side access

#### Server-Side (`lib/supabaseServer.js`)
- Used in Server Components and Server Actions
- Reads session from cookies
- Respects RLS policies

### Authentication Service (`lib/authService.js`)

- `signUp(email, password)`: Register new user
- `signInWithPassword(email, password)`: Sign in existing user
- `signOut()`: Sign out current user
- `getCurrentUser()`: Get authenticated user
- `resendConfirmationEmail(email)`: Resend email confirmation

## Security Considerations

### Authentication Security

1. **Email Domain Validation**: Only @ucsc.edu emails allowed
2. **Password Requirements**: Enforced by Supabase Auth
3. **Email Verification**: Required before account activation
4. **Session Management**: Secure token storage and refresh

### Data Security

1. **Row Level Security (RLS)**: Database-level access control
2. **Environment Variables**: Sensitive keys stored in `.env.local`
3. **HTTPS**: Required for production (enforced by Supabase)
4. **Input Validation**: Client and server-side validation

### Privacy

1. **User Data**: Only visible to authenticated UCSC students
2. **Profile Information**: Public within the platform
3. **Connection Requests**: Private between sender and receiver

## File Structure

```
slugconnect/
├── app/                          # Next.js App Router
│   ├── (route_group)/           # Route group (layout wrapper)
│   │   ├── connections/         # Connections page
│   │   ├── discover/            # Discover/search page
│   │   └── profile/             # Profile page
│   ├── actions/                  # Server Actions
│   │   └── profile.js           # Profile-related actions
│   ├── auth/                    # Auth page
│   ├── onboarding/              # Onboarding flow
│   ├── settings/                # Settings page
│   ├── signup/                  # Sign up page
│   ├── layout.js                # Root layout
│   ├── page.js                  # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── AcceptRejectButtons.jsx
│   ├── EmailConfirmationMessage.jsx
│   ├── FilterSideBar.jsx
│   ├── LogInCard.jsx
│   ├── NavBar.jsx
│   ├── OnboardingCard.jsx
│   ├── ProfileCard.js
│   ├── ProfileGrid.jsx
│   ├── SearchBar.jsx
│   ├── SendConnectionButton.jsx
│   └── SignUpCard.jsx
├── lib/                          # Utility libraries
│   ├── authService.js           # Auth service functions
│   ├── supabaseClient.js        # Client-side Supabase client
│   └── supabaseServer.js        # Server-side Supabase client
└── public/                       # Static assets
```

## Design Patterns

### 1. Server Components Pattern

- Default components are Server Components
- Fetch data directly from Supabase
- Reduce client-side JavaScript bundle

### 2. Client Components Pattern

- Use `'use client'` directive for interactivity
- Handle user interactions (clicks, form submissions)
- Use hooks (useState, useEffect)

### 3. Server Actions Pattern

- Mutations handled via Server Actions
- Type-safe function calls from Client Components
- Automatic form handling

### 4. Service Layer Pattern

- `authService.js`: Encapsulates authentication logic
- `supabaseClient.js` / `supabaseServer.js`: Abstract Supabase client creation
- Separation of concerns

### 5. Component Composition

- Reusable components (ProfileCard, ProfileGrid)
- Composition over inheritance
- Props-based configuration

## Future Enhancements

### Planned Features

1. **Real-time Updates**: Supabase real-time subscriptions for live connection requests
2. **Messaging System**: Direct messaging between connected users
3. **Interest Groups**: Create and join groups based on interests
4. **Notifications**: In-app notification system
5. **Reporting/Blocking**: User safety features

### Technical Improvements

1. **TypeScript Migration**: Add type safety
2. **Testing**: Unit and integration tests
3. **Performance Optimization**: Image optimization, lazy loading
4. **Accessibility**: WCAG compliance improvements
5. **Mobile Responsiveness**: Enhanced mobile experience

## Development Guidelines

### Code Style

- Use ESLint configuration provided
- Follow Next.js best practices
- Use meaningful component and variable names

### Git Workflow

- Use feature branches (`create_branch.sh`)
- Merge branches via `merge_branch.sh`
- Commit frequently with descriptive messages

### Environment Variables

- Never commit `.env.local` files
- Use `.env.example` as template
- Document all required variables

---

**Last Updated**: Based on current MVP implementation
**Version**: 0.1.0

