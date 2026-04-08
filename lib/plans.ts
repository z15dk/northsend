export type PlanCode = "guest" | "free" | "pro_light" | "pro";

export type PlanDefinition = {
  code: PlanCode;
  name: string;
  uploadLimitBytes: number;
  retentionHours: number;
  priceLabel: string;
  highlight: string;
  whiteLabelEnabled: boolean;
};

const gb = 1024 ** 3;

export const planDefinitions: Record<PlanCode, PlanDefinition> = {
  guest: {
    code: "guest",
    name: "Guest",
    uploadLimitBytes: 0,
    retentionHours: 0,
    priceLabel: "Free",
    highlight: "Account required before upload",
    whiteLabelEnabled: false,
  },
  free: {
    code: "free",
    name: "Free",
    uploadLimitBytes: 15 * gb,
    retentionHours: 72,
    priceLabel: "Free",
    highlight: "Up to 15 GB per file with 3 days of storage",
    whiteLabelEnabled: false,
  },
  pro_light: {
    code: "pro_light",
    name: "Pro Light",
    uploadLimitBytes: 150 * gb,
    retentionHours: 720,
    priceLabel: "149 kr/mo",
    highlight: "More capacity, fair use traffic, and basic tracking",
    whiteLabelEnabled: false,
  },
  pro: {
    code: "pro",
    name: "Pro",
    uploadLimitBytes: 500 * gb,
    retentionHours: 720,
    priceLabel: "249 kr/mo",
    highlight: "Tracking, previews, notifications, and higher storage",
    whiteLabelEnabled: true,
  },
};

export function getPlanDefinition(code: string | null | undefined): PlanDefinition {
  if (code === "pro") {
    return planDefinitions.pro;
  }

  if (code === "pro_light") {
    return planDefinitions.pro_light;
  }

  if (code === "free") {
    return planDefinitions.free;
  }

  return planDefinitions.free;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const digits = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}
