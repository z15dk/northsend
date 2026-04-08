import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CompleteTransferBody = {
  uploadedFileIds?: string[];
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as CompleteTransferBody;
    const uploadedFileIds = body.uploadedFileIds ?? [];

    if (!uploadedFileIds.length) {
      return NextResponse.json({ error: "No uploaded files were provided." }, { status: 400 });
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!transfer) {
      return NextResponse.json({ error: "Transfer not found." }, { status: 404 });
    }

    const allUploaded = transfer.files.every((file) => uploadedFileIds.includes(file.id));

    if (!allUploaded) {
      return NextResponse.json(
        { error: "All transfer files must be uploaded before completion." },
        { status: 400 },
      );
    }

    const updatedTransfer = await prisma.transfer.update({
      where: { id },
      data: {
        status: "AVAILABLE",
        events: {
          create: {
            eventType: "CREATED",
          },
        },
      },
      select: {
        id: true,
        downloadToken: true,
      },
    });

    return NextResponse.json({
      transferId: updatedTransfer.id,
      downloadToken: updatedTransfer.downloadToken,
      downloadPath: `/download/${updatedTransfer.downloadToken}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete transfer.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
