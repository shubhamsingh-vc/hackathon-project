import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

const INSTRUCTIONS = `IMPORTANT: Follow this EXACT output format. No preamble. No explanation. No markdown. No hashtags. Just the content formatted exactly as shown below.`;

/**
 * CAPTION format — always this structure:
 * [emoji or visual opener — one line]
 * [hook/opening line — captures attention, 1-2 lines]
 * [body content — value, story, or context, 2-4 lines]
 * [call to action — clear next step, 1-2 lines]
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone, hook, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformContext: Record<string, string> = {
      instagram: "Instagram — scroll-stopping opener, aesthetic feel, relatable body, strong CTA",
      youtube: "YouTube Shorts — ultra-short, punchy, no filler, ends with a question or challenge",
      tiktok: "TikTok — conversational, trendy language, hooks hard, ends with engagement prompt",
    };

    const hookContext = hook ? `Reference this opening hook: "${hook}". Incorporate it naturally into the caption.` : "";
    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `${INSTRUCTIONS}

You are a social media caption writer. Write a caption for ${platform} about "${topic}".

Tone: ${tone || "engaging"} and authentic.
${hookContext}
${profileContext}

Platform context: ${platformContext[platform] || platform}

Output format — output ONLY the caption, nothing else. Use this exact structure:

[Line 1 — emoji or visual opener, 1-3 words, no explanation needed]
[Line 2-3 — opening hook, grabs attention immediately]
[Line 4-7 — body content, provide value or tell a micro-story, 2-4 short sentences]
[Line 8-9 — call to action, tell the reader what to do next]

Rules:
- No hashtags, no @mentions, no markdown, no asterisks
- No preamble like "Here's a caption:"
- Each line is a separate paragraph (blank line between sections)
- Total: 4-9 lines max
- Keep it readable — short punchy sentences
- Use strategic line breaks for pacing
- First line should hook instantly
- Last lines should drive action (comment, save, share, follow)
- Output ONLY the caption text`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 400);
    const caption = extractText(response);

    if (!caption.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 });
  }
}
