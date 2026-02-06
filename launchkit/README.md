# LaunchKit — Instant Brand Presence MVP

**Tagline:** From bio to brand in 60 seconds

##  Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local` and add your API keys:
   ```bash
   # Required API Keys
   OLA_API_TOKEN=your_ola_cv_api_token
   CLAUDE_API_KEY=your_claude_api_key
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Supabase
- **Testing:** Jest + React Testing Library + fast-check (Property-Based Testing)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── actions.ts      # Server Actions for API integration
│   ├── layout.tsx      # Root layout with fonts
│   └── page.tsx        # Landing page
├── components/         # React components
│   └── launch/        # Launch flow components
├── types/             # TypeScript type definitions
└── globals.css        # Global styles with design system
```

## 🎨 Design System

LaunchKit uses a custom design system with:
- **Brand Colors:** Primary (#2563eb), Accent (#f59e0b), Neutral (#f3f4f6)
- **Typography:** Inter (body), Space Grotesk (display), JetBrains Mono (code)
- **Spacing Scale:** xs (0.5rem) to xl (4rem)
- **Animations:** Fade-in, slide-up, gentle bounce

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 🌟 Features

- **3-Step Magic:** Bio → AI Brand Generation → Live Site
- **Domain Integration:** Automatic .cv domain registration via Ola.CV
- **AI-Powered:** Claude API for brand identity generation
- **DNS Management:** Full DNS record management
- **Responsive Design:** Works on all devices
- **Property-Based Testing:** Comprehensive test coverage

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OLA_API_TOKEN` | Ola.CV API token for domain operations | Yes |
| `CLAUDE_API_KEY` | Claude API key for AI brand generation | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL for callbacks | No |

## 🚀 Deployment

The app is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

---

Built with ❤️ for the creator economy