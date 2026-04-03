import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, count = 20, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformContext: Record<string, string> = {
      instagram: "Instagram — up to 30 hashtags, broad reach + niche mix",
      youtube: "YouTube Shorts — 5-10 targeted tags",
      tiktok: "TikTok — 3-5 viral tags plus niche tags",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `Generate ${count} relevant hashtags for ${platform} content about "${topic}".
${profileContext}
Platform: ${platformContext[platform] || platform}

Rules:
- Mix of trending (#fyp #foryou #viral) and topic-specific tags
- Space-separated, start each with #
- No preamble, output only the hashtags`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 150);
    const rawText = extractText(response);

    if (!rawText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    const hashtags = rawText
      .split(/[\s,]+/)
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.startsWith("#"))
      .slice(0, count);

    if (hashtags.length === 0) {
      throw new Error("Could not parse hashtags. Please try again.");
    }

    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return NextResponse.json({ error: "Failed to generate hashtags" }, { status: 500 });
  }
}
