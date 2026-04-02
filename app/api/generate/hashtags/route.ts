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
      instagram: "Instagram — mix of broad reach and niche, max 30 hashtags",
      youtube: "YouTube — targeted tags for Shorts (#shorts style)",
      tiktok: "TikTok — trendy viral tags + niche",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    // Strict prompt: output exactly the count, space-separated hashtags
    const prompt = `Generate exactly ${count} relevant hashtags for ${platform} content about: "${topic}".
${profileContext}
Platform: ${platformContext[platform] || platform}

Output rules — FOLLOW EXACTLY:
- Output exactly ${count} hashtags, space-separated on ONE line
- Format: #tag1 #tag2 #tag3 (space-separated, NOT comma-separated)
- Mix: 8 popular tags (1M+ posts) + 7 medium niche tags + 5 ultra-specific tags
- For tiktok: include 2-3 trending tags like #fyp #foryoupage #viral
- For youtube: use #shorts as last tag
- NO explanation, NO labels, NO preamble, NO numbering
- Output ONLY the hashtags on one line`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 150);
    const rawText = extractText(response);

    if (!rawText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    // Normalize: extract only valid hashtags
    const hashtags = rawText
      .split(/[\s,\n]+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.startsWith("#") && tag.length > 1)
      .slice(0, 30); // cap at 30

    if (hashtags.length === 0) {
      throw new Error("Could not parse hashtags. Please try again.");
    }

    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return NextResponse.json({ error: "Failed to generate hashtags" }, { status: 500 });
  }
}
