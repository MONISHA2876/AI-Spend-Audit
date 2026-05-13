# SaaS Audit Tool

A client-side audit tool that helps teams identify bloated or underused SaaS subscriptions and find cost-saving opportunities. You plug in your tools, plans, and seat counts — it runs the audit instantly in the browser, ranks savings by severity, and generates an AI-written executive summary powered by Claude.

---

## Demo

> 🎥 **Screen Recording**

<!-- Add your Loom or YouTube link below -->
[Watch the demo](YOUR_LOOM_OR_YOUTUBE_LINK)

## Live Demo

🔗 [YOUR_DEPLOYED_URL](https://ai-spend-audit-xi-five.vercel.app/)

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key
- Supabase project (for the contact form)

### Install & Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add the same environment variables in your Vercel project dashboard under **Settings → Environment Variables**.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   └── summary/
│   │       └── route.ts          # Gemini API route
│   ├── audit/
│   │   ├── result/
│   │   │   └── page.tsx          # Results + AI summary page
│   │   └── page.tsx              # Audit input page
│   ├── contact/
│   │   └── page.tsx              # Contact / lead form
│   ├── features/
│   │   └── page.tsx              # Features page
│   ├── how-it-works/
│   │   └── page.tsx              # How it works page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Home page
├── components/
│   ├── audit/                    # Audit-specific components
│   ├── form.tsx
│   ├── header.tsx
│   ├── SectionHeader.tsx
│   └── ToolCard.tsx
├── constants/
│   ├── constants.ts              # Tool configs and pricing data
│   └── types.ts                  # Shared TypeScript types
└── lib/
    └── supabase.ts               # Supabase client
```
