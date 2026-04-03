import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

// Shared instruction injected into every prompt
const INSTRUCTIONS = `IMPORTANT: Follow this EXACT output format. No preamble. No explanation. No markdown. No hashtags. Just the content formatted exactly as shown below.`;

/**
 * HOOKS format — always 3 numbered lines:
 * 1. [opening hook — question or bold statement, 1-2 sentences, curiosity-driven]
 * 2. [stat or number hook — specific data or claim, 1-2 sentences]
 * 3. [pattern interrupt or story hook — unexpected angle, 1-2 sentences]
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformContext: Record<string, string> = {
      instagram: "Instagram Reels/Feed — stop the scroll in 1-3 seconds, visual-first thinking",
      youtube: "YouTube Shorts — hook in first 5 seconds, earns the click",
      tiktok: "TikTok — immediate attention grab, conversational, fast-paced",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `${INSTRUCTIONS}

You are a viral content strategist. Generate exactly 3 opening hooks for ${platform} about "${topic}".

Tone: ${tone || "engaging"} and compelling.

Platform context: ${platformContext[platform] || platform}
${profileContext}

Output format — output ONLY these 3 lines, nothing else:
1. [opening hook — a question or bold statement that makes people curious, 1-2 lines]
2. [stat hook — a specific number, percentage, or data point that shocks or impresses, 1-2 lines]
3. [pattern interrupt hook — an unexpected angle, contrast, or story opener that breaks the viewer's pattern, 1-2 lines]

Rules:
- Each hook is numbered 1. 2. 3. on its own line
- Each hook is 1-3 sentences max
- No hashtags, no emojis, no markdown
- No preamble text like "Here are 3 hooks:"
- Start each hook with a capital letter, end with a period or question mark
- Keep hooks between 20-80 characters each
- No camera directions or stage directions
- Output ONLY the 3 hooks in the exact numbered format`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 300);
    const hooksText = extractText(response);

    if (!hooksText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    // Parse: extract lines that start with "1.", "2.", "3." and strip the prefix
    const hooks = hooksText
      .split("\n")
      .map((line: string) => line.trim())
      .filter(Boolean)
      .map((line: string) => line.replace(/^\d+[\.\)]\s*/, ""))
      .filter((h: string) => h.length > 5)
      .slice(0, 3);

    if (hooks.length === 0) {
      throw new Error("Could not parse hooks. Please try again.");
    }

    return NextResponse.json({ hooks });
  } catch (error) {
    console.error("Hook generation error:", error);
    return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 });
  }
}
