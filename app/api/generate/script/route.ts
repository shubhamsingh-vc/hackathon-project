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
        lines: "6-8 short lines",
        time: "15-60 seconds",
        style: "fast-paced, punchy, high energy",
      },
      long: {
        lines: "15-20 lines",
        time: "3-5 minutes",
        style: "detailed, structured, smooth pacing",
      },
    };

    const format = formatMap[duration] || formatMap.short;

    const platformTips: Record<string, string> = {
      instagram: "Instagram Reels — hook-first, end with question",
      youtube: "YouTube Shorts — hook, value, CTA",
      tiktok: "TikTok — conversational, punchy, trendy",
    };

    const profileContext = buildCreatorContext(creatorProfile);

    // Very strict script format
    const prompt = `Write a ${format.style} ${tone || "engaging"} video script for ${platform} about "${topic}".
${profileContext}
Duration: ${format.time} (${format.lines})
${platformTips[platform] || ""}

Output format — FOLLOW EXACTLY, no deviations:

[HOOK]
(first 3 seconds — bold statement or question to grab attention)
[0:00]

[BODY]
(short punchy lines of what you say on camera)
(use [0:05] [0:15] [0:30] timestamps for timing)

[CTA]
(final 3 seconds — ask them to follow, comment, or share)

Rules:
- Use [HOOK], [BODY], [CTA] section labels exactly as shown
- Keep each BODY line to 1-2 sentences max
- Include 3-5 timestamps in [M:SS] format
- NO camera directions, NO scene descriptions, NO music notes
- Conversational — how you'd actually speak to camera
- NO preamble, NO explanation, NO "Here's a script:" text
- Output ONLY the script`;

    const maxTokens = duration === "long" ? 600 : 350;
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
