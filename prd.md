# ContentCraft — AI Content Generator

## 1. Problem Statement

Small creators, beginners, and small businesses struggle with creating engaging content for social media. Writing a catchy hook, crafting an optimized caption, or finding the right hashtags takes hours — time that could be spent actually creating. Most existing tools are either too complex, too expensive, or produce generic, low-quality output.

## 2. Target Users

- **Primary**: Small creators and beginners (1K–50K followers) who need help starting
- **Secondary**: Small businesses managing their own social media
- **Tertiary**: Content managers handling multiple accounts

## 3. Product Overview

ContentCraft is an AI-powered content generation tool that helps creators produce platform-optimized hooks, captions, hashtags, and scripts in seconds. Enter a topic, pick a platform and tone, and get scroll-stopping content instantly.

## 4. Features

### 4.1 Viral Hook Generator
- Generate 3-5 scroll-stopping opening lines for any topic
- Optimized for each platform's hook style
- Hook types: Question, bold statement, controversial take, story opener, stat hook
- Tone: Professional, Funny, Luxury, Casual, Inspirational, Bold

### 4.2 Caption Generator
- Create engaging captions that drive comments and saves
- Platform-optimized length and style
- Includes call-to-action suggestions
- Maintains consistent brand voice

### 4.3 Hashtag Suggestions
- Generate 15-30 relevant, trending hashtags
- Mix of broad and niche tags for optimal reach
- Platform-specific formatting (# vs. tags)
- Hashtag bundling by theme/category

### 4.4 Script Generator
- Short-form scripts (15–60 seconds) for Reels/TikTok
- Long-form scripts (1–10 minutes) for YouTube
- Built-in structure: Hook → Body → CTA
- Platform-specific pacing and formatting

## 5. User Flow

```
1. User lands on homepage
2. Sees feature overview and "Try Now" CTA
3. Selects platform (Instagram, YouTube, TikTok)
4. Selects content type (Hook, Caption, Hashtags, Script)
5. Enters their topic/idea
6. Picks a tone (optional)
7. Clicks "Generate" → AI processes
8. Views result in a formatted card
9. Copies content with one click
10. (Optional) Regenerates for different variations
```

## 6. Design Language

### Aesthetic
Modern, creator-focused, vibrant dark theme with electric accent colors. Think "midnight creative studio meets social media energy."

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0B0E14` | Page background |
| Surface | `#151922` | Cards, panels |
| Surface Hover | `#1E2330` | Interactive hover states |
| Border | `#2A3042` | Subtle dividers |
| Primary | `#6366F1` | Indigo — buttons, links |
| Accent | `#F59E0B` | Amber — highlights, badges |
| Text Primary | `#F1F5F9` | Headings, body |
| Text Muted | `#64748B` | Labels, hints |
| Success | `#10B981` | Copy confirmation |
| Error | `#EF4444` | Error states |

### Typography
- **Headings**: Inter (Google Fonts) — Bold, tracking tight
- **Body**: Inter — Regular/Medium
- **Mono**: JetBrains Mono — For hashtag display

### Animations
- Page load: Staggered fade-up (opacity 0→1, translateY 20px→0, 400ms ease-out, 100ms stagger)
- Button hover: Scale 1.02, shadow lift
- Generate: Pulse animation on button while loading
- Result card: Fade-in + slight scale (0.95→1)
- Copy: Checkmark icon swap, success color flash

## 7. Technical Decisions

### Framework: Next.js 16 (App Router)
- API routes built-in — no separate backend needed
- Server components for static sections
- Client components for interactive generator
- Single codebase, easy deployment

### AI: OpusCode API (Claude Sonnet 4.6)
- Anthropic-compatible API via OpusCode gateway
- High-quality Claude model for nuanced, creative content generation
- Base URL: `https://claude.opuscode.pro`
- Endpoint: `POST /api/v1/messages`

### Styling: Tailwind CSS v4
- Rapid UI development
- Consistent spacing/typography system
- Dark mode by default

### Deployment: Vercel
- Zero-config Next.js deployment
- Free tier sufficient for hackathon demo
- Edge network for fast global access

## 8. API Design

### `POST /api/generate/hook`
```json
Request:  { "topic": "string", "platform": "instagram|youtube|tiktok", "tone": "string" }
Response: { "hooks": ["hook1", "hook2", "hook3"] }
```

### `POST /api/generate/caption`
```json
Request:  { "topic": "string", "platform": "string", "tone": "string", "hook": "string?" }
Response: { "caption": "string" }
```

### `POST /api/generate/hashtags`
```json
Request:  { "topic": "string", "platform": "string", "count": 20 }
Response: { "hashtags": ["#tag1", "#tag2", ...] }
```

### `POST /api/generate/script`
```json
Request:  { "topic": "string", "platform": "string", "duration": "short|long", "tone": "string" }
Response: { "script": "string" }
```

## 9. Success Metrics (Hackathon Demo)

- All 4 generators produce coherent, usable output
- UI loads in < 2 seconds
- AI response in < 5 seconds
- Zero dead UI elements
- Judges can test every feature in under 2 minutes

## 10. Scope for MVP

### In Scope
- All 4 core features (hook, caption, hashtags, script)
- Platform selection (Instagram, YouTube, TikTok)
- Tone selection
- Copy to clipboard
- Responsive mobile design
- Polished dark UI

### Out of Scope (Post-Hackathon)
- User accounts / auth
- Save to library / history
- Multiple output variations toggle
- Platform-specific analytics
- Content scheduling
- Image generation
- Custom brand voice training
