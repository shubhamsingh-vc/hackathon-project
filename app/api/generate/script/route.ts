import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

const INSTRUCTIONS = `IMPORTANT: Follow this EXACT output format. No preamble. No explanation. No markdown. Just the script.`;

/**
 * SCRIPT format — always this structure:
 * HOOK:
 * [first 2-3 lines the presenter says — punchy, attention-grabbing]
 * BODY:
 * [main content lines — the value, story, or explanation, 5-10 lines]
 * CTA:
 * [call to action — tell viewers to like, comment, follow, or take action]
 *
 * Optional: [0:00] timestamp on its own line before each section
 * Optional: [SCENE: description] for visual/set cues on its own line
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, platform, duration = "short", tone, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const formatMap: Record<string, { lines: string; time: string; style: string }> = {
      short: {
        lines: "5-10 total script lines",
        time: "15-60 seconds",
        style: "fast-paced, high energy, punchy delivery",
      },
      long: {
        lines: "12-20 total script lines",
        time: "3-5 minutes",
        style: "detailed, structured, conversational flow",
      },
    };

    const platformTips: Record<string, string> = {
      instagram: "Instagram Reels — hook in first 1-3 seconds, end with a question or CTA",
      youtube: "YouTube — strong intro hook, build value in body, clear outro CTA",
      tiktok: "TikTok — conversational, punchy, conversational energy, ends with engagement prompt",
    };

    const profileContext = buildCreatorContext(creatorProfile);
    const format = formatMap[duration] || formatMap.short;

    const prompt = `${INSTRUCTIONS}

You are a video script writer. Write a ${tone || "engaging"} script for ${platform} about "${topic}".
${profileContext}

Duration: ~${format.time}, ${format.lines}.
${platformTips[platform] || platform}

Output format — output ONLY the script, nothing else. Use this EXACT structure:

[0:00]
HOOK:
[Write 2-3 punchy lines the presenter says to hook the viewer immediately. These are the first words out of their mouth. Bold, curiosity-driven, or shocking.]

[0:05]
BODY:
[Write 5-10 lines of main content. Each line is one thing to say — a sentence or short paragraph. Conversational, natural, like talking to a friend. Include specific details, examples, or story beats. Keep momentum.]

[0:30]
CTA:
[Write 2-3 lines that tell viewers what to do next. Like, comment, follow, share, visit link in bio — pick the best CTA for the platform.]

Rules:
- Do NOT use asterisks, bold markers, or markdown
- Do NOT add camera directions like "CUT TO:" or "B-ROLL:"
- Each section (HOOK/BODY/CTA) starts with its label on its own line
- Timestamps like [0:00] are on their own line before the section they introduce
- SCENE cues in [SCENE: description] format on their own line — only if setting context matters
- Keep each spoken line to 1-3 sentences max
- Body lines read like natural speech — not bullet points, not a list
- No preamble like "Here's a script:" or "Script:"
- Output ONLY the script content
- Make every spoken line genuinely interesting and worth saying`;

    const maxTokens = duration === "long" ? 800 : 500;
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
