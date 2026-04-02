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

    const platformDescriptions: Record<string, string> = {
      instagram: "Instagram Reels/Feed — stop the scroll in 1-3 seconds",
      youtube: "YouTube Shorts — compelling hook in first 5 seconds",
      tiktok: "TikTok — immediate attention-grabber, conversational and trendy",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    // Strict prompt: output exactly 5 hooks, one per line, no prefix
    const prompt = `You are a viral content expert. Generate exactly 5 opening hooks for ${platform} about "${topic}".
${profileContext}
Platform context: ${platformDescriptions[platform] || platform}
Tone: ${tone || "engaging"}

Output rules — FOLLOW EXACTLY:
- Output exactly 5 lines
- Each line is ONE hook, 1-3 sentences max
- NO numbers, NO bullets, NO hashtags, NO preamble
- Vary the style: (1) bold claim, (2) question, (3) stat/fact, (4) story snippet, (5) contrarian take
- Line 1: bold claim or shocking statement
- Line 2: question that creates curiosity
- Line 3: stat or surprising fact (include a number)
- Line 4: short story opener ("I did X and Y happened...")
- Line 5: contrarian or unexpected take
- Do NOT add any explanation, labels, or extra text

Output ONLY the 5 hooks, one per line.`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 250);
    const hooksText = extractText(response);

    if (!hooksText.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    // Normalize: strip any leading numbers/bullets, trim each line
    const hooks = hooksText
      .split("\n")
      .map((line) => line.replace(/^[#*\-–—•\d.)\]]+\s*/, "").trim())
      .filter((line) => line.length > 5); // drop very short/empty lines

    if (hooks.length === 0) {
      throw new Error("Could not parse hooks. Please try again.");
    }

    return NextResponse.json({ hooks });
  } catch (error) {
    console.error("Hook generation error:", error);
    return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 });
  }
}
