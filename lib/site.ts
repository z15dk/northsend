export const siteConfig = {
  name: "NorthSend",
  description:
    "A Nordic-inspired file transfer platform for small businesses that need a clean, white-label sharing flow.",
  url: "http://localhost:3000",
};

import { formatBytes, planDefinitions } from "@/lib/plans";

export const planSummaries = Object.values(planDefinitions).map((plan) => ({
  name: plan.name,
  price: plan.priceLabel,
  uploadLimit: formatBytes(plan.uploadLimitBytes),
  retention: `${plan.retentionHours} hours`,
  highlight: plan.highlight,
}));
