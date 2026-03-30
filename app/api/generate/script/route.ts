import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, duration = "short", tone } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const formatMap: Record<string, { lines: string; time: string; style: string }> = {
      short: {
        lines: "8-15 lines",
        time: "15-60 seconds",
        style: "Fast-paced, high energy, every second counts",
      },
      long: {
        lines: "20-40 lines",
        time: "3-10 minutes",
        style: "Detailed, structured with clear sections",
      },
    };

    const format = formatMap[duration] || formatMap.short;

    const platformTips: Record<string, string> = {
      instagram: "Instagram Reels — fast cuts, hook-first, end with a question",
      youtube: "YouTube — intro hook, body with value, outro CTA, SEO-friendly",
      tiktok: "TikTok — conversational, self-aware, trending sounds reference, punchy ending",
    };

    const prompt = `You are a professional video script writer. Write a ${format.style} video script for ${platform} about: "${topic}".

Script format: ${format.lines}
Estimated duration: ${format.time}
Tone: ${tone || "engaging"}
Platform: ${platformTips[platform] || platform}

Rules:
- Structure: HOOK (first 2-3 lines) → BODY → CTA (last 1-2 lines)
- Use [SCENE] or [CUT TO] for visual/action cues in brackets
- For the HOOK: Start with something that makes people stop scrolling
- For the BODY: Deliver value, keep it conversational (write like you speak)
- For the CTA: Ask a question or tell them what to do next
- Mark timestamps for short-form: [0:00] [0:05] etc.
- Do NOT write camera directions, just simple scene cues
- Do NOT add any preamble or "Here's a script:"

Output only the script, nothing else.`;

    const maxTokens = duration === "long" ? 1500 : 800;
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
