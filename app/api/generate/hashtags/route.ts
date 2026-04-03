import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

const INSTRUCTIONS = `IMPORTANT: Follow this EXACT output format. No preamble. No explanation. No markdown. Just the hashtags.`;

/**
 * HASHTAGS format — always space-separated single line:
 * #tag1 #tag2 #tag3 #tag4...
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, platform, count = 20, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformContext: Record<string, string> = {
      instagram: "Instagram — up to 30 hashtags, mix of broad reach and niche-specific",
      youtube: "YouTube Shorts — 5-10 targeted tags, topic-focused",
      tiktok: "TikTok — 3-5 viral tags plus 5-8 niche tags",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `${INSTRUCTIONS}

You are a hashtag strategist. Generate exactly ${count} relevant hashtags for ${platform} content about "${topic}".
${profileContext}
Platform: ${platformContext[platform] || platform}

Output format — output ONLY hashtags, nothing else:
#tag1 #tag2 #tag3 #tag4...

Rules:
- Mix of 20% trending/viral tags (#fyp #foryou #viral) and 80% topic-specific tags
- Each hashtag starts with #
- All tags are space-separated on ONE single line
- No commas, no line breaks between tags
- No preamble text like "Here are the hashtags:"
- No explanations or labels
- Tags should be specific to the topic, not generic
- Include 2-3 evergreen tags for the platform
- Output ONLY the hashtags on one line

Example correct output:
#fitness #fitnessmotivation #workout #gym #fit #healthylifestyle #foryou #viral #gains #losingweight

Output your hashtags now (one line, space-separated, nothing else):`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 150);
    const rawText = extractText(response);

    if (!rawText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    // Parse: extract all #hashtags from any format (multi-line, comma-separated, etc.)
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
