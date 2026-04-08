import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const gb = BigInt(1024 ** 3);

const plans = [
  {
    code: "guest",
    name: "Guest",
    maxUploadBytes: BigInt(2) * gb,
    retentionHours: 24,
    whiteLabelEnabled: false,
    monthlyPriceCents: 0,
  },
  {
    code: "free",
    name: "Free",
    maxUploadBytes: BigInt(10) * gb,
    retentionHours: 72,
    whiteLabelEnabled: false,
    monthlyPriceCents: 0,
  },
  {
    code: "pro",
    name: "Pro",
    maxUploadBytes: BigInt(100) * gb,
    retentionHours: 720,
    whiteLabelEnabled: true,
    monthlyPriceCents: 9900,
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }

  console.log("Seeded plans:", plans.map((plan) => plan.code).join(", "));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
