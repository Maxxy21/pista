# Pista - AI-Powered Startup Pitch Evaluator

> An intelligent platform for evaluating and analyzing startup pitches using advanced AI technology.

## 🌟 Overview

Pista is a comprehensive web application that leverages artificial intelligence to evaluate startup pitches through multiple modalities - audio transcription, content analysis, and structured scoring. Built with modern web technologies, it provides entrepreneurs and investors with detailed insights into pitch quality, strengths, and areas for improvement.

### Key Features

- 🎙️ **Audio-First Approach**: Upload pitch recordings for automatic transcription
- 🤖 **AI-Powered Analysis**: Advanced evaluation using OpenAI's latest models
- 📊 **Structured Scoring**: Multi-dimensional scoring across key pitch criteria
- 📈 **Visual Analytics**: Interactive charts and radar plots for performance visualization
- 👥 **Team Collaboration**: Organization-based pitch management with Clerk authentication
- 🎨 **Modern UI/UX**: Responsive design with dark/light theme support
- 📱 **Mobile Optimized**: Fully responsive interface for all devices
- ⚡ **Real-time Updates**: Live data synchronization with Convex backend

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Shadcn/ui](https://ui.shadcn.com/) - Modern React components
- [Recharts](https://recharts.org/) - Data visualization library

**Backend & Services:**
- [Convex](https://convex.dev/) - Real-time backend-as-a-service
- [Clerk](https://clerk.com/) - Authentication and user management
- [OpenAI API](https://openai.com/) - AI-powered content analysis
- [Vercel](https://vercel.com/) - Deployment and hosting

**Development:**
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [TypeScript](https://www.typescriptlang.org/) - Static type checking

### Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (dashboard)/                  # Dashboard route group
│   │   └── dashboard/
│   │       ├── _components/          # Private dashboard components
│   │       ├── _hooks/              # Dashboard-specific hooks
│   │       └── _lib/                # Dashboard utilities
│   ├── (pitch)/                     # Pitch evaluation route group
│   │   └── pitch/[id]/
│   │       └── _components/         # Private pitch components
│   ├── (auth)/                      # Authentication routes
│   └── api/                         # API endpoints
├── components/                      # Shared components
│   ├── ui/                         # UI primitives
│   └── shared/                     # Feature-based components
│       ├── navigation/             # Navigation components
│       ├── forms/                  # Form components
│       ├── modals/                 # Modal dialogs
│       └── common/                 # Common utilities
├── hooks/                          # Custom React hooks
├── lib/                           # Utility functions
├── providers/                     # React context providers
└── store/                         # State management
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Clerk account for authentication
- Convex account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/startup-pitches.git
   cd startup-pitches
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the required environment variables (see `.env.example` for details).

4. **Setup Backend Services**
   
   **Convex Setup:**
   ```bash
   npx convex dev
   ```
   
   **Clerk Setup:**
   - Create a Clerk application
   - Configure authentication providers
   - Add your Clerk keys to `.env.local`

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project maintains high code quality standards through:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Conventional Commits** for semantic versioning

## 📊 Features Deep Dive

### Pitch Analysis Pipeline

1. **Audio Upload & Transcription**
   - Support for multiple audio formats
   - AI-powered transcription using Whisper API
   - Real-time processing feedback

2. **Content Analysis**
   - Multi-criteria evaluation framework
   - Natural language processing for insights
   - Structured scoring across dimensions

3. **Visualization & Reporting**
   - Interactive radar charts for performance metrics
   - Detailed analysis breakdowns
   - Exportable reports (PDF generation)

### Dashboard Features

- **Pitch Library**: Organized view of all pitches
- **Search & Filtering**: Advanced search capabilities
- **Team Management**: Organization-based access control
- **Analytics**: Performance tracking and insights

## 🔐 Security & Privacy

- **Authentication**: Secure user management with Clerk
- **Data Protection**: End-to-end encryption for sensitive data
- **API Security**: Rate limiting and input validation

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Ensure all production environment variables are configured:

- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `OPENAI_API_KEY` - OpenAI API key



<div align="center">
  <strong>Built with ❤️ for the startup community</strong>
</div>