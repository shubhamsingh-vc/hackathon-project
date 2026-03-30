import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformDescriptions: Record<string, string> = {
      instagram: "Instagram Reels/Feed — needs to stop the scroll in the first 1-3 seconds",
      youtube: "YouTube Shorts — needs a compelling hook in the first 5 seconds",
      tiktok: "TikTok — needs an immediate attention-grabber, conversational and trendy",
    };

    const prompt = `You are a viral content expert. Generate 3 compelling opening hooks for ${platform} about "${topic}".
The hook should be ${tone || "engaging"} in tone.
Platform context: ${platformDescriptions[platform] || platform}

Rules:
- Each hook should be 1-2 lines max
- Make them punchy, specific, and curiosity-driven
- Vary the hook styles (e.g., question, bold claim, story opener, stat)
- Number each hook 1-3
- Do NOT use hashtags in the hooks
- Do NOT add any preamble or explanation

Output format (just the hooks, nothing else):
1. [hook text]
2. [hook text]
3. [hook text]`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 400);
    const hooksText = extractText(response);

    if (!hooksText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    const hooks = hooksText
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    if (hooks.length === 0) {
      throw new Error("Could not parse hooks. Please try again.");
    }

    return NextResponse.json({ hooks });
  } catch (error) {
    console.error("Hook generation error:", error);
    return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 });
  }
}
