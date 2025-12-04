# SlugConnect

SlugConnect is a social networking platform designed for UCSC students to connect with peers, share interests, and build meaningful relationships within the UCSC community.

## Table of Contents

- [Team Members](#team-members)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Dependencies](#dependencies)
- [Project Structure](#project-structure)
- [Release Plan](#release-plan)
- [Documentation](#documentation)
- [Deployment](#deployment)

## Team Members

- Elian Moreno
- Sam Jo
- Tyler Weng
- Dean McCulloh
- Neha Hingorani

## Tech Stack

- **Frontend**: Next.js 16.0.1 + TailwindCSS 4
- **Backend & Database**: Supabase (Auth + Tables)
- **Runtime**: Node.js
- **Package Manager**: npm/yarn/pnpm/bun

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **yarn** or **pnpm** or **bun**
- **Git** (for cloning the repository)
- A **Supabase account** (free tier is sufficient for development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slugconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your Supabase credentials (see [Environment Setup](#environment-setup) below).

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and sign in or create an account
2. Create a new project (or use an existing one)
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note**: The Supabase URL is currently hardcoded in `lib/supabaseClient.js`. For production, ensure you use environment variables for both URL and key.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

The page will auto-reload when you make changes to the code.

### Production Build

Build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

### Linting

Run the linter to check for code issues:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.0.1 | React framework for production |
| `react` | 19.2.0 | UI library |
| `react-dom` | 19.2.0 | React DOM renderer |
| `@supabase/supabase-js` | ^2.80.0 | Supabase client library for authentication and database operations |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4 | Utility-first CSS framework |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin for TailwindCSS |
| `eslint` | ^9 | JavaScript linter |
| `eslint-config-next` | 16.0.1 | ESLint configuration for Next.js |

## Project Structure

```
slugconnect/
├── app/                      # Next.js app directory (App Router)
│   ├── (route_group)/       # Route group for authenticated pages
│   │   ├── connections/     # Connection requests page
│   │   ├── discover/        # Discover/search users page
│   │   └── profile/         # User profile page
│   ├── actions/             # Server actions
│   │   └── profile.js       # Profile-related server actions
│   ├── auth/                # Authentication page
│   ├── onboarding/          # Onboarding flow
│   ├── settings/            # User settings page
│   ├── signup/              # Sign up page
│   ├── layout.js            # Root layout
│   ├── page.js              # Home page
│   └── globals.css          # Global styles
├── components/              # React components
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
├── lib/                     # Utility libraries
│   ├── authService.js       # Authentication service functions
│   ├── supabaseClient.js    # Client-side Supabase client
│   └── supabaseServer.js    # Server-side Supabase client
├── public/                  # Static assets
├── .env.local               # Environment variables (not in git)
├── .gitignore              # Git ignore rules
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
└── README.md               # This file
```

## Release Plan

### High-Level Goals (MVP)

By the end of the quarter, SlugConnect should provide a functional prototype where UCSC students can:

- Sign up and log in using a UCSC email (authentication via Supabase)
- Create and edit a personal profile including name, major, college, year, and interests
- View other student profiles and explore shared interests
- Send and respond to connection requests (accept/reject)
- Have all data persist securely in Supabase

### Stretch Goals (Only if time allows)

- Create or join interest-based groups
- Implement a basic messaging or notification system
- Add a reporting/blocking feature for user safety
- Create posts within interest-based groups/communities

### User Stories by Sprint

#### Sprint 1

- As a new student, I can create an account using my @ucsc.edu email so that only UCSC students can join
- As a returning user, I can log in securely so my profile data is saved
- As a user, I want to ensure that I am connecting with other UCSC students

#### Sprint 2

- As a user, I need to be able to update my profile so that I can find others with similar interests (e.g., major, class standing, or specific interests)
- As a user, I need to be able to view other user's profiles so that I can find others with common interests

#### Sprint 3

- As a user, I want to navigate a simple and clean UI
- As a new user, I want to sign up with my UCSC email
- As a returning user, I want to log in to my account
- As a UCSC student, I want authentication to ensure only verified UCSC emails can sign up
- As a user, I want to edit and update my profile information (major, college, year, interests)
- As a user, I want to view other student profiles
- As a user, I want to search for other student profiles
- As a user, I want to filter other student profiles based on profile information (major, college, year, interests)

#### Sprint 4

- As a user, I want to send connection requests to other users
- As a user, I want to be able to create a profile and edit my profile
- As a user, I want to be able to filter by interests
- As a user, I want to be able to view incoming connection requests from other users
- As a user, I want to accept or reject connection requests
- As a user, I want to be able to login with authentication via Supabase and ensure safety for user data
- As a user, I want there to be data persistence when I reload the page so the information is accurate and consistent

### Product Backlog

All high level goals/user stories yet to be implemented:

- Navigable UI
- Ability to sign in/create an account
- Authentication
- Profile information and the ability to view others profiles
- Search for other students with similar interests
- Potential messaging system (group chats or something similar to FB groups, as mentioned)
- Potential post creating within 'interest groups/communities'

See user stories in each sprint for more details.

### Sanity Check

Our plan should be within our capacity, however we will have to deal with other things such as balancing time between other classes, learning what we need to in order to implement certain features (spikes), and potential testing/debugging.

If we can't finish some feature within a sprint, we should ensure that we communicate that so that we can determine what should be done.

## Documentation

Additional documentation is available in the following files:

- **[USER_GUIDE.md](./USER_GUIDE.md)** - User-facing guide for using SlugConnect
- **[DESIGN.md](./DESIGN.md)** - Architecture and design documentation
- **[SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md)** - CSE 115A submission requirements checklist

### Scrum Documents

All Scrum-related documents are located in the `SCRUM_DOCUMENTS/` directory:

- Release Plan (V3.0 FINAL)
- Sprint Plans (Sprints 1-4)
- Sprint Reports (Sprints 1-4)
- Team Working Agreement
- Test Plan and Report
- Release Summary Document
- Burnup Charts (Sprints 1-4)

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

This project is private and for educational purposes only.
