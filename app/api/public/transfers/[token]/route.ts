import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const transfer = await prisma.transfer.findUnique({
    where: { downloadToken: token },
    include: {
      files: {
        select: {
          id: true,
          originalName: true,
          sizeBytes: true,
          mimeType: true,
        },
      },
    },
  });

  if (!transfer || transfer.status !== "AVAILABLE") {
    return NextResponse.json({ error: "Transfer not found." }, { status: 404 });
  }

  if (transfer.expiresAt < new Date()) {
    return NextResponse.json({ error: "Transfer expired." }, { status: 410 });
  }

  return NextResponse.json({
    id: transfer.id,
    token: transfer.downloadToken,
    expiresAt: transfer.expiresAt.toISOString(),
    totalSizeBytes: transfer.totalSizeBytes.toString(),
    fileCount: transfer.fileCount,
    files: transfer.files.map((file) => ({
      id: file.id,
      name: file.originalName,
      sizeBytes: file.sizeBytes.toString(),
      mimeType: file.mimeType,
    })),
  });
}
