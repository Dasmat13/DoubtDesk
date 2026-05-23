import { db } from "@/configs/db";
import { repliesTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { parseAndValidateRequest } from "@/lib/validations/validate";
import { updateReplyActionSchema } from "@/lib/validations/reply";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { errorResponse, data } = await parseAndValidateRequest(req, updateReplyActionSchema);
        if (errorResponse) return errorResponse;

        const { content, imageUrl } = data;
        const { id } = await params;
        const replyId = parseInt(id);

        if (isNaN(replyId)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const updateData: any = {};
        if (content !== undefined) updateData.content = content;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        const updated = await db.update(repliesTable)
            .set(updateData)
            .where(eq(repliesTable.id, replyId))
            .returning();

        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error("Error updating reply:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const replyId = parseInt(id);

        if (isNaN(replyId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        await db.delete(repliesTable).where(eq(repliesTable.id, replyId));
        return NextResponse.json({ message: "Reply deleted successfully" });
    } catch (error) {
        console.error("Error deleting reply:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
