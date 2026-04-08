import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function getStorageBucket() {
  return getRequiredEnv("R2_BUCKET");
}

function getStorageClient() {
  const accountId = getRequiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function createSignedUploadUrl({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: getStorageBucket(),
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(getStorageClient(), command, { expiresIn: 60 * 10 });
}

export async function createSignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: getStorageBucket(),
    Key: key,
  });

  return getSignedUrl(getStorageClient(), command, { expiresIn: 60 * 10 });
}
