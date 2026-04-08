import Link from "next/link";
import { getLocale, t } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { formatBytes } from "@/lib/plans";

type DownloadPageProps = {
  params: Promise<{ token: string }>;
};

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = await params;
  const locale = await getLocale();
  const copy = t(locale);
  const transfer = await prisma.transfer.findUnique({
    where: { downloadToken: token },
    include: {
      files: true,
    },
  });

  if (!transfer) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{copy.download.notFoundTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            {copy.download.notFoundDescription}
          </p>
        </div>
      </div>
    );
  }

  const expired = transfer.expiresAt < new Date();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-pine">{copy.download.eyebrow}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          {expired ? copy.download.expiredTitle : copy.download.readyTitle}
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          {expired
            ? copy.download.expiredDescription
            : `${copy.download.availableUntil} ${new Intl.DateTimeFormat(locale === "da" ? "da-DK" : "en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(transfer.expiresAt)}.`}
        </p>

        {!expired ? (
          <div className="mt-8 space-y-3">
            {transfer.files.map((file) => (
              <div
                key={file.id}
                className="flex flex-col gap-3 rounded-2xl bg-cloud px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{file.originalName}</p>
                  <p className="text-sm text-ink/60">{formatBytes(Number(file.sizeBytes))}</p>
                </div>
                <Link
                  href={`/api/public/transfers/${token}/download?fileId=${file.id}`}
                  className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-white"
                >
                  {copy.download.downloadFile}
                </Link>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
