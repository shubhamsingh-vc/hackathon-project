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

    const formatMap: Record<string, { lines: string; time: string; style: string; minLines: number; secPerLine: number }> = {
      short: {
        lines: "8-12 lines",
        time: "15-60 seconds",
        style: "fast-paced, high energy",
        minLines: 8,
        secPerLine: 4,
      },
      long: {
        lines: "30-50 lines",
        time: "3-10 minutes",
        style: "detailed, structured, and in-depth",
        minLines: 30,
        secPerLine: 6,
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
Format: AT LEAST ${format.minLines} lines of actual spoken script content, ~${format.time}.
Each line should be ${format.secPerLine}-${format.secPerLine + 3} seconds of speech (~${Math.round(format.secPerLine * 2.5)} words max per line).
${platformTips[platform] || platform}
Structure: HOOK → BODY → CTA.
[SCENE] cues in brackets. Timestamps [0:00]. Conversational, natural language.
Write full sentences, not bullet points. This is what the creator will READ OFF CAMERA.
No camera directions. No preamble. Output ONLY the script — no labels, no explanations.
CRITICAL: Do NOT use any markdown formatting (no **bold**, no *italic*, no ## headings). Plain text only.`;

    const maxTokens = duration === "long" ? 2000 : 400;
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
