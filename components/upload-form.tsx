"use client";

import type { Locale } from "@/lib/copy";
import { TransferUploader } from "@/components/transfer-uploader";

type UploadFormProps = {
  currentPlanName: string;
  currentPlanLimit: string;
  currentRetention: string;
  locale: Locale;
  requiresAccount?: boolean;
};

export function UploadForm(props: UploadFormProps) {
  return <TransferUploader {...props} variant="page" />;
}
