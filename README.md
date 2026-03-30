# ContentCraft — AI Content Generator

AI-powered content creation tool for Instagram, YouTube, and TikTok creators.

## Features

- **Viral Hook Generator** — Scroll-stopping opening lines
- **Caption Generator** — Engaging, platform-optimized captions
- **Hashtag Suggestions** — Relevant, trending hashtags
- **Script Generator** — Short and long-form video scripts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **AI**: OpusCode API (Claude Sonnet 4.6)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- OpusCode API key

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory:
   ```env
   OPUSCODE_API_KEY=your-api-key-here
   OPUSCODE_BASE_URL=https://claude.opuscode.pro
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPUSCODE_API_KEY` | Your OpusCode API key |
| `OPUSCODE_BASE_URL` | OpusCode API base URL (default: https://api.opuscode.pro) |

## Project Structure

```
├── app/
│   ├── page.tsx              # Main landing page
│   ├── api/
│   │   └── generate/
│   │       ├── hook/route.ts     # Hook generator API
│   │       ├── caption/route.ts   # Caption generator API
│   │       ├── hashtags/route.ts  # Hashtag generator API
│   │       └── script/route.ts    # Script generator API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── FeatureCard.tsx
│   ├── GeneratorForm.tsx
│   └── ResultCard.tsx
├── lib/
│   └── opuscode.ts          # OpusCode API client
└── prd.md                    # Product Requirements Document
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
