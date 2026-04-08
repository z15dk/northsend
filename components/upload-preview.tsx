import type { Locale } from "@/lib/copy";
import { TransferUploader } from "@/components/transfer-uploader";

type UploadPreviewProps = {
  currentPlanName: string;
  currentPlanLimit: string;
  currentRetention: string;
  locale: Locale;
  requiresAccount?: boolean;
};

export function UploadPreview(props: UploadPreviewProps) {
  return <TransferUploader {...props} variant="hero" />;
}
