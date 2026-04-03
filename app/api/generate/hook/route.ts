import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformContext: Record<string, string> = {
      instagram: "Instagram Reels/Feed — stop the scroll in 1-3 seconds",
      youtube: "YouTube Shorts — hook in first 5 seconds, earns the click",
      tiktok: "TikTok — immediate attention grab, conversational and trendy",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `Write 3 viral opening hooks for ${platform} about "${topic}".
${profileContext}

Tone: ${tone || "engaging"}.
Platform: ${platformContext[platform] || platform}

Rules:
- Each hook is 1-3 punchy lines
- Vary the style: question, bold claim, stat, pattern interrupt
- Number each hook 1-3
- No hashtags, no markdown
- No preamble, output only the hooks

Format:
1. [hook]
2. [hook]
3. [hook]`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 200);
    const hooksText = extractText(response);

    if (!hooksText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    const hooks = hooksText
      .split("\n")
      .map((line: string) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(Boolean)
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
