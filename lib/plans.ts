export type PlanCode = "guest" | "free" | "pro";

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
    uploadLimitBytes: 2 * gb,
    retentionHours: 24,
    priceLabel: "Free",
    highlight: "Quick sharing without signup",
    whiteLabelEnabled: false,
  },
  free: {
    code: "free",
    name: "Free",
    uploadLimitBytes: 10 * gb,
    retentionHours: 72,
    priceLabel: "Free",
    highlight: "Signup unlocks larger transfers",
    whiteLabelEnabled: false,
  },
  pro: {
    code: "pro",
    name: "Pro",
    uploadLimitBytes: 100 * gb,
    retentionHours: 720,
    priceLabel: "99 kr/mo",
    highlight: "White-label for business use",
    whiteLabelEnabled: true,
  },
};

export function getPlanDefinition(code: string | null | undefined): PlanDefinition {
  if (code === "pro") {
    return planDefinitions.pro;
  }

  if (code === "free") {
    return planDefinitions.free;
  }

  return planDefinitions.guest;
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
