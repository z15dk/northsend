"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { copy as i18nCopy, type Locale } from "@/lib/copy";
import { formatBytes } from "@/lib/plans";
import { cn } from "@/lib/utils";

type TransferUploaderProps = {
  currentPlanName: string;
  currentPlanLimit: string;
  currentRetention: string;
  locale: Locale;
  variant?: "hero" | "page";
  requiresAccount?: boolean;
};

function uploadFileWithProgress({
  url,
  contentType,
  file,
  fileName,
  onProgress,
}: {
  url: string;
  contentType: string;
  file: Blob;
  fileName: string;
  onProgress: (loadedBytes: number) => void;
}) {
  return new Promise<string | null>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("PUT", url);
    request.setRequestHeader("Content-Type", contentType);

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded);
      }
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress(file.size);
        resolve(request.getResponseHeader("ETag"));
        return;
      }

      reject(new Error(`Upload failed for ${fileName}.`));
    };

    request.onerror = () => reject(new Error(`Upload failed for ${fileName}.`));
    request.send(file);
  });
}

async function runWithConcurrency<T>({
  items,
  limit,
  worker,
}: {
  items: T[];
  limit: number;
  worker: (item: T) => Promise<void>;
}) {
  let currentIndex = 0;

  async function startNext() {
    const index = currentIndex;
    currentIndex += 1;

    if (index >= items.length) {
      return;
    }

    await worker(items[index]);
    await startNext();
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => startNext()));
}

