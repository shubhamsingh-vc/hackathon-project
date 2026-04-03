import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, duration = "short", tone, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const formatMap: Record<string, { lines: string; time: string; style: string }> = {
      short: {
        lines: "8-15 lines",
        time: "15-60 seconds",
        style: "fast-paced, high energy",
      },
      long: {
        lines: "20-30 lines",
        time: "3-10 minutes",
        style: "detailed and structured",
      },
    };

    const platformTips: Record<string, string> = {
      instagram: "Instagram Reels — hook-first, end with question",
      youtube: "YouTube — intro hook, value body, outro CTA",
      tiktok: "TikTok — conversational, punchy ending",
    };

    const profileContext = buildCreatorContext(creatorProfile);
    const format = formatMap[duration] || formatMap.short;

    const prompt = `Write a ${format.style} ${tone || "engaging"} video script for ${platform} about "${topic}".
${profileContext}
Format: ${format.lines}, ~${format.time}.
${platformTips[platform] || platform}
Structure: HOOK → BODY → CTA.
[SCENE] cues in brackets. Timestamps [0:00]. Conversational body.
No camera directions. No preamble. Output only script.
CRITICAL: Do NOT use any markdown formatting (no **bold**, no *italic*, no ## headings). Plain text only.`;

    const maxTokens = duration === "long" ? 800 : 400;
    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], maxTokens);
    const script = extractText(response);

    if (!script.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    return NextResponse.json({ script });
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  }
}
