import { randomUUID } from "node:crypto";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPlanDefinition, type PlanCode } from "@/lib/plans";
import { createSignedUploadUrl } from "@/lib/storage";

export type TransferFileInput = {
  name: string;
  size: number;
  type: string;
};

export async function createTransferWithUploads({
  user,
  files,
}: {
  user: Pick<User, "id" | "planCode"> | null;
  files: TransferFileInput[];
}) {
  const planCode = (user?.planCode ?? "guest") as PlanCode;
  const plan = getPlanDefinition(planCode);
  const totalSizeBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (!files.length) {
    throw new Error("Choose one or more files.");
  }

  if (totalSizeBytes > plan.uploadLimitBytes) {
    throw new Error(`Transfer exceeds the ${plan.name} limit of ${plan.uploadLimitBytes} bytes.`);
  }

  const expiresAt = new Date(Date.now() + plan.retentionHours * 60 * 60 * 1000);
  const downloadToken = randomUUID();

  const transfer = await prisma.transfer.create({
    data: {
      userId: user?.id ?? null,
      planSnapshot: plan.code,
      status: "UPLOADING",
      downloadToken,
      totalSizeBytes: BigInt(totalSizeBytes),
      fileCount: files.length,
      expiresAt,
      files: {
        create: files.map((file) => ({
          originalName: file.name,
          storageKey: `transfers/${downloadToken}/${randomUUID()}-${file.name}`,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: BigInt(file.size),
        })),
      },
      events: {
        create: {
          eventType: "CREATED",
        },
      },
    },
    include: {
      files: true,
    },
  });

  const uploads = await Promise.all(
    transfer.files.map(async (file, index) => ({
      index,
      fileId: file.id,
      name: file.originalName,
      uploadUrl: await createSignedUploadUrl({
        key: file.storageKey,
        contentType: file.mimeType || "application/octet-stream",
      }),
      contentType: file.mimeType || "application/octet-stream",
    })),
  );

  return {
    transferId: transfer.id,
    downloadToken: transfer.downloadToken,
    expiresAt: transfer.expiresAt.toISOString(),
    uploads,
  };
}
