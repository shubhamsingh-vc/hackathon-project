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
      instagram: "Instagram — mix of broad reach (#fitness) and niche (#fitnessmotivation2024), up to 30 hashtags",
      youtube: "YouTube — fewer, more targeted tags (YouTube Shorts style: #shorts #topic #niche)",
      tiktok: "TikTok — trendy, platform-specific, mix of viral tags (#fyp #foryou) and niche",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `You are a social media hashtag strategist. Generate ${count} relevant hashtags for ${platform} content about: "${topic}".
${profileContext}

Platform context: ${platformContext[platform] || platform}

Rules:
- Mix of popular (#fitness) and niche (#morningroutine2024) tags
- Include 2-3 trending/evergreen tags for the platform
- Hashtags should be specific to the topic, not generic
- Format as space-separated hashtags: #tag1 #tag2 #tag3
- Do NOT add any explanation or preamble
- Return ONLY the hashtags

Output format (just hashtags, nothing else):
#tag1 #tag2 #tag3...`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 300);
    const rawText = extractText(response);

    if (!rawText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    const hashtags = rawText
      .split(/[\s,]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.startsWith("#"));

    if (hashtags.length === 0) {
      throw new Error("Could not parse hashtags. Please try again.");
    }

    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return NextResponse.json({ error: "Failed to generate hashtags" }, { status: 500 });
  }
}
