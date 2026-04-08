import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createTransferWithUploads } from "@/lib/transfers";

type TransferRequestBody = {
  files?: Array<{
    name?: string;
    size?: number;
    type?: string;
  }>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TransferRequestBody;
    const files = (body.files ?? []).map((file) => ({
      name: String(file.name ?? "").trim(),
      size: Number(file.size ?? 0),
      type: String(file.type ?? "application/octet-stream"),
    }));

    if (files.some((file) => !file.name || !Number.isFinite(file.size) || file.size <= 0)) {
      return NextResponse.json({ error: "Invalid file metadata." }, { status: 400 });
    }

    const user = await getCurrentUser();
    const result = await createTransferWithUploads({
      user: user ? { id: user.id, planCode: user.planCode } : null,
      files,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create transfer.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