export function TransferUploader({
  currentPlanName,
  currentPlanLimit,
  currentRetention,
  locale,
  variant = "page",
  requiresAccount = false,
}: TransferUploaderProps) {
  const copy = i18nCopy[locale].uploader;
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloadPath, setDownloadPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const totalSizeBytes = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  const totalSizeLabel = useMemo(() => formatBytes(totalSizeBytes), [totalSizeBytes]);
  const isHero = variant === "hero";
  const uploadPercent = totalSizeBytes > 0 ? Math.min(100, Math.round((uploadedBytes / totalSizeBytes) * 100)) : 0;
  const uploadedSizeLabel = useMemo(() => formatBytes(uploadedBytes), [uploadedBytes]);

  useEffect(() => {
    if (!isUploading) {
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) => {
        if (copy.uploadMessages.length <= 1) {
          return current;
        }

        let next = current;

        while (next === current) {
          next = Math.floor(Math.random() * copy.uploadMessages.length);
        }

        return next;
      });
    }, 3200);

    return () => window.clearInterval(interval);
  }, [copy.uploadMessages.length, isUploading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!files.length) {
      setError(copy.chooseBeforeContinue);
      setSuccess(null);
      setDownloadPath(null);
      return;
    }

    if (requiresAccount) {
      window.location.href = "/signup";
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setDownloadPath(null);
    setUploadedBytes(0);
    setMessageIndex(Math.floor(Math.random() * copy.uploadMessages.length));

    try {
      const createResponse = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
          })),
        }),
      });

      const createData = (await createResponse.json()) as
        | { error: string }
        | {
            transferId: string;
            uploads: Array<
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
                }
            >;
          };

      if (!createResponse.ok || !("uploads" in createData)) {
        throw new Error("error" in createData ? createData.error : "Failed to create transfer.");
      }

      const completedUploads: Array<
        | { fileId: string; mode: "single" }
        | {
            fileId: string;
            mode: "multipart";
            uploadId: string;
            parts: Array<{ partNumber: number; etag: string }>;
          }
      > = [];
      const progressByFile = new Map<string, number>();

      await runWithConcurrency({
        items: createData.uploads,
        limit: 3,
        worker: async (upload) => {
          const browserFile = files[upload.index];

          if (!browserFile) {
            throw new Error(`Missing local file for ${upload.name}.`);
          }

          if (upload.mode === "single") {
            await uploadFileWithProgress({
              url: upload.uploadUrl,
              contentType: upload.contentType,
              file: browserFile,
              fileName: upload.name,
              onProgress: (loadedBytes) => {
                progressByFile.set(upload.fileId, loadedBytes);

                const totalUploaded = Array.from(progressByFile.values()).reduce((sum, value) => sum + value, 0);
                setUploadedBytes(totalUploaded);
              },
            });

            completedUploads.push({ fileId: upload.fileId, mode: "single" });
            return;
          }

          const partProgress = new Map<number, number>();
          const completedParts: Array<{ partNumber: number; etag: string }> = [];

          await runWithConcurrency({
            items: upload.parts,
            limit: 4,
            worker: async (part) => {
              const start = (part.partNumber - 1) * upload.chunkSize;
              const end = Math.min(start + part.size, browserFile.size);
              const chunk = browserFile.slice(start, end, upload.contentType);

              const etag = await uploadFileWithProgress({
                url: part.uploadUrl,
                contentType: upload.contentType,
                file: chunk,
                fileName: `${upload.name} (part ${part.partNumber})`,
                onProgress: (loadedBytes) => {
                  partProgress.set(part.partNumber, loadedBytes);
                  progressByFile.set(
                    upload.fileId,
                    Array.from(partProgress.values()).reduce((sum, value) => sum + value, 0),
                  );

                  const totalUploaded = Array.from(progressByFile.values()).reduce((sum, value) => sum + value, 0);
                  setUploadedBytes(totalUploaded);
                },
              });

              if (!etag) {
                throw new Error(`Missing upload confirmation for ${upload.name} part ${part.partNumber}.`);
              }

              completedParts.push({
                partNumber: part.partNumber,
                etag,
              });
            },
          });

          completedUploads.push({
            fileId: upload.fileId,
            mode: "multipart",
            uploadId: upload.uploadId,
            parts: completedParts,
          });
        },
      });

      const completeResponse = await fetch(`/api/transfers/${createData.transferId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uploads: completedUploads }),
      });

      const completeData = (await completeResponse.json()) as
        | { error: string }
        | { downloadPath: string };

      if (!completeResponse.ok || !("downloadPath" in completeData)) {
        throw new Error("error" in completeData ? completeData.error : "Failed to finalize transfer.");
      }

      setSuccess(copy.uploadSuccess);
      setDownloadPath(completeData.downloadPath);
      setFiles([]);
      setUploadedBytes(totalSizeBytes);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/88 shadow-card",
        isHero ? "p-2.5 sm:p-4" : "p-4 sm:p-6",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#dfe9e4_0%,transparent_38%),radial-gradient(circle_at_bottom_right,#efe4d5_0%,transparent_34%)]" />
      <div
        className={cn(
          "relative rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(247,243,235,0.92)_100%)]",
          isHero ? "p-4 sm:p-6 md:p-8" : "p-4 sm:p-6",
        )}
      >
        {isHero ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pine text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:h-14 sm:w-14 sm:text-xs">
                {copy.send}
              </div>
            </div>

            <label
              htmlFor={`files-${variant}`}
              className="block cursor-pointer rounded-[1.6rem] border border-dashed border-pine/25 bg-white/82 px-4 py-5 transition hover:border-pine/35 hover:bg-white sm:rounded-[2rem] sm:px-6 sm:py-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-pine sm:text-sm sm:tracking-[0.24em]">{copy.uploadZone}</p>
              <h3 className="mt-3 max-w-[9ch] text-[2.7rem] font-semibold leading-[0.92] tracking-tight text-ink sm:max-w-[10ch] sm:text-[2.95rem] md:text-[3.1rem]">
                {copy.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-ink/65">
                {copy.description}
              </p>

              <input
                id={`files-${variant}`}
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              />

              <div className="mt-5 flex flex-col gap-4 border-t border-black/6 pt-4 sm:mt-6 sm:pt-4">
                {files.length > 0 ? (
                  <div className="rounded-2xl bg-cloud/70 px-4 py-3 text-sm text-ink/72">
                    <p className="font-medium text-ink">{copy.selectedFiles(files.length)}</p>
                    <p className="mt-1 text-ink/60">{copy.totalSize(totalSizeLabel)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-ink/60">
                    {requiresAccount
                      ? locale === "da"
                        ? "Vælg filer og opret en gratis konto for at starte upload."
                        : "Choose files and create a free account to start uploading."
                      : copy.dragHint}
                  </p>
                )}

                <p className="text-sm leading-6 text-ink/62">
                  {locale === "da"
                    ? "Opret en gratis bruger og send op til 15 GB gratis."
                    : "Create a free account and send up to 15 GB for free."}
                </p>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="inline-flex w-full items-center justify-center rounded-full bg-pine px-6 py-3 text-sm font-medium text-white transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isUploading
                    ? copy.uploading
                    : requiresAccount
                      ? locale === "da"
                        ? "Opret gratis konto"
                        : "Create free account"
                      : copy.uploadTransfer}
                </button>
              </div>
            </label>

            {files.length > 0 && !isHero ? (
              <div className="space-y-2">
                {files.slice(0, 3).map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 text-sm"
                  >
                    <span className="truncate pr-4 text-ink">{file.name}</span>
                    <span className="whitespace-nowrap text-ink/60">{formatBytes(file.size)}</span>
                  </div>
                ))}
                {files.length > 3 ? <p className="text-sm text-ink/55">{copy.moreFiles(files.length - 3)}</p> : null}
              </div>
            ) : null}

            {isUploading ? (
              <div className="rounded-[1.5rem] border border-pine/10 bg-pine/5 px-4 py-4">
                <div className="flex items-center justify-between gap-4 text-sm text-ink">
                  <p className="font-medium">{copy.uploadProgress(uploadPercent)}</p>
                  <p className="text-ink/60">{copy.uploadProgressDetail(uploadedSizeLabel, totalSizeLabel)}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/6">
                  <div
                    className="h-full rounded-full bg-pine transition-[width] duration-500"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-ink/68">{copy.uploadMessages[messageIndex]}</p>
              </div>
            ) : null}

            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            {success ? (
              <div className="rounded-2xl bg-pine px-4 py-4 text-sm text-white">
                <p>{success}</p>
                {downloadPath ? (
                  <p className="mt-2">
                    <Link href={downloadPath} className="font-medium text-white underline underline-offset-4">
                      {copy.openDownloadPage}
                    </Link>
                  </p>
                ) : null}
              </div>
            ) : null}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_18rem]">
            <div className="rounded-[1.4rem] border border-dashed border-pine/25 bg-white/70 p-5 sm:rounded-[1.75rem] sm:p-8">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pine text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {copy.send}
                </div>
              </div>

              <div className="mt-7 text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-pine">{copy.uploadZone}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{copy.title}</h3>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/65">
                  {copy.description}
                </p>
              </div>

              <label
                htmlFor={`files-${variant}`}
                className="mt-6 block cursor-pointer rounded-[1.25rem] border border-black/8 bg-cloud/70 p-5 transition hover:border-pine/30 hover:bg-white sm:mt-8 sm:rounded-[1.5rem] sm:p-6"
              >
                <span className="block text-base font-medium text-ink">
                  {files.length > 0 ? copy.selectedFiles(files.length) : copy.chooseFiles}
                </span>
                <span className="mt-2 block text-sm text-ink/60">
                  {files.length > 0 ? copy.totalSize(totalSizeLabel) : copy.dragHint}
                </span>
                <input
                  id={`files-${variant}`}
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                />
              </label>

              {files.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {files.slice(0, 5).map((file) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 text-sm"
                    >
                      <span className="truncate pr-4 text-ink">{file.name}</span>
                      <span className="whitespace-nowrap text-ink/60">{formatBytes(file.size)}</span>
                    </div>
                  ))}
                  {files.length > 5 ? <p className="text-sm text-ink/55">{copy.moreFiles(files.length - 5)}</p> : null}
                </div>
              ) : null}

              {isUploading ? (
                <div className="mt-4 rounded-[1.5rem] border border-pine/10 bg-pine/5 px-4 py-4">
                  <div className="flex items-center justify-between gap-4 text-sm text-ink">
                    <p className="font-medium">{copy.uploadProgress(uploadPercent)}</p>
                    <p className="text-ink/60">{copy.uploadProgressDetail(uploadedSizeLabel, totalSizeLabel)}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/6">
                    <div
                      className="h-full rounded-full bg-pine transition-[width] duration-500"
                      style={{ width: `${uploadPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-ink/68">{copy.uploadMessages[messageIndex]}</p>
                </div>
              ) : null}

              {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
              {success ? (
                <div className="mt-4 rounded-2xl bg-pine px-4 py-4 text-sm text-white">
                  <p>{success}</p>
                  {downloadPath ? (
                    <p className="mt-2">
                      <Link href={downloadPath} className="font-medium text-white underline underline-offset-4">
                        {copy.openDownloadPage}
                      </Link>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <aside className="flex flex-col justify-between rounded-[1.75rem] border border-black/6 bg-white/78 p-5">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-pine">{locale === "da" ? "Nuværende regler" : "Current rules"}</p>
                <h4 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{currentPlanName} plan</h4>
                <dl className="mt-5 space-y-4 text-sm text-ink/75">
                  <div className="border-t border-black/5 pt-4">
                    <dt>{copy.transferLimit}</dt>
                    <dd className="mt-1 font-medium text-ink">{currentPlanLimit}</dd>
                  </div>
                  <div className="border-t border-black/5 pt-4">
                    <dt>{copy.retention}</dt>
                    <dd className="mt-1 font-medium text-ink">{currentRetention}</dd>
                  </div>
                  <div className="border-t border-black/5 pt-4">
                    <dt>{copy.whiteLabel}</dt>
                    <dd className="mt-1 font-medium text-ink">
                      {currentPlanName === "Pro" ? copy.included : copy.upgradeRequired}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full rounded-full bg-pine px-5 py-3 text-sm font-medium text-white transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isUploading
                    ? copy.uploading
                    : requiresAccount
                      ? locale === "da"
                        ? "Opret gratis konto"
                        : "Create free account"
                      : copy.uploadTransfer}
                </button>
                <p className="text-sm text-ink/55">
                  {copy.guestsHint}
                </p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
