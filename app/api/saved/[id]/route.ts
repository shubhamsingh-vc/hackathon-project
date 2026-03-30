import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import createConnection from "@/lib/db";
import SavedContent from "@/models/SavedContent";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/saved/[id] — delete saved content
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await createConnection();
    const item = await SavedContent.findById(id);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (item.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await item.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/saved/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
