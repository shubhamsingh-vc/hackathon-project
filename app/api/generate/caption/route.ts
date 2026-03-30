import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone, hook } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformLengths: Record<string, string> = {
      instagram: "150-300 characters (caption length)",
      youtube: "50-100 characters (Shorts description)",
      tiktok: "100-200 characters (caption with emojis)",
    };

    const hookContext = hook ? `Opening hook to reference: "${hook}"` : "";

    const prompt = `You are a social media caption expert. Write a captivating ${tone || "engaging"} caption for ${platform} about: "${topic}".
${hookContext}

Platform context: ${platformLengths[platform] || platform}

Rules:
- ${tone ? `Use a ${tone} tone throughout` : "Be engaging and relatable"}
- Include 1-2 line breaks for readability
- End with a natural call-to-action that encourages engagement
- Use strategic emoji placement (not overdone)
- For Instagram: leave 2-3 cliffhanger dots "..." at the end if it fits
- For TikTok: make it punchy and match TikTok's casual voice
- Do NOT include hashtags in the caption itself
- Do NOT add any preamble

Output only the caption, nothing else.`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 500);
    const caption = extractText(response);

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 });
  }
}
