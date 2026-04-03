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

    const hookContext = hook ? `Opening hook to reference: "${hook}"` : "";
    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `Write a ${tone || "engaging"} caption for ${platform} about "${topic}".
${hookContext}
${profileContext}

Rules:
- Start with an emoji or visual opener on the first line
- Hook the reader in the first 2 lines
- Body content: value, story, or context
- End with a clear call to action
- Strategic line breaks for pacing
- No hashtags, no markdown
- Output only the caption`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 300);
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
