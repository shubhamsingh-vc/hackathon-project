import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import createConnection from "@/lib/db";
import SavedContent from "@/models/SavedContent";

// GET /api/saved — list all saved content for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await createConnection();
    const items = await SavedContent.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const serialized = items.map((item) => ({
      _id: item._id.toString(),
      userId: item.userId.toString(),
      type: item.type,
      platform: item.platform,
      tone: item.tone,
      topic: item.topic,
      content: item.content,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({ items: serialized });
  } catch (error) {
    console.error("GET /api/saved error:", error);
    return NextResponse.json({ error: "Failed to fetch saved content" }, { status: 500 });
  }
}

// POST /api/saved — save new content
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, platform, tone, topic, content } = await req.json();

    if (!type || !platform || !tone || !topic || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await createConnection();
    const item = await SavedContent.create({
      userId: session.user.id,
      type,
      platform,
      tone,
      topic,
      content,
    });

    return NextResponse.json({
      item: {
        _id: item._id.toString(),
        userId: item.userId.toString(),
        type: item.type,
        platform: item.platform,
        tone: item.tone,
        topic: item.topic,
        content: item.content,
        createdAt: item.createdAt,
      },
    });
  } catch (error) {
    console.error("POST /api/saved error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
