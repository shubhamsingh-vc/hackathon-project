import { NextRequest, NextResponse } from "next/server";
import { createMessage, extractText } from "@/lib/opuscode";
import { buildCreatorContext } from "@/lib/creatorContext";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone, hook, creatorProfile } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Topic and platform are required" }, { status: 400 });
    }

    const platformLengths: Record<string, string> = {
      instagram: "150-300 characters (caption length)",
      youtube: "50-100 characters (Shorts description)",
      tiktok: "100-200 characters (caption with emojis)",
    };

    const hookContext = hook ? `Opening hook to reference: "${hook}"` : "";
    const profileContext = buildCreatorContext(creatorProfile);

    const prompt = `Write a ${tone || "engaging"} caption for ${platform} about "${topic}".
${hookContext}
${profileContext}
Platform: ${platformLengths[platform] || platform}
Rules: ${tone ? `Use ${tone} tone. ` : ""}1-2 line breaks. End with a CTA. Strategic emojis. No hashtags. No preamble. Output only caption.`;

    const response = await createMessage(MODEL, [{ role: "user", content: prompt }], 300);
    const caption = extractText(response);

    if (!caption.trim()) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 });
  }
}
