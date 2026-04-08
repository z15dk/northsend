import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSignedDownloadUrl } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const url = new URL(request.url);
  const fileId = url.searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({ error: "fileId is required." }, { status: 400 });
  }

  const transfer = await prisma.transfer.findUnique({
    where: { downloadToken: token },
    include: {
      files: true,
    },
  });

  if (!transfer || transfer.status !== "AVAILABLE") {
    return NextResponse.json({ error: "Transfer not found." }, { status: 404 });
  }

  if (transfer.expiresAt < new Date()) {
    return NextResponse.json({ error: "Transfer expired." }, { status: 410 });
  }

  const file = transfer.files.find((item) => item.id === fileId);

  if (!file) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const downloadUrl = await createSignedDownloadUrl(file.storageKey);

  await prisma.transfer.update({
    where: { id: transfer.id },
    data: {
      downloadCount: {
        increment: 1,
      },
      events: {
        create: {
          eventType: "DOWNLOADED",
          userAgent: request.headers.get("user-agent") ?? undefined,
          ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
        },
      },
    },
  });

  return NextResponse.json({
    url: downloadUrl,
    name: file.originalName,
  });
}
