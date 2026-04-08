import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { completeMultipartUpload } from "@/lib/storage";

type CompleteTransferBody = {
  uploads?: Array<
    | {
        fileId?: string;
        mode?: "single";
      }
    | {
        fileId?: string;
        mode?: "multipart";
        uploadId?: string;
        parts?: Array<{
          partNumber?: number;
          etag?: string;
        }>;
      }
  >;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as CompleteTransferBody;
    const uploads = body.uploads ?? [];

    if (!uploads.length) {
      return NextResponse.json({ error: "No uploaded files were provided." }, { status: 400 });
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!transfer) {
      return NextResponse.json({ error: "Transfer not found." }, { status: 404 });
    }

    const uploadsByFileId = new Map(uploads.map((upload) => [upload.fileId, upload]));
    const allUploaded = transfer.files.every((file) => uploadsByFileId.has(file.id));

    if (!allUploaded) {
      return NextResponse.json(
        { error: "All transfer files must be uploaded before completion." },
        { status: 400 },
      );
    }

    for (const file of transfer.files) {
      const upload = uploadsByFileId.get(file.id);

      if (!upload) {
        throw new Error(`Missing upload data for ${file.originalName}.`);
      }

      if (upload.mode === "multipart") {
        const parts = (upload.parts ?? [])
          .map((part) => ({
            partNumber: Number(part.partNumber ?? 0),
            etag: String(part.etag ?? "").trim(),
          }))
          .filter((part) => part.partNumber > 0 && part.etag);

        if (!upload.uploadId || parts.length === 0) {
          throw new Error(`Multipart upload data is incomplete for ${file.originalName}.`);
        }

        await completeMultipartUpload({
          key: file.storageKey,
          uploadId: upload.uploadId,
          parts,
        });
      }
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
