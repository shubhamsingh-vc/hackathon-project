import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone, hook, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformLengths: Record<string, string> = {
      instagram: "150-220 characters (caption length)",
      youtube: "50-100 characters (Shorts description)",
      tiktok: "100-180 characters (caption with emojis)",
    };

    const hookContext = hook ? `Reference this opening hook: "${hook}"` : "";
    const profileContext = buildCreatorContext(creatorProfile);

    // Strict prompt: plain paragraph, no markdown, no hashtags
    const prompt = `Write a ${tone || "engaging"} caption for ${platform} about "${topic}".
${hookContext}
${profileContext}
Length: ${platformLengths[platform] || "150-220 characters"}

Output rules — FOLLOW EXACTLY:
- Write exactly 2-3 short paragraphs or line blocks
- Block 1: Opening hook line (attention-grabbing first line)
- Block 2: Body — 1-2 lines of value or story
- Block 3: CTA — call to action or question
- NO hashtags, NO markdown formatting, NO bullet points
- Use 1-2 relevant emojis naturally placed
- No preamble, no labels, no explanation
- Output only the caption text`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 300);
    const caption = extractText(response);

    if (!caption.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    // Normalize: strip any hashtags that slipped through
    const normalized = caption
      .split("\n")
      .map((line) => line.replace(/#\w+/g, "").trim())
      .filter(Boolean)
      .join("\n");

    return NextResponse.json({ caption: normalized.trim() });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 });
  }
}
