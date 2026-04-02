import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import createConnection from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await createConnection();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      creatorProfile: user.creatorProfile || {
        niche: "",
        targetAudience: "",
        goals: [],
      },
    });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { creatorProfile } = await req.json();

    await createConnection();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.creatorProfile = {
      niche: creatorProfile?.niche || "",
      targetAudience: creatorProfile?.targetAudience || "",
      goals: creatorProfile?.goals || [],
    };
    await user.save();

    return NextResponse.json({ success: true, creatorProfile: user.creatorProfile });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
