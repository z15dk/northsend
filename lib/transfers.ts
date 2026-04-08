import { randomUUID } from "node:crypto";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPlanDefinition, type PlanCode } from "@/lib/plans";
import {
  createMultipartUpload,
  createSignedUploadPartUrl,
  createSignedUploadUrl,
} from "@/lib/storage";

const MULTIPART_THRESHOLD_BYTES = 100 * 1024 * 1024;
const MULTIPART_CHUNK_SIZE_BYTES = 25 * 1024 * 1024;

export type TransferFileInput = {
  name: string;
  size: number;
  type: string;
};

export type TransferUploadDescriptor =
  | {
      mode: "single";
      index: number;
      fileId: string;
      name: string;
      uploadUrl: string;
      contentType: string;
    }
  | {
      mode: "multipart";
      index: number;
      fileId: string;
      name: string;
      contentType: string;
      uploadId: string;
      chunkSize: number;
      parts: Array<{
        partNumber: number;
        size: number;
        uploadUrl: string;
      }>;
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
    transfer.files.map(async (file, index): Promise<TransferUploadDescriptor> => {
      const contentType = file.mimeType || "application/octet-stream";
      const fileSize = Number(file.sizeBytes);

      if (fileSize < MULTIPART_THRESHOLD_BYTES) {
        return {
          mode: "single",
          index,
          fileId: file.id,
          name: file.originalName,
          uploadUrl: await createSignedUploadUrl({
            key: file.storageKey,
            contentType,
          }),
          contentType,
        };
      }

      const uploadId = await createMultipartUpload({
        key: file.storageKey,
        contentType,
      });
      const partCount = Math.ceil(fileSize / MULTIPART_CHUNK_SIZE_BYTES);
      const parts = await Promise.all(
        Array.from({ length: partCount }, async (_, partIndex) => {
          const partNumber = partIndex + 1;
          const start = partIndex * MULTIPART_CHUNK_SIZE_BYTES;
          const end = Math.min(start + MULTIPART_CHUNK_SIZE_BYTES, fileSize);

          return {
            partNumber,
            size: end - start,
            uploadUrl: await createSignedUploadPartUrl({
              key: file.storageKey,
              uploadId,
              partNumber,
            }),
          };
        }),
      );

      return {
        mode: "multipart",
        index,
        fileId: file.id,
        name: file.originalName,
        contentType,
        uploadId,
        chunkSize: MULTIPART_CHUNK_SIZE_BYTES,
        parts,
      };
    }),
  );

  return {
    transferId: transfer.id,
    downloadToken: transfer.downloadToken,
    expiresAt: transfer.expiresAt.toISOString(),
    uploads,
  };
}
